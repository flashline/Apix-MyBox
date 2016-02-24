
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
class Record extends SubModel  {
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
		elemsCtnr.show();	
		pictoCtnr.show();
		labelElem.cssStyle(CssStyle.fontSize,"1.3rem");
		isClosed = false;
	}
	
	public function close () {
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
		showUpdateRecordFrame(recUpdateTitleTxt);
		setupUpdateFrameEvent() ;
	}
	function setupUpdateFrameEvent () {				
		bFrameCancel.off(StandardEvent.CLICK);
		bFrameValid.off(StandardEvent.CLICK);
		bFrameCancel.on(StandardEvent.CLICK, onFrameCancel);
		bFrameValid.on(StandardEvent.CLICK, onFrameValidUpdate);	
		bFrameValid.joinEnterKeyToClick(null,frameFieldElems[0].valueElem);
	}
	function removeUpdateFrameEvent () {			
		if (bFrameCancel.hasLst(StandardEvent.CLICK) ) bFrameCancel.off(StandardEvent.CLICK, onFrameCancel);
		if (bFrameValid.hasLst(StandardEvent.CLICK) ) bFrameValid.off(StandardEvent.CLICK, onFrameValidUpdate);			
		bFrameValid.clearEnterKeyToClick();
	}
	function onFrameCancel (e:ElemEvent) {
		removeUpdateFrameEvent ();
		recordFrame.hide();
	}
	function onFrameValidUpdate (e:ElemEvent) {		
		var fd:FieldData;
		for (fd in fieldDatas) {
			fd.value = frameFieldElems[fd.index].valueElem.value();
			if (fd.field.isPrimary) {
				label = fd.value; labelElem.value(label);
			}
			else fd.setup();	
		}			
		askUpdate ();		
	}
	function askUpdate () {			
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerUpdate);		
		var fvList:String="";var fkList:String="";var pfx:String="";
		for (fd in fieldDatas) {
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
		//getParent().selectAndDispatch () ;
		clear () ;
		if (elem == null) trace ("Erreur in Record.remove(). Instance : label=" + label + " recId=" + recId);
		else elem.delete();		
		getParent().records.splice(index,1); // remove from parent list
	}
	//
	function showUpdateRecordFrame (frameTitle:String) {	
		recordFrameTitle.text(frameTitle);
		recordFieldCtnr.removeChildren(); frameFieldElems = [];
		for (fd in fieldDatas) {
			frameFieldElems.push(fd.field.displayInRecordFrame(recordFieldCtnr, fieldDataHolder,fd.value));
		}
		recordFrame.show();		
	}
	
}