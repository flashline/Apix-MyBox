
package safebox.models;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import js.html.InputElement;
import safebox.Model;
import safebox.View;
//
using apix.common.util.StringExtender;
using apix.common.display.ElementExtender;
//

class FieldData extends SubModel  {
	
	//public var parent:Record;
	public var field(default,null):Field;
	public var value(default,default):String;
	public var key(default,null):String;
	//	
	/*
	 * constructor
	 */
	public function new (m:Model,v:View) {	
		super(m,v);
	}
	//gets
	override function get_labelElem() :Elem { 
		return ("#" + vId + " .apix_label").get();
	}
	public var valueElem(get, null):Elem ; function get_valueElem() :Elem  { 
		return ("#" + vId + " ."+field.inputFieldString+" .apix_value").get();
	}			
	public var inputElemToHide(get, null):Elem ; function get_inputElemToHide() :Elem  { 
		return ("#" + vId + " ."+field.inputFieldToHideString).get();
	}
	public var showPictoElem(get, null):Elem ; function get_showPictoElem() :Elem  { return ("#" + vId + " .apix_showPicto").get();}
	public var copyPictoElem(get, null):Elem ; function get_copyPictoElem() :Elem  { return ("#" + vId + " ."+field.inputFieldString+" .apix_copyPicto").get();}
	public var visible(get, null):Bool  ; function get_visible() :Bool  {return (value==valueElem.value());}
	
	public function getParent () :Record {
		if (parent!=null) return cast(parent,Record);
		else return null ;
	}
	public function init (k:String,v:String="",fi:Field,idx:Int,par:Record) : FieldData {	
		if (v == null) v = "";
		field = fi;
		value = v;
		key = k;
		label = g.strVal(fi.label,"");
		index = idx;
		parent = par;
		return this ;
	}
	public function display () {		
		var fieldDataProto = view.fieldDataProto;
		var fieldDataEl = fieldDataProto.clone(true);
		getParent().elemsCtnr.addChild(fieldDataEl); 
		fieldDataEl.show();		
		fieldDataEl.id = getParent().dbTable+"_rec_" + getParent().recId + "_"+key;		
		vId = fieldDataEl.id;
		elem = fieldDataEl ;
		inputElemToHide.hide();
		setup();
		//TODO ??.click.on(onElemClick);*/
	}
	
	/**
	 * erase() is opposite of display() 
	 * the tree structure is conserved
	 * erase is completly different from clear() or remove() -which are both similary and delete structure-
	 * erase just remove events and Elem instance.
	 * @param	shift
	 */
	public function clear () { 
		if (index!=0) removeEvent();
	}
	public function setup () {
		setupView ();
		setupEvent ();  // to see the detail or open a popup with each fields
	}
	
	
	
	public function toHtmlString (tab:String=""):String {
		var str = ""; 
		str+= tab + label +"="+value+" (key="+key+" index="+index+")<br/>" ;	
		return str ;
	}
	/**
	 * @private
	 */
	function setupView () {
		//elemsCtnr.show(); //tmp
		labelElem.text(label);
		valueElem.value(value);	
		if (field.inputFieldHeight > 0) valueElem.height(field.inputFieldHeight);
		field.isHidden?{ showPictoElem.visible(true);makeHidden();}:{showPictoElem.visible(false);makeVisible();};
		field.copyEnable?copyPictoElem.visible(true):copyPictoElem.visible(false);
		
	}
	function makeVisible () {
		valueElem.value(value);
	}
	function makeHidden () {
		var l=value.length;
		valueElem.value(hideChars(l));
	}
	function hideChars (l:Int) : String {
		var str = ""; for (i in 0...l - 1) str += "*" ;
		return str;
	}
	function setupEvent () {
		if (!copyPictoElem.hasLst(StandardEvent.CLICK) ) copyPictoElem.on(StandardEvent.CLICK, onCopyClick);
		if (!showPictoElem.hasLst(StandardEvent.CLICK) ) showPictoElem.on(StandardEvent.CLICK, onShowClick);
	}
	function removeEvent () {	
		if (copyPictoElem==null) trace("f:: debug test : label="+label+" index="+index);
		else if (copyPictoElem.hasLst(StandardEvent.CLICK) ) copyPictoElem.off(StandardEvent.CLICK, onCopyClick);
	}
	function onCopyClick (e:ElemEvent) {
		var visibleBefore:Bool = visible;
		if (field.isHidden && !visibleBefore) makeVisible();
		valueElem.pick();
		if (!Common.toClipBoard()) g.alert(lang.clipBoardCopyError);
		
		if (field.isHidden && !visibleBefore) makeHidden();
	}
	function onShowClick (e:ElemEvent) {
		if (!visible) makeVisible();
		else makeHidden();
	}
}