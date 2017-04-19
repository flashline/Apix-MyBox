
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import apix.common.util.Object;
import apix.ui.input.NumberInputField;
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
class NumberField_ extends Field {  	
	public var decimalNumber:Int;
	//	
	/*
	 * constructor
	 */
	public function new  (m:Model,?v:View) {	
		super(m, v);
	}
	//gets/sets
	override function get_what () :String {		
		return "Field" ;
	}
	
	
	
	/**
	 * public
	 */
	
	/*
	override public function getValueToSave (e:Elem):String {		
		return e.value();
	}
	override public function checkAndRepare (v:String):String {
		return v;
	}
	*/
	//
	public function initNumberField (dn:Int) {	
		decimalNumber = dn;
	}	
	
	override public function displayInRecordFrame (elemsCtnr:Elem, placeHolder:String, ?valInit:String = "" ) : FrameFieldElem  { 		
		elemsCtnr.setId("fieldsCtnr_" + index);	
		var ph = "999"; var dot = "." ;
		for (i in 0...decimalNumber) {
			ph += dot + "9";
			dot = "";
		}
		if (g.numVal(valInit,0) == 0) valInit = "";
		var nif = new NumberInputField( { 
								into:"#" + elemsCtnr.getId(),
								label:label,
								decimal:decimalNumber,
								placeHolder:ph,
								value:valInit,
								required:required
								} );
		
		
		
		uiCompo = nif;
		var el = nif.element;
		//el.setId("recFrameField_" + index);		
		var labEl = nif.labelElement;		
		var valEl = nif.inputElement;
		//valEl.name(dbColName);		
		return {elem:el,labelElem:labEl,valueElem:valEl} ;
	}
	//used after insert
	public function askUpdateNumberField () {
		var o:Dynamic = null;
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerInsertNumberField);	
		o = { 	req:"updateNumberField",
				data:Json.stringify(
					{	id:model.currUserId,
						formRecId:getParent().recId,
						recId:recId,
						decimalNumber:decimalNumber
					}
				)
			};
		server.ask(o);
	}
	/**
	 * private
	 */
	override function dataToScreen () {	
		super.dataToScreen ();
		view.decimalNumberInput.value(""+decimalNumber);
	}		
	override function screenToData () :Dynamic {
		var o = super.screenToData();
		var osf = Json.parse(o.data);		
		osf.decimalNumber = g.intVal(view.decimalNumberInput.value(),2); decimalNumber=osf.decimalNumber; 
		o.data = Json.stringify(osf);
		return o;
	}
	function onAnswerInsertNumberField (e:StandardEvent) {
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				
			else if (e.result.msg=="parentFormDoesntExist") g.alert(lang.parentFormDoesntExist);	
			else g.alert(lang.serverReadError + e.result.msg);
		} 
		else if (answ != "updateNumberFieldOk")  g.alert(lang.serverFatalError);
	}
}