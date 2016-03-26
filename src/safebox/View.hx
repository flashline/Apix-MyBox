
package safebox;
import apix.common.display.Alert;
import apix.common.display.Common ;
import apix.common.display.Confirm;
import apix.common.event.timing.Delay;
import apix.common.util.Global ;
import apix.common.util.Object;


/**
* classes imports
*/
using apix.common.util.StringExtender;
using apix.common.util.ArrayExtender;
using apix.common.display.ElementExtender;

class View {
	var g:Global;
	var tipBoxElem:Elem;
	var lang:Object;
	var param:Object;
	
	/**
	 * model related class
	 */
	public var model(default, null):Model ;
	/**
	 * tip array set by Controler
	 */
	public var tipArray:Array<Array<String>>;
	/**
	 * display elements
	 */
	
  
					
	public var linkDoc(get, null):Elem; function get_linkDoc() :Elem { return "#safeBox #loginView .apix_links .apix_linkDoc".get(); }
	public var linkLang1(get, null):Elem; function get_linkLang1() :Elem { return "#safeBox #loginView .apix_links .apix_linkLang1".get(); }
	public var linkLang2(get, null):Elem; function get_linkLang2() :Elem { return "#safeBox #loginView .apix_links .apix_linkLang2".get(); }
	public var linkGit(get, null):Elem; function get_linkGit() :Elem { return "#safeBox #loginView .apix_links .apix_linkGit".get(); }
	
	public var bLang1(get, null):Elem; function get_bLang1() :Elem { return "#safeBox #apix_bLang1".get(); }
	public var bLang2(get, null):Elem; function get_bLang2() :Elem { return "#safeBox #apix_bLang2".get(); }
	
	
	
	
	public var currUserId(null, set):String; function set_currUserId(v:String) :String { bLogOff.elemByClass("apix_userId").text(v); return v; }
	public var safeBox(get, null):Elem; function get_safeBox() :Elem { return "#safeBox".get(); }
	public var bConnect(get, null):Elem; function get_bConnect() :Elem { return "#safeBox #bConnect".get(); }
	public var bGoSignUp(get, null):Elem; function get_bGoSignUp() :Elem { return "#safeBox #bGoSignUp".get(); }
	public var bBackSignIn(get, null):Elem; function get_bBackSignIn() :Elem { return "#safeBox .connectForm .apix_goPrevious".get(); }
	public var idValue(get, null):String; function get_idValue() :String { return "#safeBox #idMail".get().value() ; }
	public var pwdValue(get, null):String; function get_pwdValue() :String { return "#safeBox #pwd".get().value() ; }
	public var confirmValue(get, null):String; function get_confirmValue() :String { return "#safeBox #confirm".get().value() ; }
	
	public var bOpenMenu(get, null):Elem; function get_bOpenMenu() :Elem { return "#safeBox #stdView .apix_openMenu".get(); }
	public var bGoPrevious(get, null):Elem; function get_bGoPrevious() :Elem { return "#safeBox #stdView .apix_goPrevious".get(); }
	public var bGoUp(get, null):Elem; function get_bGoUp() :Elem { return "#safeBox #stdView .apix_goUp".get(); }
	public var menu(get, null):Elem; function get_menu() :Elem { return "#safeBox .menu".get(); }
	public var bLogOff(get, null):Elem; function get_bLogOff() :Elem { return "#safeBox #apix_bLogOff".get(); }
	public var bAdmin(get, null):Elem; function get_bAdmin() :Elem { return "#safeBox #apix_bAdmin".get(); }
	public var bDoc(get, null):Elem; function get_bDoc() :Elem { return "#safeBox #apix_bDoc".get(); }
	public var bTip(get, null):Elem; function get_bTip() :Elem { return "#safeBox #apix_bTip".get(); }
	public var bQuitAdmin(get, null):Elem; function get_bQuitAdmin() :Elem { return "#safeBox #apix_bQuitAdmin".get(); }
	public var bSafeMode(get, null):Elem; function get_bSafeMode() :Elem { return "#safeBox #apix_bSafeMode".get(); }
	public var bAbout(get, null):Elem; function get_bAbout() :Elem { return "#safeBox #apix_bAbout".get(); }
	public var rootElemsCtnr(get, null):Elem; function get_rootElemsCtnr() :Elem { return "#safeBox #apix_buttonCtnr".get(); }
	public var fButtonProto(get, null):Elem; function get_fButtonProto() :Elem { return "#safeBox #apix_folderButton".get(); }
	public var fieldDataProto(get, null):Elem; function get_fieldDataProto() :Elem { return "#safeBox #apix_fieldDataProto".get(); }
	public var frameFieldDataProto(get, null):Elem; function get_frameFieldDataProto() :Elem { return "#safeBox #apix_frameFieldDataProto".get(); }
	
	public var pathElem(get, null):Elem; function get_pathElem() :Elem { return "#safeBox .apix_path".get(); }
	public var bAddFolder(get, null):Elem; function get_bAddFolder() :Elem { return ("#safeBox #apix_addFolder").get();}
	public var bAddForm(get, null):Elem; function get_bAddForm() :Elem { return ("#safeBox #apix_addForm").get();}
	public var bAddField(get, null):Elem; function get_bAddField() :Elem { return ("#safeBox #apix_addField").get();}
	public var bAddRecord(get, null):Elem; function get_bAddRecord() :Elem { return ("#safeBox #apix_addRecord").get();}
	
	
	//public var subCtnrProto(get, null):Elem; function get_subCtnrProto() :Elem { return "#safeBox #apix_subCtnr".get(); }
	 
	/**
	 * constructor
	 */
	public function new (m:Model) {	
		model = m;
		lang = m.lang;
		param = model.param;
		g = Global.get();
		tipBoxElem = "#safeBox #apix_tipBox".get();
		
	}
	public function initDisplay () {	
		"#safeBox #loginView".get().hide();
		"#safeBox #stdView".get().hide();
		"#safeBox .apix_initHidden".each(ElementExtender.hide);
		rootElemsCtnr.show();
		//
		"#safeBox .headInfo".get().inner(lang.headInfo);
		"#safeBox #bConnect .apix_label".get().text(lang.bConnectLabel);
		"#safeBox #bGoSignUp .apix_label".get().text(lang.bGoSignupLabel);			
		"#safeBox #loginView .apix_goPrevious".get().tip(lang.goPreviousTitle );
		"#safeBox #stdView .apix_goPrevious".get().tip(lang.goPreviousTitle );
		"#safeBox .topText".get().tip(lang.topTextTitle );
		"#safeBox .apix_goUp".get().tip(lang.goUpTitle );
		"#safeBox .apix_openMenu".get().tip(lang.openMenuTitle );
		"#safeBox .removePicto".get().tip(lang.removePictoTitle );
		"#safeBox .updatePicto".get().tip(lang.updatePictoTitle );
		"#safeBox .showPicto".get().tip(lang.showPictoTitle );
		"#safeBox .rubPicto".get().tip(lang.rubPictoTitle );		
		"#safeBox .copyPicto".each(function (c) { c.tip(lang.copyPictoTitle); } );
		"#safeBox .apix_cancelPicto".each(function (c) { c.tip(lang.cancelPictoTitle); } );
		"#safeBox .apix_validPicto".each(function (c) { c.tip(lang.validPictoTitle); } );		
		"#safeBox .apix_codePicto".each(function (c) { c.tip(lang.codePictoTitle); } );
		
		linkLang1.text(lang.langApp1);
		linkLang2.text(lang.langApp2);
		linkDoc.link(lang.menuDocSrc);
		linkDoc.text(lang.menuDoc);
		
		
		//menu titles and labels	
		bLang1.elemByClass("apix_label").text(lang.langApp1);
		bLang2.elemByClass("apix_label").text(lang.langApp2);
		
		bAdmin.tip(lang.menuAdminTitle);
		bDoc.tip(lang.menuDocTitle);
		bTip.tip(lang.menuTipTitle);
		bQuitAdmin.tip(lang.menuQuitAdminTitle);
		bSafeMode.tip(lang.menuSafeModeTitle); 
		bLogOff.tip(lang.menuLogOffTitle);		
		bAbout.tip(lang.menuAboutTitle);
		bAbout.elemByClass("apix_version").tip(lang.menuVersionTitle);
		bLogOff.elemByClass("apix_userId").tip(lang.menuUserIdTitle);		
		//
		bAdmin.elemByClass("apix_label").text(lang.menuAdmin);
		bDoc.elemByClass("apix_label").text(lang.menuDoc);
		bTip.elemByClass("apix_label").text(lang.menuTip);
		bQuitAdmin.elemByClass("apix_label").text(lang.menuQuitAdmin);
		bLogOff.elemByClass("apix_label").text(lang.menuLogOff);		
		bAbout.elemByClass("apix_label").text(lang.menuAbout);
		bAbout.elemByClass("apix_version").text(model.version);
		setMenuSafeModeLabel (); 
		//
		bAddFolder.tip(lang.addFolderTitle);
		bAddForm.tip(lang.addFormTitle);
		bAddField.tip(lang.addFieldTitle);
		bAddRecord.tip(lang.addRecordTitle);
		bAddFolder.cssStyle(CssStyle.backgroundColor, param.bAddFolderColor);
		bAddForm.cssStyle(CssStyle.backgroundColor, param.bAddFormColor);
		bAddField.cssStyle(CssStyle.backgroundColor, param.bAddFieldColor);
		bAddRecord.cssStyle(CssStyle.backgroundColor, param.bAddRecordColor);		
	}
	
		
	public function setMenuSafeModeLabel () {
		if (model.isSafeMode) bSafeMode.elemByClass("apix_label").text(lang.menuSafeModeOff);
		else bSafeMode.elemByClass("apix_label").text(lang.menuSafeModeOn);
	}
	public function clear () {
		pathElem.text("");
	}
	public function initAlert () : Alert{	
		// init alert frame related with g.alert();
		//
		// - apix.common.display.Alert class, 
		// - an html <div> 
		// - and this kind of code below,
		// are necessary and sufficient for. 
		//
		var el = "#safeBox #apix_alertBox".get();
		var txEl = "#safeBox #apix_alertBox .apix_content".get() ;
		var btEl = "#safeBox #apix_alertBox .apix_enter".get() ; //
		var titleEl =  "#safeBox #apix_alertBox .apix_label".get();
		return new Alert(el, txEl, btEl, titleEl, "<b>" + lang.alertTitle+"</b>", lang.alertValidLabel);
	}
	public function initConfirm () : Confirm {	
		// init alert frame related with g.alert();
		//
		// - apix.common.display.Alert class, 
		// - an html <div> 
		// - and this kind of code below,
		// are necessary and sufficient for. 
		//
		var el = "#safeBox #apix_confirmBox".get();
		var txEl = "#safeBox #apix_confirmBox .apix_content".get() ;
		var btEl = "#safeBox #apix_confirmBox .apix_enter".get() ; 
		var cbtEl = "#safeBox #apix_confirmBox .apix_cancel".get() ; 
		var titleEl =  "#safeBox #apix_confirmBox .apix_label".get();
		var titleEl =  "#safeBox #apix_confirmBox .apix_label".get();
		return new Confirm(el, txEl, btEl,cbtEl, titleEl, "<b>" + lang.confirmTitle+"</b>", lang.confirmValidLabel , lang.confirmCancelLabel);
	}
	public function resize() {
		var o=hideAbsoluteElem();
			var view = "#stdView".get();
			var w = Common.windowWidth;
			w = Math.min(w, Common.screenWidth);
			if (w > 800) w = 800;
			
			var h = Common.windowHeight;				
			h = Math.min(h, Common.screenHeight);
			//trace("h=" + h);	
		restoreAbsoluteElem(o);
		var bm = model.param.bottomMrg ; var bam = model.param.bottomAddMrg ;
		var ram = model.param.rigthAddMrg;
		if (h > bm) view.height(h - bm);			
		//
		var el:Elem = bAddRecord;
		el.posy(h-el.height()-bam);	
		el.posx(view.posx() + w - el.width()-ram);	
		//
		el = bAddField;
		el.posy(h-el.height()-bam);	
		el.posx(view.posx() + w - el.width() - ram);
		//
		el = bAddFolder;
		el.posy(h-el.height()-bam);
		el.posx(view.posx() + w - el.width()*2-2*ram) ;
		//
		el = bAddForm;
		el.posy(h-el.height()-bam);	
		el.posx(view.posx() + w - el.width()-ram);	
		//
		//
		el = "#safeBox .menu".get();
		el.posx(view.posx() + w - el.width());	
		el = "#safeBox #apix_buttonCtnr".get();
		var viewTop:Elem = "#safeBox .viewTop".get();
		el.height(view.height() - (viewTop.height() + 10));
		//
		
	}
	public function showLoginView (?id:String,?pwd:String,?mode:String="signIn") {	
		"#safeBox #loginView".get().show();
		"#safeBox #stdView".get().hide();
		"#safeBox .addPicto".each(ElementExtender.hide);
		//
		if (mode=="signIn") {	
			"#safeBox #confirm".get().hide();
			"#safeBox .connectForm .apix_goPrevious".get().hide();			
			"#safeBox #bGoSignUp".get().show("inline");
			if (id != null) "#idMail".get().value(id);
			if (pwd != null) "#pwd".get().value(pwd);
			"#safeBox #idMail".get().placeHolder(lang.signInIdHolder );
			"#safeBox #pwd".get().placeHolder(lang.signInPwdHolder );
		
		}
		else { 
			"#safeBox #bGoSignUp".get().hide();
			"#safeBox #confirm".get().show();
			"#safeBox .connectForm .apix_goPrevious".get().show("inline-block");
			
			"#safeBox #idMail".get().value("");
			"#safeBox #pwd".get().value("");
			"#safeBox #confirm".get().value("");
			//
			"#safeBox #idMail".get().placeHolder(lang.signUpIdHolder );
			"#safeBox #pwd".get().placeHolder(lang.signUpPwdHolder );
			"#safeBox #confirm".get().placeHolder(lang.signUpConfirmHolder );
		}
		
	}
	public function showStdView () {
		"#safeBox #loginView".get().hide();
		"#safeBox #stdView".get().show();	
		resize();
	}
	public function setupAdminMode () {
		"#apix_bAdmin".get().hide();
		bAddFolder.show();
		bAddForm.show();		
		resize();
	}
	
	public function setupUsingMode () {
		"#safeBox #apix_bAdmin".get().show();	
		//to continue
		bAddFolder.hide();
		bAddForm.hide();
		bAddField.hide();
		//resize();
	}
	public function showTips () {
		var txt:Array<String> = tipArray.pop();
		if (txt != null) {
			if (tipArray.length==0) g.alert(txt,showTips,lang.menuTip,lang.endValidLabel);
			else g.alert(txt,showTips,lang.menuTip,lang.nextValidLabel);
		}
	}
	
	public function showTipBox (str:String,ctnr:Elem,?vx:Float=0,?vy:Float=0,?d:Float=2) {		
		ctnr.addChild(tipBoxElem);
		ctnr.css("zIndex","2");
		tipBoxElem.posx(vx); tipBoxElem.posy(vy);
		tipBoxElem.inner(str);
		tipBoxElem.show();
		ctnr.css("overflow","visible");
		new Delay(function () { ElementExtender.hide(tipBoxElem); ctnr.css("overflow","hidden");} , d);
	}
	/*
	 * @private
	 */
	function hideAbsoluteElem() :Dynamic {
		var o = {menu:"",addFolder:"",addForm:"", addField:"" };
		var el = "#safeBox .menu".get(); o.menu = el.getDisplay(); el.hide();
			el = bAddFolder; o.addFolder = el.getDisplay(); el.hide();
			el = bAddForm; o.addForm = el.getDisplay(); el.hide();
			el = bAddField; o.addField = el.getDisplay(); el.hide();			
		return o ;
    }
	function restoreAbsoluteElem(o:Dynamic) {
		"#safeBox .menu".get().setDisplay(o.menu);
		bAddFolder.setDisplay(o.addFolder);
		bAddForm.setDisplay(o.addForm);
		bAddField.setDisplay(o.addField);		
    }
}