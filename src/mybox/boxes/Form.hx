
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.display.Confirm;
import apix.common.tools.math.MathX;
import apix.common.util.Global ;
import apix.common.util.Object;
import apix.common.util.xml.XmlParser;
import haxe.Json;
import mybox.boxes.Field.Control;
import mybox.Model;
import mybox.boxes.Field.FrameFieldElem;
import mybox.Server;
import mybox.View;
import apix.common.event.StandardEvent;
//
using apix.common.util.StringExtender;
using apix.common.display.ElementExtender;
using apix.common.util.ArrayExtender;
//   

class Form extends AbstractFormField  {	
	//
	public var records:Array<Record>;	
	public var fields:Array<Field>;	
		
	//	
		
	/*
	 * constructor
	 */
	public function new (m:Model,?v:View) {	
		super(m, v);
		fields = [];
		records = [];
		srvTxtMsg = "FormFolder";
		insertSrvTxtMsg = "Field" ;
	}
	// gets
	//
	override public function getParent () : Folder { return cast(parent, Folder);
	//
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
		
	public var dbTable (get, null):String; function get_dbTable() :String { return "tb_" + recId ;}
	public var recordsAlreadyRead(get, null): Bool; function get_recordsAlreadyRead() :Bool { return !recordsCtnr.isEmpty(); }
	override function get_color() :String { return param.formColor ; };
	//
	public var allLabelElem(get, null):Array<Elem>; function get_allLabelElem() :Array<Elem> { return ("#safeBox .apix_txtField input").all() ; }
	//			
	public var recInsertTitleTxt(get, null): String; function get_recInsertTitleTxt() :String { return lang.recInsertTitle ; }
	override function get_primary() :Field {
		var len = fields.length ; var v:Field = null;
		for (i in 0...len) {			
			if (fields[i].isPrimary) { v= fields[i];  break; }
		}
		return v;
	}
	//	
	//
	public function setupFormFields (arr:Array<Object>) {
		for (i in 0...arr.length) {
			var o:Object = arr[i]; var fi:Field ;
					if (o.control == Control.SelectField) 	fi = new SelectField_(model, view); 
			else 	if (o.control == Control.CheckField) 	fi = new  CheckField_(model, view);
			else 	if (o.control == Control.RadioField) 	fi = new  RadioField_(model, view);
			else 	if (o.control == Control.NumberField) 	fi = new  NumberField_(model, view);
			else 	if (o.control == Control.GeoField) 		fi = new  GeoField_(model, view);
			else 	if (o.control == Control.SignField) 	fi = new  SignField_(model, view);
			else 	if (o.control == Control.PhotoField) 	fi = new  PhotoField_(model, view);
			else 	if (o.control == Control.Slider) 		fi = new  Slider_(model, view);
			else 	if (o.control == Control.DateField) 	fi = new DateField_(model, view);
			else 	if (o.control == Control.ColorField) 	fi = new ColorField_(model, view);
			else 	if (o.control == Control.LinkField) 	fi = new LinkField_(model, view);
			else 	if (o.control == Control.EmailField) 	fi = new EmailField_(model, view);
			else 											fi = new       Field (model, view);
			//
			fi.parent = this;
			fi.initField( o.id, o.label,o.row_number,o.required,o.copy_enable,o.is_hidden,o.is_secure,o.is_primary,o.control);			
			fields.push(fi);
			fi.index = fields.length - 1;
					if (fi.control == Control.SelectField) 	cast(fi).initSelectField(o.selectfields.is_multiple, o.selectfields.labels);
			else 	if (fi.control == Control.CheckField)  	cast(fi).initCheckField( o.checkfields.labels);
			else 	if (fi.control == Control.RadioField)  	cast(fi).initRadioField( o.radiofields.labels);
			else 	if (fi.control == Control.NumberField)  cast(fi).initNumberField( o.numberfields.decimal_number);
			else 	if (fi.control == Control.Slider)  		cast(fi).initSlider(o.sliders.min_value,o.sliders.max_value,o.sliders.decimal_number);
			
		}
	}
	public function displayFields (?shift:Int = 0) {
		var len = fields.length  ;
		for (i in 0...len) {
			var fi:Field = fields[i] ;
			createOneField (fi, shift);
		}
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
	
	override public function removeFromList (c:AbstractBox) {
		if ( c.is("Field") ) {
			fields.splice(c.index, 1);
			for (i in c.index...fields.length) {
				fields[i].index = i;
			}
		}
		else if ( c.is("Record")) {
			records.splice(c.index, 1);
			for (i in c.index...records.length) {
				records[i].index = i;
			}
		}
		else trace("f:: Form.removeFromList() type error : "+c.what);
	}
	
	override public function clear() {
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
	
	public function insertNewField () {	
		clearSecureCode();
		insertNewElement ("field");
	}	
	public function insertNewRecord() {
		if (fields.length == 0) {
			g.alert(lang.emptyFieldDescription);
		}
		else {
		var sfg = SingleFormRecordMng.get(model,view,this);
		sfg.showRecordFrame(recInsertTitleTxt);
		
			//here frame // showInsertRecordFrame(recInsertTitleTxt);			
		}
	}
	public function createOneRecord (recId:Int,recordFrameFieldElems:Array<FrameFieldElem>) {
		var r:Record = new Record(model, view);
		r.init( recId, this, records.push(r) -1, shift, recordFrameFieldElems[0].valueElem.value() );
		r.display();
		var f:Field;
		for (f in fields) {
			r.push( ("fd_" + f.recId) , f.getValueToSave(recordFrameFieldElems[f.index].valueElem) ,f);
		}		
	}	
	
	/**
	 * @private
	 */
	
	
	override function onButtonClick (e:ElemEvent) {	
		if (!isClosed) close();
		else {			
			if (mode == "using" && !recordsAlreadyRead) askReadRecords ();
			else open();
		}
		selectAndDispatch();		
	}			
	
	override function createFieldAfterInsert (rci:Int, ?shift:Int = 0) {
		var fi:Field ;
		if (selectedControl() == Control.SelectField) fi=new SelectField_(model,view);
		else if (selectedControl() == Control.CheckField) fi=new CheckField_(model,view);
		else if (selectedControl() == Control.RadioField) fi=new RadioField_(model,view);
		else if (selectedControl() == Control.NumberField) fi=new NumberField_(model,view); 
		else if (selectedControl() == Control.GeoField) fi=new GeoField_(model,view);
		else if (selectedControl() == Control.SignField) fi=new SignField_(model,view);
		else if (selectedControl() == Control.PhotoField) fi=new PhotoField_(model,view);
		else if (selectedControl() == Control.Slider) fi=new Slider_(model,view);
		else if (selectedControl() == Control.DateField) fi=new DateField_(model,view);
		else if (selectedControl() == Control.ColorField) fi=new ColorField_(model,view);
		else if (selectedControl() == Control.LinkField) fi=new LinkField_(model,view);
		else if (selectedControl() == Control.EmailField) fi=new EmailField_(model,view);
		else fi = new Field (model,view);
		insertElementInit (fi,rci);		
		fi.initField (rci, view.foName.value(),
						g.intVal(view.rowNumberInput.value(), 1),
						view.requiredInput.selected(),
						view.copyEnableInput.selected(),
						view.isHiddenInput.selected(),
						view.isSecureInput.selected(),
						view.isPrimaryInput.selected(),
						selectedControl ()
						) ;				
		fields.push(fi);
		if (fi.control == Control.SelectField) {
			var sfi:SelectField_ = cast( fi);
			sfi.initSelectField(view.isMultipleInput.selected(), selectListEntry());
			sfi.askUpdateSelectField();	
		}
		else if (fi.control == Control.CheckField) {
			var sfi:CheckField_ = cast( fi);
			sfi.initCheckField( selectListEntry());
			sfi.askUpdateCheckField();	
		}
		else if (fi.control == Control.RadioField) {
			var sfi:RadioField_ = cast( fi);
			sfi.initRadioField( selectListEntry());
			sfi.askUpdateRadioField();	
		}
		else if (fi.control == Control.NumberField) {
			var sfi:NumberField_ = cast( fi);
			sfi.initNumberField(g.intVal(view.decimalNumberInput.value()));
			sfi.askUpdateNumberField();	
		}
		else if (fi.control == Control.Slider) {
			var sfi:Slider_ = cast( fi);
			sfi.initSlider(g.numVal(view.minValueInput.value()),g.numVal(view.maxValueInput.value()),g.intVal(view.decimalNumberInput.value()));
			sfi.askUpdateSlider();	
		}
				
		fi.index = fields.length - 1;
		createOneField (fi, shift);
		fi.setupAdminMode();
	}
	//	
	//	
	function createOneField (fi:Field,?shift:Int=0) {
		var fieldProto = view.fButtonProto; 
		var fieldEl = fieldProto.clone(true);		
		elemsCtnr.addChild(fieldEl); fieldEl.show();
		fieldEl.setId("fi_" + fi.recId);
		fi.vId = fieldEl.getId();
		fi.elem = fieldEl ;
		fi.shift = shift;
		fi.bElem.posx(fi.shift);
		fi.setup();
		fi.recordsCtnr.delete(); // Element not used by Field	
	}	
	//
	
	function askReadRecords () {
		if (fields.length == 0) g.alert(lang.emptyFieldDescription);
		else {
			server.serverEvent.off();
			server.serverEvent.on(onAnswerReadRecords); 			
			server.ask( { req:"readRecords",data:Json.stringify({id:model.currUserId, recId:recId } ) } );
		}
	}
	function onAnswerReadRecords  (e:StandardEvent)  {
		var o:Object = e.result.jsonData ; 
		if (e.result.answ == "error") {
			var msg = e.result.msg;
			if (msg == "tableDoesntExist") 		g.alert(lang.formTableDontExists);
			else 	if (msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else 	if (msg == "connectionIsNotValid") 	g.alert(lang.connectionIsNotValid);
			else	g.alert(lang.serverReadError + msg);			
		}
		else if (o == null) {
			g.alert(lang.serverFatalError);
		}
		else if (e.result.answ == "readRecordsOk") {	
			if (o.records!=null && o.records.length>0) {		
				// here ok and not empty
				setupRecordsTree (o.records);
				open();
			} 
			else {
				g.alert(lang.formHaventData);
				//empty
				
			}
		}
	}
	function setupRecordsTree (arr:Array<Object>) {
		for (i in 0...arr.length) {
			var o:Object=new Object(arr[i]); 
			var k = "fd_"+fields[0].recId ; 
			var r = new Record(model, view);			
			r.init( g.intVal(o.id), this, records.push(r) -1, shift, o.get(k));
			r.display();
			for (f in fields) {
				k = ("fd_" + f.recId) ;
				if (o.get(k) != null) r.push(k , o.get(k) , f);
				else r.push(k , "" , f);
			}
		}
	}
	
}