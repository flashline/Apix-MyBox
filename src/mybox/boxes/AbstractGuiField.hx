
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import haxe.Json;

import mybox.Model;
import mybox.View;

//
using apix.common.display.ElementExtender;
using apix.common.util.StringExtender;
using apix.common.util.ArrayExtender;
//

//
class AbstractGuiField extends Field {  	
	
	var selectArray:Array<String>; 	// <=json.parse(selectList) ; public
	
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
	var selectList(get, null):String; 
	function get_selectList() :String { 
		return Json.stringify(selectArray) ;
	}	
	
	
	
	/**
	 * public
	 */
	override public function getDisplayValue (v:String):String {
		if (v == "") v = "[-1]";		
		//
		var arr:Array<Int> = cast(Json.parse(v));
		v = ""; var coma = "";	
		for (i in arr) {
			var n = g.intVal(i, -1);	
			if (n>-1 && n<selectArray.length) {
				v += coma+selectArray[n] ; 
				coma = ",";
			}
		}
		return v;
	}
	override public function checkAndRepare (v:String):String {
		if (v == "") v = "[-1]";
		var arr:Array<Int>;
		try {
			arr = cast(Json.parse(v)) ;
		}
		catch (e:Dynamic) {			
			if (v.substr(v.length-1) == "," ) v = v.substr(0, v.length - 1);
			v = v + "]" ;			
		}
		try {
			arr = cast(Json.parse(v)) ;
		}
		catch (e:Dynamic) {
			v = "[-1]"	;
		}
		
		return v;
	}	
	/**
	 * private
	 */
	function getArrayOfString (v:String):Array<String> {	
		var arr:Array<Int> = cast(Json.parse(v));
		var arrOut:Array<String> = [];
		for (i in arr) {
			arrOut.push(Std.string(i));
		}
		return arrOut;
	}	
	override function dataToScreen () {	
		super.dataToScreen();
		view.selectListCtnr.removeChildren();
		var el:Elem=null;
		for (sl in selectArray) {
			el=pushLineInSelectList () ;
			el.value(sl);			
		}
		pushLineInSelectList(); 
	}
	
}