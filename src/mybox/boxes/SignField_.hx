
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import apix.common.util.Object;
import apix.ui.input.SignField;
import mybox.boxes.Field.FrameFieldElem;
import mybox.Model;
import mybox.View;

//
using apix.common.display.ElementExtender;
using apix.common.util.StringExtender;
using apix.common.util.ArrayExtender;
//

//
class SignField_ extends Field { 
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
	
	
		
	
	override public function displayInRecordFrame (elemsCtnr:Elem, placeHolder:String, ?valInit:String = "" ) : FrameFieldElem  { 		
		elemsCtnr.setId("fieldsCtnr_" + index);			
		var sf = new SignField ( { 
									into:"#" + elemsCtnr.getId(),
									base64UrlValue:valInit,
									label:label, 
									border:true,
									thickness:4,
									color:"#0000ff",
									width:"290px",
									height:"200px",
									required:required
								} );	
		uiCompo = sf;
		var el = sf.element;		
		var labEl = sf.labelElement;		
		var valEl = sf.inputElement;
		return {elem:el,labelElem:labEl,valueElem:valEl};
	}
	override public function getValueToSave (e:Elem):String {	
		//e is an img
		var v = e.attrib(Attrib.src);
		if (v.substr(0,10) != "data:image" ) {
			v = "";
		}
		return v ;
	}
	/*
	override public function getDisplayValue (v:String):String {		
		return v;
	}
	*/
	/**
	 * private
	 */
		
}