
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import apix.common.util.Object;
import apix.ui.input.DateField;
import apix.ui.input.NumberInputField;
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
class DateField_ extends Field {  	
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
	override public function getDisplayValue (v:String):String {		
		return v.toDisplayDate() ;		
	}
	
	
	//

	override public function displayInRecordFrame (elemsCtnr:Elem, placeHolder:String, ?valInit:String = "" ) : FrameFieldElem  { 		
		elemsCtnr.setId("fieldsCtnr_" + index);			
		new HLine("#" + elemsCtnr.getId()); 
		var df:DateField = new DateField( {
							into:"#" + elemsCtnr.getId()
						 , 	label:label
						 ,	elementToHide:"#viewBody"
						 ,	value:valInit
						 , required:required
						 
						 }); 
		uiCompo = df;						
		var el = df.element;		
		var labEl = df.labelElement;		
		var valEl = df.dataElement;
		return {elem:el,labelElem:labEl,valueElem:valEl} ;
	}
	
	/**
	 * private
	 */
	
	
}