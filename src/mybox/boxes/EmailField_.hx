
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import apix.common.util.Object;
import apix.ui.input.EmailField;
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
class EmailField_ extends Field {  	
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
	public var emailIdElement(default,null):Elem;
	public var domainElement(default,null):Elem;
	public var emailField:EmailField ;
	
	/**
	 * public
	 */
	/**
	 * if field is securised and if the correct code is entered then this function is called 
	 * (by SingleFormRecordMng wich manage record update)	 * 
	 * @param	v  Value read from server
	 * 				since EmailField.value is set by 'v' then the value is displayed on screen
	 */
	public function showValue (v:String) {
		emailField.value = v;
	}
	override public function displayInRecordFrame (elemsCtnr:Elem, placeHolder:String, ?valInit:String = "" ) : FrameFieldElem  { 		
		elemsCtnr.setId("fieldsCtnr_" + index);			
		new HLine("#" + elemsCtnr.getId()); 
		emailField =  new EmailField ( { 
									into:"#" + elemsCtnr.getId(),
									label:label, 
									value:valInit,
									placeHolder:placeHolder,
									required:required
		} );
		uiCompo = emailField;						
		var el = emailField.element;		
		var labEl = emailField.labelElement;		
		var valEl = emailField.inputElement;
		emailIdElement = emailField.emailIdElement;
		domainElement = emailField.domainElement;
		return {elem:el,labelElem:labEl,valueElem:valEl} ;
	}
	
	/**
	 * private
	 */
	
	
}