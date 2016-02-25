
package safebox.models;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.display.Confirm;
import apix.common.util.Global ;
import apix.common.util.Object;
import apix.common.util.xml.XmlParser;
import safebox.Model;
import safebox.models.Field.FrameFieldElem;
import safebox.Server;
import safebox.View;
import apix.common.event.StandardEvent;
//
using apix.common.util.StringExtender;
using apix.common.display.ElementExtender;
using apix.common.util.ArrayExtender;
//   

class Form extends SubModel  {	
	
	//
	public var fields:Array<Field>;
	public var children:Array<Folder>; 
	public var forms:Array<Form>;	
	public var records:Array<Record>;	
	public var shiftVal:Int;	
	//	
	var srvTxtMsg:String;
	var insertSrvTxtMsg:String;
	var recordFrameFieldElems:Array<FrameFieldElem>;
	/*
	 * constructor
	 */
	public function new (m:Model,?v:View) {	
		super(m, v);
		fields = [];
		records = [];
		srvTxtMsg = "FormFolder";
		insertSrvTxtMsg = "Field" ;		
		shiftVal = if (Common.windowWidth > 679) 15 else 5;
		isClosed = true; 
	}
	// gets
	public var level (get, null):Int; function get_level() :Int{ return Math.round(shift / shiftVal) ;}
	
	public function getChain() : Array<Form> {
		var arr: Array<Form>=[];
		if (parent != null) {
			arr = getParent().getChain();
			arr.push(this) ;
		}
		return arr ;
	}
	/**
	 * override subCtnr 
	 */
	/**
	 * ctnr used by Form to contain data records
	 */
	//inside Super class:
	//public var recordsCtnr(get, null):Elem; 	
	//
	/**
	 * ctnr for 'using' mode or 'admin' mode for Form ; ctnr admin only for folder
	 */
	public var subCtnr(get, null):Elem; 
	function get_subCtnr() :Elem { 
		if (mode == "admin") return elem.elemByClass("apix_subCtnr") ;
		else return recordsCtnr ; 
		
	}
	/**
	 * ctnr admin for both form and folder
	 */
	var _elemsCtnr:Elem;
	public var elemsCtnr(get, set):Elem; 
	function get_elemsCtnr() :Elem { 
		if (_elemsCtnr==null) _elemsCtnr=("#" + vId + " .apix_subCtnr").get() ;
		return  _elemsCtnr ;
	}
	function set_elemsCtnr(v:Elem) :Elem { 
		_elemsCtnr = v;
		return v ;
	}
	public var dbTable (get, null):String; function get_dbTable() :String { return "tb_" + recId ;}
	public var recordsAlreadyRead(get, null): Bool; function get_recordsAlreadyRead() :Bool { return !recordsCtnr.isEmpty(); }
	public var color(get, null): String; function get_color() :String { return param.formColor ; }
	public var mode(get, null): String; function get_mode() :String { return model.mode ;  } // "admin" or "using"
	public var nameHolderTxt(get, null): String; function get_nameHolderTxt() :String { return lang.foNameHolder ; }
	public var updateTitleTxt(get, null): String; function get_updateTitleTxt() :String { return lang.foUpdateTitle ; }
	public var nameTxt(get, null): String; function get_nameTxt() :String { return lang.name ; }
	
	//
	public var allLabelElem(get, null):Array<Elem>; function get_allLabelElem() :Array<Elem> { return ("#safeBox .apix_txtField input").all() ; }
	public var nameFrame(get, null):Elem; function get_nameFrame() :Elem { return ("#safeBox #apix_nameFrame").get();}
	public var nameFrameTitle(get, null):Elem; function get_nameFrameTitle() :Elem { return ("#safeBox #apix_nameFrame .apix_title").get();}
	public var nameFrameName(get, null):Elem; function get_nameFrameName() :Elem { return ("#safeBox #apix_nameFrame .apix_name").get();}
	public var nameFramePath(get, null):Elem; function get_nameFramePath() :Elem { return ("#safeBox #apix_nameFrame .apix_path").get();}
	public var bNameFrameCancel(get, null):Elem; function get_bNameFrameCancel() :Elem { return ("#safeBox #apix_nameFrame .apix_cancelPicto").get();}
	public var bNameFrameValid(get, null):Elem; function get_bNameFrameValid() :Elem { return ("#safeBox #apix_nameFrame .apix_validPicto").get();}
	public var foName(get, null):Elem; function get_foName() :Elem { return ("#safeBox #apix_nameFrame input[name='foName']").get();}
	public var nameFramefieldsCtnr(get, null):Elem; function get_nameFramefieldsCtnr() :Elem { return ("#safeBox #apix_nameFrame .apix_fieldElemsCtnr").get();}
	//
	public var rowNumberLabel(get, null):Elem; function get_rowNumberLabel() :Elem { return ("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_rowNumber .apix_label").get();}
	public var copyEnableLabel(get, null):Elem; function get_copyEnableLabel() :Elem { return ("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_copyEnable .apix_label").get();}
	public var isHiddenLabel(get, null):Elem; function get_isHiddenLabel() :Elem { return ("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_isHidden .apix_label").get();}
	public var isPrimaryLabel(get, null):Elem; function get_isPrimaryLabel() :Elem { return ("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_isPrimary .apix_label").get();}
	//
	public var rowNumberInput(get, null):Elem; function get_rowNumberInput() :Elem { return ("#safeBox #apix_nameFrame input[name='rowNumber']").get();}
	public var copyEnableInput(get, null):Elem; function get_copyEnableInput() :Elem { return ("#safeBox #apix_nameFrame input[name='copyEnable']").get();}
	public var isHiddenInput(get, null):Elem; function get_isHiddenInput() :Elem { return ("#safeBox #apix_nameFrame input[name='isHidden']").get();}
	public var isPrimaryInput(get, null):Elem; function get_isPrimaryInput() :Elem { return ("#safeBox #apix_nameFrame input[name='isPrimary']").get();}
	public var primary(get, null):Field; 
	function get_primary() :Field {
		var len = fields.length ; var v:Field = null;
		for (i in 0...len) {			
			if (fields[i].isPrimary) { v= fields[i];  break; }
		}
		return v;
	}		
	public var recInsertTitleTxt(get, null): String; function get_recInsertTitleTxt() :String { return lang.recInsertTitle ; }
	public var recordFrame(get, null): Elem; function get_recordFrame() :Elem { return  ("#safeBox #apix_recordFrame").get();}
	public var recordFrameTitle(get, null): Elem; function get_recordFrameTitle() :Elem { return  ("#safeBox #apix_recordFrame .apix_title").get();}
	public var fieldDataHolder(get, null): String; function get_fieldDataHolder() :String { return lang.fieldDataHolder ; }
	public var recordFieldCtnr(get, null):Elem; function get_recordFieldCtnr() :Elem { return ("#safeBox #apix_recordFrame .apix_recordFieldCtnr").get();}
	public var bValidRecordInsert(get, null):Elem; function get_bValidRecordInsert() :Elem { return ("#safeBox #apix_recordFrame .apix_validPicto").get();}
	public var bCancelRecordInsert(get, null):Elem; function get_bCancelRecordInsert() :Elem { return ("#safeBox #apix_recordFrame .apix_cancelPicto").get();}
	//	
	//
	//
	public function getParent () :Form {
		if (is("Field"))  return cast(parent, Form);
		else if (this != model.root) return cast(parent, Folder);
		else return null ;
	}
	//
	public function init (ri:Int,l:String) {	
		recId = ri;
		label = l;
	}
	public function setupFormFields (arr:Array<Object>) {
		for (i in 1...arr.length) {
			var o:Object = arr[i];
			var fi = new Field(model, view);
			fi.parent = this;
			fi.initField( o.id, o.label,o.row_number,o.copy_enable,o.is_hidden,o.is_primary);				
			fields.push(fi);
			fi.index = fields.length - 1;
			fi.fields = fields ;
		}
	}
	public function displayFields (?shift:Int = 0) {
		var len = fields.length  ;
		for (i in 0...len) {
			var fi:Field = fields[i] ;
			 createOneField (fi, shift);
		}
	}
	
	public function setup () {
		setupView ();
		setupEvent ();
	}
	public function open () {
		if (subCtnr.isEmpty() && mode=="admin" ) {
			view.showTipBox(lang.alertEmptyCtnr,bElem.parent(),bElem.posx(),bElem.posy(),2)			; 
		}
		else {
			subCtnr.show();			
			isClosed = false;
		}		
	}
	public function close () {
		subCtnr.hide();
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
	//	
	public function setupAdminMode() {	
		var len = fields.length  ;
		for (i in 0...len) {
			var fi:Field= fields[i] ;
			fi.setupAdminMode();
		}
		subCtnr.hide(); // here at this moment subCtnr == records ctnr
		if (isClosed==false) elemsCtnr.show();
		pictoCtnr.show("inline-block");		
	}	
	public function setupUsingMode() {
		var len = fields.length  ;
		for (i in 0...len) {
			var fi:Field= fields[i] ;
			fi.setupUsingMode();
		}
		subCtnr.hide(); // here subCtnr == admin elems ctnr
		pictoCtnr.hide();
		
	}
	
	public function select () {	
		labelElem.cssStyle(CssStyle.opacity, "1");
		labelElem.cssStyle(CssStyle.borderColor,param.black);		
	}
	public function unselect () {	
		labelElem.cssStyle(CssStyle.opacity, ".7"); 
		labelElem.cssStyle(CssStyle.borderColor,color);
	}	
	public function setStateOfAddButtons (?opacFd:String="0",?opacFo:String="0",?opacFi:String="1") {		
		view.bAddFolder.show();
		view.bAddForm.show();
		view.bAddField.show();		
		opacFd=="0"?view.bAddFolder.hide():view.bAddFolder.cssStyle(CssStyle.opacity, opacFd);
		opacFo=="0"?view.bAddForm.hide():view.bAddForm.cssStyle(CssStyle.opacity,opacFo);
		opacFi=="0"?view.bAddField.hide():view.bAddField.cssStyle(CssStyle.opacity, opacFi);
		view.resize();
	}
	public function remove () {
		getParent().selectAndDispatch () ;
		clear () ;
		if (elem == null) trace ("Erreur in Form.remove(). Instance : " + g.className(this) + " label=" + label + " recId=" + recId);
		else elem.delete();		
		getParent().removeFromList(this); 
	}
	public function removeFromList (f:Form) {		
		if (f.is("Field")) fields.splice(f.index,1);
		else if ( f.is("Folder")) children.splice(f.index,1);
		else if ( f.is("Form")) forms.splice(f.index,1);
		else trace("f:: Form.removeFromList() type error");
	}
	public function clear() {
		var len = fields.length;
		for (i in 0...len) {
			var field:Field = fields[i] ;						
			field.clear();
		}
		var len = records.length;
		for (i in 0...len) {
			var record:Record = records[i] ;						
			record.clear();
		}		
		removeEvent();
		fields = []; records = [];
	}
	public function selectAndDispatch () {	
		var ev = new StandardEvent(this);
		ev.path = path;
		click.dispatch(ev); // do unselect() on previous and select() on this
	}
	public function insertNewField () {	
		insertNewElement ("field");
	}	
	public function insertNewRecord() {
		if (fields.length == 0) {
			g.alert(lang.emptyFieldDescription);
		}
		else showInsertRecordFrame(recInsertTitleTxt);
	}
	function showInsertRecordFrame (frameTitle:String) {	
		recordFrameTitle.text(frameTitle);
		recordFieldCtnr.removeChildren(); recordFrameFieldElems = [];
		for (fi in fields) {
			recordFrameFieldElems.push(fi.displayInRecordFrame(recordFieldCtnr, fieldDataHolder) );		
		}
		recordFrame.show();	
		setupInsertRecordEvent ();
	}
	
	function setupInsertRecordEvent () {			
		if (bCancelRecordInsert.hasLst()) bCancelRecordInsert.off(StandardEvent.CLICK);
		if (bValidRecordInsert.hasLst()) bValidRecordInsert.off(StandardEvent.CLICK);
		bCancelRecordInsert.on(StandardEvent.CLICK, onCancelRecordInsert);
		bValidRecordInsert.on(StandardEvent.CLICK, onValidRecordInsert);	
		bValidRecordInsert.joinEnterKeyToClick(null,recordFrameFieldElems[0].valueElem);
	}
	function removeInsertRecordEvent () {			
		if (bCancelRecordInsert.hasLst(StandardEvent.CLICK) ) bCancelRecordInsert.off(StandardEvent.CLICK,onCancelRecordInsert);
		if (bValidRecordInsert.hasLst(StandardEvent.CLICK) ) bValidRecordInsert.off(StandardEvent.CLICK, onValidRecordInsert);			
		bValidRecordInsert.clearEnterKeyToClick();
	}
	function onCancelRecordInsert (e:ElemEvent) {	
		removeInsertRecordEvent();
		recordFrame.hide();	
	}	 
	function onValidRecordInsert (e:ElemEvent) {	
		var fd:Field;
		var fvList:String="";var fkList:String="";var pfx:String="";
		for (fd in fields) {
			var k = fd.dbColName ;
			var v = recordFrameFieldElems[fd.index].valueElem.value();
			fkList += pfx + k ;
			fvList += pfx + v;
			pfx = "`~¤";
		}			
		askRecordInsert (fkList,fvList);		
	}	 
	function askRecordInsert (fkList:String,fvList:String) {			
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerRecordInsert);		
		server.ask({req:"insertOneRecord",id:model.currUserId,formRecId:recId,fieldKeys:fkList,fieldValues:fvList});
	}
	function onAnswerRecordInsert (e:StandardEvent) {			
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				
			else if (e.result.msg=="parentFormDoesntExist") g.alert(lang.parentFormDoesntExist);				
			else g.alert(lang.serverReadError + e.result.msg +  e.result.qry );
		} else if (answ == "insertRecordOk")  {
			removeInsertRecordEvent ();
			recordFrame.hide();
			view.showTipBox(lang.insertOk, bElem.parent(), bElem.posx(), bElem.posy(), 2)	;
			createOneRecord (g.intVal(e.result.recId, -1));	
			var el=bElem ;
			view.showTipBox(lang.createOk, el.parent() , el.posx(), el.posy(), 1)	;
		} else {			
			g.alert(lang.serverFatalError);
		}
	}
	function createOneRecord (recId:Int) {
		var r:Record = new Record(model, view);
		r.init( recId, this, records.push(r) -1, shift, recordFrameFieldElems[0].valueElem.value() );
		r.display();
		var f:Field;
		for (f in fields) {
			r.push( ("fd_" + f.recId) , recordFrameFieldElems[f.index].valueElem.value() ,f);
		}
		
	}
	public function toHtmlString (tab:String=""):String {
		var str = "";  var pRecId = -1 ;  if (parent!= null) pRecId = parent.recId ;
		str+= tab + "parent=" + pRecId + "<br/>" ;
		str+= tab + "recId=" + recId + "<br/>";
		str+= tab + "label=" + label + "<br/>";
		return str ;
	}
	/**
	 * @private
	 */
	function setupView () {
		labelElem.value(label); //labelElem.text(label);
		labelElem.cssStyle(CssStyle.backgroundColor, color);
		labelElem.cssStyle(CssStyle.opacity, ".7");
		labelElem.cssStyle(CssStyle.borderColor,color);
		pictoCtnr.hide();
	}
	function onButtonClick (e:ElemEvent) {	
		if (!isClosed) close();
		else {			
			if (is("Form") && mode == "using" && !recordsAlreadyRead) askReadRecords ();
			else open();
		}
		selectAndDispatch();		
	}			
	function showNameFrame (?tl:String = "$Title", ?n:String = "$name", ?hld:String = "$holder",?type:String) {	
		nameFrameTitle.text(tl);
		nameFrameName.text(n);
		nameFramePath.text(path);
		foName.placeHolder(hld);
		if (type == "field") {
			rowNumberLabel.text(lang.fiRowNumberLabel);
			copyEnableLabel.text(lang.ficopyEnableLabel);
			isHiddenLabel.text(lang.fiHiddenLabel);
			isPrimaryLabel.text(lang.fiPrimaryLabel);
			nameFramefieldsCtnr.show();
		}
		else nameFramefieldsCtnr.hide();
		nameFrame.show();
		bNameFrameValid.joinEnterKeyToClick(null,foName);
	}
	//
	function createOneFolder (fd:Folder,?shift:Int=0) {
		var folderProto = view.fButtonProto;
		var folderEl = folderProto.clone(true);	
		elemsCtnr.addChild(folderEl); folderEl.show();		
		folderEl.id = "fd_" + fd.recId;
		fd.vId = folderEl.id;
		fd.elem = folderEl ;
		fd.shift = shift ;
		//"is null".trace(Common.body.querySelector("#"+folderEl.id)==null);
		
		fd.bElem.posx(fd.shift);		
		fd.setup();
		fd.recordsCtnr.delete(); // Element not used by Folder
		fd.click.on(onElemClick);
	}
	function createOneForm (f:Form,?shift:Int=0) {
		var formProto = view.fButtonProto; 
		var formEl = formProto.clone(true);
		elemsCtnr.addChild(formEl); formEl.show();
		formEl.id = "fo_" + f.recId;
		f.vId = formEl.id;
		f.elem = formEl ;
		f.shift = shift;
		f.bElem.posx(f.shift);
		f.setup();
		f.click.on(onElemClick);
	}	
	function createOneField (fi:Field,?shift:Int=0) {
		var fieldProto = view.fButtonProto; 
		var fieldEl = fieldProto.clone(true);		
		elemsCtnr.addChild(fieldEl); fieldEl.show();
		fieldEl.id = "fi_" + fi.recId;
		fi.vId = fieldEl.id;
		fi.elem = fieldEl ;
		fi.shift = shift;
		fi.bElem.posx(fi.shift);
		fi.setup();
		fi.recordsCtnr.delete(); // Element not used by Field		
				
		//TODO fi.click.on(onElemClick); // maybe to oder the fields  positions
	}	
	//
	function onElemClick (ev:StandardEvent) {			
		click.dispatch(ev);
	}
	function insertNewElement (type:String) {
		var tl; var hd; var na = lang.name ;
		if (type == "folder") 		{ tl = lang.fdCreateTitle; hd = lang.fdNameHolder  ;  }
		else if (type == "form") 	{ tl = lang.foCreateTitle; hd = lang.foNameHolder ; }
		else if (type == "field")	{ tl = lang.fiCreateTitle; hd = lang.fiNameHolder ; na = lang.fiName ;  }
		else { tl = null;hd = null;  trace("f:: Form. insertNewElement() type error"); }
		showNameFrame(tl, na, hd,type);
		
		bNameFrameCancel.off();bNameFrameCancel.on(StandardEvent.CLICK, onFrameCancel);
		bNameFrameValid.off(); bNameFrameValid.on(StandardEvent.CLICK, onInsertElementValid,false,{type:type});
		foName.value("");
		if (type == "field") {
			nameFramefieldsCtnr.show();
			rowNumberInput.value("1");		
			copyEnableInput.value("true");
			copyEnableInput.selected(true);
			isHiddenInput.value("false");
			isHiddenInput.selected(false);	
			lockPrimaryInput ();
		}
	}
	function lockPrimaryInput (?fi:Field=null) {
		if (primary!=null && primary!=fi) {
			if (fi==null) isPrimaryInput.value("false");
			if (fi==null) isPrimaryInput.selected(false);
			isPrimaryInput.enable(false,true);
		} 
		else {
			if (fi==null) isPrimaryInput.value("true");
			if (fi==null) isPrimaryInput.selected(true);
			isPrimaryInput.enable(true,true);
		}
	}
	function unlockPrimaryInput () {
		isPrimaryInput.enable(true,true);
	}
	function clearInsertFields () {
		trace("f::todo if Form.clearInsertFields () is called");
		foName.value("");
	}	
	function onInsertElementValid (e:ElemEvent, ?d:Dynamic) {		
		var o:Dynamic = null;
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerInsertElement, { type:d.type } );	
		if (d.type == "field") {
			o = { 	req:"insert" + insertSrvTxtMsg,
					id:model.currUserId,
					recId:recId,
					label:foName.value(),
					rowNumber:rowNumberInput.value(), 
					copyEnable:copyEnableInput.selected(),
					isHidden:isHiddenInput.selected(),
					isPrimary:isPrimaryInput.selected()					
				}
		}
		else  {
			o = { req:"insert" + insertSrvTxtMsg, id:model.currUserId, label:foName.value(), recId:recId, type:d.type } ;
			//var oo:Object = new Object(o);
			//"req".trace(oo.toHtmlString());
		}
		server.ask(o);
	}
	function onAnswerInsertElement (e:StandardEvent) {
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				
			else if (e.result.msg=="parentFormDoesntExist") g.alert(lang.parentFormDoesntExist);	
			else g.alert(lang.serverReadError + e.result.msg);
		} else if (answ == "insert"+insertSrvTxtMsg+"Ok")  {
			var ff:Form=null; var el; //var fi:Field; 
			if (this == model.root)  el = elemsCtnr ; else el = bElem ;
				view.showTipBox(lang.createOk, el.parent() , el.posx(), el.posy(), 1)	;
			if (e.data.type == "folder") {
				ff = new Folder(model, view); 
				insertElementInit (ff, e);
				children.push(cast(ff, Folder));
				ff.index = children.length - 1;
				createOneFolder (cast(ff, Folder), shift + shiftVal);				
			}			
			else if (e.data.type == "form") {
				ff = new Form(model, view); 
				insertElementInit (ff, e);				
				forms.push(ff);
				ff.index = forms.length - 1;
				createOneForm(ff,  shift+shiftVal);
			}
			else  {
				ff = new Field(model, view); 
				insertElementInit (ff, e);
				cast(ff, Field).initField (  
								e.result.recId, foName.value(),
								g.intVal(rowNumberInput.value(), 1),
								copyEnableInput.selected(),
								isHiddenInput.selected(),
								isPrimaryInput.selected() 
								) ;				
				fields.push(cast(ff, Field));
				ff.index = fields.length - 1;
				createOneField (cast(ff, Field), shift);				
			}
			ff.setupAdminMode();	
			nameFrame.hide();			
		} else {			
			g.alert(lang.serverFatalError);
		}
	}
	function insertElementInit (ff:Form,e:Dynamic) {
		ff.init(e.result.recId, foName.value());
		ff.parent = this;
	}
	//
	function onUpdateClick (e:ElemEvent) {			
		showNameFrame(updateTitleTxt,nameTxt,nameHolderTxt);
		bNameFrameCancel.off();bNameFrameCancel.on(StandardEvent.CLICK, onFrameCancel);
		bNameFrameValid.off(); bNameFrameValid.on(StandardEvent.CLICK, onFrameValid);
		foName.value(label);
		selectAndDispatch ();
	}	
	function onFrameCancel (e:ElemEvent) {
		nameFrame.hide();
	}
	function onFrameValid (e:ElemEvent) {
		label = foName.value();
		labelElem.value(label);
		//
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerUpdate);
		
		server.ask({ req:"updateFormFolder",id:model.currUserId,recId:recId,label:label});	
		
	}
	function onAnswerUpdate (e:StandardEvent) {
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);			
			else g.alert(lang.serverReadError + e.result.msg);
		} else if (answ == "update" + srvTxtMsg + "Ok")  {
			nameFrame.hide();
			view.showTipBox(lang.updateOk, bElem.parent(), bElem.posx(), bElem.posy(), 2)	;
		} else {			
			g.alert(lang.serverFatalError);
		}
	}
	function onRemoveClick (e:ElemEvent) {
		selectAndDispatch ();
		cb.show(lang.deleteConfirm+" "+path+" ?",askDelete);		
	}
	function askDelete (b:Bool,f:Confirm) {
		if (b) {
			server.serverEvent.off(); 
			server.serverEvent.on(onAnswerDelete  );		
			server.ask( { req:"delete"+srvTxtMsg , id:model.currUserId, recId:recId } );	
		} 
	}
	function onAnswerDelete (e:StandardEvent) {
		cb.hide();
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				 
			else if (e.result.msg=="elemDoesntExist") g.alert(lang.elemDoesntExist);
			else if (e.result.msg=="invalidFormOwner") g.alert(lang.invalidFormOwner);
			else g.alert(lang.serverReadError + e.result.msg);
		} else if (answ == "delete"+srvTxtMsg+"Ok")  { 
			if (getParent() != model.root)
				view.showTipBox(lang.deleteOk,getParent().bElem.parent(), bElem.posx(), bElem.posy(), 1)	;
			remove ();
		} else {			
			g.alert(lang.serverFatalError);
		}
	}
	function askReadRecords () {
		if (fields.length == 0) g.alert(lang.emptyFieldDescription);
		else {
			server.serverEvent.off();
			server.serverEvent.on(onAnswerReadRecords); 
			server.ask( { req:"readRecords", id:model.currUserId, recId:recId } );
		}
	}
	function onAnswerReadRecords  (e:StandardEvent)  {
		var o:Object = e.result.records ; 
		if (e.result.answ=="error") {
			g.alert(lang.serverReadError+e.result.msg);
		}
		else if (o == null || e.result.answ=="error") {
			g.alert(lang.serverFatalError);
		}
		else if (o.error != null) {
					if (o.error.value == "tableDoesntExist") 		g.alert(lang.formTableDontExists);
			else 	if (o.error.value == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else 	if (o.error.value == "connectionIsNotValid") 	g.alert(lang.connectionIsNotValid);
			else												 	g.alert(lang.serverReadError + o.error.value);
		}
		else if (o.item!=null && Std.is(o.item,Array)) {		
			// here ok and not empty
			setupRecordsTree (o.item);
			open();
		} 
		else {
			g.alert(lang.formHaventData);
			//empty
			
		}
	}
	function setupRecordsTree (arr:Array<Object>) {
		for (i in 1...arr.length) {
			var o:Object = arr[i]; var k = "fd_"+fields[0].recId ; 
			var r = new Record(model, view);
			r.init( g.intVal(o.id.value), this, records.push(r) -1, shift, o.get(k).value);
			r.display();
			for (f in fields) {
				k = ("fd_" + f.recId) ;
				if (o.get(k) != null) r.push(k , o.get(k).value , f);
				else r.push(k , "" , f);
			}
		}
	}
	
}