
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.display.Confirm;
import apix.common.event.EventSource;
import apix.common.util.Global ;
import apix.common.util.Object;
import mybox.Model;
import mybox.Server;
import mybox.View;
//
using apix.common.util.StringExtender;
using apix.common.display.ElementExtender;
//
class AbstractBox  {
	var g:Global;
	var cb:Confirm;
	var lang(default, null):Object;
	var param(default, null):Object;
	var server:Server;
	var model:Model ;
	var view:View ;	
	// common to subclasses
	public var parent:AbstractBox;
	public var label:String;
	public var recId :Int;
	public var vId :String;
	public var elem :Elem; 
	public var shift :Int; 
	public var isClosed :Bool; 
	public var index :Int;	
	// gets
	public var path(get, null):String; 
	function get_path() : String {
		if (parent != null) return parent.path + "/" + label;
		else return "";
	}	
	//
	/**
	 * ctnr used by Form and Record to contain data records
	 */	
	public var recordsCtnr(get, null):Elem; function get_recordsCtnr() :Elem { 	return elem.elemByClass("apix_recordsSubCtnr");	}	
	public var bElem(get, null):Elem; function get_bElem() :Elem { return elem.elemByClass("apix_txtField");}
	public var labelElem(get, null):Elem; function get_labelElem() :Elem { 
		return bElem.elemByTag("input");
	}
	//
	public var pictoCtnr(get, null):Elem; function get_pictoCtnr() :Elem {
		return  return elem.elemByClass("apix_pictoCtnr");
	}
	public var bUpdate(get, null):Elem; function get_bUpdate() :Elem { return ("#" + vId + " .apix_pictoCtnr .updatePicto").get();}
	public var bRemove(get, null):Elem; function get_bRemove() :Elem { return ("#" + vId + " .apix_pictoCtnr .removePicto").get();}
	
	
	
	public function is (v:String) :Bool  return what==v ;
	public function whatIs (v:Dynamic) :String  return g.className(v) ;
	public var what(get, null):String; 
	//override by sub fields as SelectField_
	function get_what () :String {		
		return g.className(this) ;
	}
	/*
	 * constructor
	 */
	function new (m:Model,?v:View) {	
		g = Global.get();
		cb = Confirm.get();		
		model = m; view = v;
		lang = model.lang;
		param = model.param;
		server = model.server; 		
	}
	
	/**
	 * @private
	 */
	

}