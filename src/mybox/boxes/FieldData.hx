
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.event.timing.Delay;
import apix.common.tools.math.MathX;
import apix.common.util.Global ;
import haxe.Json;
import js.html.InputElement;
import mybox.boxes.Field.Control;
import mybox.Model;
import mybox.View;
//
using apix.common.util.StringExtender;
using apix.common.display.ElementExtender;
//

class FieldData extends AbstractBox  {
	
	//public var parent:Record;
	public var field(default,null):Field;
	public var value:String;
	
	
	
	
	
	
	public var key(default,null):String;
	public var isUpdated:Bool;
	public var length:Int;	
	//	
	public var secureFieldRead(default,null):EventSource;
	//
	
	/*
	 * constructor
	 */
	public function new (m:Model,v:View) {	
		super(m, v); 
		secureFieldRead = new EventSource();
		isUpdated = false;
	}
	//gets
	override function get_labelElem() :Elem { 
		return ("#" + vId + " .apix_label").get();
	}
	public var formParent(get, null):Form ; 
	function get_formParent() :Form { 
		if (getParent().getParent() != field.getParent()) trace("f:: error in FieldData.getFormParent ()");
		if (getParent()!=null) return getParent().getParent();
		else return null ;
	}
	
	public var valueElem(get, null):Elem ; function get_valueElem() :Elem  { 
		return ("#" + vId + " ."+field.inputFieldString+" .apix_value").get();
	}
	public var linkInputElem(get, null):Elem ; function get_linkInputElem() :Elem  { 
		return ("#" + vId + " .apix_linkInput").get();
	}
	
	public var inputElemToHide(get, null):Elem ; function get_inputElemToHide() :Elem  { 
		return ("#" + vId + " ."+field.inputFieldToHideString).get();
	}
	public var showPictoElem(get, null):Elem ; function get_showPictoElem() :Elem  { return ("#" + vId + " .apix_showPicto").get();}
	public var copyPictoElem(get, null):Elem ; function get_copyPictoElem() :Elem  { return ("#" + vId + " ."+field.inputFieldString+" .apix_copyPicto").get();}
	public var visible(get, null):Bool  ; function get_visible() :Bool  {
		if (field.control == Control.LinkField) {
			return (field.getDisplayValue(value) == linkInputElem.value());
		}
		else return (field.getDisplayValue(value) == valueElem.value());		
	}
	
	public function getParent () :Record {
		if (parent!=null) return cast(parent,Record);
		else return null ;
	}
	
	public function init (k:String,v:String="",fi:Field,idx:Int,par:Record) : FieldData {	
		if (v == null) v = "";
		field = fi;
		value = field.checkAndRepare(v);
		key = k;
		label = g.strVal(fi.label,"");
		index = idx;
		parent = par;
		if (field.control == Control.LinkField) length = cast(field,LinkField_).getLinkText(value).length ;
		else length = field.getDisplayValue(value).length;
		if (field.isHidden) makeHidden();
		return this ;
	}
	public function display () {		
		var fieldDataProto = view.fieldDataProto;
		var fieldDataEl = fieldDataProto.clone(true);
		getParent().elemsCtnr.addChild(fieldDataEl); 
		fieldDataEl.show();		
		fieldDataEl.setId(getParent().dbTable+"_rec_" + getParent().recId + "_"+key);		
		vId = fieldDataEl.getId();
		elem = fieldDataEl ;
		inputElemToHide.hide();
		setup();
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
	public function makeHidden () {		
		if (field.isSecure) value = "";
		// if valueElem is null it is because the field is secure AND... NO primary exists !!!
		if (valueElem != null) {
			if (field.control == Control.LinkField) {
				valueElem.inner(hideChars(length)) ;
				linkInputElem.value(hideChars(length));
			}
			else valueElem.value(hideChars(length));
		}
	}
	public function enterSecureCode (whatFor:String) {
		field.showSecureFrame(lang.secureEnterTitle,"","");
		view.bValidSecureFrame.off(); view.bValidSecureFrame.on(StandardEvent.CLICK, onValidSecureEnter,false,{whatFor:whatFor});
		view.bRubSecureFrame.off();view.bRubSecureFrame.on(StandardEvent.CLICK, function (e:ElemEvent) { field.clearSecureCode () ;});
		
		field.clearSecureCode () ;
		field.secureCodes=MathX.randomExclusiveList(9);
		view.secureFrameCodePictoString.each(field.assignSecureCode) ;	
		view.secureFrameCodePictoString.off() ;	
		view.secureFrameCodePictoString.on(StandardEvent.CLICK,onClickSecureCode) ;			
	}
	
	
	
	public function toHtmlString (tab:String=""):String {
		var str = ""; 
		str+= tab + label +"="+field.getDisplayValue(value)+" (key="+key+" index="+index+")<br/>" ;	
		return str ;
	}
	/**
	 * @private
	 */
	function setupView () {
		labelElem.text(label);	
		if (field.control==Control.SignField) {
			var p = valueElem.parent();
			valueElem.delete();
			var el = Common.createElem(TagType.IMG);	
			el.addClass("apix_value") ; 
			el.css("width", "35%");  
			p.addChild(el);
			valueElem.attrib(Attrib.src,field.getDisplayValue(value));
		}
		if (field.control == Control.DateField) {
			valueElem.width(90);
		}
		if (field.control == Control.ColorField) {
			var p = valueElem.parent();
			valueElem.delete();
			var el = Common.createElem(TagType.INPUT);
			el.addClass("apix_value") ;
			el.width(300); el.height(30) ; el.enable(false);			
			p.addChild(el);
			el.cssStyle(CssStyle.backgroundColor, value);
			el.cssStyle(CssStyle.color, cast(field, ColorField_).oppositeColor(value));
		}
		if (field.control == Control.LinkField) {
			var p = valueElem.parent();
			valueElem.delete();
			if (linkInputElem != null) linkInputElem.delete();
			var el = Common.createElem(TagType.BOX);
			el.addClass("apix_value") ;			
			p.addChild(el);	
			el = Common.createElem(TagType.INPUT);
			el.addClass("apix_linkInput") ;			
			p.addChild(el);	
			el.hide();
		}
		if (field.control==Control.PhotoField) {
			var p = valueElem.parent();
			valueElem.delete();
			var el = Common.createElem(TagType.IMG);	
			el.addClass("apix_value") ; 
			el.css("width", "60%");  
			p.addChild(el);
			valueElem.attrib(Attrib.src,field.getDisplayValue(value));
		}
		//else valueElem.value(field.getDisplayValue(value));
		if (field.control==Control.AreaField) {
			if (field.inputFieldHeight > 0) valueElem.height(field.inputFieldHeight);		
		}
		if (field.control==Control.NumberField || field.control==Control.Slider ) {
			valueElem.css("textAlign", "right");	
			valueElem.width(g.numVal(param.numberFieldWidth,100));
		}		
		(field.isHidden && length>0)?{ showPictoElem.visible(true);makeHidden();}:{showPictoElem.visible(false);makeVisible();};
		(field.copyEnable && length>0 )?copyPictoElem.visible(true):copyPictoElem.visible(false);
	}
	function makeVisible () {
		if (field.control == Control.SignField) {
			valueElem.attr("src",field.getDisplayValue(value));
		}
		else if (field.control == Control.LinkField) {
			valueElem.inner(field.getDisplayValue(value));
			linkInputElem.value(field.getDisplayValue(value));
		}
		else if (field.control == Control.PhotoField) {
			valueElem.attr("src",field.getDisplayValue(value));
		}
		else valueElem.value(field.getDisplayValue(value));
	}	
	function hideChars (l:Int) : String {
		var str = ""; for (i in 0...l ) str += "*" ;
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
		if (field.isSecure && !visible) {
			enterSecureCode ("forCopy");
		}
		else doCopyToClipBoard();
	}
	function doCopyToClipBoard() {
		var visibleBefore:Bool = visible;
		if (field.isHidden && !visibleBefore) makeVisible();
		if (field.control == Control.LinkField) {
			linkInputElem.show();
			linkInputElem.pick();
		}
		else valueElem.pick();
		if (!Common.toClipBoard()) g.alert(lang.clipBoardCopyError);		
		if (field.isHidden && !visibleBefore) makeHidden();
		if (field.control == Control.LinkField) linkInputElem.hide();
		
	}
	function onShowClick (e:ElemEvent) {		
		if (!visible) {			
			if (field.isSecure) enterSecureCode ("forShow");
			else makeVisible();
		}
		else makeHidden();
	}
	function onValidSecureEnter (e:ElemEvent,d:Dynamic) {
		if (field.currSecureCode!="") askReadFieldData (d);
		field.hideSecureFrame();			
	}
	function onClickSecureCode (e:ElemEvent) {
		var el:Elem = cast(e.currentTarget, Elem);
		field.pushSecureCode (el);
		view.secureFrameCode.text("");
	}	
	function askReadFieldData (d:Dynamic) {			
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerReadFieldData,d);		
		server.ask( { 	req:"readFieldData", data:Json.stringify( { id:model.currUserId, formRecId:formParent.recId,		
						recId:getParent().recId, fieldRecId:field.recId, secureCode:field.currSecureCode } ) } ); 						
	}
	function onAnswerReadFieldData (e:StandardEvent) {
		var answ:String = e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				
			else if (e.result.msg=="elemDoesntExist") g.alert(lang.elemDoesntExist);	
			else if (e.result.msg == "invalidSecureCode") {
				var d = g.numVal(e.result.jsonData.failureDelay, 0);
				var mn = Math.floor(d / 60); //var sec = d % 60; 
				var fm = g.intVal(e.result.jsonData.failureMin);
				var fn = g.intVal(e.result.jsonData.failureNumber);
				var b = g.boolVal(e.result.jsonData.failureLogoff, false);
				var msg = "";
				if (b) {
					msg+= lang.invalidSecureCodeLogoff+ Std.string(mn);
					msg+= lang.invalidSecureCodeLogoff2;
					g.alert(msg);						
				}
				else {
					msg+= lang.invalidSecureCode+(fm-fn+1) ;
					msg+= lang.invalidSecureCode2;
					g.alert(msg);
				}
			}
			else g.alert(lang.serverReadError + e.result.msg);
		}
		else if (answ != "readFieldDataOk") g.alert(lang.serverFatalError);
		else {			
			value = e.result.value;
			if (e.data.whatFor == "forShow") makeVisible(); 
			else if (e.data.whatFor == "forCopy") g.alert(lang.secureToClipBoard, doCopyToClipBoard,null,lang.secureCopyConfirm);
			else if (e.data.whatFor == "forRecordUpdate") {
				var ev = new StandardEvent(this); ev.value = value; value = "";
				secureFieldRead.dispatch(ev);
				isUpdated = true;
			}
			else trace("f::Fatal error in FieldData.onAnswerReadFieldData()");
		}
	}
}