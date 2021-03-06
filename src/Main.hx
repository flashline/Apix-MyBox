/**
 * Copyright (c) jm Delettre.
 * 
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 *   - Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   - Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
/**
* app root package
*/
package;
import apix.common.display.Common ;
import apix.common.event.StandardEvent;
import apix.common.event.timing.Delay;
import apix.common.util.Global ;
import apix.common.util.Cst;
import apix.common.util.Object;
import apix.ui.ApixCst;
import apix.ui.input.DateField;
import apix.ui.input.EmailField;
import apix.ui.input.GeoField;
import apix.ui.input.InputField;
import apix.ui.input.LinkField;
import apix.ui.input.PhotoField;
import apix.ui.input.SignField;
import apix.ui.slider.Slider;
import apix.ui.tools.Spinner;
import apix.ui.UICompo;
import haxe.Json;
import mybox.SafeBox;
import apix.common.io.JsonLoader;

/**
* classes imports
*/

using apix.common.util.StringExtender;
using apix.common.display.ElementExtender;
using apix.common.event.EventTargetExtender;
class Main  {
	static var g:Global;	
	var lang:Object;
	var lg:String;
	var param:Object; 
	var spinner:Spinner; 
	var firstLaunch:Bool; 
	/**
	 * constructor
	 */
	public function new () {
		// Common.window.on("load", uiCompoInit) ;
		// load event is already listen by www/js/index.js
		//
		uiCompoInit();
	}

	/**
	 * @private
	 */	
	function uiCompoInit () {
		UICompo.loadInit(chooseLanguage);
	}
	function chooseLanguage () {
		if (LocalShared.exists("safeboxLanguage")) {
			lg = LocalShared.get("safeboxLanguage");
			if (lg != "fr" && lg != "en" && lg != "es") {
				LocalShared.remove("safeboxLanguage");
				chooseLanguage();
			}
			else {
				"#safeBox #apix_chooseLangBox".get().delete();
				firstLaunch = false;				
				startSpinner ();
			}
		}
		else {
			"#safeBox #apix_chooseLangBox".get().show();	
			"#safeBox #apix_chooseLangBox".get().visible(true);
			"#safeBox #apix_enLang".get().on(StandardEvent.CLICK, onLangChoosen, false, { lg:"en" } );	
			"#safeBox #apix_frLang".get().on(StandardEvent.CLICK, onLangChoosen, false, { lg:"fr" } );	
			"#safeBox #apix_esLang".get().on(StandardEvent.CLICK, onLangChoosen, false, { lg:"es" } );	
			firstLaunch = true;
		}
	}
	function onLangChoosen (e:ElemEvent, ?p:Dynamic) {  
		lg = p.lg;
		var del = 365 * 24 * 60 * 60 * 1000;
		LocalShared.set("safeboxLanguage", lg , del);
		startSpinner(); //  readLanguage (); //
	}
	function startSpinner () { 
		spinner = Spinner.get( { callBack:readLanguage } ) ; // {skinPath:"apix/default/Spinner/mobile/"}
		spinner.start();
	}
	
	function readLanguage () {  
		var ll = new JsonLoader();
		ll.read.on(readParam);
		ll.load(Cst.BASE_URL + Cst.LANGUAGE_PATH+lg+Cst.LANGUAGE_FILE);		
	}
	function readParam (e:JsonLoaderEvent) { 
		var ll:JsonLoader = e.target;
		ll.read.off(readParam);
		lang = e.tree;		
		Lang.setLangObject(lang);
		//var ll = new JsonLoader();
		ll.read.on(start);
		ll.load(Cst.BASE_URL + Cst.MODEL_SRC);		
	}
	function start (e:JsonLoaderEvent) {  
		var ll:JsonLoader = e.target;
		ll.read.off(start);
		param = e.tree; 
		new SafeBox(Cst.BASE_URL, Cst.SERVER_URL, lang, param, firstLaunch);
	}	
	// app entry point
    static function main() {  
		g=Global.get();
		g.setupTrace();
		UICompo.baseUrl = ApixCst.BASE_URL;	
		Slider.init(); 
		InputField.init();		
		GeoField.init();		
		SignField.init(); 
		PhotoField.init("mobile", "apix/default/PhotoField/png/"); 
		DateField.init(); 
		LinkField.init();
		EmailField.init();
		//		
		new Main();
	}
}