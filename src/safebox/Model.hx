
package safebox;
import apix.common.display.Common ;
import apix.common.util.Global ;
import apix.common.util.Object;
import safebox.models.Folder;
import safebox.models.Form;
import safebox.models.SubModel;
/**
* classes imports
*/
using apix.common.util.StringExtender;
class Model {
	static var g:Global;		
	/**
	 * language and param from extern files
	 */
	public var lang(default, null):Object;
	public var param(default, null):Object;
	public var server(default, null):Server;
	public var root(default, null): Folder;
	var view:View;
	//	
	/**
	 * first data read from server
	 */
	public var data  :Object;
	/**
	 * user name, id, pseudo etc
	 */
	var _currUserId:String;
	public var currUserId(get, set):String; 
	function set_currUserId(v:String) :String { 
		_currUserId = v;
		_currUserId==null?view.currUserId="":view.currUserId=_currUserId;
		return _currUserId;
	}
	function get_currUserId() :String { 
		return _currUserId ;
	}
	
	/**
	 * pwd
	 */
	public var currUserPwd :String;
	/**
	 * version -update in Controler.new()
	 */
	public var version :String;
	//
	//
	public var currCookieId(default, null):String;
	public var currCookiePwd(default, null):String;
	public var selectedFormOrFolder:Form; // Folder extends Form
	public var mode: String;// "admin" or "using"
	
	/**
	 * language and param from extern files
	 */
	public var baseUrl(default, null):String;
	public var serverUrl(default, null):String;
	/*
	 * constructor
	 */
	public function new (bu:String ,su:String , l:Object, p:Object) {	
		baseUrl = bu;
		serverUrl = su;
		lang = l;
		param = p;
		server = new Server (baseUrl + serverUrl,this); 
		//
		mode = "using";
		g = Global.get();
	}
	//get/set
	
	//
	public var isSafeMode(get, null):Bool; 
	function  get_isSafeMode () : Bool {	
		return !(LocalShared.exists("safeboxUnsafe")) ;		
	}
	public function  setSafeMode (?isSafe=true) {
		var del = 365 * 24 * 60 * 60 * 1000;
		if (isSafe) {	
			if (LocalShared.exists("safeboxUnsafe")) LocalShared.remove("safeboxUnsafe");
			LocalShared.remove("safeboxId");
			LocalShared.remove("safeboxPwd");
			currCookieId=null;
			currCookiePwd = null;	
		} else {		
			if (!LocalShared.exists("safeboxUnsafe")) LocalShared.set("safeboxUnsafe", "true" , del);
			currCookieId=null;
			currCookiePwd = null;
			writeUserCookie();
		}			
	}
	//
	//
	public function  createRootFolder (v:View) {
		view = v;
		root = new Folder(this,view);
		root.init(0, "root");
		root.index = 0;
		root.shift = 0 - root.shiftVal;
		root.elemsCtnr = view.rootElemsCtnr ;
		selectedFormOrFolder = root;
	}
	public function  readUserCookie (?b:Bool = true) : Object {
		var o:Object = new Object( { currCookieId:null, currCookiePwd:null } ) ;
		if (!isSafeMode) {
			if (LocalShared.exists("safeboxId")) {
				currCookieId=LocalShared.get("safeboxId");
				currCookiePwd = LocalShared.get("safeboxPwd");
				o.id = currCookieId;
				o.pwd = currCookiePwd;
				currUserPwd = currCookiePwd;
			} else {
				if (b) {
					if ( g.strVal(currUserId, "") != "") {
						 writeUserCookie ();
						 o=readUserCookie (false) ;
					} 
				} 
			}
		} 
		return o;
	}
	public function  writeUserCookie () {
		if (!isSafeMode) {
			if ( currCookieId!=currUserId || currCookiePwd != currUserPwd) {
				var del = 365 * 24 * 60 * 60 * 1000;
				if ( g.strVal(currUserId, "") != "") {
					LocalShared.set("safeboxId", currUserId, del); 
					currCookieId = currUserId;
					if (g.strVal(currUserPwd, "") != "") {
						LocalShared.set("safeboxPwd", currUserPwd, del); 
						currCookiePwd = currUserPwd;
					}
				} 
			} 
		} 
	}
	public function isValidSignInInput (id:String,pwd:String) : String {
		var str = "";
		if (  !id.isMail() ) str += lang.notEmailError  ;
		//	
		if  (Std.parseInt(param.pwdMinLen) > pwd.length)  str += lang.pwdLengthError  ;
		//	
		return str;
	}
	public function isValidSignUpInput (id:String,pwd:String,confirm:String) : String {
		var str = isValidSignInInput(id, pwd);
		if (pwd!=confirm ) str += lang.confirmPwdError ;
		//	
		return str;
	}
	public function initDataObject () {
		var arr:Array<Object> = data.folders.item ;
		for (i in 1...arr.length) {			
			var o:Object = arr[i];
			o.parent_id = g.intVal(o.parent_id.value, 0);
			o.is_form = g.boolVal(o.is_form.value, false);
			o.label = g.strVal(o.label.value, "");
			o.id = g.intVal(o.id.value, 1);	
			if (o.is_form && o.fields.item!=null ) {
				var arrf:Array<Object> =  o.fields.item ; 
				for (i in 1...arrf.length) {
					var of:Object = arrf[i];					
					of.id = g.intVal(of.id.value, 1);
					of.label = g.strVal(of.label.value, "");
					of.row_number = g.intVal(of.row_number.value, 1);
					of.copy_enable = g.boolVal(of.copy_enable.value, true);
					of.is_hidden = g.boolVal(of.is_hidden.value, false);
					of.is_primary = g.boolVal(of.is_primary.value, false);					
				}
			}
		}		
	}
	public function dataIsEmpty () : Bool {
		//var o = data.folders.item;
		return !((data != null) && (data != {}) && (data.folders!=null) && (Std.is(data.folders.item,Array)) ) ;
	}
	public function dataIsFormLess () : Bool {
		var arr:Array<Object> = data.folders.item ; var b = true ;
		var len = arr.length ;
		for (i in 1...len) {
			b = !arr[i].is_form;
			if (!b) break ;
		}
		return b ;
	}	
	public function setupTree () {	
		var arr:Array<Object> = data.folders.item ;
		for (i in 1...arr.length) {
			var o:Object = arr[i];			
			if (!o.is_form) {
				var fd = new Folder(this,view);
				fd.init(o.id, o.label);				
				root.setupFolderTreeRelation(o,fd);
			}
			else {
				var f = new Form(this,view);
				f.init( o.id, o.label);				
				root.setupFormTreeRelation(o, f);
				f.setupFormFields(o.fields.item);
			}
		}
	}
	public function clear () {
		root.clear();
		data = null;
		selectedFormOrFolder = root;
	}
	
	/**
	 * @private
	 */
	
	
}