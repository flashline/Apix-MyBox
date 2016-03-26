
package safebox.models;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.event.timing.Delay;
import apix.common.tools.math.MathX;
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
	public var valueElem(get, null):Elem ; function get_valueElem() :Elem  { 
		return ("#" + vId + " ."+field.inputFieldString+" .apix_value").get();
	}			
	public var inputElemToHide(get, null):Elem ; function get_inputElemToHide() :Elem  { 
		return ("#" + vId + " ."+field.inputFieldToHideString).get();
	}
	public var showPictoElem(get, null):Elem ; function get_showPictoElem() :Elem  { return ("#" + vId + " .apix_showPicto").get();}
	public var copyPictoElem(get, null):Elem ; function get_copyPictoElem() :Elem  { return ("#" + vId + " ."+field.inputFieldString+" .apix_copyPicto").get();}
	public var visible(get, null):Bool  ; function get_visible() :Bool  {return (value==valueElem.value());}
	public var secureFrame(get, null):Elem; function get_secureFrame() :Elem { return getFormParent().secureFrame ;}
	public var bValidSecureFrame(get, null):Elem; function get_bValidSecureFrame() :Elem { return getFormParent().bValidSecureFrame ;}
	public var bRubSecureFrame(get, null):Elem; function get_bRubSecureFrame() :Elem { return getFormParent().bRubSecureFrame ;}
	public var secureFrameCode(get, null):Elem; function get_secureFrameCode() :Elem { return getFormParent().secureFrameCode ;}
	
	
	public function getParent () :Record {
		if (parent!=null) return cast(parent,Record);
		else return null ;
	}
	public function getFormParent () :Form {
		if (getParent().getParent() != field.getParent()) trace("f:: error in FieldData.getFormParent ()");
		if (getParent()!=null) return getParent().getParent();
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
		length = value.length;
		if (field.isHidden) makeHidden;
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
	public function makeHidden () {		
		if (field.isSecure) value = "";
		// if valueElem is null it is because the field is secure AND... NO primary exists !!!
		if (valueElem!=null) valueElem.value(hideChars(length));
	}
	public function enterSecureCode (whatFor:String) {
		getFormParent().showSecureFrame(lang.secureEnterTitle,"","");
		bValidSecureFrame.off(); bValidSecureFrame.on(StandardEvent.CLICK, onValidSecureEnter,false,{whatFor:whatFor});
		bRubSecureFrame.off();bRubSecureFrame.on(StandardEvent.CLICK, function (e:ElemEvent) { getFormParent().clearSecureCode () ;});
		
		getFormParent().clearSecureCode () ;
		getFormParent().secureCodes=MathX.randomExclusiveList(9);
		"#apix_secureFrame .apix_codePicto".each(getFormParent().assignSecureCode) ;	
		"#apix_secureFrame .apix_codePicto".off() ;	
		"#apix_secureFrame .apix_codePicto".on(StandardEvent.CLICK,onClickSecureCode) ;			
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
		(field.isHidden && length>0)?{ showPictoElem.visible(true);makeHidden();}:{showPictoElem.visible(false);makeVisible();};
		(field.copyEnable && length>0 )?copyPictoElem.visible(true):copyPictoElem.visible(false);
		
	}
	function makeVisible () {
		valueElem.value(value);
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
		valueElem.pick();
		if (!Common.toClipBoard()) g.alert(lang.clipBoardCopyError);		
		if (field.isHidden && !visibleBefore) makeHidden();
	}
	function onShowClick (e:ElemEvent) {
		if (!visible) {
			if (field.isSecure) {
				enterSecureCode ("forShow");
			}
			else makeVisible();
		}
		else makeHidden();
	}
	function onValidSecureEnter (e:ElemEvent,d:Dynamic) {
		if (getFormParent().currSecureCode!="") askReadFieldData (d);
		secureFrame.hide();			
	}
	function onClickSecureCode (e:ElemEvent) {
		var el:Elem = cast(e.currentTarget, Elem);
		getFormParent().pushSecureCode (el);
		secureFrameCode.text("");
	}	
	function askReadFieldData (d:Dynamic) {			
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerReadFieldData,d);		
		server.ask( { 	req:"readFieldData", id:model.currUserId, formRecId:getFormParent().recId,
						recId:getParent().recId,fieldRecId:field.recId,secureCode:getFormParent().currSecureCode 
					});
	}
	function onAnswerReadFieldData (e:StandardEvent) {
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				
			else if (e.result.msg=="elemDoesntExist") g.alert(lang.elemDoesntExist);	
			else if (e.result.msg=="invalidSecureCode") g.alert(lang.invalidSecureCode);	
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