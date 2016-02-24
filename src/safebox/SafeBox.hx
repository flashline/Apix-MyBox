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
package safebox;
import apix.common.display.Common ;
import apix.common.display.Confirm;
import apix.common.util.Global ;
import apix.common.util.Object;
import apix.ui.tools.Spinner;
/**
* classes imports
*/
using apix.common.util.StringExtender;
using apix.common.display.ElementExtender;
using apix.common.event.EventTargetExtender;
class SafeBox {	
	/**
	 * model related class
	 */
	public var model(default, null):Model ;
	/**
	 * view related class
	 */
	public var view(default, null):View;
	/**
	 * controler related class
	 */
	public var controler(default, null):Controler;
	
	/**
	 * constructor
	 */
	public function new (bu:String, su:String , l:Object, p:Object) {
		model = new Model(bu,su,l,p) ; 
		view = new View(model);
		controler = new Controler(model, view);			
		start();
    	//
		
	}
	/**
	 * @private
	 */
	function start () {  
		Spinner.get().stop();
		view.initDisplay(); 
		view.initAlert();
		view.initConfirm();	
		model.createRootFolder(view);
    	controler.initEvent();	
		controler.start();	
    }
	
	
}