
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import apix.common.util.Object;
import apix.ui.input.ColorField;
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
class ColorField_ extends Field {  
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
		var red= g.hexToDec(v.substr(1,2));
		var green= g.hexToDec(v.substr(3,2));
		var blue= g.hexToDec(v.substr(5,2));
		return lang.red + " : " + red + " / " + lang.green + " : " + green + " / " + lang.blue+" : " + blue ;
	}
	public function oppositeColor (v:String):String {		
		var red= 255-g.hexToDec(v.substr(1,2));
		var green= 255-g.hexToDec(v.substr(3,2));
		var blue= 255-g.hexToDec(v.substr(5,2));
		return "rgb("+red+","+green+","+blue+")" ;
	}
	
	
	//

	override public function displayInRecordFrame (elemsCtnr:Elem, placeHolder:String, ?valInit:String = "#000000" ) : FrameFieldElem  { 		
		elemsCtnr.setId("fieldsCtnr_" + index);			
		new HLine("#" + elemsCtnr.getId()); 
		//if (valInit == "") valInit = "#000000";
		var cf:ColorField =  new ColorField ( { 
									into:"#" + elemsCtnr.getId(),
									label:label, 
									value:valInit,
									width:"100px",
									height:"100px",
									required:required
		} );
		uiCompo = cf;					
		var el = cf.element;		
		var labEl = cf.labelElement;		
		var valEl = cf.inputElement;
		return {elem:el,labelElem:labEl,valueElem:valEl} ;
	}
	
	/**
	 * private
	 */
	
	
}