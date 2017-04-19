
package mybox.boxes;
/**
* classes imports
*/
import apix.common.display.Common ;
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.util.Global ;
import apix.common.util.Object;
import haxe.Json;
import mybox.boxes.Field.FrameFieldElem;
import mybox.Model;
import mybox.View;

//
using apix.common.display.ElementExtender;
using apix.common.util.StringExtender;
using apix.common.util.ArrayExtender;
//

//
class CheckField_ extends AbstractGuiField {  	
	//	
	/*
	 * constructor
	 */
	public function new  (m:Model,?v:View) {	
		super(m, v);
	}
	//gets/sets
	
	
	
	/**
	 * public
	 */
	override public function getValueToSave (e:Elem):String {	
		var v = "[" ; var coma = "";	
		// var e is the checks Container (css class=apix_checkCtnr)
		for (ec in "input[type='checkbox']".all(e)) {
			if (ec.selected()) {
				v += coma + ec.value();
				coma = ",";
			}
		}	
		v += "]";
		return v;
	}
	//
	public function initCheckField (sl:String) {	
		selectArray = Json.parse(sl); 
	}
	
	
	override public function displayInRecordFrame (elemsCtnr:Elem, placeHolder:String, ?valInit:String = "" ) : FrameFieldElem  { 
		var el = view.frameCheckFieldDataProto.clone(true);
		elemsCtnr.addChild(el); el.show();
		el.setId("recFrameField_" + index);				
		var labEl = el.elemByClass("apix_label"); 
		var valEl = el.elemByClass("apix_checkCtnr");		
		if (valInit == "") valInit = "[-1]";
		var i = 0; var bEl; var lEl; var iEl;
		var checkedArr:Array<String>=getArrayOfString(valInit);
		for (sl in selectArray) {
			bEl = Common.createElem(TagType.BOX);
			lEl = Common.createElem(TagType.LABEL);
			iEl = Common.createElem(TagType.INPUT); iEl.cssStyle(CssStyle.display, "inline");
			lEl.text(sl); 
			iEl.value("" + i);
			iEl.inputType(InputType.CHECKBOX);
			bEl.addChild(iEl);	
			bEl.addChild(lEl);			
			valEl.addChild(bEl);
			i++;			
		}
		// set selected the choosen checkbox(es)	
		for (iChk in checkedArr) {
			if (iChk!="-1") {
				var v = ("#safeBox #" + el.getId() + " input[value='" + iChk + "'] ");
				v.get().selected(true);
			}
		}		
		labEl.text(label) ;	 
		//valEl.setId(dbColName);	
		return {elem:el,labelElem:labEl,valueElem:valEl} ;
	}
	/**
	 * private
	 */
	
	override function screenToData () :Dynamic {
		var o = super.screenToData();
		var osf = Json.parse(o.data);		
		osf.selectList = selectListEntry() ; selectArray = Json.parse(selectListEntry()); 
		o.data = Json.stringify(osf);
		return o ;
	}
	
	
	//used after insert
	public function askUpdateCheckField () {
		var o:Dynamic = null;
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerInsertCheckField );	
		popLineInSelectList ();
		view.bAddSelectLine.off();	
		o = { 	req:"updateCheckField",
				data:Json.stringify(
					{	id:model.currUserId,
						formRecId:getParent().recId,
						recId:recId,
						selectList: selectList	
					}
				)
			};
		server.ask(o);
	}
	function onAnswerInsertCheckField (e:StandardEvent) {
		var answ:String=e.result.answ;
		if (answ == "error") { 
			if (e.result.msg == "connectionHasBeenClosed") g.alert(lang.connectionHasBeenClosed);	
			else if (e.result.msg == "connectionIsNotValid") g.alert(lang.connectionIsNotValid);				
			else if (e.result.msg=="parentFormDoesntExist") g.alert(lang.parentFormDoesntExist);	
			else g.alert(lang.serverReadError + e.result.msg);
		} 
		else if (answ != "updateCheckFieldOk")  g.alert(lang.serverFatalError);
	}
	
	
}