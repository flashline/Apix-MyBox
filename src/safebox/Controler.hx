
package safebox;
import apix.common.display.Common ;
import apix.common.display.Confirm;
import apix.common.event.StandardEvent;
import apix.common.event.timing.Delay;
import apix.common.util.Global ;
import apix.common.util.Object;
import apix.common.util.xml.XmlParser;
import safebox.models.Folder;
import safebox.models.Form;
/**
* classes imports
*/
using apix.common.util.StringExtender;
using apix.common.display.ElementExtender;
class Controler {
	static var g:Global;
	var lang:Object;
	/**
	 * model related class
	 */
	public var model(default, null):Model ;
	/**
	 * view related class
	 */
	public var view(default, null):View;
	/**
	 * server related class
	 */
	var server:Server;
	var cb:Confirm;
	/**
	 * constructor
	 */
	public function new (m:Model,v:View) {	
		view = v;
		model = m; lang = model.lang;
		server = model.server; 
		model.version = "v 1.0.4 - r 1";
		//
		g = Global.get();
	}
	public function initEvent () {	
		Common.window.on("resize", onResize);
		view.resize();
	}
	public function start (?fl:Bool = false) { 		
		cb = Confirm.get();			
		if (fl) showWarning();
		else askConnectInfo ();	
    }
	/**
	 * @private
	 */
	//
	//
	// server ask/answers
	//
	//
	 function showWarning () { 			 
		g.alert(lang.warning,askConnectInfo,lang.warningTitle,lang.warningValidText);		
    }	
	function askConnectInfo () {
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerConnectInfo); 
		server.ask({req:"isConnectionOpen"});
	}	
	function onAnswerConnectInfo (e:StandardEvent) {
		server.serverEvent.off(onAnswerConnectInfo);		
		var answ = e.result.answ;
		if (answ == "connectionIsOpen") { 
			model.currUserId = e.result.id; 
			model.currUserPwd = model.readUserCookie(false).pwd ;
			model.data= new XmlParser().parse(Xml.parse(e.result.xmlData));
			if (model.data.folders == null) {
				g.alert(lang.serverReadError);
				model.data = null;
			}
			else if (model.data.folders.error != null) {
				g.alert(lang.serverReadError + model.data.error.value);
				model.data = null;
			}
			else {						
				doAfterConnection();
			}	
		} 
		else if (answ == "connectionIsNotOpen")  {			
			goSignIn ();
		} 
		else {		
			g.alert(lang.serverFatalError,goSignIn);
		}		
	}
	//
	function askSignIn ( id:String, pwd:String) {
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerSignIn); 
		server.ask( { req:"signIn", id:id, pwd:pwd } );
		model.currUserPwd = pwd;
	}
	function onAnswerSignIn (e:StandardEvent) {
		server.serverEvent.off(onAnswerSignIn); 
		var answ:String=e.result.answ;
		if (answ == "error") { 
			model.currUserPwd = null;
			var msg:String=e.result.msg;
			if (msg=="noValidLogin") {
				g.alert(lang.noValidLoginError,onErrorCallBackSignIn);					
			} 
			else if (msg=="loginDoesntExist")  {
				g.alert(lang.loginDoesntExist,onErrorCallBackSignIn);
			} 
			else if (msg=="connectionAlreadyOpen") {
				g.alert(lang.connectAlreadyExists,onErrorCallBackSignIn);					
			}
			else {		
				g.alert(lang.serverFatalError,onErrorCallBackSignIn);
			}
		} 
		else if (answ == "signInOk")  {	
			model.currUserId = e.result.id; 
			model.data= new XmlParser().parse(Xml.parse(e.result.xmlData));
			if (model.data.error != null) {
				g.alert(lang.serverReadError + model.data.error.value,onErrorCallBackSignIn);
				model.data = null;
			}
			else {				
				model.writeUserCookie();
				doAfterConnection();
			}			
		} 
		else {
			g.alert(lang.serverFatalError,onErrorCallBackSignIn);
		}			
	}	
	function onErrorCallBackSignIn () {
		model.currUserPwd = null;
		goSignIn();
	}
	//
	function askSignUp ( id:String, pwd:String) {
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerSignUp); 
		model.currUserPwd = pwd;
		server.ask( { req:"signUp", id:id, pwd:pwd } );		
	}
	function onAnswerSignUp (e:StandardEvent) {
		var answ:String=e.result.answ;
		if (answ=="error") { 
			var msg:String=e.result.msg;
			if (msg=="idAlreadyExist") {
				g.alert(lang.alreadyExistError,onErrorCallBackSignUp);					
			} else if (msg=="noValidLogin")  {
				g.alert(lang.noValidLoginError,onErrorCallBackSignUp);
			} else {
				g.alert(lang.serverReadError+msg,onErrorCallBackSignUp);					
			} 
			model.currUserPwd =null;
		} else if (answ == "signUpOk")  {
			model.currUserId =  e.result.id;	
			model.writeUserCookie();
			goMain () ;	
		} else {			
			g.alert(lang.serverFatalError,onErrorCallBackSignUp);
		}
		
	}	
	function onErrorCallBackSignUp () {
		model.currUserPwd = null;
	}
	function askLogOff () {	
		server.serverEvent.off(); 
		server.serverEvent.on(onAnswerLogOff); 
		server.ask( { req:"logOff" } );	
	}
	function onAnswerLogOff (e:StandardEvent) {	
		var answ:String = e.result.answ;
		if (answ == "logOffOk")  {	
			var id = e.result.id;
			model.currUserId = null;
			model.currUserPwd = null;			
		} else {
			model.currUserId = null;
			model.currUserPwd = null;
			//g.alert(lang.xxxxx);	
		}
		goSignIn();
	}
	//
	//
	//
	function doAfterConnection () {
		model.initDataObject();				
		model.setupTree();
		goMain();
		//new Delay(goMain,1);
	}
	function goSignIn () {
		var o = model.readUserCookie();	
		view.showLoginView(g.strVal(o.id, ""), g.strVal(o.pwd, ""),"signIn");
		view.bConnect.joinEnterKeyToClick();
		setupSignInEvent();		
	}
	function goSignUp () {
		view.showLoginView(null, null, "signUp");	
		setupSignUpEvent();
	}
	function goMain () {
		view.showStdView();	
		setupStdViewEvent();
		model.root.display();		
		if (model.dataIsEmpty()) {
			g.alert(lang.alertBeforeFolderCreation,null,lang.startAlertTitle);// [0] + lang.alertBeforeFolderCreation[1]);
		}
		else {			
			if (model.dataIsFormLess()) {
				g.alert(lang.alertBeforeFormCreation,null,lang.startAlertTitle);
			}
		}	
	}	
	function logOff () {		
		model.clear();
		view.clear();
		model.root.click.off(onFormOrFolderClick);
		setupUsingMode();
		askLogOff();
	}
	function setupAdminMode() {
		view.setupAdminMode();
		view.model.root.setupAdminMode();
		setupAdminModeEvent();
		model.mode = "admin";
		setStateOfAddButtons(model.selectedFormOrFolder);
	}
	function setupUsingMode() {
		view.setupUsingMode();
		view.model.root.setupUsingMode();
		setupUsingModeEvent();
		model.mode = "using"; 		
	}
	//
	// Listeners adding
	//
	function setupSignInEvent () {
		if (view.bConnect.hasLst(StandardEvent.CLICK) ) view.bConnect.off(StandardEvent.CLICK, onSignUpClick);
		if (view.bBackSignIn.hasLst(StandardEvent.CLICK) ) view.bBackSignIn.off(StandardEvent.CLICK, onBackSignInClick);
		
		if (!view.bConnect.hasLst(StandardEvent.CLICK) ) view.bConnect.on(StandardEvent.CLICK, onSignInClick);		
		if (!view.bGoSignUp.hasLst(StandardEvent.CLICK) ) view.bGoSignUp.on(StandardEvent.CLICK, onGoSignUpClick);	
		setupLangEvent ();
	}
	function setupSignUpEvent () {
		if (view.bConnect.hasLst(StandardEvent.CLICK) ) view.bConnect.off(StandardEvent.CLICK, onSignInClick);
		if (view.bGoSignUp.hasLst(StandardEvent.CLICK) ) view.bGoSignUp.off(StandardEvent.CLICK, onGoSignUpClick);
		if (!view.bConnect.hasLst(StandardEvent.CLICK) ) view.bConnect.on(StandardEvent.CLICK, onSignUpClick);
		if (!view.bBackSignIn.hasLst(StandardEvent.CLICK) ) view.bBackSignIn.on(StandardEvent.CLICK, onBackSignInClick);
		setupLangEvent ();
	}
	function setupLangEvent () {
		if (!view.linkLang1.hasLst(StandardEvent.CLICK) ) view.linkLang1.on(StandardEvent.CLICK, onChangeLang,false,{lg:lang.langApp1Src});
		if (!view.linkLang2.hasLst(StandardEvent.CLICK) ) view.linkLang2.on(StandardEvent.CLICK, onChangeLang,false,{lg:lang.langApp2Src});		
	}
	function setupStdViewEvent () {
		if (!view.bAdmin.hasLst(StandardEvent.CLICK) ) view.bAdmin.on(StandardEvent.CLICK, onAdminClick);
		if (!view.bDoc.hasLst(StandardEvent.CLICK) ) view.bDoc.on(StandardEvent.CLICK, onDocClick);
		if (!view.bTip.hasLst(StandardEvent.CLICK) ) view.bTip.on(StandardEvent.CLICK, onTipClick);
		if (!view.bLang1.hasLst(StandardEvent.CLICK) ) view.bLang1.on(StandardEvent.CLICK, onChangeLang,false,{lg:lang.langApp1Src});
		if (!view.bLang2.hasLst(StandardEvent.CLICK) ) view.bLang2.on(StandardEvent.CLICK, onChangeLang,false,{lg:lang.langApp2Src});	
		if (!view.bOpenMenu.hasLst(StandardEvent.CLICK) ) view.bOpenMenu.on(StandardEvent.CLICK, onOpenMenuClick);
		view.bGoPrevious.off() ; view.bGoPrevious.on(StandardEvent.CLICK, onLogOffClick);
		if (!Common.window.hasLst(StandardEvent.CLICK) ) Common.window.on(StandardEvent.CLICK, onWindowClick);
		if (!view.bLogOff.hasLst(StandardEvent.CLICK) ) view.bLogOff.on(StandardEvent.CLICK, onLogOffClick);
		if (!view.bQuitAdmin.hasLst(StandardEvent.CLICK) ) view.bQuitAdmin.on(StandardEvent.CLICK, onBackFromAdmin);
		if (!model.root.click.hasListener ()) model.root.click.on(onFormOrFolderClick);
		if (!view.bGoUp.hasLst(StandardEvent.CLICK) ) view.bGoUp.on(StandardEvent.CLICK, onGoUpClick);
		if (!view.bSafeMode.hasLst(StandardEvent.CLICK) ) view.bSafeMode.on(StandardEvent.CLICK, onChangeSafeModeClick);
		if (!view.bAbout.hasLst(StandardEvent.CLICK) ) view.bAbout.on(StandardEvent.CLICK, onAboutClick);		
	}
	function enableAddButtonEvent (?fd:Bool = true, ?fo: Bool = true) {
		if (fd && !view.bAddFolder.hasLst(StandardEvent.CLICK) ) view.bAddFolder.on(StandardEvent.CLICK, onAddFolderClick);
		if (fo && !view.bAddForm.hasLst(StandardEvent.CLICK) ) view.bAddForm.on(StandardEvent.CLICK, onAddFormClick);		
	}
	function disableAddButtonEvent (?fd: Bool = true,?fo: Bool = true) {
		if (fd && view.bAddFolder.hasLst(StandardEvent.CLICK) ) view.bAddFolder.off(StandardEvent.CLICK, onAddFolderClick);
		if (fo && view.bAddForm.hasLst(StandardEvent.CLICK) ) view.bAddForm.off(StandardEvent.CLICK, onAddFormClick);		
	}
	function enableAddFieldButtonEvent () {
		if (!view.bAddField.hasLst(StandardEvent.CLICK))  view.bAddField.on(StandardEvent.CLICK, onAddFieldClick);
	}
	function disableAddFieldButtonEvent () {
		if (view.bAddField.hasLst(StandardEvent.CLICK))  view.bAddField.off(StandardEvent.CLICK, onAddFieldClick);
	}
	function enableAddRecordButtonEvent () {
		if (!view.bAddRecord.hasLst(StandardEvent.CLICK))  view.bAddRecord.on(StandardEvent.CLICK, onAddRecordClick);
	}
	function disableAddRecordButtonEvent () {
		if (view.bAddRecord.hasLst(StandardEvent.CLICK))  view.bAddRecord.off(StandardEvent.CLICK, onAddRecordClick);
	}
	function setupAdminModeEvent () {		
		view.bGoPrevious.off();
		view.bGoPrevious.on(StandardEvent.CLICK, onBackFromAdmin);
		view.bQuitAdmin.show();
		enableAddButtonEvent ();
	}
	function setupUsingModeEvent () {
		view.bGoPrevious.off();
		view.bGoPrevious.on(StandardEvent.CLICK, onLogOffClick);
		view.bQuitAdmin.hide();
		disableAddButtonEvent ();
		disableAddFieldButtonEvent ();
	}
	
	//
	// Listeners 
	//
	function onSignInClick (e:ElemEvent) {
		view.bConnect.clearEnterKeyToClick();
		var str = model.isValidSignInInput(view.idValue, view.pwdValue) ;		
		if (str!= "") {
			g.alert(str);
		} 
		else {
			askSignIn(view.idValue, view.pwdValue);		
		}
	}
	function onSignUpClick (e:ElemEvent) {
		view.bConnect.clearEnterKeyToClick();
		var str = model.isValidSignUpInput(view.idValue, view.pwdValue, view.confirmValue) ;		
		if (str!= "") {
			g.alert(str);
		} 
		else {
			askSignUp(view.idValue, view.pwdValue);	
		}
	}
	function onGoSignUpClick (e:ElemEvent) {
		goSignUp();		
	}
	function onBackSignInClick  (e:ElemEvent) {
		goSignIn();		
	}
	//
	function onOpenMenuClick  (e:ElemEvent) {	
		e.stopPropagation();
		view.setMenuSafeModeLabel() ;
		view.menu.show();	
		view.resize();
	}
	
	//
	function onLogOffClick (e:ElemEvent) {
		logOff ();
	}	
	function onAdminClick  (e:ElemEvent) {	
		setupAdminMode();
	}
	function onDocClick  (e:ElemEvent) {	
		//g.replace(lang.menuDocSrc);
		g.open(lang.menuDocSrc,"_self");
	}
	function onTipClick  (e:ElemEvent) {
		var arr:Array<Array<String>> = lang.tipArray;
		view.tipArray = arr.copy();
		view.showTips();
	}
	function onChangeLang  (e:ElemEvent, ?p:Dynamic) { 	
		model.language = p.lg;
		g.replace("./index.html");
		//g.open("./", "_self");
	}
	function onChangeSafeModeClick  (e:ElemEvent) {	
		if (model.isSafeMode) cb.show(lang.goToNoSafeMode,onChangeSafeMode);
		else cb.show(lang.goToSafeMode,onChangeSafeMode);
	}
	function onChangeSafeMode  (b:Bool,f:Confirm) {	
		if (b) {
			if (model.isSafeMode) model.setSafeMode(false);
			else model.setSafeMode(true);
			view.setMenuSafeModeLabel() ;
			cb.hide();
		}
	}
	
	function onAboutClick  (e:ElemEvent) {	
		g.alert(lang.about,null,lang.aboutTitle );
	}
	function onBackFromAdmin  (e:ElemEvent) {	
		setupUsingMode();
		model.root.click.off(onFormOrFolderClick);	
		model.clear();
		askConnectInfo () ;
	}
	function onGoUpClick  (e:ElemEvent) {	
		setupCurrentFormOrFolder ( model.root) ;
	}	
	function onFormOrFolderClick (ev:StandardEvent) {	
		setupCurrentFormOrFolder ( ev.target);
	}
	function setupCurrentFormOrFolder (f:Form) {	
		// deselect previous
		if (model.selectedFormOrFolder != model.root) 
			model.selectedFormOrFolder.unselect();
		// select new current
		model.selectedFormOrFolder = f;
		if (model.selectedFormOrFolder != model.root) 
			model.selectedFormOrFolder.select();
		//	
		setStateOfAddButtons(model.selectedFormOrFolder);
		view.pathElem.text(f.path);		
	}
	function setStateOfAddButtons (fo:Form) {	
		if (model.mode=="admin") {
			if (fo.is("Folder")) {
				var fd = cast(fo, Folder);
				if (fd.level < 3) { //2
					enableAddButtonEvent();
					fd.setStateOfAddButtons();
				}
				else if (fd.level<4) { //3
					disableAddButtonEvent();
					enableAddButtonEvent(false,true);
					fd.setStateOfAddButtons(".4","1");
				}
				else {
					// no possible !
					fd.setStateOfAddButtons(".5");
					disableAddButtonEvent();
				}
			}
			else {
				//disableAddButtonEvent();
				//disableAddRecordButtonEvent();
				view.bAddRecord.hide() ;
				view.bAddField.show();view.resize();
				fo.setStateOfAddButtons();			
				enableAddFieldButtonEvent();
			}
		}
		else {			
			if (fo.is("Form")) {
				//disableAddButtonEvent(); disableAddFieldButtonEvent ();
				view.bAddRecord.show();view.resize();
				enableAddRecordButtonEvent();
			}
			else {
				view.bAddRecord.hide();
			}
			
		}
	}
	function onAddFolderClick  (e:ElemEvent) {	
		var fd:Folder = cast(model.selectedFormOrFolder,Folder);
		fd.insertNewFolder();
	}	
	function onAddFormClick  (e:ElemEvent) {	
		var fd:Folder = cast(model.selectedFormOrFolder,Folder);
		fd.insertNewForm();
	}	
	function onAddFieldClick  (e:ElemEvent) {	
		var fo:Form = cast(model.selectedFormOrFolder,Form);
		fo.insertNewField();
	}	
	function onAddRecordClick  (e:ElemEvent) {	
		var fo:Form = model.selectedFormOrFolder ;
		fo.insertNewRecord();
	}		
	//
	function  onWindowClick  (e:ElemEvent) {
		view.menu.hide();
	}	
	//
	function onResize(e:ElemEvent) {			
		view.resize();
	}
	
}