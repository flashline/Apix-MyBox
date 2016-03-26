
package safebox.models;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.StandardEvent;
import safebox.models.Folder;
import safebox.View;

import apix.common.util.Global ;
import apix.common.util.Object;
import safebox.Model;
using apix.common.util.StringExtender;
using apix.common.display.ElementExtender;
//

class Folder extends Form implements IContent {	
	
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
	override public function setupAdminMode () { 
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
	override public function setupUsingMode () { 
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
	override public function clear() {		
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
		var arr = children ; var len = arr.length  ; 
		for (i in 0...len) {
			if (arr[i] == null) {
				"WARNING JM LOOK THAT : ".trace();
				"recId".trace(recId);
				"label".trace(label);
				"len".trace(len);
				"i".trace(i);
			}
			else arr[i].remove();
		}
		var arr = forms ; var len = arr.length  ; 		
		for (i in 0...len) arr[i].remove();
		if (recId != 0) super.remove();
	}
	override public function removeFromList (c:IContent) {
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
		var str = ""; 
		str+=super.toHtmlString (tab);
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
	
}
