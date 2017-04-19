
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.StandardEvent;
import mybox.View;
import apix.common.util.Global ;
import apix.common.util.Object;
import mybox.Model;
using apix.common.util.StringExtender;
using apix.common.display.ElementExtender;
//

class Folder extends AbstractFolderFormField  {	
	public var children:Array<Folder>; 
	public var forms:Array<Form>;	
	//
	/*
	 * constructor
	 */
	public function new (m:Model,?v:View) {	
		super(m, v);
		children = []; forms = [];
		srvTxtMsg = "FormFolder";
		insertSrvTxtMsg = "FormFolder" ;
	}
	// gets
	/**
	 * override super public var subCtnr(get, null):Elem; 
	 */
	override function get_subCtnr() :Elem { 
		//return ("#" + vId + " .apix_subCtnr").get(); 
		return elem.elemByClass("apix_subCtnr") ;
		
		
	}		
	override function get_color() :String { return param.folderColor ; }
	override function get_nameHolderTxt() :String { return lang.fdNameHolder ; }
	override function get_updateTitleTxt() :String { return lang.fdUpdateTitle ; }	
	//
	override public function getParent () :Folder {
		if (this != model.root) return cast(parent, Folder);
		else return null ;
	}
	public function setupFolderTreeRelation(o:Object, fd:Folder) {			
		if (recId == o.parent_id) {
			fd.parent = this;
			children.push(fd);
			fd.index = children.length - 1;
		}
		else {
			var len = children.length  ;
			for (i in 0...len) {
				children[i].setupFolderTreeRelation(o,fd);
			}
		}
	}
	public function setupFormTreeRelation(o:Object, f:Form) {
		if (recId == o.parent_id) {
			f.parent = this;
			forms.push(f);
			f.index = forms.length - 1;					
		}
		else {
			var len = children.length  ;
			for (i in 0...len) {
				children[i].setupFormTreeRelation(o,f);
			}
		}
	}
	public function display (?shift:Int = 0) { 
		var len = children.length  ;
		for (i in 0...len) {
			var fd:Folder = children[i] ;
			createOneFolder (fd,shift);			
			fd.display (shift+shiftVal);
		}
		var len = forms.length  ;
		for (i in 0...len) {
			var f:Form = forms[i] ;
			createOneForm (f, shift);
			f.displayFields(shift );
		}
		
	}	
	public function insertNewFolder () {	
		insertNewElement ("folder");
	}	
	public function insertNewForm () {	
		insertNewElement ("form");
	}
	public function setupAdminMode () { 
		var len = children.length  ;
		for (i in 0...len) {
			var fd:Folder = children[i] ;
			fd.setupAdminMode();
		}
		var len = forms.length  ;
		for (i in 0...len) {
			var f:Form = forms[i] ;
			f.setupAdminMode();
		}
		if (recId != 0) {
			pictoCtnr.show("inline-block");
			
		}
	}
	public function setupUsingMode () { 
		var len = children.length  ;
		for (i in 0...len) {
			var fd:Folder = children[i] ;
			fd.setupUsingMode();
		}
		var len = forms.length  ;
		for (i in 0...len) {
			var f:Form = forms[i] ;
			f.setupUsingMode();
		}
		if (recId != 0) pictoCtnr.hide();
	}
	//
	public function clear() {	
		var len = children.length  ;
		for (i in 0...len) {
			var fd:Folder = children[i] ;						
			fd.clear();
		}
		var len = forms.length  ;
		for (i in 0...len) {
			var f:Form = forms[i] ;
			f.clear();
		}
		children = []; forms = [];
		if (recId == 0) elemsCtnr.inner(""); // root folder
		else removeEvent();	
	}
	override public function remove () {		
		while (children.length > 0 ) children[children.length - 1].remove();
		while ( forms.length > 0 ) forms[forms.length-1].remove();
		
		if (recId != 0) {
			getParent().selectAndDispatch () ;
			clear () ;
			if (elem == null) trace ("Erreur in Form.remove(). Instance : " + g.className(this) + " label=" + label + " recId=" + recId);
			else elem.delete();		
			getParent().removeFromList(this); 			
		}
	}
	override public function removeFromList (c:AbstractBox) {
		if ( c.is("Folder")) {
			children.splice(c.index, 1);
			for (i in c.index...children.length) {
				children[i].index = i;
			}
		}
		else if ( c.is("Form")) {
			forms.splice(c.index, 1);
			for (i in c.index...forms.length) {
				forms[i].index = i;
			}
		}
		else trace("f:: [override] Folder.removeFromList() type error");		
	}
	
	override public function setStateOfAddButtons (?opacFd:String="1",?opacFo:String="1",?opacFi:String="0") {
		super.setStateOfAddButtons (opacFd,opacFo,opacFi) ;
	}
	
	//
	override public function toHtmlString (?tab:String="") :String{
		var str = super.toHtmlString(tab);		
		//
		str+= tab + "children ------- <br/>"	;	
		var len = children.length  ;
		for (i in 0...len) {
			str+=children[i].toHtmlString (tab+"..........");
		}
		str+= tab + "end children ------ <br/>"	;	
		str+= tab + "forms ------ <br/>";		
		var len = forms.length  ;
		for (i in 0...len) {
			str+=forms[i].toHtmlString (tab+"..........");
		}
		str+= tab + "end forms ------ <br/>"	;	
		return str ;
	}	
	/**
	 * @private
	 */
	override function onAnswerInsertElement (e:StandardEvent) :String {
		var answ:String=super.onAnswerInsertElement (e);
		if (answ == "insert" + insertSrvTxtMsg + "Ok")  {
			if 		(e.data.type == "folder") 	createFolderAfterInsert(e.result.recId, shift + shiftVal);	
			else if (e.data.type == "form") 	createFormAfterInsert(e.result.recId, shift + shiftVal );
		}
		return answ;
	}
	override function createFolderAfterInsert (rci:Int, ?shift:Int = 0) {
		var fd = new Folder(model, view); 
		insertElementInit (fd, rci);
		children.push(fd);
		fd.index = children.length - 1;	
		createOneFolder (fd, shift);
		fd.setupAdminMode();
	}
	override function createFormAfterInsert (rci:Int, ?shift:Int = 0) {
		var fo = new Form(model, view); 
		insertElementInit (fo, rci);				
		forms.push(fo);
		fo.index = forms.length - 1;
		createOneForm(fo,  shift );
		fo.setupAdminMode();
	}
	function createOneFolder (fd:Folder, ?shift:Int = 0) {		
		var folderProto = view.fButtonProto;
		var folderEl = folderProto.clone(true);	
		elemsCtnr.addChild(folderEl); folderEl.show();		
		folderEl.setId("fd_" + fd.recId);
		fd.vId = folderEl.getId();
		fd.elem = folderEl ;
		fd.shift = shift ;		
		fd.bElem.posx(fd.shift);		
		fd.setup();
		fd.recordsCtnr.delete();
		fd.click.on(onElemClick);
	}
	function createOneForm (fo:Form,?shift:Int=0) {
		var formProto = view.fButtonProto; 
		var formEl = formProto.clone(true);
		elemsCtnr.addChild(formEl); formEl.show();
		formEl.setId("fo_" + fo.recId);
		fo.vId = formEl.getId();
		fo.elem = formEl ;
		fo.shift = shift;
		fo.bElem.posx(fo.shift);
		fo.setup();
		fo.click.on(onElemClick);
	}	
	override function onButtonClick (e:ElemEvent) {	
		if (!isClosed) close();
		else open();
		selectAndDispatch();		
	}	
}
