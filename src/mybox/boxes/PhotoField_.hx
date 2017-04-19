
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import apix.common.util.Object;
import apix.ui.input.PhotoField;
import apix.ui.UICompo;
import apix.ui.UICompo.MediaData;
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
class PhotoField_ extends Field { 
	
	var pfUi:PhotoField;
	
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
		var value:Array<MediaData> = null;
		value = cast(Json.parse(checkAndRepare(valInit)));
		var pfId = Common.newSingleId;
		pfUi = new PhotoField ( { 
									id:pfId,
									into:"#" + elemsCtnr.getId(),
									value:value,
									label:label,
									name:pfId,
									max:1,
									skin:"mobile",
									required:required
								} );
		
		uiCompo = pfUi;						
		var el = pfUi.element;		
		var labEl = pfUi.labelElement;		
		var valEl = pfUi.photoCtnrElement;
		return {elem:el,labelElem:labEl,valueElem:valEl};
	}
	
	override public function getValueToSave (e:Elem):String {	
		//e is not used. Only here for compatibility whith Field. getValueToSave();
		var v = Json.stringify(pfUi.value);
		return v ;
	}
	override public function getDisplayValue(v:String) {
		var arr:Array<MediaData> = cast(Json.parse(v)); 
		if (arr.length > 0) {
			var md:MediaData = arr[0];
			v = UICompo.mediaDataToUrl(md) ; 
			
		} else v = "";
		return v ;
	}
	override public function checkAndRepare (v:String):String {
		if (v == "" || v==null) v = "[]";		
		return v;
	}
	/**
	 * private
	 */
		
}