
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import apix.common.util.Object;
import haxe.Json;
import mybox.boxes.Field.Control;
import mybox.Model;
import mybox.View;
import apix.common.tools.math.MathX;
//
using apix.common.util.StringExtender;
using apix.common.display.ElementExtender;
using apix.common.util.ArrayExtender;
//
class AbstractFormField extends AbstractFolderFormField  {	
	
	
	
	// private vars
	
	/*
	 * constructor
	 */
	function new (m:Model,?v:View) {	
		super(m, v);
	}
	//gets/sets
	
	
	/**
	 * public methods
	 */
	public function showSecureFrame (?tl:String = "", ?cmt:String = "", ?sc:String = "") {	
		view.secureFrameTitle.text(tl);
		view.secureFrameCmt.text(cmt);
		view.secureFrameCode.text(sc);
		view.secureFrame.show();
		view.secureFrame.css("height", "" + Common.documentHeight * 2 + "px");
		view.secureFrameInner.posx((view.secureFrameInner.parent().width()-view.secureFrameInner.width())/2);
	}
	public function hideSecureFrame () {		
		view.secureFrame.css("height", "100%"); 
		view.secureFrame.hide();			
	}
	public function pushSecureCode (el:Elem,?forWhat:String="") {
		view.bRubSecureFrame.visible(true);
		if (currSecureCode.length < param.secureCodeLen) {
			currSecureCode+= el.elemByClass("apix_num").text();			
			el.cssStyle(CssStyle.backgroundColor, param.secureCodeClickBgColor);
			el.elemByClass("apix_num").cssStyle(CssStyle.color, param.secureCodeClickColor);
			view.bValidSecureFrame.visible(false);
		}
		if (currSecureCode.length == param.secureCodeLen)  {
			if (forWhat!="forEnter") view.secureFrameCode.text(lang.secureCode);
			view.bValidSecureFrame.visible(true);
		}
	}	
	public function assignSecureCode(el:Elem) {
		el.elemByClass("apix_num").text("" + secureCodes.pop());
	}	
	public function clearSecureCode () {
		currSecureCode = "";
		view.secureFrameCode.text("");
		view.bRubSecureFrame.visible(false);
		view.bValidSecureFrame.visible(true);
		view.secureFrameCodePictoString.each(function (el:Elem) { 
			el.cssStyle(CssStyle.backgroundColor, param.secureCodeBgColor);
			el.elemByClass("apix_num").cssStyle(CssStyle.color, param.secureCodeColor);			
		});
	}	
	override public function remove () {
		getParent().selectAndDispatch () ;
		clear () ;
		if (elem == null) trace ("Erreur in Form.remove(). Instance : " + g.className(this) + " label=" + label + " recId=" + recId);
		else elem.delete();		
		getParent().removeFromList(this); 
	}
	override function closeNameFrame () {
		view.isSecureInput.off();
		view.isPrimaryInput.off();
		view.controlInput.off(); 
		view.bRubSecureFrame.off();
		view.bValidSecureFrame.off(); 
		view.secureFrameCodePictoString.off();
		view.bAddSelectLine.off();
		super.closeNameFrame ();
	}
	
	/**
	 * @private
	 */
	function clear() {trace("f::Must be override by Folder, Form and Field !");}
	
	override function insertNewElement (type:String) {
		super.insertNewElement(type);	  
		view.nameFramefieldsCtnr.show();
		showAdminFields ();
		enableAdminFields();view.isPrimaryInput.enable(true, true);	
		view.rowNumberInput.value("1");	
		view.isMultipleInput.selected(false);	
		view.controlDetailCtnr.hide();
		view.controlInput.getOption(0).selected(true);
		//
		view.selectListCtnr.removeChildren();
		view.selectListCtnr.hide();
		//
		view.copyEnableInput.selected(true);
		//
		view.requiredInput.selected(false);	
		view.isHiddenInput.selected(false);	
		view.isSecureInput.selected(false);									
		view.isPrimaryInput.off();
		setupAdminFieldsEvent () ;
		setupAdminFieldsInput ();
		//
		model.isFieldCreation = true;
	}
	function setupAdminFieldsEvent () {
		view.isSecureInput.off(); view.isSecureInput.on(StandardEvent.CHANGE, onSecureChange);
		view.controlInput.off(); view.controlInput.on(StandardEvent.CHANGE, onControlChange);			
	}
	function setupAdminFieldsInput () {		
		if (primary != null) {
			// a primary already exists
			hideIsPrimaryInput();
			enableAdminFields ();
			view.foName.value("");
		} 
		else {	
			// primary doesnt exist 
			showIsPrimaryInput ();
			disableAdminFields ();	
			view.nameFrameTitle.inner(lang.fiPrimCreateTitle);
			view.foName.value(lang.fiPrimDefaultLabel);				
		}		
	}	
	function showIsPrimaryInput () {
			view.isPrimaryInput.parent().show("inline");
			view.isPrimaryInput.selected(true);
			view.isPrimaryInput.enable(false, true);			
			hideAdminFields () ;
			view.showTipBox(lang.primaryMustBeCreated, view.isPrimaryInput.parent(),0,0,3);			
	}
	function hideIsPrimaryInput () {
		view.isPrimaryInput.selected(false);
		view.isPrimaryInput.enable(false, true);
		view.isPrimaryInput.off();
		view.isPrimaryInput.parent().hide();
	}
	function showAdminFields () {
		view.controlInput.parent().show();
		view.rowNumberInput.parent().show();
		view.isHiddenInput.parent().show();
		view.requiredInput.parent().show();
		view.copyEnableInput.parent().show();
		view.isSecureInput.parent().show();		
	}
	function hideAdminFields () {
		view.controlInput.parent().hide();
		view.controlDetailCtnr.hide();
		view.rowNumberInput.parent().hide();
		view.isHiddenInput.parent().hide();
		//view.requiredInput.parent().hide();
		view.copyEnableInput.parent().hide();
		view.isSecureInput.parent().hide();		
	}	
	function enableAdminFields () {
		view.controlInput.enable(true, true);
		view.isHiddenInput.enable(true, true);
		view.requiredInput.enable(true, true);
		view.copyEnableInput.enable(true, true);
		view.isSecureInput.enable(true, true);
		
	}
	function disableAdminFields () {
		view.controlInput.enable(false, true);
		view.controlInput.getOption(0).selected(true);
		view.isHiddenInput.selected(false);
		view.isHiddenInput.enable(false, true);
		view.copyEnableInput.selected(false);
		view.copyEnableInput.enable(false, true);
		//view.requiredInput.selected(false);
		//view.requiredInput.enable(false, true);
		view.isSecureInput.selected(false);
		view.isSecureInput.enable(false, true);	
		currSecureCode = "";
	}
	//
	function onPrimaryChange (e:ElemEvent) {
		if (view.isPrimaryInput.selected()) disableAdminFields ();
		else enableAdminFields ();
	}
	function onSecureChange (e:ElemEvent) {
		if (view.isSecureInput.selected()) createSecureCode();
		else doSecureChange ();
	}
	function doSecureChange () {
		if (view.isSecureInput.selected()) {
			view.isHiddenInput.selected(true);
			view.isHiddenInput.enable(false, true);
		} 
		else view.isHiddenInput.enable(true, true);	
	}
	function createSecureCode (?forWhat:String = "") {		
		showSecureFrame(lang.secureCreateTitle,lang.secureCreateComment,"");
		view.bRubSecureFrame.off();		
		view.bRubSecureFrame.on(StandardEvent.CLICK, function (e:ElemEvent) { clearSecureCode () ; } );
		view.bValidSecureFrame.off(); view.bValidSecureFrame.on(StandardEvent.CLICK, onValidSecureCreate);
		clearSecureCode () ;
		secureCodes=MathX.randomExclusiveList(9);
		view.secureFrameCodePictoString.each(assignSecureCode) ;	
		view.secureFrameCodePictoString.off() ;	
		view.secureFrameCodePictoString.on(StandardEvent.CLICK, onClickSecureCode,{forWhat:forWhat}) ;
	}	
	function onClickSecureCode (e:ElemEvent,?d:Dynamic) {
		var el:Elem = cast(e.currentTarget, Elem);
		pushSecureCode (el,d.forWhat);
	}	
	
	function onValidSecureCreate (e:ElemEvent) {
		if (currSecureCode == "") {
			view.isSecureInput.value("false");
			view.isSecureInput.selected(false);			
		}
		else {
			view.isSecureInput.selected(true);
			doSecureChange();
		}
		hideSecureFrame();	
	}
	function onControlChange (e:ElemEvent) {		
		var v = view.controlInput.getSelectedOption().value;
		setupFromControl(v);
		if (model.isFieldCreation) initFieldValue (v) ;
				if ( v == Control.SelectField) 	pushLineInSelectList();			
		else 	if ( v == Control.CheckField) 	pushLineInSelectList();			
		else 	if ( v == Control.RadioField) 	pushLineInSelectList();		
		else 									popLineInSelectList ();		
		
	}	
	function setupFromControl (v:Control) {	
		if (g.strVal(view.foName.value(), "") == lang.fiGeoDefaultLabel) view.foName.value("");
		if (g.strVal(view.foName.value(),"")  == lang.fiSignDefaultLabel) view.foName.value("");
		if (g.strVal(view.foName.value(),"")  == lang.fiPhotoDefaultLabel) view.foName.value("");
		view.rowNumberInput.parent().hide();
		view.isMultipleInput.parent().hide();
		view.decimalNumberInput.parent().hide();
		view.minValueInput.parent().hide();
		view.maxValueInput.parent().hide();
		view.selectListCtnr.hide();	
		view.bAddSelectLine.off();
		view.bAddSelectLine.hide();
		view.isSecureInput.parent().show();	
		view.copyEnableInput.selected(true);			
		view.copyEnableInput.parent().show();		
		view.requiredInput.parent().show();
		view.isHiddenInput.parent().show();		
		view.controlDetailCtnr.hide();
		if ( v == Control.AreaField) {
			view.controlDetailCtnr.show();
			view.rowNumberInput.parent().show();
		}
		else if ( v == Control.NumberField) {
			view.controlDetailCtnr.show();
			view.decimalNumberInput.parent().show();
		}
		else if ( v == Control.SelectField) {
			view.controlDetailCtnr.show();
			view.isMultipleInput.parent().show();
			view.selectListCtnr.show();	
			view.bAddSelectLine.show();
			view.bAddSelectLine.on(StandardEvent.CLICK, onAddSelectLine);
			view.isSecureInput.parent().hide();
		}
		else if ( v == Control.CheckField ||  v == Control.RadioField) {
			view.controlDetailCtnr.show();
			view.isMultipleInput.parent().hide();
			view.selectListCtnr.show();	
			view.bAddSelectLine.show();
			view.bAddSelectLine.on(StandardEvent.CLICK, onAddSelectLine);
			view.isSecureInput.parent().hide();
		}	
		else if ( v == Control.GeoField) {			
			//view.isSecureInput.parent().hide();
			if (g.strVal(view.foName.value(),"")=="") view.foName.value(lang.fiGeoDefaultLabel);	
		}
		else if ( v == Control.SignField) {			
			view.isSecureInput.parent().hide();
			view.isHiddenInput.parent().hide();
			view.copyEnableInput.selected(false);			
			view.copyEnableInput.parent().hide();
			if (g.strVal(view.foName.value(),"")=="") view.foName.value(lang.fiSignDefaultLabel);	
		}
		else if ( v == Control.PhotoField) {			
			view.isSecureInput.parent().hide();
			view.isHiddenInput.parent().hide();
			view.copyEnableInput.selected(false);			
			view.copyEnableInput.parent().hide();
			if (g.strVal(view.foName.value(),"")=="") view.foName.value(lang.fiPhotoDefaultLabel);	
		}
		else if ( v == Control.Slider) {			
			view.isSecureInput.parent().hide();
			view.controlDetailCtnr.show();			
			view.minValueInput.parent().show();
			view.maxValueInput.parent().show();
			view.decimalNumberInput.parent().show();
		}
		else if ( v == Control.ColorField) {			
			view.isSecureInput.parent().hide();
			view.isHiddenInput.parent().hide();
		}
		else if ( v == Control.DateField) {			
			view.isSecureInput.parent().hide();
		}
		else if ( v == Control.LinkField) {			
			view.isSecureInput.parent().hide();
		}
	}
	function initFieldValue (v)  {	
		if ( v == Control.AreaField) 	{
			view.rowNumberInput.value("1");
		}
		if ( v == Control.SelectField) {
			view.isMultipleInput.selected(false);
		} 
		if ( v == Control.SelectField ||
			 v == Control.CheckField || 
			 v == Control.RadioField ) {
			view.selectListCtnr.removeChildren();
		} 
		if ( v == Control.NumberField ||
			 v == Control.Slider) {
			view.decimalNumberInput.value("0");
		} 
		if ( v == Control.Slider) {
			view.minValueInput.value("1");
			view.maxValueInput.value("999");			
		}	
	}	
	
	function pushLineInSelectList () : Elem {
		popLineInSelectList ();
		var proto = view.selectLineProto; 
		var el = proto.clone();		
		view.selectListCtnr.addChild(el); el.show();
		el = el.elemByClass("apix_selectText");
		el.placeHolder(lang.fiSelectTextHolder);
		renumLineInSelectList ();
		el.setFocus();
		return el ;
	}
	function popLineInSelectList () {			
		view.selectListCtnr.forEachChildren( function (c:Elem) {
			if (c.elemByClass("apix_selectText").value() == "") {
				var b = c.delete();
			}
		});
		renumLineInSelectList ();
	}
	function renumLineInSelectList () {	
		var i = 0;
		view.selectListCtnr.forEachChildren( function (c:Elem) {
			i++;
			c.setId("selLine_" + i);
			c.elemByClass("apix_label").text(""+i+": ");
		});
	}
	function onAddSelectLine (e:ElemEvent) {		
		pushLineInSelectList ();
	}
	function makeFieldsEntryCoherent () : Control {		
		var v = view.controlInput.getSelectedOption().value;
		if ( v != Control.AreaField) 	{
			view.rowNumberInput.value("1");
		}
		if ( v != Control.SelectField) {
			view.isMultipleInput.selected(false);
		} 
		if ( v != Control.SelectField &&
			 v != Control.CheckField && 
			 v != Control.RadioField ) {
			view.selectListCtnr.removeChildren();
		} 
		if ( v != Control.NumberField &&
			 v != Control.Slider) {
			view.decimalNumberInput.value("");
		} 
		if ( v != Control.Slider) {
			view.minValueInput.value("1");
			view.maxValueInput.value("999");			
		}		
		return v;
	}	
	function selectedControl () : Control {		
		return  view.controlInput.getSelectedOption().value;
	}	
	function selectListEntry () : String {		
		var arr:Array<String> = [];
		view.selectListCtnr.forEachChildren( function (c:Elem) {
			var el=c.elemByClass("apix_selectText");
			if (el.value() != "") {
				arr.push(el.value());
			}
		});
		return Json.stringify(arr)	;
	}	
	override function onInsertElementValid (e:ElemEvent, ?d:Dynamic) {	
		var o:Dynamic = null;
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerInsertElement, { type:d.type } );	
		o = { 	req:"insert" + insertSrvTxtMsg,
				data:Json.stringify(
					{	
						id:model.currUserId,
						formRecId:recId,
						label:view.foName.value(),
						rowNumber:view.rowNumberInput.value(), 
						required:view.requiredInput.selected(),
						copyEnable:view.copyEnableInput.selected(),
						isHidden:view.isHiddenInput.selected(),
						isSecure:view.isSecureInput.selected(),
						secureCode:currSecureCode,
						isPrimary:view.isPrimaryInput.selected(),
						control:makeFieldsEntryCoherent ()
					}
				)
			};
		server.ask(o);
	}
	override function onAnswerInsertElement (e:StandardEvent) :String {
		var answ:String = super.onAnswerInsertElement (e);
		if (answ == "insert" + insertSrvTxtMsg + "Ok")  {			
			createFieldAfterInsert(e.result.recId, shift ) ;//  + shiftVal); // if not display over flow on mobile
		}
		return answ;
	}
	
}
	
	
	
	
	
	
	
	