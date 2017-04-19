
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import apix.common.util.Object;
import apix.ui.input.GeoField;
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
class GeoField_ extends Field { 
	
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
	
	//
		
	
	override public function displayInRecordFrame (elemsCtnr:Elem, placeHolder:String, ?valInit:String = "" ) : FrameFieldElem  { 		
		elemsCtnr.setId("fieldsCtnr_" + index);			
		var gf = new GeoField ( { 
								into:"#" + elemsCtnr.getId(),
								value:valInit,
								label:label,
								shortDisplay:true,
								required:required
								} );	
		uiCompo = gf;
		var el = gf.element;		
		var labEl = gf.labelElement;		
		var valEl = gf.inputElement;
		return {elem:el,labelElem:labEl,valueElem:valEl} ;
	}
	/**
	 * private
	 */
		
}