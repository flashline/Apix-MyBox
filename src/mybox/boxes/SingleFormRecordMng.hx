
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import apix.common.util.Object;
import apix.ui.UICompo;
import haxe.Json;
import mybox.boxes.Field.Control;
import mybox.boxes.Field.FrameFieldElem;
import mybox.Model;
import mybox.View;
//
using apix.common.util.StringExtender;
using apix.common.display.ElementExtender;
//
/* TODO
 typedef FrameFieldElem = {
	var elem:Elem;
	var valueElem:Elem;
	var labelElem:Elem;	
}*/
class SingleFormRecordMng extends AbstractBox  { // SingleRecordFrame
	static var _instance:SingleFormRecordMng;
	// private vars
	var recordFrameFieldElems:Array<FrameFieldElem>;
	var form:Form;
	var record:Record;
	var forWhat:String;
	var fields:Array<Field>;
	var onValidRecordFrame:ElemEvent -> Void ;
	/*
	 * constructor
	 */
	function new (m:Model,v:View ) {	
		super(m, v);		
	}
	//gets/sets
	public var fieldDataHolder(get, null): String; function get_fieldDataHolder() :String { return lang.fieldDataHolder ; }
	public var recordFrameTitle(get, null): Elem; function get_recordFrameTitle() :Elem { return  ("#safeBox #apix_recordFrame .apix_title").get();}
	public var recordFieldCtnr(get, null):Elem; function get_recordFieldCtnr() :Elem { return ("#safeBox #apix_recordFrame .apix_recordFieldCtnr").get();}
	public var recordFrame(get, null): Elem; function get_recordFrame() :Elem { return  ("#safeBox #apix_recordFrame").get();}
	
	public var bValidRecordFrame(get, null):Elem; function get_bValidRecordFrame() :Elem { return ("#safeBox #apix_recordFrame .apix_validPicto").get();}
	public var bCancelRecordFrame(get, null):Elem; function get_bCancelRecordFrame() :Elem { return ("#safeBox #apix_recordFrame .apix_cancelPicto").get();}
	public var jsonFieldDatas (get, null) :String ;
	function get_jsonFieldDatas () :String {
		var o = new Object( { fkList:[], fvList:[], ftList:[]  } ); 
		if (forWhat=="update") {
			for (fd in record.fieldDatas) {
				if (fd.field.isSecure && !fd.isUpdated && fd.value == "") continue ;
				o.fvList.push( fd.value);
				o.fkList.push( fd.key);
				if (fd.field.control==Control.SelectField && cast(fd.field).isMultiple) o.ftList.push( fd.field.control+"_m");
				else if (fd.field.control == Control.NumberField) {
					var nf:NumberField_ = cast(fd.field);
					o.ftList.push( fd.field.control+g.strVal(nf.decimalNumber,"0") );
				}
				else o.ftList.push( fd.field.control);
			}
		}
		else {
			for (fi in fields) {				
				o.fvList.push(fi.getValueToSave(recordFrameFieldElems[fi.index].valueElem));
				o.fkList.push(fi.dbColName);				
				if (fi.control==Control.SelectField && cast(fi).isMultiple) o.ftList.push( fi.control+"_m");
				else if (fi.control == Control.NumberField) {
					var nf:NumberField_ = cast(fi);
					o.ftList.push( fi.control+g.strVal(nf.decimalNumber,"0"));
				}
				else o.ftList.push(fi.control);
			}
		}
		return Json.stringify(o);
	}
	
	//
	public static function get(m:Model,v:View,fo:Form, ?re:Record=null ) : SingleFormRecordMng {	 
		if (_instance == null) _instance = new SingleFormRecordMng(m, v);
		_instance.form = fo;
		_instance.record = re;
		if (_instance.form != null) { 
			_instance.record = null; 
			_instance.forWhat = "insert" ; 
			_instance.fields = _instance.form.fields;
			_instance.elem = _instance.form.elem ;
		}
		else if (_instance.record != null) { 
			_instance.forWhat = "update" ; 
			_instance.fields = _instance.record.fields;
			_instance.elem = _instance.record.elem ;
		}
		else trace ("f::Fatal error in SingleRecordFrame.get() : form and record are null !");
		return _instance ;
	}	
	public function showRecordFrame (frameTitle:String) {
		if 		(form != null) fields = form.fields;
		else if (record != null) fields = record.fields;
		else trace("f::Error in SingleFormRecordMng.showRecordFrame()");
		var fdh = "" ;  var fdv = "";
		recordFrameTitle.text(frameTitle);
		recordFieldCtnr.removeChildren(); recordFrameFieldElems = [];
		recordFrame.show();	
		for (fi in fields) {
			fdh = fieldDataHolder;
			if (forWhat=="update") {
				var fd:FieldData = record.fieldDatas[fi.index];
				if (fi.isSecure) fd.makeHidden();	
				
				if (fi.isSecure && fd.value == "" && fd.length > 0) fdh = lang.securefieldDataHolder ;	
				fdv = fd.value;
			}
			recordFrameFieldElems.push(fi.displayInRecordFrame(recordFieldCtnr,fdh ,fdv));
		}	
		recordFrame.css("height", "" + Common.documentHeight * 2 + "px"); 		
		setupRecordFrameEvent ();	
		
	}
	public function hideRecordFrame () {		
		recordFrame.css("height", "100%"); 
		recordFrame.hide();			
	}
	public function setupRecordFrameEvent () {		
		if (forWhat == "insert") 	onValidRecordFrame = onValidRecordFrameInsert;
		else 						onValidRecordFrame = onValidRecordFrameUpdate;
		bCancelRecordFrame.off(StandardEvent.CLICK);
		bValidRecordFrame.off(StandardEvent.CLICK);
		bCancelRecordFrame.on(StandardEvent.CLICK, onCancelRecordFrame);
		bValidRecordFrame.on(StandardEvent.CLICK, onValidRecordFrame);	
		bValidRecordFrame.joinEnterKeyToClick(null, recordFrameFieldElems[0].valueElem);
		setupFieldsEvent () ;
		
	}
	public function removeRecordFrameEvent () {		
		if (bCancelRecordFrame.hasLst(StandardEvent.CLICK) ) bCancelRecordFrame.off(StandardEvent.CLICK, onCancelRecordFrame);
		if (bValidRecordFrame.hasLst(StandardEvent.CLICK) ) bValidRecordFrame.off(StandardEvent.CLICK,  onValidRecordFrame);			
		bValidRecordFrame.clearEnterKeyToClick();
		removeFieldsEvent ();
	}
	/**
	 * @private
	 */
	function setupFieldsEvent () {			
		for (fi in fields) {
			var el = recordFrameFieldElems[fi.index].valueElem; 			
			if (fi.isMultiLines) {	
				el.on(StandardEvent.FOCUS, onTextAreaFocus);
				el.on(StandardEvent.BLUR, onTextAreaBlur);
			}
			if (forWhat == "update" && fi.isSecure && el.value() == "" && record.fieldDatas[fi.index].length > 0) {
				if (fi.control == Control.EmailField) {
					cast(fi,EmailField_).emailIdElement.on(StandardEvent.FOCUS, onSecureFieldFocus, false, { index:fi.index } );
					cast(fi,EmailField_).domainElement.on(StandardEvent.FOCUS, onSecureFieldFocus, false, { index:fi.index } );					
				}
				else el.on(StandardEvent.FOCUS, onSecureFieldFocus, false, { index:fi.index } );				
			}
		}
	}
	function removeFieldsEvent () {			
		for (fi in fields) {
			var el = recordFrameFieldElems[fi.index].valueElem;				
			if (fi.isMultiLines || fi.isSecure) {
				if (el != null && el.hasLst()) el.off();
			}
			//			
			if (fi.control == Control.EmailField) {
				var eie = cast(fi, EmailField_).emailIdElement;
				//if (eie != null && eie.hasLst()) eie.offsetHeight();
				if (eie.hasLst()) eie.off();
				var de = cast(fi, EmailField_).domainElement;
				if (de.hasLst()) de.off();	
			}
			if (fi.uiCompo != null) {
				fi.uiCompo.remove();
				fi.uiCompo = null;
			}
		}
		
	}
	function onTextAreaFocus (e:ElemEvent,p:Dynamic) {			
		if (bValidRecordFrame!=null) bValidRecordFrame.clearEnterKeyToClick();
	}
	function onTextAreaBlur (e:ElemEvent,p:Dynamic) {			
		if (bValidRecordFrame!=null) bValidRecordFrame.joinEnterKeyToClick();
	}
	function onSecureFieldFocus (e:ElemEvent, d:Dynamic) {			
		var fd:FieldData = record.fieldDatas[d.index];
		fd.secureFieldRead.on(onSecureFieldRead,d);
		fd.enterSecureCode("forRecordUpdate");
	}
	function onSecureFieldRead (e:StandardEvent) {	
		var fd:FieldData = e.target; var fi = fd.field;
		fd.secureFieldRead.off(onSecureFieldRead);
		var el = recordFrameFieldElems[e.data.index].valueElem; 
		if (fi.control == Control.EmailField) {
			cast(fi,EmailField_).emailIdElement.off(StandardEvent.FOCUS, onSecureFieldFocus);
			cast(fi,EmailField_).domainElement.off(StandardEvent.FOCUS, onSecureFieldFocus );
			cast(fi, EmailField_).showValue(e.value);
		}
		else el.off(StandardEvent.FOCUS, onSecureFieldFocus);
		el.value(e.value);
		//
		el.placeHolder(fieldDataHolder + " " + fd.field.label);		
	}
	function onCancelRecordFrame (e:ElemEvent) {	
		removeRecordFrameEvent();
		hideRecordFrame();	
	}
	function checkEmpties () {
		var str = ""; var coma = "<br/>";
		for (i in 0...fields.length) {
			var fi:Field = fields[i];
			if (	fi.uiCompo == null && 
					fi.required &&
					fi.getDisplayValue(g.strVal(fi.getValueToSave(recordFrameFieldElems[i].valueElem), "")) == "" &&
					(	forWhat == "insert"  ||
						!fi.isSecure ||
						record.fieldDatas[i].isUpdated						
					)				
				) 
				{
					str += coma + fi.label ;
					coma = ",<br/>";
				}				
		}
		var str2 = UICompo.getEmpties();	
		if (str!="" && str2 == "") {
			str=UICompoLoader.langObject.emptyError + str ;
		}
		else {
			str2 += str;
			str = str2;
		}
		return str;
	}
	function onValidRecordFrameInsert (e:ElemEvent) {	
		var str = checkEmpties();		
		if (str!="") str.alert();
		else askRecordInsert ();	
	}
	function onValidRecordFrameUpdate (e:ElemEvent) {	
		var str = checkEmpties();		
		if (str!="") str.alert();
		else {
			var fd:FieldData; var b:Bool ;
			for (fd in record.fieldDatas) {
				if (!fd.field.isSecure) {				
					fd.value = fd.field.getValueToSave(recordFrameFieldElems[fd.index].valueElem); 				
					if (fd.field.control == Control.LinkField) fd.length = cast(fd.field,LinkField_).getLinkText(fd.value).length;
					else fd.length = fd.field.getDisplayValue(fd.value).length;
				}
				else if ( ( fd.isUpdated || recordFrameFieldElems[fd.index].valueElem.value()!="" ) ) {
					fd.value = recordFrameFieldElems[fd.index].valueElem.value();
					fd.length = fd.value.length;
				}	
				
			}			
			askRecordUpdate ();	
			for (fd in record.fieldDatas) {
				b = fd.field.isPrimary || record.checkIfprimaryExists() != "" && fd.field.index == 0 ;
				if (b) { record.label = fd.value; labelElem.value(record.label); }
				else fd.setup();			
			}
		}
	}
	function askRecordInsert () {
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerRecordInsert);
		// formRecId is sent for security check
		server.ask( { req:"insertOneRecord", data:Json.stringify({id:model.currUserId, formRecId:form.recId, fieldsKeyValue:jsonFieldDatas})});		
	}
	function askRecordUpdate () {
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerRecordUpdate);	
		// formRecId is sent for security check
		server.ask( { req:"updateOneRecord",data:Json.stringify({ id:model.currUserId, recId:record.recId, formRecId:record.getParent().recId, fieldsKeyValue:jsonFieldDatas})});
		
	}
	function onAnswerRecordInsert (e:StandardEvent) {			
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				
			else if (e.result.msg=="parentFormDoesntExist") g.alert(lang.parentFormDoesntExist);				
			else g.alert(lang.serverReadError + e.result.msg +  e.result.qry );
		} else if (answ == "insertRecordOk")  {
			UICompo.removeAllRequired ();
			removeRecordFrameEvent ();
			hideRecordFrame();
			view.showTipBox(lang.insertOk, bElem.parent(), bElem.posx(), bElem.posy(), 2)	;
			form.createOneRecord (g.intVal(e.result.recId, -1),recordFrameFieldElems);	
			var el=bElem ;
			view.showTipBox(lang.createOk, el.parent() , el.posx(), el.posy(), 1)	;
		} else {			
			g.alert(lang.serverFatalError);
		}
	}
	function onAnswerRecordUpdate (e:StandardEvent) {	
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				 
			else if (e.result.msg=="parentFormDoesntExist") g.alert(lang.parentFormDoesntExist);
			else g.alert(lang.serverReadError + e.result.msg);
		} else if (answ == "updateRecordOk")  {
			UICompo.removeAllRequired ();
			removeRecordFrameEvent();
			hideRecordFrame();
			for (fd in record.fieldDatas) {
				if (fd.field.isSecure) { fd.makeHidden(); fd.isUpdated = false; }
			}
			view.showTipBox(lang.updateOk, bElem.parent(), bElem.posx(), bElem.posy(), 2)	;
		} else {			
			g.alert(lang.serverFatalError);
		}
	}
	
}