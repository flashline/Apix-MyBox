
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.display.Confirm;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import haxe.Json;
import mybox.Model;
import mybox.View  ;
using apix.common.util.StringExtender;
using apix.common.display.ElementExtender;
//
class Record extends AbstractBox {	
	public var fieldDatas:Array<FieldData>;
	public var fields:Array<Field>;
	
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
	
	
	public var recUpdateTitleTxt(get, null): String; function get_recUpdateTitleTxt() :String { return lang.recUpdateTitle ; }
	
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
		recordEl.setId(dbTable+"_rec_" + recId);
		vId = recordEl.getId();
		elem = recordEl ;
		bElem.posx(shift);
		elemsCtnr.posx(shift);
		elemsCtnr.cssStyle(CssStyle.border, "1px dotted #999");
		setup();
		recordsCtnr.delete(); // Element not used by Record	
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
	public function checkIfprimaryExists () :String {
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
		str+= tab + "label=" + label + "<br/>" ;
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
		getParent().selectAndDispatch();
	}	
	function onUpdateClick (e:ElemEvent) {	
		var str = checkIfprimaryExists ();
		if (str != "" && str!=lang.primaryMissing) {
			g.alert(str,null,lang.warningTitle); 
		}
		else {		
			var sfg = SingleFormRecordMng.get(model,view,null,this);
			sfg.showRecordFrame(recUpdateTitleTxt);
			
		}
	}
	
	function onRemoveClick (e:ElemEvent) {
		cb.show(lang.deleteConfirm+" "+path+" ?",askDelete);		
	}
	function askDelete (b:Bool,f:Confirm) {
		if (b) {
			server.serverEvent.off(); 
			server.serverEvent.on(onAnswerDelete  );		
			server.ask( { req:"deleteOneRecord", data:Json.stringify( { id:model.currUserId, recId:recId, formRecId:getParent().recId } ) } );			
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
	
}