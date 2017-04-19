
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import apix.common.util.Object;
import apix.ui.input.LinkField;
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
class LinkField_ extends Field {  	
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
		return LinkField.getLinkFrom(v);
	}
	
	public function getLinkText (v:String):String {
		return LinkField.getArrayFrom(v)[0];
	}
	
	//

override public function displayInRecordFrame (elemsCtnr:Elem, placeHolder:String, ?valInit:String = '[""],[""]' ) : FrameFieldElem  { 		
		elemsCtnr.setId("fieldsCtnr_" + index);			
		new HLine("#" + elemsCtnr.getId()); 
		if (valInit == "") valInit = '[""],[""]';
		//var arr=LinkField.getArrayFrom(valInit);
		var lf:LinkField =  new LinkField ( { 
									into:"#" + elemsCtnr.getId(),
									label:label, 									
									textPlaceHolder:lang.linkTextPlaceHolder,
									urlPlaceHolder:"http://....",
									value:valInit,
									textLabel:lang.linkTextLabel,
									urlLabel:lang.linkUrlLabel,
									required:required
		} );
		uiCompo = lf;					
		var el = lf.element;		
		var labEl = lf.labelElement;		
		var valEl = lf.inputElement;
		return {elem:el,labelElem:labEl,valueElem:valEl} ;
	}
	
	/**
	 * private
	 */
	
	
}