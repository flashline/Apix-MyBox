
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import apix.common.util.Object;
import haxe.Json;
import mybox.boxes.Field.FrameFieldElem;
import mybox.Model;
import mybox.View;

//
using apix.common.display.ElementExtender;
using apix.common.util.StringExtender;
using apix.common.util.ArrayExtender;
//

//
class SelectField_ extends AbstractGuiField {  	
	var isMultiple:Bool ;	
	//	
	/*
	 * constructor
	 */
	public function new  (m:Model,?v:View) {	
		super(m, v);
	}
	//gets/sets
	var selectFieldDataHolderTxt(get, null):String; 
	function get_selectFieldDataHolderTxt() :String { 
		return isMultiple?lang.selectFieldMulDataHolder:lang.selectFieldDataHolder;
	}
	override public function getValueToSave (e:Elem):String {	
		var v = "["; var coma = "";	
		for (so in e.getSelectedOptions()) {
			v += coma + so.value;
			coma = ",";
		}
		v += "]";
		return v;
	}
	//
	public function initSelectField (?im:Bool,?sl:String) {	
		isMultiple = im ;
		selectArray = Json.parse(sl); 
	}
	
	override public function displayInRecordFrame (elemsCtnr:Elem, placeHolder:String, ?valInit:String = "" ) : FrameFieldElem  { 
		var el = view.frameSelectFieldDataProto.clone(true); 
		elemsCtnr.addChild(el); el.show();
		el.setId("recFrameField_" + index);		
		var labEl = el.elemByClass("apix_label");
		var valEl = el.elemByClass("apix_value");		
		if (valInit == "") valInit = "[-1]";
		var i = 0;
		var oEl; var o1El=null;
		if (valInit == "[-1]")  {
			oEl= valEl.addOption() ;		
			oEl.inner(selectFieldDataHolderTxt);
			oEl.value("-1");
		}		
		for (sl in selectArray) {
			oEl=valEl.addOption() ;
			oEl.value("" + i);
			oEl.inner(sl);
			i++;
		}
		if (valInit != "[-1]")  {
			oEl= valEl.addOption() ;		
			oEl.inner(lang.selectFieldDataNone);
			oEl.value("-1");
		}		
		if (isMultiple) {
			valEl.multiple(true);
			var h = Math.min((selectArray.length + 1), 5) * 20;
			valEl.height(Math.min((selectArray.length + 1), 5) * 20);			
		}
		for (e in valEl.getOptions()) e.selected(false);
		// set selected the choosen element(s) in combo
		var aov:Array<OptionValue> = valEl.getOptionsByValue(getArrayOfString(valInit));
		for (ov in aov) {			
			var oi = ov.index;
			valEl.getOption(oi).selected(true);
		}
		labEl.text(label) ;	 
		valEl.name(dbColName);		
		return {elem:el,labelElem:labEl,valueElem:valEl} ;
	}
	/**
	 * private
	 */
	
	override function dataToScreen () {	
		super.dataToScreen();
		view.isMultipleInput.selected(isMultiple);
	}
	override function screenToData () :Dynamic {
		var o = super.screenToData();
		var osf = Json.parse(o.data);		
		osf.isMultiple = view.isMultipleInput.selected();
		osf.selectList = selectListEntry() ; selectArray = Json.parse(selectListEntry()); 
		o.data = Json.stringify(osf);
		return o ;
	}
	//used after insert
	public function askUpdateSelectField () {
		var o:Dynamic = null;
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerInsertSelectField );	
		popLineInSelectList ();
		view.bAddSelectLine.off();	
		o = { 	req:"updateSelectField",
				data:Json.stringify(
					{	id:model.currUserId,
						formRecId:getParent().recId,
						recId:recId,
						isMultiple:isMultiple,
						selectList: selectList	
					}
				)
			};
		server.ask(o);
	}
	function onAnswerInsertSelectField (e:StandardEvent) {
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				
			else if (e.result.msg=="parentFormDoesntExist") g.alert(lang.parentFormDoesntExist);	
			else g.alert(lang.serverReadError + e.result.msg);
		} 
		else if (answ != "updateSelectFieldOk")  g.alert(lang.serverFatalError);
	}
	
	
}