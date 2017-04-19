
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.display.Confirm;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import apix.common.util.Object;
import apix.ui.UICompo;
import haxe.Json;
import mybox.Model;
import mybox.View;
//
using apix.common.display.ElementExtender;
using apix.common.util.StringExtender;
//
typedef FrameFieldElem = {
	var elem:Elem;
	var valueElem:Elem;
	var labelElem:Elem;	
}
@:enum
abstract Control (String) from String to String { 
	var InputField 	= "InputField";
	var AreaField 	= "AreaField" ; 
	var SelectField = "SelectField";
	var CheckField 	= "CheckField";
	var RadioField 	= "RadioField";
	var NumberField = "NumberField";
	var GeoField 	= "GeoField";
	var SignField 	= "SignField";
	var PhotoField 	= "PhotoField";
	var Slider 		= "Slider";
	var DateField	= "DateField";
	var EmailField	= "EmailField";
	var ColorField	= "ColorField";
	var LinkField	= "LinkField";
	
}
//
class Field extends AbstractFormField {  
	
	//public var change:EventSource;
	public var required:Bool ;
	public var copyEnable:Bool ;
	public var isHidden:Bool ;
	public var isSecure:Bool ;
	public var isPrimary:Bool ;
	public var control:Control ;
	public var rowNumber:Int;	
	/**
	 * used by Field that contains UICompo in recordFrame
	 * @see  SingleFormRecordMng.removeFieldsEvent ()
	 */
	public var uiCompo:UICompo;	
	//	
	/*
	 * constructor
	 */
	public function new  (m:Model,?v:View) {	
		super(m, v);
		srvTxtMsg = "Field";
		//change=new EventSource
	}
	override public function getParent () : Form { return cast(parent, Form);  } 
	// gets
	public var dbColName(get, null): String; function get_dbColName() :String { return "fd_"+recId ; }
	
	
	//
	override function get_nameTxt() :String { return lang.fiName ; }
	override function get_color() :String { return param.fieldColor ; }
	override function get_nameHolderTxt() :String { return lang.fiNameHolder ; }
	override function get_updateTitleTxt() :String { return lang.fiUpdateTitle ; }
	override function get_primary() :Field {
		var flds = getParent().fields; var len = flds.length ; var v:Field = null; 
		for (i in 0...len) {			
			if (flds[i].isPrimary) { v= flds[i];  break; }
		}
		return v;
	}/**/
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
	/**
	 * must be override by GUI fields
	 * 
	 */
	public function getDisplayValue (v:String):String {		
		return v;
	}
	public function getValueToSave (e:Elem):String {		
		return e.value();
	}
	public function checkAndRepare (v:String):String {
		return v;
	}
	//
	public function initField (ri:Int,l:String,rn:Int,re:Bool,ce:Bool,ih:Bool,is:Bool,ip:Bool,ct:Control,?im:Bool,?sl:String) {	
		recId = ri;
		label = l;
		rowNumber = rn ;
		required = re ;
		copyEnable = ce;
		isHidden = ih;
		isSecure = is;
		isPrimary = ip;
		control = ct;			
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
	public function setupAdminMode () { 
		pictoCtnr.show("inline-block");	
	}
	public function setupUsingMode () { 
		pictoCtnr.hide();
	}
	public function displayInRecordFrame (elemsCtnr:Elem, placeHolder:String, ?valInit:String = "" ) : FrameFieldElem { 
		var el = view.frameFieldDataProto.clone(true);
		elemsCtnr.addChild(el); el.show();
		el.setId("recFrameField_" + index);
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
		getParent().selectAndDispatch();
		clearSecureCode();	
		dataToScreen ();
		showNameFrame (updateTitleTxt, nameTxt, nameHolderTxt, "field");
		showAdminFields ();
		enableAdminFields(); view.isPrimaryInput.enable(true, true);
		setupAdminFieldsInput ();
		setupAdminFieldsEvent ();
		// is forbidden to change control type
		view.controlInput.enable(false, true);
		view.isPrimaryInput.off(); view.isPrimaryInput.on(StandardEvent.CHANGE, onPrimaryChange);
		model.isFieldCreation = false;
	}	
	override function setupAdminFieldsInput () {
		if (isPrimary) {
			//view.isPrimaryInput.parent().show("inline-block");
			view.isPrimaryInput.parent().show("inline");
			disableAdminFields ();			
			hideAdminFields () ;
		}
		else {
			if (primary != null) hideIsPrimaryInput ();
			else if (!isSecure  && control==Control.InputField)  {
				view.isPrimaryInput.off();
				showIsPrimaryInput ();
				view.nameFrameTitle.inner(lang.fiPrimUpdateTitle);
				if (g.strVal(view.foName.value(),"")=="") view.foName.value(lang.fiPrimDefaultLabel);
			}	
			//
			if (control != Control.InputField || isSecure) hideIsPrimaryInput ();
			//
			if (isSecure) {
				view.isHiddenInput.enable(false, true);
				view.isHiddenInput.selected(true);
			}
			else {
				view.isHiddenInput.enable(true,true);
			}
			setupFromControl(control);
			
		}				
	}
	
	override function onUpdateFrameValid (e:ElemEvent) {
		var o = screenToData ();
		var oo = new  Object(o);
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerUpdate);	
		server.ask(o);	
	}
	
	// override by XxxxField_
	function dataToScreen () {	
		view.foName.value(label);
		view.rowNumberInput.value("" + rowNumber);			
		view.controlInput.value(control);		
		view.requiredInput.selected(required);
		view.copyEnableInput.selected(copyEnable);
		view.isHiddenInput.selected(isHidden);
		view.isSecureInput.selected(isSecure);
		view.isPrimaryInput.selected(isPrimary);						
	}		
	function screenToData () :Dynamic {
		rowNumber = g.intVal(view.rowNumberInput.value(),1);
		required = g.boolVal(view.requiredInput.selected(), true);
		copyEnable = g.boolVal(view.copyEnableInput.selected(), true);
		isHidden = g.boolVal(view.isHiddenInput.selected(),true);
		isSecure = g.boolVal(view.isSecureInput.selected(),false);
		isPrimary = g.boolVal(view.isPrimaryInput.selected(), true);
		control=makeFieldsEntryCoherent () ;
		label = view.foName.value();
		labelElem.value(label);
		// add parent id : getParent().recId ;
		var o = { req:"updateField", data:Json.stringify( { id:model.currUserId, formRecId:getParent().recId, recId:recId, label:label, rowNumber:rowNumber, copyEnable:copyEnable,required:required, isHidden:isHidden, isSecure:isSecure, secureCode:currSecureCode, isPrimary:isPrimary, control:control } )  } ;
		return o;
	}
	//
	override function onSecureChange (e:ElemEvent) {
		if (view.isSecureInput.selected()) createSecureCodeForUpdate();
		else {
			if (isSecure) {
				setSecure (true);
				enterSecureCode() ;
			} else doSecureChange();
		}
	}
	override function doSecureChange () {
		super.doSecureChange();
		if (!view.isSecureInput.selected() && primary == null ) {
			view.isPrimaryInput.off();view.isPrimaryInput.on(StandardEvent.CHANGE, onPrimaryChange);	
			view.isPrimaryInput.selected(true);	
			view.isPrimaryInput.enable(true, true);
			disableAdminFields ();
			view.showTipBox(lang.primaryMustBeCreated, view.isPrimaryInput.parent(),0,0,3);
		}
	}
	function setSecure (?b:Bool=true) {		
		view.isSecureInput.selected(b);
		if (!b) currSecureCode="";
	}
	function createSecureCodeForUpdate () {
		createSecureCode ();			
	}		
	function enterSecureCode () {
		createSecureCode ("forEnter");
		showSecureFrame(lang.secureEnterTitle,"","");		
		view.bValidSecureFrame.off(); view.bValidSecureFrame.on(StandardEvent.CLICK, onValidSecureEnter);		
	}	
	function onValidSecureEnter (e:ElemEvent) {
		if (currSecureCode!="") askVerifySecureCode ();
		hideSecureFrame();			
	}
	function askVerifySecureCode () {			
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerVerifySecureCode);		
		server.ask({req:"verifySecureCode",data:Json.stringify({id:model.currUserId,fieldRecId:recId,formRecId:getParent().recId,secureCode:currSecureCode})});
	}
	function onAnswerVerifySecureCode (e:StandardEvent) {
		var answ:String = e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				
			else if (e.result.msg=="elemDoesntExist") g.alert(lang.elemDoesntExist);	
			else if (e.result.msg=="invalidSecureCode") {	
				var d = g.numVal(e.result.jsonData.failureDelay, 0);
				var mn = Math.floor(d / 60); //var sec = d % 60; 
				var fm = g.intVal(e.result.jsonData.failureMin);
				var fn = g.intVal(e.result.jsonData.failureNumber);
				var b = g.boolVal(e.result.jsonData.failureLogoff, false);
				var msg = "";
				if (b) {
					msg+= lang.invalidSecureCodeLogoff+ Std.string(mn);
					msg+= lang.invalidSecureCodeLogoff2;
					g.alert(msg);						
				}
				else {
					msg+= lang.invalidSecureCode+(fm-fn+1) ;
					msg+= lang.invalidSecureCode2;
					g.alert(msg);
				}
			}
			else g.alert(lang.serverReadError + e.result.msg);
		}
		else if (answ != "secureCodeOk") g.alert(lang.serverFatalError);
		else {
			setSecure(false);
			doSecureChange();
		}
	}
	
}