
package safebox.models;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.display.Confirm;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import safebox.Model;
//
using apix.common.display.ElementExtender;
using apix.common.util.StringExtender;
//
typedef FrameFieldElem = {
	var elem:Elem;
	var valueElem:Elem;
	var labelElem:Elem;	
}
//
class Field extends Folder {  
	
	//public var change:EventSource;
	public var rowNumber:Int;
	public var copyEnable:Bool ;
	public var isHidden:Bool ;
	//public var isUnique:Bool ;
	public var isPrimary:Bool ;
	
	//	
	/*
	 * constructor
	 */
	public function new  (m:Model,?v:View) {	
		super(m, v);
		srvTxtMsg = "Field";
		//change=new EventSource
	}
	/*
	public function getParentForm () :Form {
		return cast(parent, Form);
	}*/
	// gets
	public var dbColName(get, null): String; function get_dbColName() :String { return "fd_"+recId ; }
	
	
	//
	override function get_nameTxt() :String { return lang.fiName ; }
	override function get_color() :String { return param.fieldColor ; }
	override function get_nameHolderTxt() :String { return lang.fiNameHolder ; }
	override function get_updateTitleTxt() :String { return lang.fiUpdateTitle ; }
	override function get_primary() :Field {
		var len = fields.length ; var v:Field = null;
		for (i in 0...len) {			
			if (fields[i].isPrimary) { v= fields[i];  break; }
		}
		return v;
	}
	public var inputFieldString (get, null):String ; function get_inputFieldString() :String { 
		if (rowNumber > 1) return "apix_textArea" ;
		else return  "apix_textInput" ;
	}	
	public var isMultiLines (get, null):Bool ; function get_isMultiLines() :Bool { 
		return (rowNumber > 1)  ;
	}	
	public var inputFieldToHideString (get, null):String ; function get_inputFieldToHideString() :String { 
		if (rowNumber > 1) return "apix_textInput" ;
		else return  "apix_textArea" ;
	}	
	public var inputFieldHeight(get, null):Float ; function get_inputFieldHeight() :Float  { 
		if (rowNumber > 1) return rowNumber*22 ;
		else return -1 ;
	}
	//
	public function initField (ri:Int,l:String,rn:Int,ce:Bool,ih:Bool,ip:Bool) {	
		recId = ri;
		label = l;
		rowNumber = rn ;
		copyEnable = ce;
		isHidden = ih;
		isPrimary = ip;
		
	}
	
	override public function clear () {	
		removeEvent();
	}
	override public function setupEvent () {
		super.setupEvent();
		bElem.off(StandardEvent.CLICK, onButtonClick);
		bElem.on(StandardEvent.CLICK, onUpdateClick);		
	}
	override public function removeEvent () {		
		if (bElem.hasLst(StandardEvent.CLICK) ) bElem.off(StandardEvent.CLICK,onUpdateClick);		
		super.removeEvent ();
	}
	override public function open () {
		trace("f:: not possible to use Field.open() !!");
		
	}
	override public function close () {	
		trace("f:: not possible to use Field.close() !!");
	}
	override public function setupAdminMode () { 
		pictoCtnr.show("inline-block");	
	}
	override public function setupUsingMode () { 
		pictoCtnr.hide();
	}
	public function displayInRecordFrame (elemsCtnr:Elem,placeHolder:String,?valInit:String="" ) : FrameFieldElem { 
		var el = view.frameFieldDataProto.clone(true);
		elemsCtnr.addChild(el); el.show();
		el.id = "recFrameField_" + index;
		var labEl = el.elemByClass("apix_label");
		labEl.text(label) ;		
		el.elemByClass(inputFieldToHideString).hide();
		el.elemByClass(inputFieldString).show();
		var valEl = el.elemByClass(inputFieldString).elemByClass("apix_value");
		if (inputFieldHeight > 0) valEl.height(inputFieldHeight);
		valEl.value(valInit) ; valEl.placeHolder(placeHolder + " " + label); valEl.name(dbColName);		
		return {elem:el,labelElem:labEl,valueElem:valEl} ;
	}
	
	/**
	 * @private
	 */
	
	override function onUpdateClick (e:ElemEvent) {	
		super.onUpdateClick(e);
		showNameFrame (updateTitleTxt, nameTxt, nameHolderTxt, "field");
		foName.value(label);
		rowNumberInput.value("" + rowNumber);		
		copyEnableInput.value(copyEnable?"true":"false");
		copyEnableInput.selected(copyEnable);
		isHiddenInput.value(isHidden?"true":"false");
		isHiddenInput.selected(isHidden);
		isPrimaryInput.value(isPrimary?"true":"false");
		isPrimaryInput.selected(isPrimary);
		lockPrimaryInput (this);
	}
	override function onFrameValid (e:ElemEvent) {
		rowNumber = g.intVal(rowNumberInput.value(),1);
		copyEnable = g.boolVal(copyEnableInput.selected(), true);
		isHidden = g.boolVal(isHiddenInput.selected(),true);
		isPrimary = g.boolVal(isPrimaryInput.selected(),true);
		label = foName.value();
		labelElem.value(label);
		//
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerUpdate);		
		server.ask({ req:"updateField",id:model.currUserId,recId:recId,label:label,rowNumber:rowNumber,copyEnable:copyEnable,isHidden:isHidden,isPrimary:isPrimary});	
	}	
	
	
}