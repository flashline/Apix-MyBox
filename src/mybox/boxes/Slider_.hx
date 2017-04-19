
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.event.timing.Delay;
import apix.common.tools.math.Rectangle;
import apix.common.util.Global ;
import apix.common.util.Object;
import apix.ui.slider.Slider;
import apix.ui.UICompo.HLine;
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
class Slider_ extends Field { 
	public var minValue:Float;
	public var maxValue:Float;
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
	public function initSlider (minVal:Float, maxVal:Float, dn:Int) {
		minValue = minVal;
		maxValue = maxVal;
		decimalNumber = dn;
	}	
	override public function getDisplayValue (v:String):String {		
		var arr:Array<Float> = cast(Json.parse(checkAndRepare(v)));
		if (arr.length > 0) v = g.strVal(arr[0]) ; else v = "";
		return v;
	}
	override public function getValueToSave (e:Elem):String {	
		return "["+e.value()+"]";
	}
	override public function checkAndRepare (v:String):String {
		if (v == "") v = "[]";
		var arr:Array<Int>;
		try {
			arr = cast(Json.parse(v)) ;
		}
		catch (e:Dynamic) {	
			if (v.length>1) {
				if (v.substr(0) != "[" ) v = "["+v;
				if (v.substr(v.length - 1) != "]" ) v = v += "]";
			} 
			else v = "[]"	;									
		}
		try {
			arr = cast(Json.parse(v)) ;
		}
		catch (e:Dynamic) {
			v = "[]"	;
		}		
		return v;
	}	
	override public function displayInRecordFrame (elemsCtnr:Elem, placeHolder:String, ?valInit:String = "" ) : FrameFieldElem  { 		
		elemsCtnr.setId("fieldsCtnr_" + index);		
		new HLine("#" + elemsCtnr.getId()); 
		var sl:Slider = new Slider ( { 
									into:"#" + elemsCtnr.getId()
									,label:label
									,auto:false
									,start: numVal(minValue)
									,end: maxValue
									,inputValue:valInit
									,decimal:decimalNumber
									,required:required
								} );
		uiCompo = sl;			
		sl.enable();	
		//							
		var el = sl.element;		
		var labEl = sl.labelElement;		
		var valEl = sl.lastSelector.inputElem;
		return {elem:el,labelElem:labEl,valueElem:valEl} ;
	}
		//used after insert
	public function askUpdateSlider () {
		var o:Dynamic = null;
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerInsertSlider);	
		o = { 	req:"updateSlider",
				data:Json.stringify(
					{	id:model.currUserId,
						formRecId:getParent().recId,
						recId:recId,
						minValue:minValue,
						maxValue:maxValue,
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
		view.decimalNumberInput.value("" + decimalNumber);
		view.minValueInput.value(g.strVal(minValue));
		view.maxValueInput.value(g.strVal(maxValue));
	}	
	override function screenToData () :Dynamic {
		var o = super.screenToData();
		var osf = Json.parse(o.data);		
		osf.minValue = g.numVal(view.minValueInput.value(), 1); 
		minValue=osf.minValue; 
		osf.maxValue = g.numVal(view.maxValueInput.value(), 999); 
		maxValue=osf.maxValue; 
		osf.decimalNumber = g.intVal(view.decimalNumberInput.value(), 2); 
		decimalNumber=osf.decimalNumber; 
		o.data = Json.stringify(osf);		
		return o;
	}
	function onAnswerInsertSlider (e:StandardEvent) {
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				
			else if (e.result.msg=="parentFormDoesntExist") g.alert(lang.parentFormDoesntExist);	
			else g.alert(lang.serverReadError + e.result.msg);
		} 
		else if (answ != "updateSliderOk")  g.alert(lang.serverFatalError);
	}
}