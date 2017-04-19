
package mybox;
/**
* classes imports
*/
import apix.common.event.EventSource;
import apix.common.event.StandardEvent;
import apix.common.util.Global;
import apix.common.util.Object;
import apix.common.util.xml.XmlParser;
import apix.ui.tools.Spinner;
import haxe.Http; 
import haxe.Json;
//
using apix.common.io.HttpExtender ;
//
using apix.common.util.StringExtender;


class Server {	
	/**
	 * event dispatcher when server answers
	 */
	public var serverEvent(default, null):EventSource;	
	//
	var currentAskObject:Dynamic;
	var currentAnswerObject:StandardEvent;
	//var currentListeners:Array<Dynamic>;
	var httpStandardRequest(default,null):Http;
	var serverUrl:String;
	var spinner:Spinner;
	var model:Model;
	static var _instance:Server;
	var g:Global;
	//
	/**
	 * constructor
	 * @param	su server program full url
	 */
	public function new (su:String,m:Model) {
		serverUrl = su;
		serverEvent = new EventSource();
		_instance = this;
		spinner = Spinner.get();
		model = m;
		g = Global.get(); 		
    }		
	
	public static function get() : Server {	 
		return _instance ;
	}
	public function on (cb:Dynamic )  {	 
		 serverEvent.on(cb);
	}
	public function off (?cb:Dynamic=null )  {	 
		serverEvent.off(cb);
	}
	/**
	 * Main method to send server request
	 * @param	?o		vars to send
	 * @param	?type	request type 
	 */
	public function ask (?o:Dynamic = null)  {
		spinner.start();
		initServer(); 
		var httpRequest:Http;
		httpRequest = httpStandardRequest;
		httpRequest.onData = onServerData;
		//
		httpRequest.onError = onServerError;
		currentAskObject = o;		
		if (o != null) {
			var arr:Array<String> = Reflect.fields(o);
			for (i in 0...arr.length) httpRequest.setParameter(arr[i], Reflect.field(o, arr[i]) ) ;
		}
		httpRequest.request(true);
	}	
    /**
    *@private
    */
	 /**
	 * Create request
	 */
    function initServer () {
		if (httpStandardRequest == null) {
			httpStandardRequest = new Http(serverUrl);
		}		
	}  	
	//
	// server return listeners
	//
	function onServerData (data:String)  { 			
		data = StringTools.trim(data);			
		var e:StandardEvent = new StandardEvent(this);
		if (data.substr(0, 5) == "<?xml") {	
			e.result= new XmlParser().parse(Xml.parse(data));		
		}
		else {
			e.result = httpStandardRequest.getParameter(data);	
			if (e.result.data != null && e.result.data.substr(0, 1) == "{") {				
				e.result.jsonData = new Object(Json.parse(g.decodeAmp(e.result.data)));					
			}
		} 
		currentAnswerObject = e;
		if ( isDeconnected (e.result))  askAutoLogin();
		else {
			spinner.stop();
			serverEvent.dispatch(e);
		}
	}
	function onServerError (msg:String)  {
		var e:StandardEvent = new StandardEvent(this);
		e.result = { answ:"error", msg:msg } ;
		serverEvent.dispatch(e);
		trace("f::From server:\n" + msg);
	}
	//
	//
	function askAutoLogin () {
		//currentListeners=serverEvent.copyListeners();
		httpStandardRequest.onData = onAnswerAutoLogin;
		httpStandardRequest.onError = onServerError;
		var o = { req:"signIn", id: model.currUserId, pwd: model.currUserPwd };
		var arr:Array<String> = Reflect.fields(o );
		for (i in 0...arr.length) {
			httpStandardRequest.setParameter(arr[i], Reflect.field(o, arr[i]) ) ;
		}
		httpStandardRequest.request(true);
	}
	function onAnswerAutoLogin (data:String)  {
 		var answ:String = httpStandardRequest.getParameter(StringTools.trim(data)).answ;
		if (answ != "signInOk") { 
			//not ok
			spinner.stop();
			serverEvent.dispatch(currentAnswerObject);			
		}
		else {
			//ok			
			ask(currentAskObject);
		} 
	}
	function isDeconnected (result:Object) :Bool {
		var er = false ;
		if (result.answ=="error" && result.msg != null && result.msg=="connectionHasBeenClosed" ) {
			er = true;
		}
		else if (result.records != null && result.records.error != null && result.records.error.value == "connectionHasBeenClosed") {
			er = true;
		}
		if ( 	er
				&& currentAskObject != null
				&& model.isSafeMode == false
				&& model.currUserId != null
				&& model.currUserPwd != null )  {				
					return true ;
		}
		else return false;
	}
}
