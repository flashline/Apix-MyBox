
package mybox;
import apix.common.display.Common ;
import apix.common.util.Global ;
import apix.common.util.Object;
import mybox.boxes.Folder;
import mybox.boxes.Form;
import mybox.boxes.AbstractFolderFormField;
/**
* classes imports
*/
using apix.common.util.StringExtender;
using apix.common.util.ArrayExtender;
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
	 * app curr language
	 */	
	public var language(get, set):String;
	function  set_language (v:String) : String {
		var del = 365 * 24 * 60 * 60 * 1000;
		LocalShared.set("safeboxLanguage", v , del);
		return v;
	}
	function get_language() :String { 
		return lang.language ;
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
	public var selectedFormOrFolder:AbstractFolderFormField; // Folder extends Form
	public var mode: String;// "admin" or "using"
	public var isFieldCreation: Bool;
	
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
		if (serverUrl.substr(0, 4) != "http") su = baseUrl + serverUrl;		
		server = new Server (su,this); 
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
		var arr:Array<Object> = data.folders ;
		for (i in 0...arr.length) {			
			var o:Object = new Object(arr[i]); arr[i] = o;//here
			o.id = g.intVal(o.id, 1);	
			if (o.is_form == 1) o.is_form = true; else o.is_form = false ;			
			if (o.is_form && o.fields != null ) {
				var arrf:Array<Object> =  o.fields ; 
				for (i in 0...arrf.length) {
					var of:Object = new Object(arrf[i]); arrf[i] = of ;					
					of.id = g.intVal(of.id, 1);
					of.row_number = g.intVal(of.row_number, 1);		
					if (of.is_hidden == 1) of.is_hidden = true; else of.is_hidden = false ;
					if (of.required == 1) of.required = true; else of.required = false ;
					if (of.copy_enable == 1) of.copy_enable = true; else of.copy_enable = false ;
					if (of.is_primary == 1) of.is_primary = true; else of.is_primary = false ;
					if (of.is_secure == 1) of.is_secure = true; else of.is_secure = false ;
					if (of.selectfields != null) {
						var osf:Object = new Object(of.selectfields); of.selectfields = osf;
						if (osf.is_multiple == 1) osf.is_multiple = true; else osf.is_multiple = false ;						
					}
				}
			}				
		}
	}

	public function dataIsEmpty () : Bool {
		return !((data != null) && (data != {}) && (data.folders!=null) && (Std.is(data.folders,Array)) && data.folders.length>0) ;
	}
	public function dataIsFormLess () : Bool {
		var arr:Array<Object> = data.folders ; var b = true ;
		var len = arr.length ; 
		for (i in 0...len) {              
			b = !arr[i].is_form;
			if (!b) break ;
			
		}
		return b ;
	}	
	public function setupTree () {	
		var arr:Array<Object> = data.folders;
		for (i in 0...arr.length) {
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
				if (o.fields!=null) f.setupFormFields(o.fields);
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