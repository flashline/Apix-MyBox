
package mybox.boxes;
/**
* classes imports
*/
import apix.common.event.EventSource;
import apix.common.display.Common ;
import apix.common.display.Confirm;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import haxe.Json;
import mybox.Model;
import mybox.View;
//
using apix.common.util.StringExtender;
using apix.common.display.ElementExtender;
using apix.common.util.ArrayExtender;
//
class AbstractFolderFormField extends AbstractBox  {	
	//
	// Common public var Form and Folder only
	//
	public var click:EventSource;
	//
	// Common public var Field, Form and Folder 
	//	
	public var currSecureCode:String;
	public var secureCodes:Array<Int>;
	public var shiftVal:Int;
	// private vars
	var srvTxtMsg:String;
	var insertSrvTxtMsg:String; 	
	/*
	 * constructor
	 */
	function new (m:Model,?v:View) {	
		super(m, v);
		isClosed = true;
		click = new EventSource();
		shiftVal = if (Common.windowWidth > 679) 15 else 5;
	}
	//gets/sets
	//
	// Common get/set for Form and Folder only
	//
	public var mode(get, null): String; function get_mode() :String { return model.mode ;  } // "admin" or "using"	
	public var level (get, null):Int; function get_level() :Int { return Math.round(shift / shiftVal) ; }
	/**
	 * ctnr for 'using' mode or 'admin' mode for Form ; ctnr admin only for folder
	 */
	public var subCtnr(get, null):Elem; 
	function get_subCtnr() :Elem { 
		if (mode == "admin") return elem.elemByClass("apix_subCtnr") ;
		else return recordsCtnr; 
		
	}
	/**
	 * ctnr admin for both form and folder
	 */
	var _elemsCtnr:Elem;
	public var elemsCtnr(get, set):Elem; 
	function get_elemsCtnr() :Elem { 
		if (_elemsCtnr==null) _elemsCtnr=("#" + vId + " .apix_subCtnr").get() ;
		return  _elemsCtnr ;
	}
	function set_elemsCtnr(v:Elem) :Elem { 
		_elemsCtnr = v;
		return v ;
	}
	//
	//
	// Common get/set for Field, Form and Folder 
	//
	//
	public var color(get, null): String; function get_color() :String { return "#00000" ; };	//
	public var foName(get, null):Elem; function get_foName() :Elem { return ("#safeBox #apix_nameFrame input[name='foName']").get();}
	public var nameHolderTxt(get, null): String; function get_nameHolderTxt() :String { return lang.foNameHolder ; }
	public var updateTitleTxt(get, null): String; function get_updateTitleTxt() :String { return lang.foUpdateTitle ; }
	public var nameTxt(get, null): String; function get_nameTxt() :String { return lang.name ; }
	public var primary(get, null):Field; function get_primary() :Field { trace("f::Must be override by Form !"); return null; };	
	
	/**
	 * public methods
	 */
	//
	// Common public method for Form and Folder only
	//
	public function getChain() : Array<AbstractFolderFormField> {
		var arr: Array<AbstractFolderFormField>=[];
		if (parent != null) {
			arr = getParent().getChain();
			arr.push(this) ;
		}
		return arr ;
	}
	public function open () {
		if (subCtnr.isEmpty() && mode=="admin" ) {
			view.showTipBox(lang.alertEmptyCtnr,bElem.parent(),bElem.posx(),bElem.posy(),2)			; 
		}
		else {
			subCtnr.show();			
			isClosed = false;
		}		
	}
	public function close () {
		subCtnr.hide();
		isClosed = true; 
	}
	public function select () {	
		labelElem.cssStyle(CssStyle.opacity, "1");
		labelElem.cssStyle(CssStyle.borderColor,param.black);		
	}
	public function unselect () {	
		labelElem.cssStyle(CssStyle.opacity, ".7"); 
		labelElem.cssStyle(CssStyle.borderColor,color);
	}	
	public function setStateOfAddButtons (?opacFd:String="0",?opacFo:String="0",?opacFi:String="1") {		
		view.bAddFolder.show();
		view.bAddForm.show();
		view.bAddField.show();		
		opacFd=="0"?view.bAddFolder.hide():view.bAddFolder.cssStyle(CssStyle.opacity, opacFd);
		opacFo=="0"?view.bAddForm.hide():view.bAddForm.cssStyle(CssStyle.opacity,opacFo);
		opacFi=="0"?view.bAddField.hide():view.bAddField.cssStyle(CssStyle.opacity, opacFi);
		view.resize();
	}
	public function selectAndDispatch () {	
		var ev = new StandardEvent(this);
		ev.path = path;
		click.dispatch(ev); // do unselect() on previous and select() on this
	}
	public function toHtmlString (tab:String=""):String {
		var str = "";  var pRecId = -1 ;  if (parent!= null) pRecId = parent.recId ;
		str+= tab + "parent=" + pRecId + "<br/>" ;
		str+= tab + "recId=" + recId + "<br/>";
		str+= tab + "label=" + label + "<br/>";
		return str ;
	}
	
	//
	// Common public method for Field , Form and Folder
	//
	public function getParent () :AbstractFolderFormField {
		trace("f::is override by FormFolderAbstract, Folder, Form and Field !"); return null;
	}	
	public function init (ri:Int,l:String) {	
		recId = ri;
		label = l;
	}
	public function setup () {
		setupView ();
		setupEvent ();
	}		
	public function setupEvent () {
		if (!bElem.hasLst(StandardEvent.CLICK) ) {
			bElem.on(StandardEvent.CLICK, onButtonClick);
			labelElem.handCursor(true); // for firefox
		}
		if (!bUpdate.hasLst(StandardEvent.CLICK) ) bUpdate.on(StandardEvent.CLICK, onUpdateClick);
		if (!bRemove.hasLst(StandardEvent.CLICK) ) bRemove.on(StandardEvent.CLICK, onRemoveClick);
	}
	public function removeEvent () {		
		if (bElem.hasLst(StandardEvent.CLICK) ) {
			bElem.off(StandardEvent.CLICK, onButtonClick);
			labelElem.handCursor(false); 
		}
		if (bUpdate.hasLst(StandardEvent.CLICK) ) bUpdate.off(StandardEvent.CLICK, onUpdateClick);
		if (bRemove.hasLst(StandardEvent.CLICK) ) bRemove.off(StandardEvent.CLICK, onRemoveClick);
	}
	//
	public function removeFromList (c:AbstractBox) {
		trace("f::Must be override by Folder and Form ");
	} 
	/**
	 * @private
	 */
	//
	// Common private func for Form and Folder only
	//
	function onElemClick (ev:StandardEvent) {	
		// recursive dispatch until Controler.onFormOrFolderClick() call.
		click.dispatch(ev);
	}
	//
	// Common Common private func  for Field , Form and Folder
	//
	function setupView () {
		labelElem.value(label); //labelElem.text(label);
		labelElem.cssStyle(CssStyle.backgroundColor, color);
		labelElem.cssStyle(CssStyle.opacity, ".7");
		labelElem.cssStyle(CssStyle.borderColor,color);
		pictoCtnr.hide();
	}	
	function showNameFrame (?tl:String = "$Title", ?n:String = "$name", ?hld:String = "$holder",?type:String) {	
		view.nameFrameTitle.text(tl);
		view.nameFrameName.text(n);
		view.nameFramePath.text(path);
		view.foName.placeHolder(hld);
		if (type == "field") view.nameFramefieldsCtnr.show();
		else view.nameFramefieldsCtnr.hide();
		view.nameFrame.show();
		view.bNameFrameValid.joinEnterKeyToClick(null,view.foName);
	}	
	function insertNewElement (type:String) {
		var tl; var hd; var na = lang.name ;
		if (type == "folder") 		{ tl = lang.fdCreateTitle; hd = lang.fdNameHolder  ;  }
		else if (type == "form") 	{ tl = lang.foCreateTitle; hd = lang.foNameHolder ; }
		else if (type == "field")	{ tl = lang.fiCreateTitle; hd = lang.fiNameHolder ; na = lang.fiName ;  }
		else { tl = null;hd = null;  trace("f:: Form. insertNewElement() type error"); }
		showNameFrame(tl, na, hd,type);		
		view.bNameFrameCancel.off();view.bNameFrameCancel.on(StandardEvent.CLICK, onFrameCancel);
		view.bNameFrameValid.off(); view.bNameFrameValid.on(StandardEvent.CLICK, onInsertElementValid,false,{type:type});
		view.foName.value("");		
	}
	
	function onFrameCancel (e:ElemEvent) {
		closeNameFrame ();
	}
	// override by AbstractFormField
	function onInsertElementValid (e:ElemEvent, ?d:Dynamic) {		
		var o:Dynamic = null;
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerInsertElement, { type:d.type } );			
		o = { req:"insert" + insertSrvTxtMsg, data:Json.stringify({id:model.currUserId, label:view.foName.value(), parentRecId:recId, type:d.type})  };	
		server.ask(o);
	}
	//ici
	/*
	function autoCreateFolder () {		
		var o:Dynamic = null;
		server.serverEvent.off(); 
		server.serverEvent.on(autoCreateAdressBook);			
		o = { req:"insertFormFolder", data:Json.stringify({id:model.currUserId, label:lang.autoFolderLabel, parentRecId:0, type:"folder"}) };	
		server.ask(o);
	}
	function autoCreateAdressBook (e:StandardEvent) {
		var o:Dynamic = null;
		server.serverEvent.off(); 
		if (e.result.answ == "insertFormFolderOk") {			
			server.serverEvent.on(autoCreateLogins, { parentRecId:e.result.recId });			
			o = { req:"insertFormFolder", data:Json.stringify({id:model.currUserId, label:lang.autoAdressBookLabel, parentRecId:e.result.recId, type:"form"}) };	
			server.ask(o);
		}
		else g.alert(lang.serverFatalError);
	}
	function autoCreateLogins (e:StandardEvent) {
		var o:Dynamic = null;
		server.serverEvent.off(); 
		if (e.result.answ == "insertFormFolderOk") {			
			server.serverEvent.on(autoCreate, { parentRecId:e.result.recId });			
			o = { req:"insertFormFolder", data:Json.stringify({id:model.currUserId, label:lang.autoAdressBookLabel, parentRecId:e.result.recId, type:"form"}) };	
			server.ask(o);
		}
		else g.alert(lang.serverFatalError);
	}
	*/
	//fin ici
	function onAnswerInsertElement (e:StandardEvent) :String {
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				
			else if (e.result.msg=="parentFormDoesntExist") g.alert(lang.parentFormDoesntExist);	
			else g.alert(lang.serverReadError + e.result.msg);
		} 
		else if (answ != "insert"+insertSrvTxtMsg+"Ok")  g.alert(lang.serverFatalError);
		else {
			var el; if (this == model.root)  el = elemsCtnr ; else el = bElem ;
			view.showTipBox(lang.createOk, el.parent() , el.posx(), el.posy(), 1)	;
			closeNameFrame ();
			if (e.result.msg != null) trace(e.result.msg);
		}
		return answ;
	}
	function insertElementInit (ff:AbstractFolderFormField,rci:Int) {
		ff.init(rci, view.foName.value());
		ff.parent = this;
	}
		
	function onUpdateClick (e:ElemEvent) {		
		showNameFrame(updateTitleTxt,nameTxt,nameHolderTxt);
		view.bNameFrameCancel.off();view.bNameFrameCancel.on(StandardEvent.CLICK, onFrameCancel);
		view.bNameFrameValid.off(); view.bNameFrameValid.on(StandardEvent.CLICK, onUpdateFrameValid);
		view.foName.value(label);
		selectAndDispatch ();
	}	
	function onRemoveClick (e:ElemEvent) {
		selectAndDispatch ();
		cb.show(lang.deleteConfirm+" "+path+" ?",askDelete);		
	}
	function onUpdateFrameValid (e:ElemEvent) {
		label = view.foName.value();
		labelElem.value(label);
		//
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerUpdate);
		server.ask( { req:"updateFormFolder", data:Json.stringify({id:model.currUserId, recId:recId, label:label})  } );
	}
	function onAnswerUpdate (e:StandardEvent) {
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);			
			else g.alert(lang.serverReadError + e.result.msg);
		} else if (answ == "update" + srvTxtMsg + "Ok")  {
			closeNameFrame ();
			view.showTipBox(lang.updateOk, bElem.parent(), bElem.posx(), bElem.posy(), 2)	;
		} else {			
			g.alert(lang.serverFatalError);
		}
	}
	// must be override 
	function closeNameFrame () {
		view.bNameFrameCancel.off();
		view.bNameFrameValid.off(); 		
		view.nameFrame.hide();
	}
	function askDelete (b:Bool,f:Confirm) {
		if (b) {
			server.serverEvent.off(); 
			server.serverEvent.on(onAnswerDelete  );	
			// formId:getParent().recId is used only to delete a field
			server.ask( { req:"delete" + srvTxtMsg , data:Json.stringify({id:model.currUserId, formRecId:getParent().recId , recId:recId})  } );
		} 
	}
	function onAnswerDelete (e:StandardEvent) {
		cb.hide();
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				 
			else if (e.result.msg=="elemDoesntExist") g.alert(lang.elemDoesntExist);
			else if (e.result.msg=="invalidFormOwner") g.alert(lang.invalidFormOwner);
			else g.alert(lang.serverReadError + e.result.msg);
		} else if (answ == "delete" + srvTxtMsg + "Ok")  { 
			//g.alert("msg"+e.result.msg);
			if (getParent() != model.root)
				view.showTipBox(lang.deleteOk,getParent().bElem.parent(), bElem.posx(), bElem.posy(), 1)	;
			remove ();
		} else {			
			g.alert(lang.serverFatalError);
		}
	}	
	function remove 										()	{trace("f::Must be override by Folder, Form and Field !");}
	function createFolderAfterInsert 	(rci:Int, ?shift:Int=0) {trace("f::Must be override by Folder !");}
	function createFormAfterInsert 		(rci:Int, ?shift:Int=0) {trace("f::Must be override by Folder !");}
	function createFieldAfterInsert 	(rci:Int, ?shift:Int=0) {trace("f::Must be override by Form !");}
	function onButtonClick 				(e:ElemEvent) 			{trace("f::Must be override by Form and Folder !");}
}