
package safebox.models;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.display.Confirm;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import safebox.Model;
import safebox.models.Field.FrameFieldElem;
//
using apix.common.util.StringExtender;
using apix.common.display.ElementExtender;
//
class Record extends SubModel  implements IContent{
	//public var parent:Form;
	
	public var fieldDatas:Array<FieldData>;
	public var fields:Array<Field>;
	public var frameFieldElems:Array<FrameFieldElem>; 
	
	//	
	/*
	 * constructor
	 */
	public function new (m:Model,v:View) {	
		super(m,v);
	}
	//gets
	public var dbTable (get, null):String; function get_dbTable() :String { return getParent ().dbTable ;}
	public var table (get, null):String; function get_table() :String { return getParent ().label ;}
	public var elemsCtnr(get, null):Elem; function get_elemsCtnr() :Elem { return ("#" + vId + " .apix_subCtnr").get() ;}
	public var color(get, null): String; function get_color() :String { return param.recordColor ; }
	//
	public var recordFrame(get, null): Elem; function get_recordFrame() :Elem { return getParent().recordFrame ;}
	public var recordFrameTitle(get, null): Elem; function get_recordFrameTitle() :Elem { return getParent().recordFrameTitle ;}
	public var fieldDataHolder(get, null): String; function get_fieldDataHolder() :String { return getParent().fieldDataHolder ; }
	public var recUpdateTitleTxt(get, null): String; function get_recUpdateTitleTxt() :String { return lang.recUpdateTitle ; }
	public var bFrameValid(get, null):Elem; function get_bFrameValid() :Elem { return getParent().bValidRecordInsert;}
	public var bFrameCancel(get, null):Elem; function get_bFrameCancel() :Elem { return getParent().bCancelRecordInsert;}
	public var recordFieldCtnr(get, null):Elem; function get_recordFieldCtnr() :Elem { return getParent().recordFieldCtnr ;}
	//
	public function getParent () :Form {
		if (parent!=null) return cast(parent, Form);
		else return null ;
	}
	public function clear () {
		var len = fieldDatas.length ;
		for (i in 0...len) {
			fieldDatas[i].clear() ;
		}
		fieldDatas = [];
		removeEvent();
	}
	public function init (rid:Int,par:Form,idx:Int,sh:Int,l:String) : Record{	
		recId = rid;
		parent = par;	
		fields = getParent().fields ;
		index = idx;
		fieldDatas = [];
		shift = sh;
		label = g.strVal(l, "");
		return this ;
	}
	public function display () {		
		var recordProto = view.fButtonProto; 
		var recordEl = recordProto.clone(true);
		getParent().recordsCtnr.addChild(recordEl); recordEl.show();
		recordEl.id = dbTable+"_rec_" + recId;
		vId = recordEl.id;
		elem = recordEl ;
		bElem.posx(shift);
		elemsCtnr.posx(shift);
		elemsCtnr.cssStyle(CssStyle.border, "1px dotted #999");
		setup();
		recordsCtnr.delete(); // Element not used by Record			
		//TODO fi.click.on(onElemClick);
	}	
	
	public function push (k:String,v:String="",fi:Field) : Record {	
		var fd:FieldData = new FieldData(model, view);		
		fd.init(k, v, fi, fieldDatas.push(fd)-1,this);	
		if (fieldDatas.length>1) fd.display();		
		return this ;
	}
	
	public function setup () {
		setupView ();
		setupEvent ();  // to see the detail or open a popup with each fields
	}
	public function open () {
		var str = checkIfprimaryExists ();
		if (str != "") g.alert(str,null,lang.alertTitle);
		elemsCtnr.show();	
		pictoCtnr.show();
		labelElem.cssStyle(CssStyle.fontSize,"1.3rem");
		isClosed = false;
	}
	function checkIfprimaryExists () :String {
		var str = ""; var p:Field = fields[0];		
		if (p.isSecure || p.isHidden) {
			if (!p.isPrimary) str = lang.firstFieldIsSecure;
			else str = lang.primaryFieldIsSecure;
		} else if (!p.isPrimary) str = lang.primaryMissing;
		return str;
	}
	
	public function close () {	
		for (fd in fieldDatas) {
			if (fd.field.isHidden && fd.field.isSecure) fd.makeHidden();
		}
		elemsCtnr.hide();
		pictoCtnr.hide();
		labelElem.cssStyle(CssStyle.fontSize,"1.05rem");
		isClosed = true; 
	}
	public function setupEvent () {
		if (!bElem.hasLst(StandardEvent.CLICK) ) {
			bElem.on(StandardEvent.CLICK, onButtonClick);
			labelElem.handCursor(true); // for firefox
		}
		if (!bUpdate.hasLst(StandardEvent.CLICK) ) bUpdate.on(StandardEvent.CLICK, onUpdateClick);
		if (!bRemove.hasLst(StandardEvent.CLICK) ) bRemove.on(StandardEvent.CLICK, onRemoveClick);
	}
	public function removeEvent () {		
		if (bElem.hasLst(StandardEvent.CLICK) ) {
			bElem.off(StandardEvent.CLICK, onButtonClick);
			labelElem.handCursor(false); 
		}
		if (bUpdate.hasLst(StandardEvent.CLICK) ) bUpdate.off(StandardEvent.CLICK, onUpdateClick);
		if (bRemove.hasLst(StandardEvent.CLICK) ) bRemove.off(StandardEvent.CLICK, onRemoveClick);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	public function toHtmlString (tab:String=""):String {
		var str = ""; 
		str+= tab + "parent=" + getParent().label + "<br/>" ;
		str+= tab + "label=" + getParent().label + "<br/>" ;
		str+= tab + "DB table=" + dbTable + "<br/>" ;
		str+= tab + "form name=" + table + "<br/>" ;
		str+= tab + "recId=" + recId + "<br/>";
		str+= tab + "index=" + index + "<br/>";
		str+= tab + "Content ------- <br/>"	;	
		var len = fieldDatas.length  ;
		for (i in 0...len) {
			str+=fieldDatas[i].toHtmlString (tab+"..........");
		}
		str+= tab + "end of one record ------ <br/>"	;	
		return str ;
	}
	/**
	 * @private
	 */
	function setupView () {
		//elemsCtnr.show(); //tmp
		labelElem.value(label);
		labelElem.cssStyle(CssStyle.backgroundColor, color);
		labelElem.cssStyle(CssStyle.opacity, "1");
		labelElem.cssStyle(CssStyle.borderColor,color);
		pictoCtnr.hide();
		elemsCtnr.cssStyle(CssStyle.backgroundColor, "white");
		elemsCtnr.cssStyle(CssStyle.width, "" + (98 - getParent().level) + "%");
		close ();
	}
	//listeners
	function onButtonClick (e:ElemEvent) {	
		if (elemsCtnr.isDisplay()) close();		
		else open();
		//selectAndDispatch();
	}	
	function onUpdateClick (e:ElemEvent) {	
		var str = checkIfprimaryExists ();
		if (str != "" && str!=lang.primaryMissing) {
			g.alert(str,null,lang.warningTitle); 
		}
		else {		
			showUpdateRecordFrame(recUpdateTitleTxt);
			setupUpdateFrameEvent() ;
		}
	}
	function setupUpdateFrameEvent () {				
		bFrameCancel.off(StandardEvent.CLICK);
		bFrameValid.off(StandardEvent.CLICK);
		bFrameCancel.on(StandardEvent.CLICK, onFrameCancel);
		bFrameValid.on(StandardEvent.CLICK, onFrameValidUpdate);	
		bFrameValid.joinEnterKeyToClick(null, frameFieldElems[0].valueElem);
		setupFieldsEvent () ;
	}
	function setupFieldsEvent () {			
		for (fi in fields) {
			var el = frameFieldElems[fi.index].valueElem; 
			if (el.hasLst()) el.off();				
			if (fi.isMultiLines) {
				el.on(StandardEvent.FOCUS, onTextAreaFocus);
				el.on(StandardEvent.BLUR, onTextAreaBlur);
			}
			else if (fi.isSecure && el.value()=="" && fieldDatas[fi.index].length>0) {
				el.on(StandardEvent.FOCUS, onSecureFieldFocus,false,{index:fi.index});
			}
		}
	}
	function removeFieldsEvent () {			
		for (fi in fields) {
			var el = frameFieldElems[fi.index].valueElem;				
			if (fi.isMultiLines || fi.isSecure) {
				if (el != null && el.hasLst()) el.off();
			}
		}
	}
	function onTextAreaFocus (e:ElemEvent) {	
		if (bFrameValid!=null) bFrameValid.clearEnterKeyToClick();
	}
	function onTextAreaBlur (e:ElemEvent) {			
		if (bFrameValid!=null) bFrameValid.joinEnterKeyToClick();
	}
	function onSecureFieldFocus (e:ElemEvent,d:Dynamic) {	
		var fd:FieldData = fieldDatas[d.index];
		fd.secureFieldRead.on(onSecureFieldRead,d);
		fd.enterSecureCode("forRecordUpdate");
	}
	function onSecureFieldRead (e:StandardEvent) {	
		var fd:FieldData = e.target; //e.data.index // e.value
		fd.secureFieldRead.off(onSecureFieldRead);
		var el = frameFieldElems[e.data.index].valueElem; 
		el.off(StandardEvent.FOCUS, onSecureFieldFocus);
		el.value(e.value);
		//
		el.placeHolder(fieldDataHolder + " " + fd.field.label);
		
	}
	//
	function removeUpdateFrameEvent () {			
		if (bFrameCancel.hasLst(StandardEvent.CLICK) ) bFrameCancel.off(StandardEvent.CLICK, onFrameCancel);
		if (bFrameValid.hasLst(StandardEvent.CLICK) ) bFrameValid.off(StandardEvent.CLICK, onFrameValidUpdate);			
		bFrameValid.clearEnterKeyToClick();
		removeFieldsEvent ();
	}
	function onFrameCancel (e:ElemEvent) {
		removeUpdateFrameEvent ();
		recordFrame.hide();
	}
	function onFrameValidUpdate (e:ElemEvent) {		
		var fd:FieldData; var b:Bool ;
		for (fd in fieldDatas) {
			fd.value = frameFieldElems[fd.index].valueElem.value();
			if (fd.field.isSecure && ( fd.isUpdated || frameFieldElems[fd.index].valueElem.value()!="" ) ){
				fd.value = frameFieldElems[fd.index].valueElem.value();
				fd.length = fd.value.length;
			}			
		}			
		askUpdate ();	
		for (fd in fieldDatas) {
			b = fd.field.isPrimary || checkIfprimaryExists()!="" && fd.field.index==0 ;
			if (b) { label = fd.value; labelElem.value(label); }
			else fd.setup();			
		}
	}
	function askUpdate () {			
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerUpdate);		
		var fvList:String="";var fkList:String="";var pfx:String="";
		for (fd in fieldDatas) {
			if (fd.field.isSecure && !fd.isUpdated && fd.value=="") continue ;
			fvList += pfx +  fd.value;
			fkList += pfx + fd.key;
			pfx = "`~¤";
		}
		server.ask({req:"updateOneRecord",id:model.currUserId,recId:recId,formRecId:getParent().recId, fieldValues:fvList,fieldKeys:fkList});
	}
	function onAnswerUpdate (?e:StandardEvent) {		
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				 
			else if (e.result.msg=="parentFormDoesntExist") g.alert(lang.parentFormDoesntExist);
			else g.alert(lang.serverReadError + e.result.msg);
		} else if (answ == "updateRecordOk")  {
			removeUpdateFrameEvent ();
			recordFrame.hide();
			for (fd in fieldDatas) {
				if (fd.field.isSecure) { fd.makeHidden(); fd.isUpdated = false; }
			}
			view.showTipBox(lang.updateOk, bElem.parent(), bElem.posx(), bElem.posy(), 2)	;
		} else {			
			g.alert(lang.serverFatalError);
		}
	}
	
	function onRemoveClick (e:ElemEvent) {
		cb.show(lang.deleteConfirm+" "+path+" ?",askDelete);		
	}
	function askDelete (b:Bool,f:Confirm) {
		if (b) {
			server.serverEvent.off(); 
			server.serverEvent.on(onAnswerDelete  );		
			server.ask( { req:"deleteOneRecord",id:model.currUserId, recId:recId,formRecId:getParent().recId} );	
		}
	}
	function onAnswerDelete (e:StandardEvent) {
		cb.hide();
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				 
			else if (e.result.msg=="parentFormDoesntExist") g.alert(lang.parentFormDoesntExist);
			else if (e.result.msg=="elemDoesntExist") g.alert(lang.elemDoesntExist);			
			else g.alert(lang.serverReadError + e.result.msg);
		} else if (answ == "deleteRecordOk")  { 
			view.showTipBox(lang.deleteOk,getParent().bElem.parent(), bElem.posx(), bElem.posy(), 1)	;
			remove ();
		} else {			
			g.alert(lang.serverFatalError);
		}
	}
	function remove () {	
		clear () ;
		if (elem == null) trace ("Erreur in Record.remove(). Instance : label=" + label + " recId=" + recId);
		else elem.delete();		
		getParent().removeFromList(this); // remove from parent list
	}
	//
	function showUpdateRecordFrame (frameTitle:String) {
		var fdh = "";
		recordFrameTitle.text(frameTitle);
		recordFieldCtnr.removeChildren(); frameFieldElems = [];
		for (fd in fieldDatas) {
			if (fd.field.isSecure && fd.value=="" && fd.length > 0) fdh = lang.securefieldDataHolder ;
			else fdh=fieldDataHolder;
			frameFieldElems.push(fd.field.displayInRecordFrame(recordFieldCtnr,fdh ,fd.value));
		}
		recordFrame.show();		
	}
	
}