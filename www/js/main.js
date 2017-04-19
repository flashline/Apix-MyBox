(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var DateTools = function() { };
DateTools.__name__ = ["DateTools"];
DateTools.delta = function(d,t) {
	var t1 = d.getTime() + t;
	var d1 = new Date();
	d1.setTime(t1);
	return d1;
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = ["Lambda"];
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
};
var List = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,__class__: List
};
var Main = function() {
	this.uiCompoInit();
};
Main.__name__ = ["Main"];
Main.main = function() {
	Main.g = apix.common.util.Global.get();
	Main.g.setupTrace();
	apix.ui.UICompo.set_baseUrl(apixCst.BASE_URL);
	apix.ui.slider.Slider.init();
	apix.ui.input.InputField.init();
	apix.ui.input.GeoField.init();
	apix.ui.input.SignField.init();
	apix.ui.input.PhotoField.init("mobile","apix/default/PhotoField/png/");
	apix.ui.input.DateField.init();
	apix.ui.input.LinkField.init();
	apix.ui.input.EmailField.init();
	new Main();
};
Main.prototype = {
	uiCompoInit: function() {
		apix.ui.UICompo.loadInit($bind(this,this.chooseLanguage));
	}
	,chooseLanguage: function() {
		if(js.Cookie.exists("safeboxLanguage")) {
			this.lg = js.Cookie.get("safeboxLanguage");
			if(this.lg != "fr" && this.lg != "en" && this.lg != "es") {
				js.Cookie.remove("safeboxLanguage");
				this.chooseLanguage();
			} else {
				apix.common.display.ElementExtender["delete"](apix.common.util.StringExtender.get("#safeBox #apix_chooseLangBox"));
				this.firstLaunch = false;
				this.startSpinner();
			}
		} else {
			apix.common.display.ElementExtender.show(apix.common.util.StringExtender.get("#safeBox #apix_chooseLangBox"));
			apix.common.display.ElementExtender.visible(apix.common.util.StringExtender.get("#safeBox #apix_chooseLangBox"),true);
			apix.common.event.EventTargetExtender.on(apix.common.util.StringExtender.get("#safeBox #apix_enLang"),"click",$bind(this,this.onLangChoosen),false,{ lg : "en"});
			apix.common.event.EventTargetExtender.on(apix.common.util.StringExtender.get("#safeBox #apix_frLang"),"click",$bind(this,this.onLangChoosen),false,{ lg : "fr"});
			apix.common.event.EventTargetExtender.on(apix.common.util.StringExtender.get("#safeBox #apix_esLang"),"click",$bind(this,this.onLangChoosen),false,{ lg : "es"});
			this.firstLaunch = true;
		}
	}
	,onLangChoosen: function(e,p) {
		this.lg = p.lg;
		var del = 31536000 * 1000;
		js.Cookie.set("safeboxLanguage",this.lg,del);
		this.startSpinner();
	}
	,startSpinner: function() {
		this.spinner = apix.ui.tools.Spinner.get({ callBack : $bind(this,this.readLanguage)});
		this.spinner.start();
	}
	,readLanguage: function() {
		var ll = new apix.common.io.JsonLoader();
		ll.read.on($bind(this,this.readParam));
		ll.load(cst.BASE_URL + cst.LANGUAGE_PATH + this.lg + cst.LANGUAGE_FILE);
	}
	,readParam: function(e) {
		var ll = e.target;
		ll.read.off($bind(this,this.readParam));
		this.lang = e.tree;
		apix.ui.Lang.setLangObject(this.lang);
		ll.read.on($bind(this,this.start));
		ll.load(cst.BASE_URL + cst.MODEL_SRC);
	}
	,start: function(e) {
		var ll = e.target;
		ll.read.off($bind(this,this.start));
		this.param = e.tree;
		new mybox.SafeBox(cst.BASE_URL,cst.SERVER_URL,this.lang,this.param,this.firstLaunch);
	}
	,__class__: Main
};
var IMap = function() { };
IMap.__name__ = ["IMap"];
Math.__name__ = ["Math"];
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
var Std = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
};
var XmlType = { __ename__ : true, __constructs__ : [] };
var Xml = function() {
};
Xml.__name__ = ["Xml"];
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
};
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new haxe.ds.StringMap();
	r.set_nodeName(name);
	return r;
};
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.set_nodeValue(data);
	return r;
};
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.set_nodeValue(data);
	return r;
};
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.set_nodeValue(data);
	return r;
};
Xml.createProcessingInstruction = function(data) {
	var r = new Xml();
	r.nodeType = Xml.ProcessingInstruction;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
};
Xml.prototype = {
	get_nodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,set_nodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,get_nodeValue: function() {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue;
	}
	,set_nodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,attributes: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.keys();
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k1 = this.cur;
			var l1 = this.x.length;
			while(k1 < l1) {
				var n = this.x[k1];
				k1 += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k1;
					return n;
				}
			}
			return null;
		}};
	}
	,firstChild: function() {
		if(this._children == null) throw "bad nodetype";
		return this._children[0];
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,__class__: Xml
};
var apix = {};
apix.common = {};
apix.common.display = {};
apix.common.display.Alert = function(el,txElem,bElem,tEl,tTx,vTx) {
	if(vTx == null) vTx = "Enter";
	if(tTx == null) tTx = "Alert !";
	this.ctnrElem = el;
	this.titleElem = tEl;
	this.textElem = txElem;
	this.validElem = bElem;
	this.defTitleLabel = tTx;
	this.defValidLabel = vTx;
	this.enable();
};
apix.common.display.Alert.__name__ = ["apix","common","display","Alert"];
apix.common.display.Alert.prototype = {
	enable: function() {
		apix.common.display.ElementExtender.on(this.validElem,"click",$bind(this,this.onValid));
		this.alertFunction = $bind(this,this.display);
		apix.common.util.Global.alertFunction = $bind(this,this.display);
		return this;
	}
	,onValid: function(e) {
		apix.common.display.ElementExtender.clearEnterKeyToClick(this.validElem);
		apix.common.display.ElementExtender.hide(this.ctnrElem);
		if(this.callBack != null) this.callBack();
	}
	,display: function(v,cb,titleLabel,validLabel) {
		if(v == null) v = "";
		if((v instanceof Array) && v.__enum__ == null) {
			var arr = v;
			v = "";
			var _g1 = 0;
			var _g = arr.length;
			while(_g1 < _g) {
				var i = _g1++;
				v += arr[i];
			}
		}
		if(apix.common.util.Global.get().strVal(v,"") == "") v = "Alert.display() : Programming error in assign message ! May be dont use 'lang' object";
		if(titleLabel != null) apix.common.display.ElementExtender.inner(this.titleElem,titleLabel); else apix.common.display.ElementExtender.inner(this.titleElem,this.defTitleLabel);
		if(validLabel != null) apix.common.display.ElementExtender.inner(this.validElem,validLabel); else apix.common.display.ElementExtender.inner(this.validElem,this.defValidLabel);
		this.callBack = cb;
		apix.common.display.ElementExtender.show(this.ctnrElem);
		apix.common.display.ElementExtender.visible(this.ctnrElem,true);
		apix.common.display.ElementExtender.inner(this.textElem,v);
		apix.common.display.ElementExtender.joinEnterKeyToClick(this.validElem);
	}
	,__class__: apix.common.display.Alert
};
apix.common.display.Common = function() { };
apix.common.display.Common.__name__ = ["apix","common","display","Common"];
apix.common.display.Common.htmlToElem = function(v) {
	var tmp = apix.common.display.Common.createElem(null);
	tmp.innerHTML = v;
	if(tmp.firstElementChild == null) haxe.Log.trace("f::String '" + v + "' can't be converted to HtmlElement !'",{ fileName : "Common.hx", lineNumber : 71, className : "apix.common.display.Common", methodName : "htmlToElem"});
	return tmp.firstElementChild;
};
apix.common.display.Common.createElem = function(tag) {
	if(tag == null) tag = "div";
	var str = Std.string(tag);
	return window.document.createElement(str);
};
apix.common.display.Common.toClipBoard = function() {
	var ret;
	try {
		ret = document.execCommand('copy') ;
	} catch( err ) {
		if( js.Boot.__instanceof(err,String) ) {
			ret = false;
		} else throw(err);
	}
	return ret;
};
apix.common.display.Common.open = function(url,lab,opt) {
	window.open(url,lab,opt);
};
apix.common.display.Common.get_head = function() {
	return window.document.head;
};
apix.common.display.Common.get_body = function() {
	return window.document.body;
};
apix.common.display.Common.get_documentElement = function() {
	return window.document.documentElement;
};
apix.common.display.Common.get_availWidth = function() {
	return window.screen.availWidth;
};
apix.common.display.Common.get_availHeight = function() {
	return window.screen.availHeight;
};
apix.common.display.Common.get_screenWidth = function() {
	return apix.common.display.Common.get_availWidth();
};
apix.common.display.Common.get_screenHeight = function() {
	return apix.common.display.Common.get_availHeight();
};
apix.common.display.Common.get_windowWidth = function() {
	return window.innerWidth;
};
apix.common.display.Common.get_windowHeight = function() {
	return window.innerHeight;
};
apix.common.display.Common.get_userAgent = function() {
	return window.navigator.userAgent;
};
apix.common.display.Common.get_newSingleId = function() {
	apix.common.display.Common.__nextSingleId++;
	var id = "apix_instance_" + apix.common.display.Common.__nextSingleId;
	if(window.document.getElementById(id) != null) haxe.Log.trace("f::Id " + id + " already exists ! ",{ fileName : "Common.hx", lineNumber : 259, className : "apix.common.display.Common", methodName : "get_newSingleId"});
	return id;
};
apix.common.display.Confirm = function(el,txElem,bvElem,bcElem,tEl,tTx,vTx,cTx) {
	if(cTx == null) cTx = "No";
	if(vTx == null) vTx = "Yes";
	if(tTx == null) tTx = "Confirm ?";
	this.cancelElem = bcElem;
	this.defCancelLabel = cTx;
	apix.common.display.Alert.call(this,el,txElem,bvElem,tEl,tTx,vTx);
	apix.common.display.Confirm._instance = this;
};
apix.common.display.Confirm.__name__ = ["apix","common","display","Confirm"];
apix.common.display.Confirm.get = function() {
	if(apix.common.display.Confirm._instance == null) haxe.Log.trace("f:: new Confirm() not executed !",{ fileName : "Confirm.hx", lineNumber : 36, className : "apix.common.display.Confirm", methodName : "get"});
	return apix.common.display.Confirm._instance;
};
apix.common.display.Confirm.__super__ = apix.common.display.Alert;
apix.common.display.Confirm.prototype = $extend(apix.common.display.Alert.prototype,{
	show: function(v,cb,titleLabel,validLabel,cancelLabel) {
		if((v instanceof Array) && v.__enum__ == null) {
			var arr = v;
			v = "";
			var _g1 = 0;
			var _g = arr.length;
			while(_g1 < _g) {
				var i = _g1++;
				v += arr[i];
			}
		}
		if(titleLabel != null) apix.common.display.ElementExtender.inner(this.titleElem,titleLabel); else apix.common.display.ElementExtender.inner(this.titleElem,this.defTitleLabel);
		if(validLabel != null) apix.common.display.ElementExtender.inner(this.validElem,validLabel); else apix.common.display.ElementExtender.inner(this.validElem,this.defValidLabel);
		if(cancelLabel != null) apix.common.display.ElementExtender.inner(this.cancelElem,cancelLabel); else apix.common.display.ElementExtender.inner(this.cancelElem,this.defCancelLabel);
		this.confirmCallBack = cb;
		apix.common.display.ElementExtender.show(this.ctnrElem);
		apix.common.display.ElementExtender.visible(this.ctnrElem,true);
		apix.common.display.ElementExtender.inner(this.textElem,v);
		apix.common.display.ElementExtender.joinEnterKeyToClick(this.cancelElem);
	}
	,hide: function() {
		apix.common.display.ElementExtender.hide(this.ctnrElem);
	}
	,enable: function() {
		apix.common.display.ElementExtender.on(this.validElem,"click",$bind(this,this.onValid));
		apix.common.display.ElementExtender.on(this.cancelElem,"click",$bind(this,this.onCancel));
		this.confirmCallBack = null;
		return this;
	}
	,onValid: function(e) {
		apix.common.display.ElementExtender.clearEnterKeyToClick(this.cancelElem);
		if(this.confirmCallBack != null) {
			this.confirmCallBack(true,this);
			this.confirmCallBack = null;
		}
	}
	,onCancel: function(e) {
		apix.common.display.ElementExtender.clearEnterKeyToClick(this.cancelElem);
		this.hide();
		if(this.confirmCallBack != null) {
			this.confirmCallBack(false,this);
			this.confirmCallBack = null;
		}
	}
	,__class__: apix.common.display.Confirm
});
apix.common.display.ElementExtender = function() { };
apix.common.display.ElementExtender.__name__ = ["apix","common","display","ElementExtender"];
apix.common.display.ElementExtender.toBase64Url = function(el) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 189, className : "apix.common.display.ElementExtender", methodName : "toBase64Url"});
	if(el.toDataURL==null) haxe.Log.trace("f::Element " + el.id + " hasn't Base64 Url ",{ fileName : "ElementExtender.hx", lineNumber : 190, className : "apix.common.display.ElementExtender", methodName : "toBase64Url"});
	return el.toDataURL("image/png");
};
apix.common.display.ElementExtender.toBase64 = function(el) {
	var s = "base64,";
	var str = apix.common.display.ElementExtender.toBase64Url(el);
	if(str.length == 0) return ""; else {
		var pos = str.indexOf(s) + s.length;
		return HxOverrides.substr(str,pos,null);
	}
};
apix.common.display.ElementExtender.getContext2D = function(el) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 198, className : "apix.common.display.ElementExtender", methodName : "getContext2D"});
	if(el.getContext('2d')==null) haxe.Log.trace("f::Element " + el.id + " hasn't Context",{ fileName : "ElementExtender.hx", lineNumber : 199, className : "apix.common.display.ElementExtender", methodName : "getContext2D"});
	return el.getContext("2d");
};
apix.common.display.ElementExtender.getElemsByClass = function(el,v) {
	return el.getElementsByClassName(v);
};
apix.common.display.ElementExtender.getElemsByTag = function(el,v) {
	return el.getElementsByTagName(v);
};
apix.common.display.ElementExtender.elemByClass = function(el,v) {
	var arr = apix.common.display.ElementExtender.getElemsByClass(el,v);
	if(arr.length == 0) haxe.Log.trace("f:: class '" + v + "' doesn't exist in element with id '" + el.id + "'",{ fileName : "ElementExtender.hx", lineNumber : 211, className : "apix.common.display.ElementExtender", methodName : "elemByClass"});
	return arr[0];
};
apix.common.display.ElementExtender.elemByTag = function(el,v) {
	var arr = apix.common.display.ElementExtender.getElemsByTag(el,v);
	if(arr.length == 0) haxe.Log.trace("f:: tag '" + v + "' doesn't exist in element with id '" + el.id + "'",{ fileName : "ElementExtender.hx", lineNumber : 216, className : "apix.common.display.ElementExtender", methodName : "elemByTag"});
	return arr[0];
};
apix.common.display.ElementExtender.setId = function(el,v) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 220, className : "apix.common.display.ElementExtender", methodName : "setId"});
	el.id = v;
	return el;
};
apix.common.display.ElementExtender.getId = function(el) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 225, className : "apix.common.display.ElementExtender", methodName : "getId"});
	return el.id;
};
apix.common.display.ElementExtender.objClsName = function(el) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 260, className : "apix.common.display.ElementExtender", methodName : "objClsName"});
	var v = "";
	v=el.constructor.name;
	if(v == null) {
		 v=  Object.prototype.toString.call(el).slice(8, -1)  ;
	}
	return v;
};
apix.common.display.ElementExtender.isEmpty = function(el) {
	if(el.children != null && el.children.length > 0) return false; else return true;
};
apix.common.display.ElementExtender.addChild = function(el,v) {
	return el.appendChild(v);
};
apix.common.display.ElementExtender.hasChild = function(el,v) {
	return apix.common.display.ElementExtender.parent(v) == el;
};
apix.common.display.ElementExtender.removeChildren = function(el) {
	if(el.hasChildNodes()) while(el.childNodes.length > 0) el.removeChild(el.firstChild);
};
apix.common.display.ElementExtender["delete"] = function(el) {
	if(el.parentNode != null) {
		el.parentNode.removeChild(el);
		return true;
	} else return false;
};
apix.common.display.ElementExtender.forEachChildren = function(el,f) {
	var _g = 0;
	var _g1 = el.children;
	while(_g < _g1.length) {
		var child = _g1[_g];
		++_g;
		f(child);
	}
};
apix.common.display.ElementExtender.clone = function(el,b) {
	if(b == null) b = true;
	var e = el.cloneNode(b);
	return e;
};
apix.common.display.ElementExtender.positionInWindow = function(el) {
	var v = new apix.common.tools.math.Vector(0,0);
	do {
		var _g = v;
		_g.set_x(_g.get_x() + (el.offsetLeft - el.scrollLeft));
		var _g1 = v;
		_g1.set_y(_g1.get_y() + (el.offsetTop - el.scrollTop));
		el = el.offsetParent;
	} while(el != null);
	if(apix.common.util.Global.get().get_isIE() || apix.common.util.Global.get().get_isFirefox()) {
		var _g2 = v;
		_g2.set_x(_g2.get_x() - window.pageXOffset);
		var _g3 = v;
		_g3.set_y(_g3.get_y() - window.pageYOffset);
	}
	return v;
};
apix.common.display.ElementExtender.positionInPage = function(el) {
	var v = apix.common.display.ElementExtender.positionInWindow(el);
	var _g = v;
	_g.set_x(_g.get_x() + window.pageXOffset);
	var _g1 = v;
	_g1.set_y(_g1.get_y() + window.pageYOffset);
	return v;
};
apix.common.display.ElementExtender.getBoundInfo = function(el) {
	var r = el.getBoundingClientRect();
	var ebi = { pageX : null, pageY : null, left : null, right : null, top : null, bottom : null, width : null, height : null, bottomRightX : null, bottomRightY : null};
	var v = apix.common.display.ElementExtender.positionInPage(el);
	ebi.pageX = v.get_x();
	ebi.pageY = v.get_y();
	ebi.left = r.left;
	ebi.right = r.right;
	ebi.top = Math.round(r.top);
	ebi.bottom = Math.round(r.bottom);
	ebi.width = r.width;
	ebi.height = r.height;
	ebi.bottomRightX = v.get_x() + r.width;
	ebi.bottomRightY = v.get_y() + r.height;
	return ebi;
};
apix.common.display.ElementExtender.getVector = function(el) {
	var r = apix.common.display.ElementExtender.getBoundInfo(el);
	return new apix.common.tools.math.Vector(r.pageX,r.pageY);
};
apix.common.display.ElementExtender.handCursor = function(el,v) {
	if(v == null) v = true;
	var str;
	if(v) str = "pointer"; else str = "auto";
	if(el.style != null && el.style.cursor != null) el.style.cursor = str;
};
apix.common.display.ElementExtender.visible = function(el,b) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 413, className : "apix.common.display.ElementExtender", methodName : "visible"});
	if(b == null) {
		if(el.style.visibility == "hidden") b = false; else b = true;
		if(b == null) haxe.Log.trace("f::Element " + el.id + " has not valid visibility !",{ fileName : "ElementExtender.hx", lineNumber : 416, className : "apix.common.display.ElementExtender", methodName : "visible"});
	} else {
		b = apix.common.display.ElementExtender.boolVal(b);
		if(b) el.style.visibility = "visible"; else el.style.visibility = "hidden";
	}
	return b;
};
apix.common.display.ElementExtender.hide = function(el) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 428, className : "apix.common.display.ElementExtender", methodName : "hide"});
	var before = el.style.display;
	el.style.display = "none";
	return before;
};
apix.common.display.ElementExtender.show = function(el,v) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 434, className : "apix.common.display.ElementExtender", methodName : "show"});
	if(!(!(apix.common.util.Global.get().strVal(el.style.display,"none") == "none")) || v != null) if(v == null) el.style.display = "block"; else el.style.display = v;
};
apix.common.display.ElementExtender.isDisplay = function(el) {
	return !(apix.common.util.Global.get().strVal(el.style.display,"none") == "none");
};
apix.common.display.ElementExtender.setDisplay = function(el,v) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 445, className : "apix.common.display.ElementExtender", methodName : "setDisplay"});
	el.style.display = v;
};
apix.common.display.ElementExtender.pick = function(el) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 449, className : "apix.common.display.ElementExtender", methodName : "pick"});
	if(!apix.common.display.ElementExtender.isInputField(el)) haxe.Log.trace("f::Element isn't an input field !",{ fileName : "ElementExtender.hx", lineNumber : 450, className : "apix.common.display.ElementExtender", methodName : "pick"});
	el.select();
};
apix.common.display.ElementExtender.isInputField = function(el) {
	return apix.common.display.ElementExtender.objClsName(el) == "HTMLTextAreaElement" || apix.common.display.ElementExtender.objClsName(el) == "HTMLInputElement" || js.Boot.__instanceof(el,HTMLInputElement) || js.Boot.__instanceof(el,HTMLTextAreaElement);
};
apix.common.display.ElementExtender.startDrag = function(el,r,ms,forceStopAllDrag) {
	if(forceStopAllDrag == null) forceStopAllDrag = true;
	apix.common.display.ElementExtender.dragArray.push({ elem : el, ox : el.offsetLeft, oy : el.offsetTop, bounds : r, mouseScale : ms});
	var onMouseUp;
	if(forceStopAllDrag == true) onMouseUp = apix.common.display.ElementExtender.stopAllDrag; else onMouseUp = null;
	if(apix.common.util.Global._mouseClock == null) apix.common.util.Global._mouseClock = new apix.common.event.timing.MouseClock(apix.common.display.ElementExtender.onDragClock,onMouseUp);
};
apix.common.display.ElementExtender.stopDrag = function(el) {
	var len = apix.common.display.ElementExtender.dragArray.length;
	var _g = 0;
	while(_g < len) {
		var n = _g++;
		var dei = apix.common.display.ElementExtender.dragArray[n];
		if(dei.elem == el) {
			apix.common.display.ElementExtender.dragArray.splice(n,1);
			break;
		}
	}
	if(apix.common.display.ElementExtender.dragArray.length == 0 && apix.common.util.Global._mouseClock != null) apix.common.util.Global._mouseClock = apix.common.util.Global._mouseClock.remove();
};
apix.common.display.ElementExtender.posx = function(el,v,bounds) {
	var vx = apix.common.display.ElementExtender.numVal(v,null);
	if(vx == null) {
		if(el.offsetLeft != null) vx = el.offsetLeft; else if(el.clientLeft != null) vx = el.clientLeft; else if(el.scrollLeft != null) vx = el.scrollLeft; else vx = apix.common.display.ElementExtender.numVal(Std.parseFloat(el.style.left),null);
		if(vx == null) haxe.Log.trace("f::Element " + el.id + " has not valid left position !",{ fileName : "ElementExtender.hx", lineNumber : 530, className : "apix.common.display.ElementExtender", methodName : "posx"});
	} else {
		if(bounds != null) {
			if(vx < bounds.get_x()) vx = bounds.get_x(); else if(vx > bounds.get_x() + bounds.get_width()) vx = bounds.get_x() + bounds.get_width();
		}
		el.style.left = (vx == null?"null":"" + vx) + "px";
	}
	return vx;
};
apix.common.display.ElementExtender.posy = function(el,v,bounds) {
	var vy = apix.common.display.ElementExtender.numVal(v,null);
	if(vy == null) {
		if(el.offsetTop != null) vy = el.offsetTop; else if(el.clientTop != null) vy = el.clientTop; else if(el.scrollTop != null) vy = el.scrollTop; else vy = apix.common.display.ElementExtender.numVal(Std.parseFloat(el.style.top),null);
		if(vy == null) haxe.Log.trace("f::Element " + el.id + " has not valid top position !",{ fileName : "ElementExtender.hx", lineNumber : 551, className : "apix.common.display.ElementExtender", methodName : "posy"});
	} else {
		if(bounds != null) {
			if(vy < bounds.get_y()) vy = bounds.get_y(); else if(vy > bounds.get_y() + bounds.get_height()) vy = bounds.get_y() + bounds.get_height();
		}
		el.style.top = (vy == null?"null":"" + vy) + "px";
	}
	return vy;
};
apix.common.display.ElementExtender.width = function(el,v) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 591, className : "apix.common.display.ElementExtender", methodName : "width"});
	var w = apix.common.display.ElementExtender.numVal(v,null);
	if(w == null) {
		if(el.clientWidth != null) w = el.clientWidth; else w = apix.common.display.ElementExtender.numVal(Std.parseFloat(el.style.width),null);
		if(w == null) {
			if(el.offsetWidth != null) w = el.offsetWidth; else if(el.scrollWidth != null) w = el.scrollWidth;
		}
		if(w == 0 && el.style.width != "") w = Std.parseFloat(el.style.width);
		if(w == null) haxe.Log.trace("f::Element " + el.id + " has not valid width !",{ fileName : "ElementExtender.hx", lineNumber : 601, className : "apix.common.display.ElementExtender", methodName : "width"});
	} else el.style.width = (w == null?"null":"" + w) + "px";
	return w;
};
apix.common.display.ElementExtender.height = function(el,v,forceCss) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 610, className : "apix.common.display.ElementExtender", methodName : "height"});
	var h = apix.common.display.ElementExtender.numVal(v,null);
	if(h == null) {
		if(el.clientHeight != null && (!forceCss || el.clientHeight != 0)) h = el.clientHeight; else h = apix.common.display.ElementExtender.numVal(Std.parseFloat(el.style.height),null);
		if(h == null) {
			if(el.offsetHeight != null) h = el.offsetHeight; else if(el.scrollHeight != null) h = el.scrollHeight;
		}
		if(h == 0 && el.style.height != "") h = Std.parseFloat(el.style.height);
		if(h == null) haxe.Log.trace("f::Element " + el.id + " has not valid height !",{ fileName : "ElementExtender.hx", lineNumber : 620, className : "apix.common.display.ElementExtender", methodName : "height"});
	} else el.style.height = (h == null?"null":"" + h) + "px";
	return h;
};
apix.common.display.ElementExtender.parent = function(el) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 629, className : "apix.common.display.ElementExtender", methodName : "parent"});
	return el.parentElement;
};
apix.common.display.ElementExtender.link = function(el,v,verify) {
	if(verify == null) verify = false;
	return apix.common.display.ElementExtender.attr(el,"href",v,verify);
};
apix.common.display.ElementExtender.attr = function(el,k,v,verify) {
	if(verify == null) verify = false;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 642, className : "apix.common.display.ElementExtender", methodName : "attr"});
	if(verify && el.getAttribute(k) == null && el[k]==null) haxe.Log.trace("f::Element " + el.id + " has not '" + k + "' attribute !",{ fileName : "ElementExtender.hx", lineNumber : 643, className : "apix.common.display.ElementExtender", methodName : "attr"});
	if(v == null) v = el.getAttribute(k); else el.setAttribute(k,v);
	return v;
};
apix.common.display.ElementExtender.attrib = function(el,k,v,verify) {
	if(verify == null) verify = false;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 650, className : "apix.common.display.ElementExtender", methodName : "attrib"});
	if(el[k]==null) haxe.Log.trace("f::Element " + el.id + " hasn't '" + Std.string(k) + "' attribute !",{ fileName : "ElementExtender.hx", lineNumber : 651, className : "apix.common.display.ElementExtender", methodName : "attrib"});
	if(v == null) v = el[k]; else {
		el[k]=v;
	}
	return v;
};
apix.common.display.ElementExtender.prop = function(el,k,v) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 661, className : "apix.common.display.ElementExtender", methodName : "prop"});
	if(el[k]==null) haxe.Log.trace("f::Element " + el.id + " hasn't '" + k + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 662, className : "apix.common.display.ElementExtender", methodName : "prop"});
	if(v == null) v = el[k]; else {
		el[k]=v;
	}
	return v;
};
apix.common.display.ElementExtender.css = function(el,k,v) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 672, className : "apix.common.display.ElementExtender", methodName : "css"});
	if(el.style[k]==null) haxe.Log.trace("f::Element " + el.id + " hasn't '" + k + "' style property !",{ fileName : "ElementExtender.hx", lineNumber : 673, className : "apix.common.display.ElementExtender", methodName : "css"});
	if(v == null) v = el.style[k]; else {
		el.style[k]=v;
	}
	return v;
};
apix.common.display.ElementExtender.cssStyle = function(el,k,v) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 680, className : "apix.common.display.ElementExtender", methodName : "cssStyle"});
	if(el.style[k]==null) haxe.Log.trace("f::Element " + el.id + " hasn't '" + Std.string(k) + "' style property !",{ fileName : "ElementExtender.hx", lineNumber : 681, className : "apix.common.display.ElementExtender", methodName : "cssStyle"});
	if(v == null) v = el.style[k]; else {
		el.style[k]=v;
	}
	return v;
};
apix.common.display.ElementExtender.enable = function(el,v,useDisabled) {
	if(useDisabled == null) useDisabled = false;
	var e = el;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 689, className : "apix.common.display.ElementExtender", methodName : "enable"});
	if(v == null) {
		if(useDisabled) v = !e.disabled; else v = !e.readOnly;
	} else if(useDisabled) e.disabled = !v; else e.readOnly = !v;
	return v;
};
apix.common.display.ElementExtender.hasClass = function(el,v) {
	return new EReg("/[\n\t\r]/g","i").replace(" " + el.className + " "," ").indexOf(" " + v + " ") > -1;
};
apix.common.display.ElementExtender.addClass = function(el,v) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 724, className : "apix.common.display.ElementExtender", methodName : "addClass"});
	var prop = "classList";
	if(el[prop]==null) haxe.Log.trace("f::Element " + el.id + " has not '" + prop + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 725, className : "apix.common.display.ElementExtender", methodName : "addClass"});
	if(apix.common.display.ElementExtender.hasClass(el,v)) return false; else {
		el.classList.add(v);
		return true;
	}
};
apix.common.display.ElementExtender.inputType = function(e,v) {
	var el = e;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 748, className : "apix.common.display.ElementExtender", methodName : "inputType"});
	var prop = "type";
	if(el[prop]==null) haxe.Log.trace("f::Element " + Std.string(el.id) + " has not '" + prop + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 749, className : "apix.common.display.ElementExtender", methodName : "inputType"});
	if(v == null) v = el.type; else if(js.Boot.__instanceof(el,HTMLInputElement)) el.type = v;
	return v;
};
apix.common.display.ElementExtender.type = function(e,v) {
	var el = e;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 758, className : "apix.common.display.ElementExtender", methodName : "type"});
	var prop = "type";
	if(el[prop]==null) haxe.Log.trace("f::Element " + Std.string(el.id) + " has not '" + prop + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 759, className : "apix.common.display.ElementExtender", methodName : "type"});
	if(v == null) el.type; else el.type = v;
	return v;
};
apix.common.display.ElementExtender.step = function(e,v) {
	var el = e;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 768, className : "apix.common.display.ElementExtender", methodName : "step"});
	var prop = "step";
	if(el[prop]==null) haxe.Log.trace("f::Element " + Std.string(el.id) + " has not '" + prop + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 769, className : "apix.common.display.ElementExtender", methodName : "step"});
	if(v == null) v = el.step; else el.step = v;
	return v;
};
apix.common.display.ElementExtender.value = function(e,v) {
	var el = e;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 780, className : "apix.common.display.ElementExtender", methodName : "value"});
	var prop = "value";
	if(el[prop]==null) haxe.Log.trace("f::Element " + Std.string(el.id) + " has not '" + prop + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 781, className : "apix.common.display.ElementExtender", methodName : "value"});
	if(v == null) v = el.value; else el.value = v;
	return v;
};
apix.common.display.ElementExtender.$name = function(e,v) {
	var el = e;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 791, className : "apix.common.display.ElementExtender", methodName : "name"});
	var p = "name";
	if(el[p]==null) haxe.Log.trace("f::Element " + Std.string(el.id) + " hasn't '" + p + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 792, className : "apix.common.display.ElementExtender", methodName : "name"});
	if(v == null) v = el.name; else el.name = v;
	return v;
};
apix.common.display.ElementExtender.tip = function(e,v) {
	return apix.common.display.ElementExtender.attr(e,"title",v);
};
apix.common.display.ElementExtender.inner = function(el,v) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 807, className : "apix.common.display.ElementExtender", methodName : "inner"});
	if(v == null) v = el.innerHTML; else el.innerHTML = v;
	return v;
};
apix.common.display.ElementExtender.text = function(e,v) {
	var el = e;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 822, className : "apix.common.display.ElementExtender", methodName : "text"});
	if(v == null) {
		if(el.value != null) v = el.value; else if(el.textContent != null) v = el.textContent; else if(el.text != null) v = el.text; else if(el.nodeValue != null) v = el.nodeValue; else if(el.innerHTML != null) v = el.innerHTML; else haxe.Log.trace("f::Element " + Std.string(el.id) + " has not text, nor inner property !",{ fileName : "ElementExtender.hx", lineNumber : 829, className : "apix.common.display.ElementExtender", methodName : "text"});
	} else if(el.value != null) el.value = v; else if(el.textContent != null) el.textContent = v; else if(el.text != null) el.text = v; else if(el.nodeValue != null) el.nodeValue = v; else if(el.innerHTML != null) el.innerHTML = v; else haxe.Log.trace("f::Element " + Std.string(el.id) + " has not text, nor inner property !",{ fileName : "ElementExtender.hx", lineNumber : 837, className : "apix.common.display.ElementExtender", methodName : "text"});
	return v;
};
apix.common.display.ElementExtender.selected = function(e,v) {
	var el = e;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 851, className : "apix.common.display.ElementExtender", methodName : "selected"});
	var prop1 = "selected";
	var prop2 = "checked";
	var prop = "selected or checked";
	if(el[prop1]==null && el[prop2]==null ) haxe.Log.trace("f::Element " + Std.string(el.id) + " has not '" + prop + "' properties !",{ fileName : "ElementExtender.hx", lineNumber : 853, className : "apix.common.display.ElementExtender", methodName : "selected"});
	var b = el[prop1]==null;
	if(v == null) {
		if(b) v = el.checked; else v = el.selected;
	} else if(b) el.checked = v; else el.selected = v;
	return v;
};
apix.common.display.ElementExtender.addOption = function(el) {
	if(!js.Boot.__instanceof(el,HTMLSelectElement)) haxe.Log.trace("f::Element " + el.id + " isn't SelectElement !",{ fileName : "ElementExtender.hx", lineNumber : 869, className : "apix.common.display.ElementExtender", methodName : "addOption"});
	return apix.common.display.ElementExtender.addChild(el,window.document.createElement("option"));
};
apix.common.display.ElementExtender.getOption = function(el,v) {
	if(v == null) v = 0;
	if(!js.Boot.__instanceof(el,HTMLSelectElement)) haxe.Log.trace("f::Element " + el.id + " isn't SelectElement !",{ fileName : "ElementExtender.hx", lineNumber : 876, className : "apix.common.display.ElementExtender", methodName : "getOption"});
	var sel = el;
	if(v < 0 || v > sel.options.length - 1) haxe.Log.trace("f::Element out of range",{ fileName : "ElementExtender.hx", lineNumber : 878, className : "apix.common.display.ElementExtender", methodName : "getOption"});
	return sel.options[v];
};
apix.common.display.ElementExtender.getOptions = function(el) {
	if(!js.Boot.__instanceof(el,HTMLSelectElement)) haxe.Log.trace("f::Element " + el.id + " isn't SelectElement !",{ fileName : "ElementExtender.hx", lineNumber : 882, className : "apix.common.display.ElementExtender", methodName : "getOptions"});
	var sel = el;
	return sel.options;
};
apix.common.display.ElementExtender.getOptionsByValue = function(el,arrs) {
	var p = "options";
	if(el[p]==null) haxe.Log.trace("f::Element " + el.id + " hasn't '" + p + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 887, className : "apix.common.display.ElementExtender", methodName : "getOptionsByValue"});
	var sel = el;
	var arr = [];
	var len = sel.options.length;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		var opt = sel.options[i];
		var match = false;
		var _g1 = 0;
		while(_g1 < arrs.length) {
			var s = arrs[_g1];
			++_g1;
			if(opt.value == s) match = true;
		}
		if(match) arr.push({ text : opt.text, value : opt.value, index : opt.index});
	}
	return arr;
};
apix.common.display.ElementExtender.getSelectedOptions = function(el) {
	var p = "options";
	if(el[p]==null) haxe.Log.trace("f::Element " + el.id + " hasn't '" + p + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 902, className : "apix.common.display.ElementExtender", methodName : "getSelectedOptions"});
	p = "multiple";
	if(el[p]==null) haxe.Log.trace("f::Element " + el.id + " hasn't '" + p + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 903, className : "apix.common.display.ElementExtender", methodName : "getSelectedOptions"});
	var sel = el;
	var arr = [];
	if(sel.multiple) {
		var len = sel.options.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var opt = sel.options[i];
			if(opt.selected) arr.push({ text : opt.text, value : opt.value, index : opt.index});
		}
	} else {
		var opt1 = sel.options[sel.selectedIndex];
		arr.push({ text : opt1.text, value : opt1.value, index : opt1.index});
	}
	return arr;
};
apix.common.display.ElementExtender.getSelectedOption = function(el) {
	var p = "options";
	if(el[p]==null) haxe.Log.trace("f::Element " + el.id + " hasn't '" + p + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 922, className : "apix.common.display.ElementExtender", methodName : "getSelectedOption"});
	p = "multiple";
	if(el[p]==null) haxe.Log.trace("f::Element " + el.id + " hasn't '" + p + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 923, className : "apix.common.display.ElementExtender", methodName : "getSelectedOption"});
	var sel = el;
	if(sel.multiple) haxe.Log.trace("f::Element " + el.id + " has multiple selected options !",{ fileName : "ElementExtender.hx", lineNumber : 925, className : "apix.common.display.ElementExtender", methodName : "getSelectedOption"});
	return apix.common.display.ElementExtender.getSelectedOptions(sel)[0];
};
apix.common.display.ElementExtender.placeHolder = function(e,v) {
	var el = e;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 933, className : "apix.common.display.ElementExtender", methodName : "placeHolder"});
	var p = "placeholder";
	if(el[p]==null) haxe.Log.trace("f::Element " + Std.string(el.id) + " hasn't '" + p + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 934, className : "apix.common.display.ElementExtender", methodName : "placeHolder"});
	if(v == null) v = el.placeholder; else el.placeholder = v;
	return v;
};
apix.common.display.ElementExtender.multiple = function(e,v) {
	var el = e;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 943, className : "apix.common.display.ElementExtender", methodName : "multiple"});
	var p = "multiple";
	if(el[p]==null) haxe.Log.trace("f::Element " + Std.string(el.id) + " hasn't '" + p + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 944, className : "apix.common.display.ElementExtender", methodName : "multiple"});
	if(v == null) v = el.multiple; else el.multiple = v;
	return v;
};
apix.common.display.ElementExtender.joinEnterKeyToClick = function(el,buttonArray,focusElem) {
	var activeEl = null;
	if(focusElem != null) focusElem.focus(); else el.focus();
	if(buttonArray == null) buttonArray = [];
	buttonArray.push(el);
	window.onkeypress = function(e) {
		if(e.keyCode == 13) {
			var _g = 0;
			while(_g < buttonArray.length) {
				var button = buttonArray[_g];
				++_g;
				if(button == window.document.activeElement) activeEl = window.document.activeElement;
			}
			if(activeEl == null) {
				var evt = new Event("click");
				el.dispatchEvent(evt);
			}
		}
	};
};
apix.common.display.ElementExtender.clearEnterKeyToClick = function(el) {
	window.onkeypress = null;
};
apix.common.display.ElementExtender.setFocus = function(el) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 978, className : "apix.common.display.ElementExtender", methodName : "setFocus"});
	el.focus();
};
apix.common.display.ElementExtender.on = function(srcEvt,type,listenerFunction,b,data) {
	if(b == null) b = false;
	if(apix.common.event.StandardEvent.isMouseType(type)) apix.common.display.ElementExtender.handCursor(srcEvt);
	var deleguateFunction = apix.common.display.ElementExtender.getLst(srcEvt,listenerFunction,data);
	var el = srcEvt;
	if(el.listeners == null) el.listeners = [];
	el.listeners.push({ type : type, listenerFunction : listenerFunction, deleguateFunction : deleguateFunction});
	srcEvt.addEventListener(type,deleguateFunction,b);
};
apix.common.display.ElementExtender.off = function(srcEvt,type,listenerFunction,b) {
	if(b == null) b = false;
	if(listenerFunction == null || type == null) apix.common.display.ElementExtender.removeAllListener(srcEvt,type,null,b); else if(!apix.common.display.ElementExtender.removeDelegateListener(srcEvt,type,listenerFunction,b)) srcEvt.removeEventListener(type,listenerFunction,b);
	if(!apix.common.display.ElementExtender.hasLst(srcEvt) && apix.common.event.StandardEvent.isMouseType(type)) apix.common.display.ElementExtender.handCursor(srcEvt,false);
};
apix.common.display.ElementExtender.hasLst = function(srcEvt,type,listenerFunction) {
	var el = srcEvt;
	var ret = false;
	if(el.listeners != null) {
		var len = el.listeners.length;
		var _g = 0;
		while(_g < len) {
			var n = _g++;
			var i = el.listeners[n];
			if(type == null) {
				ret = true;
				break;
			} else if(i.type == type) {
				if(listenerFunction == null) ret = true; else if(Reflect.compareMethods(i.listenerFunction,listenerFunction)) ret = true;
				if(ret) break;
			}
		}
	}
	return ret;
};
apix.common.display.ElementExtender.getLst = function(srcEvt,listenerFunction,data) {
	var deleguateFunction;
	if(data == null) deleguateFunction = listenerFunction; else deleguateFunction = function(e) {
		listenerFunction.call(srcEvt,e,data);
	};
	return deleguateFunction;
};
apix.common.display.ElementExtender.removeAllListener = function(srcEvt,type,listenerFunction,b) {
	if(b == null) b = false;
	var el = srcEvt;
	if(el.listeners != null) {
		var len = el.listeners.length;
		var _g = 0;
		while(_g < len) {
			var n = _g++;
			var i = el.listeners[n];
			if(i.type == type || type == null) {
				if(i.deleguateFunction != null) srcEvt.removeEventListener(i.type,i.deleguateFunction,b); else if(i.listenerFunction != null) srcEvt.removeEventListener(i.type,i.listenerFunction,b);
				el.listeners.splice(n,1);
				apix.common.display.ElementExtender.removeAllListener(srcEvt,type,null,b);
				break;
			}
		}
	}
};
apix.common.display.ElementExtender.removeDelegateListener = function(srcEvt,type,listenerFunction,b) {
	if(b == null) b = false;
	var match = false;
	var el = srcEvt;
	if(el.listeners != null) {
		var len = el.listeners.length;
		var _g = 0;
		while(_g < len) {
			var n = _g++;
			var i = el.listeners[n];
			if(Reflect.compareMethods(i.listenerFunction,listenerFunction)) {
				if(i.type == type) {
					if(i.deleguateFunction != null) srcEvt.removeEventListener(type,i.deleguateFunction,b);
					el.listeners.splice(n,1);
					match = true;
					break;
				}
			}
		}
	}
	return match;
};
apix.common.display.ElementExtender.boolVal = function(b,defVal) {
	if(defVal == null) defVal = false;
	if(b == null) return defVal;
	if(typeof(b) == "string") {
		if(b == "true") return true; else if(b == "false") return false; else return defVal;
	} else if(typeof(b) == "number") {
		if(b == 0) return false; else if(b == 1) return true; else return defVal;
	} else if(typeof(b) == "boolean") return b;
	return defVal;
};
apix.common.display.ElementExtender.numVal = function(n,defVal) {
	if(n == "0") return Std.parseFloat("0");
	if(n == null) return defVal;
	if(Math.isNaN(n)) return defVal;
	if(n == "") return defVal;
	if(typeof(n) == "string") return Std.parseFloat(n);
	return Math.pow(n,1);
};
apix.common.display.ElementExtender.onDragClock = function(clk) {
	var msx = 1.0;
	var msy = 1.0;
	var _g = 0;
	var _g1 = apix.common.display.ElementExtender.dragArray;
	while(_g < _g1.length) {
		var o = _g1[_g];
		++_g;
		if(o.mouseScale != null) {
			msx = o.mouseScale.get_x();
			msy = o.mouseScale.get_y();
		}
		apix.common.display.ElementExtender.posx(o.elem,o.ox + clk.x * msx,o.bounds);
		apix.common.display.ElementExtender.posy(o.elem,o.oy + clk.y * msy,o.bounds);
	}
};
apix.common.display.ElementExtender.stopAllDrag = function(e) {
	if(apix.common.util.Global._mouseClock != null) apix.common.util.Global._mouseClock = apix.common.util.Global._mouseClock.remove();
	apix.common.display.ElementExtender.dragArray = [];
};
apix.common.event = {};
apix.common.event.EventSource = function() {
	this._listenerArray = [];
};
apix.common.event.EventSource.__name__ = ["apix","common","event","EventSource"];
apix.common.event.EventSource.prototype = {
	on: function(listener,data) {
		this._listenerArray.push({ listener : listener, data : data});
		return true;
	}
	,off: function(listener) {
		var match = false;
		if(listener == null) {
			this._listenerArray = [];
			match = true;
		} else {
			var _g = 0;
			var _g1 = this._listenerArray;
			while(_g < _g1.length) {
				var o = _g1[_g];
				++_g;
				if(Reflect.compareMethods(listener,o.listener)) {
					var x = o;
					HxOverrides.remove(this._listenerArray,x);
					this.off(listener);
					match = true;
					break;
				}
			}
		}
		return match;
	}
	,dispatch: function(e) {
		var ret = null;
		if(e.target == null) e.target = this;
		var _g = 0;
		var _g1 = this._listenerArray;
		while(_g < _g1.length) {
			var o = _g1[_g];
			++_g;
			if(o.data != null) e.data = o.data;
			ret = o.listener(e);
		}
		return ret;
	}
	,hasListener: function() {
		return this._listenerArray.length != 0;
	}
	,__class__: apix.common.event.EventSource
};
apix.common.event.EventTargetExtender = function() { };
apix.common.event.EventTargetExtender.__name__ = ["apix","common","event","EventTargetExtender"];
apix.common.event.EventTargetExtender.on = function(srcEvt,type,listenerFunction,b,data) {
	if(b == null) b = false;
	var deleguateFunction = apix.common.event.EventTargetExtender.getLst(srcEvt,listenerFunction,data);
	var el = srcEvt;
	if(el.listeners == null) el.listeners = [];
	el.listeners.push({ type : type, listenerFunction : listenerFunction, deleguateFunction : deleguateFunction});
	srcEvt.addEventListener(type,deleguateFunction,b);
};
apix.common.event.EventTargetExtender.getLst = function(srcEvt,listenerFunction,data) {
	var deleguateFunction;
	if(data == null) deleguateFunction = listenerFunction; else deleguateFunction = function(e) {
		listenerFunction.call(srcEvt,e,data);
	};
	return deleguateFunction;
};
apix.common.event.MouseTouchEvent = function() { };
apix.common.event.MouseTouchEvent.__name__ = ["apix","common","event","MouseTouchEvent"];
apix.common.event.MouseTouchEvent.getVector = function(e) {
	var g = apix.common.util.Global.get();
	var ex;
	var v;
	if(g.get_isMobile()) {
		if(e.changedTouches == null) v = e.pageX; else v = e.changedTouches[0].pageX;
	} else v = e.pageX;
	ex = Math.round(v);
	var ey;
	var v1;
	if(g.get_isMobile()) {
		if(e.changedTouches == null) v1 = e.pageY; else v1 = e.changedTouches[0].pageY;
	} else v1 = e.pageY;
	ey = Math.round(v1);
	return new apix.common.tools.math.Vector(ex,ey);
};
apix.common.event.MouseTouchEvent.__super__ = MouseEvent;
apix.common.event.MouseTouchEvent.prototype = $extend(MouseEvent.prototype,{
	__class__: apix.common.event.MouseTouchEvent
});
apix.common.util = {};
apix.common.util.Global = function() {
};
apix.common.util.Global.__name__ = ["apix","common","util","Global"];
apix.common.util.Global.get_mouseClock = function() {
	if(apix.common.util.Global._mouseClock == null) haxe.Log.trace("f::Mouse Clock isn't enabled ! ",{ fileName : "Global.hx", lineNumber : 63, className : "apix.common.util.Global", methodName : "get_mouseClock"});
	return apix.common.util.Global._mouseClock;
};
apix.common.util.Global.get = function() {
	if(apix.common.util.Global._instance == null) apix.common.util.Global._instance = new apix.common.util.Global();
	return apix.common.util.Global._instance;
};
apix.common.util.Global.apixTrace = function(v,i) {
	var str = Std.string(v);
	var len = str.length;
	if(len > 2 && HxOverrides.substr(str,1,2) == "::") {
		if(HxOverrides.substr(str,0,1) == "e" || HxOverrides.substr(str,0,1) == "f") {
			var d = window.document.getElementById("apix:error");
			if(d != null) {
				str = "<br/>error " + (i != null?"in " + i.fileName + " line " + i.lineNumber:"") + " : " + "<span style='color:#999;'>" + HxOverrides.substr(str,3,len - 3) + "</span>" + "<br/>";
				d.innerHTML += str + "<br/>";
				throw "apix error. See red message in page.";
			} else if(HxOverrides.substr(str,0,1) == "f") {
				var msg = "";
				v = HxOverrides.substr(str,3,len - 3);
				if(window.document.getElementById("haxe:trace") != null) msg = "apix error. See message in page."; else msg = "apix error. See last message above.";
				js.Boot.__trace(v,i);
				throw msg;
			}
		} else if(HxOverrides.substr(str,0,1) == "s") {
			str = "" + "<span style='color:#999;'>" + HxOverrides.substr(str,3,len - 3) + "</span>";
			var d1 = window.document.getElementById("apix:info");
			if(d1 != null) d1.innerHTML += "<div style='border-bottom: dotted 1px black;' >" + str + "</div>"; else js.Boot.__trace(v,i);
		} else if(HxOverrides.substr(str,0,1) == "i") {
			str = "notice in " + (i != null?i.fileName + ":" + i.lineNumber:"") + "<span style='color:#999;'> - " + HxOverrides.substr(str,3,len - 3) + "</span>";
			var d2 = window.document.getElementById("apix:info");
			if(d2 != null) d2.innerHTML += "<div style='border-bottom: dotted 1px black;' >" + str + "</div>"; else js.Boot.__trace(v,i);
		}
	} else {
		var d3 = window.document.getElementById("apix:info");
		if(d3 != null) d3.innerHTML += "<div style='border-bottom: dotted 1px black;' >" + str + "</div>"; else js.Boot.__trace(v,i);
	}
};
apix.common.util.Global.prototype = {
	classPathName: function(inst) {
		return Type.getClassName(Type.getClass(inst));
	}
	,className: function(inst) {
		var str = this.classPathName(inst);
		var p = str.lastIndexOf(".");
		return str.substring(p + 1);
	}
	,boolVal: function(b,defVal) {
		if(defVal == null) defVal = false;
		if(b == null) return defVal;
		if(typeof(b) == "string") {
			if(b == "true") return true; else if(b == "false") return false; else return defVal;
		} else if(typeof(b) == "number") {
			if(b == 0) return false; else if(b == 1) return true; else return defVal;
		} else if(typeof(b) == "boolean") return b;
		return defVal;
	}
	,strVal: function(s,defVal) {
		if(defVal == null) defVal = "";
		if(typeof(s) == "number" && s == 0) return "0";
		if(s == null) return defVal;
		if(s == "") return defVal;
		return Std.string(s);
	}
	,numVal: function(n,defVal) {
		if(defVal == null) defVal = 0;
		if(n == "0") return Std.parseFloat("0");
		if(n == null) return defVal;
		if(Math.isNaN(n)) return defVal;
		if(n == "") return defVal;
		if(typeof(n) == "string") return Std.parseFloat(n);
		return Math.pow(n,1);
	}
	,intVal: function(n,defVal) {
		if(defVal == null) defVal = 0;
		if(n == "0") return Std.parseInt("0");
		if(n == null) return defVal;
		if(Math.isNaN(n)) return defVal;
		if(n == "") return defVal;
		if(typeof(n) == "string") return Std.parseInt(n);
		return n;
	}
	,jsonParseCheck: function(v,defVal) {
		if(defVal == null) defVal = "";
		try {
			JSON.parse(v);
		} catch( e ) {
			v = defVal;
		}
		return v;
	}
	,empty: function(v) {
		if(v == null) return true;
		if(v.length == 0) return true;
		return false;
	}
	,alert: function(v,cb,title,validLabel) {
		if(apix.common.util.Global.alertFunction != null) apix.common.util.Global.alertFunction(v,cb,title,validLabel); else {
			if(this.strVal(title,"") != "") v = title + "\n" + Std.string(v);
			alert(js.Boot.__string_rec(v,""));
			if(cb != null) cb();
		}
	}
	,setupTrace: function(ctnrId,where) {
		if(where == null) where = "bottom";
		var ctnr;
		if(this.empty(ctnrId)) ctnr = apix.common.display.Common.get_body(); else ctnr = window.document.getElementById(ctnrId);
		if(ctnr != null) {
			if(window.document.getElementById("apix:error") == null) ctnr.innerHTML = "<div id='apix:error' style='font-weight:bold;color:#900;' ></div>" + ctnr.innerHTML;
			if(window.document.getElementById("apix:info") == null) {
				if(where == "top") ctnr.innerHTML = "<div id='apix:info' style='font-weight:bold;' ></div>" + ctnr.innerHTML; else {
					ctnr.innerHTML += "<div id='apix:info' style='position:relative;font-weight:bold;' ></div>";
					apix.common.display.ElementExtender.css(window.document.getElementById("apix:info"),"zIndex",Std.string(this.getNextZindex()));
				}
			}
			haxe.Log.trace = apix.common.util.Global.apixTrace;
		} else return false;
		return true;
	}
	,isBissextile: function(n) {
		return new Date(n,1,29,0,0,0).getDay() != new Date(n,2,1,0,0,0).getDay();
	}
	,maxDayIn: function(m,leap) {
		if(leap == null) leap = false;
		m = this.intVal(m);
		if(m < 1 || m > 12) haxe.Log.trace("f::Month must be from 1 to 12 !",{ fileName : "Global.hx", lineNumber : 284, className : "apix.common.util.Global", methodName : "maxDayIn"});
		var v = [31,28,31,30,31,30,31,31,30,31,30,31][m - 1];
		if(m == 2 && leap) v++;
		return v;
	}
	,decodeAmp: function(str) {
		str = this.strVal(str,"");
		if(str != "") {
			var i = str.indexOf("~#e");
			while(i > -1) {
				str = HxOverrides.substr(str,0,i) + "&" + HxOverrides.substr(str,i + 3,null);
				i = str.indexOf("~#e");
			}
		}
		return str;
	}
	,decodeXmlReserved: function(str) {
		str = this.strVal(str,"");
		if(str != "") {
			var i = str.indexOf("~#e");
			while(i > -1) {
				str = HxOverrides.substr(str,0,i) + "&" + HxOverrides.substr(str,i + 3,null);
				i = str.indexOf("~#e");
			}
			i = str.indexOf("~#{");
			while(i > -1) {
				str = HxOverrides.substr(str,0,i) + "<" + HxOverrides.substr(str,i + 3,null);
				i = str.indexOf("~#{");
			}
			i = str.indexOf("~#}");
			while(i > -1) {
				str = HxOverrides.substr(str,0,i) + ">" + HxOverrides.substr(str,i + 3,null);
				i = str.indexOf("~#}");
			}
			i = str.indexOf("~#ç");
			while(i > -1) {
				str = HxOverrides.substr(str,0,i) + "%" + HxOverrides.substr(str,i + 3,null);
				i = str.indexOf("~#ç");
			}
			i = str.indexOf("~#`");
			while(i > -1) {
				str = HxOverrides.substr(str,0,i) + "\"" + HxOverrides.substr(str,i + 3,null);
				i = str.indexOf("~#`");
			}
		}
		return str;
	}
	,newObject: function(os) {
		var o = { };
		for (var i in os) { o[i]=os[i] }
		return o;
	}
	,hexToDec: function(v) {
		return Number('0x'+v) ;;
	}
	,open: function(url,lab,opt) {
		if(lab == null) lab = "";
		apix.common.display.Common.open(url,lab,opt);
	}
	,replace: function(url) {
		window.location.replace(url);
	}
	,getNextZindex: function() {
		var highestZ = null;
		var onefound = false;
		var elems = window.document.getElementsByTagName("*");
		if(elems.length > 0) {
			var _g = 0;
			while(_g < elems.length) {
				var el = elems[_g];
				++_g;
				if(el.style.position != null && el.style.zIndex != null) {
					var zi = this.intVal(el.style.zIndex);
					if(highestZ == null || highestZ < zi) highestZ = zi;
				}
			}
		}
		if(highestZ == null) highestZ = 0;
		return highestZ + 1;
	}
	,get_isPhone: function() {
		return apix.common.display.Common.get_availHeight() < 800 && this.get_isMobile();
	}
	,get_isTablet: function() {
		return apix.common.display.Common.get_availHeight() >= 800 && this.get_isMobile();
	}
	,get_isMobile: function() {
		return new EReg("iPhone|ipad|iPod|Android|opera mini|blackberry|palm os|palm|hiptop|avantgo|plucker|xiino|blazer|elaine|iris|3g_t|opera mobi|windows phone|iemobile|mobile".toLowerCase(),"i").match(apix.common.display.Common.get_userAgent().toLowerCase());
	}
	,get_isIE: function() {
		return new EReg("msie".toLowerCase(),"i").match(apix.common.display.Common.get_userAgent().toLowerCase());
	}
	,get_isFirefox: function() {
		return new EReg("firefox".toLowerCase(),"i").match(apix.common.display.Common.get_userAgent().toLowerCase());
	}
	,get_isAndroid: function() {
		return new EReg("android".toLowerCase(),"i").match(apix.common.display.Common.get_userAgent().toLowerCase());
	}
	,get_isAndroidNative: function() {
		return this.get_isAndroid() && !this.get_isFirefox();
	}
	,get_isAndroidNative300: function() {
		return this.get_isAndroidNative() && new EReg("android 2|android 3".toLowerCase(),"i").match(apix.common.display.Common.get_userAgent().toLowerCase());
	}
	,__class__: apix.common.util.Global
};
apix.common.event.StandardEvent = function(target) {
	this.target = target;
};
apix.common.event.StandardEvent.__name__ = ["apix","common","event","StandardEvent"];
apix.common.event.StandardEvent.isMouseType = function(v) {
	var _g = 0;
	var _g1 = ["click","dblclick",apix.common.event.StandardEvent.MOUSE_DOWN,apix.common.event.StandardEvent.MOUSE_OVER];
	while(_g < _g1.length) {
		var i = _g1[_g];
		++_g;
		if(i == v) return true;
	}
	return false;
};
apix.common.event.StandardEvent.prototype = {
	__class__: apix.common.event.StandardEvent
};
var haxe = {};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe.Timer
};
apix.common.event.timing = {};
apix.common.event.timing.Clock = function(f,per) {
	if(per == null) per = 0.04;
	haxe.Timer.call(this,Math.round(per * 1000));
	this.top = new apix.common.event.EventSource();
	this.run = $bind(this,this.clockRun);
	this.listener = f;
	this._idle = false;
};
apix.common.event.timing.Clock.__name__ = ["apix","common","event","timing","Clock"];
apix.common.event.timing.Clock.__super__ = haxe.Timer;
apix.common.event.timing.Clock.prototype = $extend(haxe.Timer.prototype,{
	remove: function() {
		this.stop();
		this.listener = null;
		this.run = null;
		this.top = null;
		return null;
	}
	,clockRun: function() {
		if(!this._idle) {
			if(this.listener != null) this.listener(this);
			if(this.top != null) this.top.dispatch(new apix.common.event.StandardEvent(this));
		}
	}
	,__class__: apix.common.event.timing.Clock
});
apix.common.event.timing.Delay = function(f,per) {
	if(per == null) per = 0.04;
	this.listener = f;
	this.timer = haxe.Timer.delay($bind(this,this.clockRun),Math.round(per * 1000));
};
apix.common.event.timing.Delay.__name__ = ["apix","common","event","timing","Delay"];
apix.common.event.timing.Delay.prototype = {
	remove: function() {
		this.timer.stop();
	}
	,clockRun: function() {
		this.timer.stop();
		this.listener(this);
	}
	,__class__: apix.common.event.timing.Delay
};
apix.common.event.timing.MouseClock = function(omm,omu) {
	this.g = apix.common.util.Global.get();
	this.onMouseMove = omm;
	this.onMouseUp = omu;
	window.document.addEventListener(apix.common.event.StandardEvent.MOUSE_MOVE,$bind(this,this.clockRun));
	if(this.onMouseUp != null) window.document.addEventListener(apix.common.event.StandardEvent.MOUSE_UP,$bind(this,this.clockStop));
	this.top = new apix.common.event.EventSource();
};
apix.common.event.timing.MouseClock.__name__ = ["apix","common","event","timing","MouseClock"];
apix.common.event.timing.MouseClock.prototype = {
	remove: function() {
		window.document.removeEventListener(apix.common.event.StandardEvent.MOUSE_UP,$bind(this,this.clockStop));
		window.document.removeEventListener(apix.common.event.StandardEvent.MOUSE_MOVE,$bind(this,this.clockRun));
		this.onMouseMove = null;
		this.top.off();
		return null;
	}
	,clockRun: function(e) {
		e.preventDefault();
		if (e.preventManipulation) e.preventManipulation();
		var v = apix.common.event.MouseTouchEvent.getVector(e);
		var ex = v.get_x();
		var ey = v.get_y();
		if(this.sx == null) this.sx = ex;
		if(this.sy == null) this.sy = ey;
		this.x = ex - this.sx;
		this.y = ey - this.sy;
		this.onMouseMove(this);
		this.top.dispatch(new apix.common.event.StandardEvent(this));
	}
	,clockStop: function(e) {
		e.preventDefault();
		if (e.preventManipulation) e.preventManipulation();
		if(this.onMouseUp != null) this.onMouseUp(this);
	}
	,get_vector: function() {
		if(this._vector == null) this._vector = new apix.common.tools.math.Vector(this.x,this.y); else {
			this._vector.set_x(this.x);
			this._vector.set_y(this.y);
		}
		return this._vector;
	}
	,__class__: apix.common.event.timing.MouseClock
};
apix.common.io = {};
apix.common.io.HttpExtender = function() { };
apix.common.io.HttpExtender.__name__ = ["apix","common","io","HttpExtender"];
apix.common.io.HttpExtender.getParameter = function(h,v) {
	var params = new apix.common.util.Object();
	var _g = 0;
	var _g1 = new EReg("[&]","g").split(v);
	while(_g < _g1.length) {
		var p = _g1[_g];
		++_g;
		var pl = p.split("=");
		if(pl.length < 2) continue;
		var name = pl.shift();
		params.set(decodeURIComponent(name.split("+").join(" ")),pl.join("="));
	}
	return params;
};
apix.common.io.JsonLoaderEvent = function(trgt,tree,answ) {
	apix.common.event.StandardEvent.call(this,this.target);
	this.target = trgt;
	this.answer = answ;
	this.tree = tree;
};
apix.common.io.JsonLoaderEvent.__name__ = ["apix","common","io","JsonLoaderEvent"];
apix.common.io.JsonLoaderEvent.__super__ = apix.common.event.StandardEvent;
apix.common.io.JsonLoaderEvent.prototype = $extend(apix.common.event.StandardEvent.prototype,{
	__class__: apix.common.io.JsonLoaderEvent
});
apix.common.io.JsonLoader = function() {
	this.read = new apix.common.event.EventSource();
};
apix.common.io.JsonLoader.__name__ = ["apix","common","io","JsonLoader"];
apix.common.io.JsonLoader.prototype = {
	load: function(fu) {
		if(fu != null) this.fileUrl = fu; else if(this.fileUrl != null) this.fileUrl = this.fileUrl; else this.fileUrl = apix.common.util.StringExtender.trace("f::File url must be given !!",null);
		this.httpRequest = new haxe.Http(this.fileUrl);
		this.httpRequest.onData = $bind(this,this.onJsonLoaderData);
		this.httpRequest.onError = $bind(this,this.onJsonLoaderError);
		this.httpRequest.request();
		return this;
	}
	,onJsonLoaderData: function(result) {
		var o;
		if(HxOverrides.substr(result,0,6) == "answer") {
			o = apix.common.io.HttpExtender.getParameter(this.httpRequest,result);
			this.answer = o.answer;
			result = o.data;
		} else this.answer = null;
		this.tree = new apix.common.util.Object(JSON.parse(result));
		var e = new apix.common.io.JsonLoaderEvent(this,this.tree,this.answer);
		this.read.dispatch(e);
	}
	,onJsonLoaderError: function(msg) {
		this.answer = "error";
		this.tree = new apix.common.util.Object({ message : msg});
		var e = new apix.common.io.JsonLoaderEvent(this,this.tree,this.answer);
		this.read.dispatch(e);
	}
	,__class__: apix.common.io.JsonLoader
};
apix.common.tools = {};
apix.common.tools.math = {};
apix.common.tools.math.GeoLoc = function(la,lo,sd) {
	if(sd == null) sd = 3;
	if(lo == null) lo = 0.0;
	if(la == null) la = 0.0;
	this._lat = la;
	this._long = lo;
	this._secDec = sd;
};
apix.common.tools.math.GeoLoc.__name__ = ["apix","common","tools","math","GeoLoc"];
apix.common.tools.math.GeoLoc.prototype = {
	__class__: apix.common.tools.math.GeoLoc
};
apix.common.tools.math.MathX = function() { };
apix.common.tools.math.MathX.__name__ = ["apix","common","tools","math","MathX"];
apix.common.tools.math.MathX.round = function(n,d) {
	if(d == null) d = 2;
	var p = Math.pow(10,d);
	return Math.round(n * p) / p;
};
apix.common.tools.math.MathX.floor = function(n,d) {
	if(d == null) d = 2;
	var p = Math.pow(10,d);
	return Math.floor(n * p) / p;
};
apix.common.tools.math.MathX.randomExclusiveList = function(len,arr) {
	if(arr == null) arr = [];
	var r = Math.floor(Math.random() * (len + 1 - 1)) + 1;
	var ok = true;
	var _g = 0;
	while(_g < arr.length) {
		var i = arr[_g];
		++_g;
		if(r == i) {
			ok = false;
			break;
		}
	}
	if(ok) arr.push(r);
	if(arr.length < len) arr = apix.common.tools.math.MathX.randomExclusiveList(len,arr);
	return arr;
};
apix.common.tools.math.Vector = function(vx,vy,vz) {
	this.g = apix.common.util.Global.get();
	this.set_x(vx);
	this.set_y(vy);
	this.set_z(vz);
};
apix.common.tools.math.Vector.__name__ = ["apix","common","tools","math","Vector"];
apix.common.tools.math.Vector.prototype = {
	get_x: function() {
		return this._x;
	}
	,set_x: function(v) {
		this._x = v;
		return v;
	}
	,get_y: function() {
		return this._y;
	}
	,set_y: function(v) {
		this._y = v;
		return v;
	}
	,get_z: function() {
		return this._z;
	}
	,set_z: function(v) {
		this._z = v;
		return v;
	}
	,add: function(v) {
		return new apix.common.tools.math.Vector(this.get_x() + v.get_x(),this.get_y() + v.get_y(),this.get_z() == null?null:this.get_z() + v.get_z());
	}
	,sub: function(v) {
		return new apix.common.tools.math.Vector(this.get_x() - v.get_x(),this.get_y() - v.get_y(),this.get_z() == null?null:this.get_z() - v.get_z());
	}
	,__class__: apix.common.tools.math.Vector
};
apix.common.tools.math.Rectangle = function(vx,vy,w,h) {
	apix.common.tools.math.Vector.call(this,vx,vy);
	this.set_width(w);
	this.set_height(h);
};
apix.common.tools.math.Rectangle.__name__ = ["apix","common","tools","math","Rectangle"];
apix.common.tools.math.Rectangle.__super__ = apix.common.tools.math.Vector;
apix.common.tools.math.Rectangle.prototype = $extend(apix.common.tools.math.Vector.prototype,{
	get_width: function() {
		return this._width;
	}
	,set_width: function(v) {
		this._width = v;
		return v;
	}
	,get_length: function() {
		return Math.max(this.get_width(),this.get_height());
	}
	,get_height: function() {
		return this._height;
	}
	,set_height: function(v) {
		this._height = v;
		return v;
	}
	,__class__: apix.common.tools.math.Rectangle
});
apix.common.util.ArrayExtender = function() { };
apix.common.util.ArrayExtender.__name__ = ["apix","common","util","ArrayExtender"];
apix.common.util.ArrayExtender.objectOf = function(arr,val,key) {
	if(key == null) key = "id";
	var ret = { object : { }, index : null};
	var i = -1;
	var _g = 0;
	while(_g < arr.length) {
		var o = arr[_g];
		++_g;
		i++;
		if(Reflect.field(o,key) == val) {
			ret = { object : o, index : i};
			break;
		}
	}
	return ret;
};
apix.common.util.Object = function(o) {
	if(o != null) {
		var arr = Reflect.fields(o);
		var _g1 = 0;
		var _g = arr.length;
		while(_g1 < _g) {
			var i = _g1++;
			var v = Reflect.field(o,arr[i]);
			this.set(arr[i],v);
		}
	}
};
apix.common.util.Object.__name__ = ["apix","common","util","Object"];
apix.common.util.Object.prototype = {
	set: function(k,v) {
		this[k] = v;
		return Reflect.field(this,k);
	}
	,get: function(k) {
		return Reflect.field(this,k);
	}
	,array: function() {
		return Reflect.fields(this);
	}
	,get_length: function() {
		return Reflect.fields(this).length;
	}
	,empty: function() {
		return this.get_length() < 1;
	}
	,forEach: function(f) {
		var len = this.array().length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var k = this.array()[i];
			var v = this.get(k);
			f(k,v,i);
		}
	}
	,__class__: apix.common.util.Object
};
apix.common.util.StringExtender = function() { };
apix.common.util.StringExtender.__name__ = ["apix","common","util","StringExtender"];
apix.common.util.StringExtender.on = function(v,type,listenerFunction,b,data,parent) {
	if(b == null) b = false;
	var arr;
	arr = apix.common.util.StringExtender.all(v,parent);
	var _g = 0;
	while(_g < arr.length) {
		var el = arr[_g];
		++_g;
		apix.common.display.ElementExtender.on(el,type,listenerFunction,b,data);
	}
};
apix.common.util.StringExtender.off = function(v,type,listenerFunction,b,parent) {
	if(b == null) b = false;
	var arr;
	arr = apix.common.util.StringExtender.all(v,parent);
	var _g = 0;
	while(_g < arr.length) {
		var el = arr[_g];
		++_g;
		apix.common.display.ElementExtender.off(el,type,listenerFunction,b);
	}
};
apix.common.util.StringExtender.each = function(v,f,parent) {
	var arr = apix.common.util.StringExtender.all(v,parent);
	var _g = 0;
	while(_g < arr.length) {
		var el = arr[_g];
		++_g;
		f(el);
	}
	return arr;
};
apix.common.util.StringExtender.all = function(v,parent) {
	if(apix.common.util.StringExtender.rootHtmlElement == null) apix.common.util.StringExtender.rootHtmlElement = apix.common.display.Common.get_body();
	if(parent == null) parent = apix.common.util.StringExtender.rootHtmlElement;
	return parent.querySelectorAll(v);
};
apix.common.util.StringExtender.get = function(v,parent) {
	if(apix.common.util.StringExtender.rootHtmlElement == null) apix.common.util.StringExtender.rootHtmlElement = apix.common.display.Common.get_body();
	if(parent == null) parent = apix.common.util.StringExtender.rootHtmlElement;
	return parent.querySelector(v);
};
apix.common.util.StringExtender.toDecimal = function(v,d) {
	if(d == null) d = 2;
	var n = Std.parseFloat(v);
	var mul = Math.pow(10,d);
	var str = Std.string(mul + Math.floor(n * mul) % mul);
	return Std.string(Math.floor(n)) + "." + HxOverrides.substr(str,1,d);
};
apix.common.util.StringExtender.replace = function(v,from,to) {
	var reg = new RegExp('('+from+')', 'g');;
	v = v.replace(reg,to);;
	return v;
};
apix.common.util.StringExtender.isDate = function(v) {
	var msg = "";
	if(v.length != 10) msg = "invalid date format yyyy-mm-dd"; else {
		var yy = Std.parseInt(HxOverrides.substr(v,0,4));
		var mm = Std.parseInt(HxOverrides.substr(v,5,2));
		var dd = Std.parseInt(HxOverrides.substr(v,8,2));
		if(yy < 1000 || yy > 9999) msg = "invalid year " + yy; else if(mm < 1 || mm > 12) msg = "invalid month " + mm; else if(dd < 1 || dd > apix.common.util.StringExtender.maxDayIn(mm,new Date(yy,1,29,0,0,0).getDay() != new Date(yy,2,1,0,0,0).getDay())) msg = "invalid day " + dd + " for month=" + mm + " and year=" + yy;
	}
	return msg;
};
apix.common.util.StringExtender.toDisplayDate = function(v) {
	var s = HxOverrides.substr(v,4,1);
	return HxOverrides.substr(v,8,2) + s + HxOverrides.substr(v,5,2) + s + HxOverrides.substr(v,0,4);
};
apix.common.util.StringExtender.isMail = function(v) {
	var r = new EReg("[A-Z0-9._%-]+@[A-Z0-9.-]+\\.[A-Z][A-Z][A-Z]?","i");
	var b = r.match(v);
	if(b) {
		if(v.indexOf("@",v.indexOf("@") + 1) != -1) b = false;
	}
	return b;
};
apix.common.util.StringExtender.alert = function(s,cb,title) {
	apix.common.util.Global.get().alert(s,cb,title);
};
apix.common.util.StringExtender.trace = function(s,v) {
	if(v != null) s += "=" + Std.string(v.toString());
	haxe.Log.trace(s,{ fileName : "StringExtender.hx", lineNumber : 188, className : "apix.common.util.StringExtender", methodName : "trace"});
	return "";
};
apix.common.util.StringExtender.maxDayIn = function(m,leap) {
	if(leap == null) leap = false;
	if(m < 1 || m > 12) haxe.Log.trace("f::Month must be from 1 to 12 !",{ fileName : "StringExtender.hx", lineNumber : 195, className : "apix.common.util.StringExtender", methodName : "maxDayIn"});
	var v = [31,28,31,30,31,30,31,31,30,31,30,31][m - 1];
	if(m == 2 && leap) v++;
	return v;
};
apix.common.util.xml = {};
apix.common.util.xml.XmlParser = function() {
	this.g = apix.common.util.Global.get();
};
apix.common.util.xml.XmlParser.__name__ = ["apix","common","util","xml","XmlParser"];
apix.common.util.xml.XmlParser.prototype = {
	parse: function(x) {
		x = x.firstElement();
		this.tree = new apix.common.util.Object();
		this.parseNode(x,this.tree);
		return this.tree;
	}
	,parseNode: function(xml,o) {
		if(xml.firstChild() != null) {
			if(xml.firstChild().nodeType == Xml.PCData) {
				var v = StringTools.trim(xml.firstChild().get_nodeValue());
				if(!this.g.empty(v)) o.set("value",this.g.decodeXmlReserved(v));
			}
		}
		var $it0 = xml.attributes();
		while( $it0.hasNext() ) {
			var i = $it0.next();
			o.set(i,this.g.decodeXmlReserved(xml.get(i)));
		}
		var oo;
		var $it1 = xml.elements();
		while( $it1.hasNext() ) {
			var i1 = $it1.next();
			if(o.get(i1.get_nodeName()) != null) {
				if(!((o.get(i1.get_nodeName()) instanceof Array) && o.get(i1.get_nodeName()).__enum__ == null)) {
					oo = o.get(i1.get_nodeName());
					o.set(i1.get_nodeName(),new Array());
					o.get(i1.get_nodeName()).push(oo);
				}
				oo = new apix.common.util.Object();
				o.get(i1.get_nodeName()).push(oo);
				this.parseNode(i1,oo);
			} else {
				o.set(i1.get_nodeName(),new apix.common.util.Object());
				this.parseNode(i1,o.get(i1.get_nodeName()));
			}
		}
	}
	,__class__: apix.common.util.xml.XmlParser
};
apix.ui = {};
apix.ui.UICompo = function() {
	this.g = apix.common.util.Global.get();
	this.compoProp = new apix.common.util.Object();
	this.compoProp.skin = "default";
	this.compoProp.auto = true;
	this.enabled = false;
	this.lang = apix.ui.UICompoLoader.langObject;
	this.over = new apix.common.event.EventSource();
};
apix.ui.UICompo.__name__ = ["apix","ui","UICompo"];
apix.ui.UICompo.get_orientation = function() {
	if(Math.abs(window.orientation) == 90) return "landscape"; else return "portrait";
};
apix.ui.UICompo.addRequired = function(compo) {
	var exist = false;
	var _g = 0;
	var _g1 = apix.ui.UICompo.requiredStk;
	while(_g < _g1.length) {
		var r = _g1[_g];
		++_g;
		if(r.compo == compo) {
			exist = true;
			break;
		}
	}
	if(!exist) apix.ui.UICompo.requiredStk.push({ compo : compo});
};
apix.ui.UICompo.removeRequired = function(c) {
	var i = 0;
	var _g = 0;
	var _g1 = apix.ui.UICompo.requiredStk;
	while(_g < _g1.length) {
		var r = _g1[_g];
		++_g;
		if(r.compo == c) {
			apix.ui.UICompo.requiredStk.splice(i,1);
			break;
		}
		i++;
	}
	return null;
};
apix.ui.UICompo.removeAllRequired = function() {
	apix.ui.UICompo.requiredStk = [];
};
apix.ui.UICompo.mediaDataToUrl = function(md) {
	var v = "";
	if(md.name == null) haxe.Log.trace("f:: In parameter isn't a MediaData !",{ fileName : "UICompo.hx", lineNumber : 496, className : "apix.ui.UICompo", methodName : "mediaDataToUrl"});
	v = "data:" + md.type + "/" + md.ext + ";" + md.code + "," + md.data;
	return v;
};
apix.ui.UICompo.getEmpties = function() {
	var str = "";
	var coma = "<br/>";
	var _g = 0;
	var _g1 = apix.ui.UICompo.requiredStk;
	while(_g < _g1.length) {
		var r = _g1[_g];
		++_g;
		if(r.compo.get_isEmpty()) {
			str += coma + r.compo.get_label();
			if(js.Boot.__instanceof(r.compo,apix.ui.input.EmailField) && !(js.Boot.__cast(r.compo , apix.ui.input.EmailField)).get_isMail()) str += " : " + Std.string(apix.ui.UICompoLoader.langObject.invalidEmail);
			coma = ",<br/>";
		}
	}
	if(str != "") str = Std.string(apix.ui.UICompoLoader.langObject.emptyError) + str;
	return str;
};
apix.ui.UICompo.set_baseUrl = function(v) {
	if(v == null) v = "";
	apix.ui.UICompoLoader.baseUrl = v;
	return v;
};
apix.ui.UICompo.loadInit = function(f) {
	apix.ui.UICompoLoader.__loadInit(f);
};
apix.ui.UICompo.prototype = {
	setup: function(p) {
		this.setCompoProp(p);
		if(this.isInitialized()) {
			if(!this.isCreated()) this.create();
			if(this.ctnrExist()) {
				if(!this.isEnabled()) this.enable();
				this.update();
			}
		}
		return this;
	}
	,enable: function() {
		haxe.Log.trace("f:: UICompo.enable() must be override by subclass !! ",{ fileName : "UICompo.hx", lineNumber : 207, className : "apix.ui.UICompo", methodName : "enable"});
		this.enabled = true;
		return this;
	}
	,update: function() {
		var _g = 0;
		var _g1 = Reflect.fields(this.get_style());
		while(_g < _g1.length) {
			var k = _g1[_g];
			++_g;
			apix.common.display.ElementExtender.css(this.element,k,Reflect.field(this.get_style(),k));
		}
		if(this.get_required()) apix.ui.UICompo.addRequired(this); else apix.ui.UICompo.removeRequired(this);
		if(this.get_info() != "") {
			this.infoBubble = apix.ui.tools.InfoBubble.get();
			if(!this.over.hasListener()) {
				this.over.on(function() {
				});
				apix.common.display.ElementExtender.on(this.element,apix.common.event.StandardEvent.MOUSE_OVER,$bind(this,this.showInfoBubble));
				apix.common.display.ElementExtender.on(this.element,apix.common.event.StandardEvent.MOUSE_OUT,$bind(this,this.hideInfoBubble));
			}
		}
		return this;
	}
	,remove: function() {
		apix.ui.UICompo.removeRequired(this);
		return this;
	}
	,create: function() {
		this.element = apix.common.display.Common.htmlToElem(this.getCompoSkins(this.get_skin()).skinContent);
		if(this.get_id() == "") this.setCompoProp({ id : apix.common.display.Common.get_newSingleId()});
		this.element.id = this.get_id();
		if(this.ctnrExist()) this.addIntoCtnr();
		return this;
	}
	,isCreated: function() {
		return this.element != null && this.g.strVal(this.element.id) != "";
	}
	,ctnrExist: function() {
		return this.get_ctnr() != null;
	}
	,isEnabled: function() {
		return this.enabled;
	}
	,isInitialized: function() {
		var v = this.getCompoSkins(this.get_skin()) != null;
		if(!v) haxe.Log.trace("f:: UI&lt;component&gt;.init() must be called before !! ",{ fileName : "UICompo.hx", lineNumber : 269, className : "apix.ui.UICompo", methodName : "isInitialized"});
		return v;
	}
	,showInfoBubble: function() {
		this.infoBubble.text(this.get_info()).show(this);
	}
	,hideInfoBubble: function() {
		this.infoBubble.hide();
	}
	,getCompoSkins: function(v) {
		var ret = null;
		var _g = 0;
		var _g1 = this.compoSkinList;
		while(_g < _g1.length) {
			var o = _g1[_g];
			++_g;
			if(o.skinName == v) {
				ret = o;
				break;
			}
		}
		return ret;
	}
	,addIntoCtnr: function() {
		if(this.ctnrExist() && !apix.common.display.ElementExtender.hasChild(this.get_ctnr(),this.element)) apix.common.display.ElementExtender.addChild(this.get_ctnr(),this.element);
	}
	,setCompoProp: function(p) {
		var _g = this;
		var o = new apix.common.util.Object(p);
		if(!o.empty()) o.forEach(function(k,v,i) {
			_g.compoProp.set(k,v);
		});
		if(this.isCreated() && p != null) {
			if(p.id != null) this.element.id = this.compoProp.id;
			if(p.into != null) this.addIntoCtnr();
		}
	}
	,get_skin: function() {
		return this.g.strVal(this.compoProp.skin);
	}
	,get_id: function() {
		var v;
		if(this.isCreated()) v = this.element.id; else v = this.g.strVal(this.compoProp.id);
		return v;
	}
	,get_name: function() {
		var v = null;
		if(this.compoProp.name != null) v = this.compoProp.name; else v = "unnamed";
		this.compoProp.name = v;
		return v;
	}
	,get_width: function() {
		var v = null;
		if(this.compoProp.width != null) v = this.compoProp.width; else if(this.element != null && this.g.strVal(this.element.style.width,"") != "") v = this.element.style.width; else v = "100%";
		this.compoProp.width = v;
		return v;
	}
	,get_height: function() {
		var v = null;
		if(this.compoProp.height != null) v = this.compoProp.height; else if(this.element != null && this.g.strVal(this.element.style.height,"") != "") v = this.element.style.height; else v = "";
		this.compoProp.height = v;
		return v;
	}
	,get_required: function() {
		var v = null;
		if(this.compoProp.required != null) v = this.compoProp.required; else v = false;
		this.compoProp.required = v;
		return v;
	}
	,get_info: function() {
		var v = null;
		if(this.compoProp.info != null) v = this.compoProp.info; else v = "";
		this.compoProp.info = v;
		return v;
	}
	,get_ctnr: function() {
		if(this.g.strVal(this.get_into()) != "") return apix.common.util.StringExtender.get(this.get_into()); else return null;
	}
	,get_into: function() {
		return this.compoProp.into;
	}
	,get_auto: function() {
		return this.g.boolVal(this.compoProp.auto);
	}
	,get_value: function() {
		haxe.Log.trace("f:: UICompo. get_value () must be override by subclass !! ",{ fileName : "UICompo.hx", lineNumber : 388, className : "apix.ui.UICompo", methodName : "get_value"});
		return null;
	}
	,get_isEmpty: function() {
		return this.g.strVal(this.get_value(),"") == "";
	}
	,get_label: function() {
		haxe.Log.trace("f:: UICompo.get_label() must be override by subclass !! ",{ fileName : "UICompo.hx", lineNumber : 399, className : "apix.ui.UICompo", methodName : "get_label"});
		return null;
	}
	,get_style: function() {
		var v = null;
		if(this.compoProp.style != null) v = this.compoProp.style; else v = { };
		this.compoProp.style = v;
		return v;
	}
	,get_labelAlign: function() {
		var v = null;
		if(this.compoProp.labelAlign != null) v = this.compoProp.labelAlign; else v = "top";
		v = v.toLowerCase();
		if(v != "left") v = "top";
		this.compoProp.labelAlign = v;
		return v;
	}
	,get_labelWidth: function() {
		var v = null;
		if(this.compoProp.labelWidth != null) v = this.compoProp.labelWidth; else v = "50%";
		this.compoProp.labelWidth = v;
		return v;
	}
	,__class__: apix.ui.UICompo
};
apix.ui.UICompoLoader = function() { };
apix.ui.UICompoLoader.__name__ = ["apix","ui","UICompoLoader"];
apix.ui.UICompoLoader.__loadInit = function(f) {
	apix.ui.UICompoLoader.__callBack = f;
	var tmp = apix.common.display.Common.createElem(null);
	tmp.id = "apix_tmp_ctnr";
	apix.common.display.ElementExtender.addChild(apix.common.display.Common.get_body(),tmp);
	var spinnerProp = { callBack : apix.ui.UICompoLoader.__startLoadCompo};
	if(apix.common.util.Global.get().get_isMobile()) spinnerProp.skinPath = "apix/default/" + "Spinner/mobile/";
	apix.ui.tools.Spinner.get(spinnerProp).start();
};
apix.ui.UICompoLoader.__startLoadCompo = function() {
	if(apix.ui.Lang.getSrc() == null) apix.ui.UICompoLoader.__loadNext(); else {
		var jl = new apix.common.io.JsonLoader();
		jl.read.on(apix.ui.UICompoLoader.__onLangLoaded);
		jl.load(apix.ui.Lang.getSrc());
	}
};
apix.ui.UICompoLoader.__onLangLoaded = function(e) {
	var jl = e.target;
	jl.read.off(apix.ui.UICompoLoader.__onLangLoaded);
	apix.ui.UICompoLoader.langObject = e.tree;
	apix.ui.UICompoLoader.__loadNext();
};
apix.ui.UICompoLoader.__push = function(f,url,skinName) {
	apix.ui.UICompoLoader.__stk.push({ f : f, url : url, skinName : skinName});
};
apix.ui.UICompoLoader.__loadNext = function() {
	if(apix.ui.UICompoLoader.__stk.length > 0) {
		var o = apix.ui.UICompoLoader.__stk.pop();
		o.f(o.url,o.skinName);
	} else {
		apix.common.display.Common.get_body().removeChild(apix.common.util.StringExtender.get("#" + "apix_tmp_ctnr"));
		apix.ui.tools.Spinner.get().stop();
		apix.ui.UICompoLoader.__callBack();
	}
};
apix.ui.UICompoLoader.__onEndLoad = function() {
	apix.ui.UICompoLoader.__loadNext();
};
apix.ui.UICompoLoader.__storeData = function(result) {
	var tmpCtnr = window.document.getElementById("apix_tmp_ctnr");
	result = apix.common.util.StringExtender.replace(result,"././",apix.ui.UICompoLoader.__currentFromPath);
	apix.common.display.ElementExtender.inner(tmpCtnr,result);
	var tmpStyleEl = apix.common.display.ElementExtender.elemByTag(tmpCtnr,"style");
	var styleContent = apix.common.display.ElementExtender.text(tmpStyleEl);
	tmpCtnr.removeChild(tmpStyleEl);
	var styleElArr = window.document.getElementsByTagName("style");
	if(styleElArr.length == 0) {
		apix.common.display.ElementExtender.text(tmpStyleEl,styleContent);
		apix.common.display.ElementExtender.addChild(apix.common.display.Common.get_head(),tmpStyleEl);
	} else {
		var styleEl = styleElArr[0];
		styleEl.textContent += styleContent;
	}
	var el = apix.common.display.ElementExtender.elemByClass(tmpCtnr,"apix_loader_ctnr");
	var skinContent = apix.common.display.ElementExtender.inner(el);
	apix.common.display.ElementExtender.inner(tmpCtnr,"");
	return skinContent;
};
apix.ui.HLine = function(v,visible) {
	if(visible == null) visible = false;
	var parent = apix.common.util.StringExtender.get(v);
	if(visible) apix.common.display.ElementExtender.addChild(parent,apix.common.display.Common.createElem("hr")); else apix.common.display.ElementExtender.addChild(parent,apix.common.display.Common.createElem("br"));
};
apix.ui.HLine.__name__ = ["apix","ui","HLine"];
apix.ui.HLine.prototype = {
	__class__: apix.ui.HLine
};
apix.ui.Lang = function() { };
apix.ui.Lang.__name__ = ["apix","ui","Lang"];
apix.ui.Lang.getSrc = function() {
	return apix.ui.Lang.languageSrc;
};
apix.ui.Lang.setLangObject = function(o) {
	if(o == null) haxe.Log.trace("f::Error in Lang.setLangObject(). Parameter must not be null !",{ fileName : "UICompo.hx", lineNumber : 673, className : "apix.ui.Lang", methodName : "setLangObject"});
	if(apix.common.util.Global.get().className(o) != "Object") haxe.Log.trace("f::Error in Lang.setLangObject(). Parameter must be an Object !",{ fileName : "UICompo.hx", lineNumber : 674, className : "apix.ui.Lang", methodName : "setLangObject"});
	if(apix.ui.UICompoLoader.langObject != null || apix.ui.Lang.languageSrc != null) haxe.Log.trace("f::Error in Lang.setLangObject(). Lang.init() is already done !",{ fileName : "UICompo.hx", lineNumber : 675, className : "apix.ui.Lang", methodName : "setLangObject"});
	apix.ui.UICompoLoader.langObject = o;
};
apix.ui.input = {};
apix.ui.input.ColorFieldEvent = function(target,values,value,inputElement,id) {
	apix.common.event.StandardEvent.call(this,target);
	this.value = value;
	this.values = values;
	this.inputElement = inputElement;
	this.id = id;
};
apix.ui.input.ColorFieldEvent.__name__ = ["apix","ui","input","ColorFieldEvent"];
apix.ui.input.ColorFieldEvent.__super__ = apix.common.event.StandardEvent;
apix.ui.input.ColorFieldEvent.prototype = $extend(apix.common.event.StandardEvent.prototype,{
	__class__: apix.ui.input.ColorFieldEvent
});
apix.ui.input.InputField = function(p,isSubClassCall) {
	if(isSubClassCall == null) isSubClassCall = false;
	apix.ui.UICompo.call(this);
	this.input = new apix.common.event.EventSource();
	this.blur = new apix.common.event.EventSource();
	if(!isSubClassCall) {
		this.compoSkinList = apix.ui.input.InputFieldLoader.__compoSkinList;
		this.setup(p);
	}
};
apix.ui.input.InputField.__name__ = ["apix","ui","input","InputField"];
apix.ui.input.InputField.init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	apix.ui.input.InputFieldLoader.__init(skinName,pathStr);
};
apix.ui.input.InputField.__super__ = apix.ui.UICompo;
apix.ui.input.InputField.prototype = $extend(apix.ui.UICompo.prototype,{
	setup: function(p) {
		apix.ui.UICompo.prototype.setup.call(this,p);
		return this;
	}
	,enable: function() {
		this.inputElement = apix.common.util.StringExtender.get("#" + this.get_id() + " input");
		this.labelElement = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "label"));
		if(this.get_disabled()) apix.common.display.ElementExtender.enable(this.inputElement,false,true);
		apix.common.display.ElementExtender.on(this.inputElement,"input",$bind(this,this.onAppendChar));
		this.enabled = true;
		return this;
	}
	,remove: function() {
		apix.ui.UICompo.prototype.remove.call(this);
		apix.common.display.ElementExtender.off(this.inputElement,"input",$bind(this,this.onAppendChar));
		if(this.input.hasListener()) this.input.off();
		if(this.blur.hasListener()) this.blur.off();
		apix.common.display.ElementExtender["delete"](this.element);
		return this;
	}
	,update: function() {
		apix.ui.UICompo.prototype.update.call(this);
		apix.common.display.ElementExtender.text(this.labelElement,this.get_label());
		apix.common.display.ElementExtender.value(this.inputElement,this.get_value());
		apix.common.display.ElementExtender.inputType(this.inputElement,this.get_type());
		apix.common.display.ElementExtender.placeHolder(this.inputElement,this.get_placeHolder());
		apix.common.display.ElementExtender.css(this.inputElement,"width",this.get_width());
		if(this.get_labelAlign() == "left" && !this.g.get_isMobile()) {
			apix.common.display.ElementExtender.forEachChildren(this.element,function(child) {
				child.style.display = "inline-block";
			});
			apix.common.display.ElementExtender.css(this.labelElement,"textAlign","right");
			apix.common.display.ElementExtender.css(this.labelElement,"width",this.get_labelWidth());
			apix.common.display.ElementExtender.width(this.inputElement,apix.common.display.ElementExtender.width(this.element) - apix.common.display.ElementExtender.width(this.labelElement) - 10);
			apix.common.display.ElementExtender.width(this.element,apix.common.display.ElementExtender.width(this.labelElement) + apix.common.display.ElementExtender.width(this.inputElement) + 10);
		}
		return this;
	}
	,onAppendChar: function(e) {
		var v = apix.common.display.ElementExtender.value(this.inputElement);
		this.set_value(v);
		if(this.input.hasListener()) this.input.dispatch(new apix.ui.input.InputFieldEvent(this,v,this.inputElement,this.get_id()));
	}
	,get_value: function() {
		var v = null;
		if(this.compoProp.value != null) v = this.compoProp.value; else v = "";
		this.compoProp.value = v;
		return v;
	}
	,set_value: function(v) {
		apix.common.display.ElementExtender.value(this.inputElement,v);
		this.setCompoProp({ value : v});
		return v;
	}
	,get_type: function() {
		var v = null;
		if(this.compoProp.type != null) v = this.compoProp.type; else v = "text";
		this.compoProp.type = v;
		return v;
	}
	,get_label: function() {
		var v = null;
		if(this.compoProp.label != null) v = this.compoProp.label; else v = "Untitled";
		this.compoProp.label = v;
		return v;
	}
	,get_placeHolder: function() {
		var v = null;
		if(this.compoProp.placeHolder != null) v = this.compoProp.placeHolder; else v = "Enter data";
		this.compoProp.placeHolder = v;
		return v;
	}
	,get_disabled: function() {
		var v = null;
		if(this.compoProp.disabled != null) v = this.compoProp.disabled; else v = false;
		this.compoProp.disabled = v;
		return v;
	}
	,__class__: apix.ui.input.InputField
});
apix.ui.input.ColorField = function(p) {
	p.type = "color";
	apix.ui.input.InputField.call(this,p);
	this.change = new apix.common.event.EventSource();
};
apix.ui.input.ColorField.__name__ = ["apix","ui","input","ColorField"];
apix.ui.input.ColorField.__super__ = apix.ui.input.InputField;
apix.ui.input.ColorField.prototype = $extend(apix.ui.input.InputField.prototype,{
	enable: function() {
		this.inputElement = apix.common.util.StringExtender.get("#" + this.get_id() + " input");
		this.labelElement = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "label"));
		apix.common.display.ElementExtender.on(this.inputElement,"input",$bind(this,this.onChange));
		apix.common.display.ElementExtender.on(this.inputElement,"blur",$bind(this,this.onChange));
		this.enabled = true;
		return this;
	}
	,update: function() {
		apix.ui.input.InputField.prototype.update.call(this);
		return this;
	}
	,remove: function() {
		apix.common.display.ElementExtender.off(this.inputElement,"input",$bind(this,this.onChange));
		apix.common.display.ElementExtender.off(this.inputElement,"blur",$bind(this,this.onChange));
		if(this.change.hasListener()) this.change.off();
		apix.ui.input.InputField.prototype.remove.call(this);
		return this;
	}
	,onChange: function() {
		this.set_value(this.get_hexa());
		if(this.change.hasListener()) this.change.dispatch(new apix.ui.input.ColorFieldEvent(this,this.get_values(),this.get_value(),this.inputElement,this.get_id()));
	}
	,get_values: function() {
		return { hexa : this.get_hexa(), rgb : this.get_rgb(), red : this.get_red(), green : this.get_green(), blue : this.get_blue()};
	}
	,get_hexa: function() {
		return apix.common.display.ElementExtender.value(this.inputElement);
	}
	,get_rgb: function() {
		return "rgb(" + this.get_red() + "," + this.get_green() + "," + this.get_blue() + ")";
	}
	,get_red: function() {
		return this.g.hexToDec((function($this) {
			var $r;
			var _this = $this.get_hexa();
			$r = HxOverrides.substr(_this,1,2);
			return $r;
		}(this)));
	}
	,get_green: function() {
		return this.g.hexToDec((function($this) {
			var $r;
			var _this = $this.get_hexa();
			$r = HxOverrides.substr(_this,3,2);
			return $r;
		}(this)));
	}
	,get_blue: function() {
		return this.g.hexToDec((function($this) {
			var $r;
			var _this = $this.get_hexa();
			$r = HxOverrides.substr(_this,5,2);
			return $r;
		}(this)));
	}
	,get_placeHolder: function() {
		var v = null;
		if(this.compoProp.placeHolder != null) v = this.compoProp.placeHolder; else v = "";
		this.compoProp.placeHolder = v;
		return v;
	}
	,__class__: apix.ui.input.ColorField
});
apix.ui.input.DateFieldEvent = function(target,values,value,dataElement,inputElement,id) {
	apix.common.event.StandardEvent.call(this,target);
	this.values = values;
	this.value = value;
	this.inputElement = inputElement;
	this.dataElement = dataElement;
	this.id = id;
};
apix.ui.input.DateFieldEvent.__name__ = ["apix","ui","input","DateFieldEvent"];
apix.ui.input.DateFieldEvent.__super__ = apix.common.event.StandardEvent;
apix.ui.input.DateFieldEvent.prototype = $extend(apix.common.event.StandardEvent.prototype,{
	__class__: apix.ui.input.DateFieldEvent
});
apix.ui.input.DateField = function(p) {
	p.type = "text";
	this.pickerLoop = 0;
	apix.ui.input.InputField.call(this,p);
	this.change = new apix.common.event.EventSource();
};
apix.ui.input.DateField.__name__ = ["apix","ui","input","DateField"];
apix.ui.input.DateField.init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	apix.ui.input.DatePickerLoader.__init(skinName,pathStr);
};
apix.ui.input.DateField.__super__ = apix.ui.input.InputField;
apix.ui.input.DateField.prototype = $extend(apix.ui.input.InputField.prototype,{
	enable: function() {
		this.inputElement = apix.common.util.StringExtender.get("#" + this.get_id() + " input");
		this.labelElement = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "label"));
		apix.common.display.ElementExtender.prop(this.inputElement,"readOnly",true);
		apix.common.display.ElementExtender.on(this.inputElement,"focus",$bind(this,this.onEnterInputElement));
		this.dataElement = window.document.createElement("input");
		apix.common.display.ElementExtender.type(this.dataElement,"text");
		apix.common.display.ElementExtender.hide(this.dataElement);
		this.element.appendChild(this.dataElement);
		this.enabled = true;
		return this;
	}
	,remove: function() {
		apix.common.display.ElementExtender.off(this.inputElement,"focus",$bind(this,this.onEnterInputElement));
		apix.ui.input.InputField.prototype.remove.call(this);
		return this;
	}
	,update: function() {
		apix.ui.input.InputField.prototype.update.call(this);
		var v = this.get_value();
		if(v != "") {
			var m = apix.common.util.StringExtender.isDate(v);
			if(m != "") this.set_value("");
		}
		this.storeDate(this.get_value());
		this.displayDate();
		return this;
	}
	,storeDate: function(v) {
		if(v == "") {
			this.date = null;
			this.day = null;
			this.month = null;
			this.year = null;
		} else {
			this.year = Std.parseInt(HxOverrides.substr(v,0,4));
			this.month = Std.parseInt(HxOverrides.substr(v,5,2));
			this.day = Std.parseInt(HxOverrides.substr(v,8,2));
			this.date = new Date(this.year,this.month,this.day,0,0,0);
		}
	}
	,displayDate: function() {
		apix.common.display.ElementExtender.value(this.dataElement,this.get_dataValue());
		apix.common.display.ElementExtender.value(this.inputElement,this.get_displayValue());
	}
	,onEnterInputElement: function(e) {
		if(this.pickerElement == null) this.createPicker();
		this.openPicker();
	}
	,dispatchChange: function() {
		this.set_value(this.get_dataValue());
		if(this.change.hasListener()) this.change.dispatch(new apix.ui.input.DateFieldEvent(this,this.get_values(),this.get_value(),this.dataElement,this.inputElement,this.get_id()));
	}
	,onEndPicker: function(e,data) {
		if(data.action == "valid") this.getDataFromPicker(); else if(data.action == "clear") {
			this.date = null;
			this.day = null;
			this.month = null;
			this.year = null;
			this.pickerInfo = null;
			this.dispatchChange();
		}
		if(data.action != "cancel") {
			this.displayDate();
			this.dispatchChange();
		}
		var _g = 0;
		var _g1 = apix.ui.UICompo.inputStk;
		while(_g < _g1.length) {
			var el = _g1[_g];
			++_g;
			apix.common.display.ElementExtender.prop(el,"disabled",false);
		}
		this.popBox.close();
	}
	,createPicker: function() {
		var el = apix.common.display.Common.createElem(null);
		apix.common.display.ElementExtender.inner(el,this.getPickerSkin(this.get_pickerSkin()).skinContent);
		this.pickerElement = el.firstElementChild;
		this.pickerElement.id = this.get_id() + "-datePicker";
		this.popBox = new apix.ui.tools.PopBox().create({ elementToHide : apix.common.util.StringExtender.get(this.get_elementToHide())});
		this.popBox.addChild(this.pickerElement);
		this.enablePicker();
	}
	,enablePicker: function() {
		apix.common.display.ElementExtender.on(apix.common.util.StringExtender.get("#" + this.pickerElement.id + " .apix_enter"),"click",$bind(this,this.onEndPicker),null,{ action : "valid"});
		apix.common.display.ElementExtender.on(apix.common.util.StringExtender.get("#" + this.pickerElement.id + " .apix_cancel"),"click",$bind(this,this.onEndPicker),null,{ action : "cancel"});
		apix.common.display.ElementExtender.on(apix.common.util.StringExtender.get("#" + this.pickerElement.id + " .apix_clear"),"click",$bind(this,this.onEndPicker),null,{ action : "clear"});
		apix.common.util.StringExtender.on("#" + this.pickerElement.id + " .apix_button",apix.common.event.StandardEvent.MOUSE_DOWN,$bind(this,this.onDownPickerButton));
		apix.common.util.StringExtender.on("#" + this.pickerElement.id + " .apix_button",apix.common.event.StandardEvent.MOUSE_UP,$bind(this,this.onUpPickerButton));
	}
	,openPicker: function() {
		this.setDataToPicker();
		var _g = 0;
		var _g1 = apix.ui.UICompo.inputStk;
		while(_g < _g1.length) {
			var el = _g1[_g];
			++_g;
			apix.common.display.ElementExtender.prop(el,"disabled",true);
		}
		this.popBox.open();
	}
	,setDataToPicker: function() {
		if(this.date == null) {
			if(this.pickerInfo == null) {
				var d = new Date();
				this.pickerInfo = { year : d.getFullYear(), month : d.getMonth() + 1, day : d.getDate()};
			}
		} else this.pickerInfo = { year : this.year, month : this.month, day : this.day};
		this.displayPickerInfo();
	}
	,getDataFromPicker: function() {
		this.year = this.pickerInfo.year;
		this.month = this.pickerInfo.month;
		this.day = this.pickerInfo.day;
		this.date = new Date(this.year,this.month,this.day,0,0,0);
	}
	,displayPickerInfo: function() {
		apix.common.display.ElementExtender.inner(apix.common.util.StringExtender.get("#" + this.pickerElement.id + " .apix_year"),this.pad(this.pickerInfo.year));
		apix.common.display.ElementExtender.inner(apix.common.util.StringExtender.get("#" + this.pickerElement.id + " .apix_month"),this.pad(this.pickerInfo.month));
		apix.common.display.ElementExtender.inner(apix.common.util.StringExtender.get("#" + this.pickerElement.id + " .apix_day"),this.pad(this.pickerInfo.day));
	}
	,onUpPickerButton: function(e) {
		if(this.pickerButtonClock != null) this.pickerButtonClock = this.pickerButtonClock.remove();
		this.pickerLoop = 0;
	}
	,onDownPickerButton: function(e) {
		var el = e.currentTarget;
		this.doDownPickerButton(el);
		if(this.pickerButtonClock != null) this.pickerButtonClock = this.pickerButtonClock.remove();
		this.pickerButtonClock = new apix.common.event.timing.Clock($bind(this,this.doDownPickerButton),.25);
		this.pickerButtonClock.top.on($bind(this,this.onClockPickerButton),{ el : el});
	}
	,onClockPickerButton: function(e) {
		this.pickerLoop++;
		var el = e.data.el;
		if(this.pickerLoop > 8) {
			if(this.pickerButtonClock != null) this.pickerButtonClock = this.pickerButtonClock.remove();
			this.pickerButtonClock = new apix.common.event.timing.Clock($bind(this,this.doDownPickerButton),0.08);
			this.pickerButtonClock.top.on($bind(this,this.onClockPickerButton),{ el : el});
		}
		this.doDownPickerButton(el);
	}
	,doDownPickerButton: function(el) {
		if(apix.common.display.ElementExtender.hasClass(el,"apix_moreDay")) {
			this.pickerInfo.day++;
			if(this.pickerInfo.day > this.g.maxDayIn(this.pickerInfo.month,this.g.isBissextile(this.pickerInfo.year))) this.pickerInfo.day = 1;
		} else if(apix.common.display.ElementExtender.hasClass(el,"apix_moreMonth")) {
			this.pickerInfo.month++;
			if(this.pickerInfo.month > 12) this.pickerInfo.month = 1;
		} else if(apix.common.display.ElementExtender.hasClass(el,"apix_moreYear")) {
			this.pickerInfo.year++;
			if(this.pickerInfo.year > 9999) this.pickerInfo.year = 9999;
		} else if(apix.common.display.ElementExtender.hasClass(el,"apix_lessDay")) {
			this.pickerInfo.day--;
			if(this.pickerInfo.day < 1) this.pickerInfo.day = this.g.maxDayIn(this.pickerInfo.month,this.g.isBissextile(this.pickerInfo.year));
		} else if(apix.common.display.ElementExtender.hasClass(el,"apix_lessMonth")) {
			this.pickerInfo.month--;
			if(this.pickerInfo.month < 1) this.pickerInfo.month = 12;
		} else if(apix.common.display.ElementExtender.hasClass(el,"apix_lessYear")) {
			this.pickerInfo.year--;
			if(this.pickerInfo.year < 1000) this.pickerInfo.year = 1000;
		}
		while(this.pickerInfo.day > this.g.maxDayIn(this.pickerInfo.month,this.g.isBissextile(this.pickerInfo.year))) this.pickerInfo.day--;
		this.displayPickerInfo();
	}
	,pad: function(v) {
		if(v > 31) return this.g.strVal(v); else return StringTools.lpad(this.g.strVal(v),"0",2);
	}
	,getPickerSkin: function(v) {
		var ret = null;
		var _g = 0;
		var _g1 = this.get_pickerSkinList();
		while(_g < _g1.length) {
			var o = _g1[_g];
			++_g;
			if(o.skinName == v) {
				ret = o;
				break;
			}
		}
		return ret;
	}
	,get_displayValue: function() {
		var v;
		if(this.date == null) v = ""; else v = this.pad(this.day) + "/" + this.pad(this.month) + "/" + this.pad(this.year);
		return v;
	}
	,get_dataValue: function() {
		var v;
		if(this.date == null) v = ""; else v = this.pad(this.year) + "-" + this.pad(this.month) + "-" + this.pad(this.day);
		return v;
	}
	,get_values: function() {
		return { day : this.day, month : this.month, year : this.year, date : this.date, displayValue : this.get_displayValue(), dataValue : this.get_dataValue()};
	}
	,set_value: function(v) {
		this.setCompoProp({ value : v});
		return v;
	}
	,get_placeHolder: function() {
		var v = null;
		if(this.compoProp.placeHolder != null) v = this.compoProp.placeHolder; else v = "jj/mm/aaaa";
		this.compoProp.placeHolder = v;
		return v;
	}
	,get_pickerSkin: function() {
		var v = null;
		if(this.compoProp.pickerSkin != null) v = this.compoProp.pickerSkin; else v = "default";
		this.compoProp.pickerSkin = v;
		return v;
	}
	,get_pickerSkinList: function() {
		return apix.ui.input.DatePickerLoader.__compoSkinList;
	}
	,get_elementToHide: function() {
		var v = null;
		if(this.compoProp.elementToHide != null) v = this.compoProp.elementToHide; else v = "";
		this.compoProp.elementToHide = v;
		return v;
	}
	,__class__: apix.ui.input.DateField
});
apix.ui.input.DatePickerLoader = function() { };
apix.ui.input.DatePickerLoader.__name__ = ["apix","ui","input","DatePickerLoader"];
apix.ui.input.DatePickerLoader.__init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	if(pathStr != null && skinName == "default") haxe.Log.trace("f::Invalid skinName '" + skinName + "' when a custom path is given ! ",{ fileName : "DateField.hx", lineNumber : 395, className : "apix.ui.input.DatePickerLoader", methodName : "__init"}); else true;
	if(pathStr == null) pathStr = "apix/default/" + "DatePicker/"; else pathStr = pathStr;
	apix.ui.UICompoLoader.__push(apix.ui.input.DatePickerLoader.__load,apix.ui.UICompoLoader.baseUrl + pathStr,skinName);
};
apix.ui.input.DatePickerLoader.__load = function(fromPath,sk) {
	var h = new haxe.Http(fromPath + ("skin." + "html"));
	h.onData = apix.ui.input.DatePickerLoader.__onData;
	h.request(false);
	apix.ui.UICompoLoader.__currentSkinName = sk;
	apix.ui.UICompoLoader.__currentFromPath = fromPath;
};
apix.ui.input.DatePickerLoader.__onData = function(result) {
	var skinContent = apix.ui.UICompoLoader.__storeData(result);
	apix.ui.input.DatePickerLoader.__compoSkinList.push({ skinName : apix.ui.UICompoLoader.__currentSkinName, skinContent : skinContent, skinPath : apix.ui.UICompoLoader.__currentFromPath});
	apix.ui.UICompoLoader.__onEndLoad();
};
apix.ui.input.DatePickerLoader.__super__ = apix.ui.UICompoLoader;
apix.ui.input.DatePickerLoader.prototype = $extend(apix.ui.UICompoLoader.prototype,{
	__class__: apix.ui.input.DatePickerLoader
});
apix.ui.input.EmailFieldEvent = function(target,value,inputElement,id) {
	apix.common.event.StandardEvent.call(this,target);
	this.value = value;
	this.inputElement = inputElement;
	this.id = id;
};
apix.ui.input.EmailFieldEvent.__name__ = ["apix","ui","input","EmailFieldEvent"];
apix.ui.input.EmailFieldEvent.__super__ = apix.common.event.StandardEvent;
apix.ui.input.EmailFieldEvent.prototype = $extend(apix.common.event.StandardEvent.prototype,{
	__class__: apix.ui.input.EmailFieldEvent
});
apix.ui.input.EmailField = function(p) {
	apix.ui.input.InputField.call(this,p,true);
	this.compoSkinList = apix.ui.input.EmailFieldLoader.__compoSkinList;
	this.setup(p);
};
apix.ui.input.EmailField.__name__ = ["apix","ui","input","EmailField"];
apix.ui.input.EmailField.init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	apix.ui.input.EmailFieldLoader.__init(skinName,pathStr);
};
apix.ui.input.EmailField.__super__ = apix.ui.input.InputField;
apix.ui.input.EmailField.prototype = $extend(apix.ui.input.InputField.prototype,{
	enable: function() {
		this.inputElement = window.document.createElement("input");
		apix.common.display.ElementExtender.type(this.inputElement,"text");
		apix.common.display.ElementExtender.hide(this.inputElement);
		this.element.appendChild(this.inputElement);
		this.labelElement = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "label"));
		this.emailIdElement = apix.common.util.StringExtender.get("#" + this.get_id() + " .apix_emailId");
		apix.common.display.ElementExtender.type(this.emailIdElement,"email");
		this.domainElement = apix.common.util.StringExtender.get("#" + this.get_id() + " .apix_emailDomain");
		apix.common.display.ElementExtender.type(this.domainElement,"email");
		apix.common.display.ElementExtender.on(this.emailIdElement,"blur",$bind(this,this.onLeave));
		apix.common.display.ElementExtender.on(this.domainElement,"blur",$bind(this,this.onLeave));
		apix.common.display.ElementExtender.on(this.emailIdElement,"change",$bind(this,this.onLeave));
		apix.common.display.ElementExtender.on(this.domainElement,"change",$bind(this,this.onLeave));
		this.enabled = true;
		return this;
	}
	,update: function() {
		apix.ui.input.InputField.prototype.update.call(this);
		apix.common.display.ElementExtender.value(this.emailIdElement,this.get_idValue());
		apix.common.display.ElementExtender.placeHolder(this.emailIdElement,this.get_placeHolder());
		apix.common.display.ElementExtender.value(this.domainElement,this.get_domainValue());
		return this;
	}
	,remove: function() {
		apix.common.display.ElementExtender.off(this.emailIdElement,"blur",$bind(this,this.onLeave));
		apix.common.display.ElementExtender.off(this.domainElement,"blur",$bind(this,this.onLeave));
		apix.common.display.ElementExtender.off(this.emailIdElement,"change",$bind(this,this.onLeave));
		apix.common.display.ElementExtender.off(this.domainElement,"change",$bind(this,this.onLeave));
		apix.ui.input.InputField.prototype.remove.call(this);
		return this;
	}
	,onLeave: function() {
		if(apix.common.display.ElementExtender.value(this.emailIdElement) != "" && apix.common.display.ElementExtender.value(this.domainElement) != "") this.set_value(apix.common.display.ElementExtender.value(this.emailIdElement) + "@" + apix.common.display.ElementExtender.value(this.domainElement)); else if(apix.common.display.ElementExtender.value(this.emailIdElement) != "") this.set_value(apix.common.display.ElementExtender.value(this.emailIdElement) + "@"); else if(apix.common.display.ElementExtender.value(this.domainElement) != "") this.set_value("@" + apix.common.display.ElementExtender.value(this.domainElement)); else this.set_value("");
		if(this.blur.hasListener()) this.blur.dispatch(new apix.ui.input.EmailFieldEvent(this,this.get_value(),this.inputElement,this.get_id()));
	}
	,get_idValue: function() {
		var p = this.get_value().indexOf("@");
		var v;
		if(p != -1) v = this.get_value().substr(0,p); else v = this.get_value();
		return v;
	}
	,get_domainValue: function() {
		var p = this.get_value().indexOf("@");
		var v;
		v = this.get_value().substr(p + 1);
		return v;
	}
	,set_value: function(v) {
		v = apix.ui.input.InputField.prototype.set_value.call(this,v);
		apix.common.display.ElementExtender.value(this.emailIdElement,this.get_idValue());
		apix.common.display.ElementExtender.value(this.domainElement,this.get_domainValue());
		return v;
	}
	,get_isEmpty: function() {
		var b = apix.ui.input.InputField.prototype.get_isEmpty.call(this);
		if(!b) b = !this.get_isMail();
		return b;
	}
	,get_isMail: function() {
		var str = this.get_value();
		var b;
		if(str == "") b = true; else b = apix.common.util.StringExtender.isMail(str);
		return b;
	}
	,__class__: apix.ui.input.EmailField
});
apix.ui.input.EmailFieldLoader = function() { };
apix.ui.input.EmailFieldLoader.__name__ = ["apix","ui","input","EmailFieldLoader"];
apix.ui.input.EmailFieldLoader.__init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	if(pathStr != null && skinName == "default") haxe.Log.trace("f::Invalid skinName '" + skinName + "' when a custom path is given ! ",{ fileName : "EmailField.hx", lineNumber : 192, className : "apix.ui.input.EmailFieldLoader", methodName : "__init"}); else true;
	if(pathStr == null) pathStr = "apix/default/" + "EmailField/"; else pathStr = pathStr;
	apix.ui.UICompoLoader.__push(apix.ui.input.EmailFieldLoader.__load,apix.ui.UICompoLoader.baseUrl + pathStr,skinName);
};
apix.ui.input.EmailFieldLoader.__load = function(fromPath,sk) {
	var h = new haxe.Http(fromPath + ("skin." + "html"));
	h.onData = apix.ui.input.EmailFieldLoader.__onData;
	h.request(false);
	apix.ui.UICompoLoader.__currentSkinName = sk;
	apix.ui.UICompoLoader.__currentFromPath = fromPath;
};
apix.ui.input.EmailFieldLoader.__onData = function(result) {
	var skinContent = apix.ui.UICompoLoader.__storeData(result);
	apix.ui.input.EmailFieldLoader.__compoSkinList.push({ skinName : apix.ui.UICompoLoader.__currentSkinName, skinContent : skinContent, skinPath : apix.ui.UICompoLoader.__currentFromPath});
	apix.ui.UICompoLoader.__onEndLoad();
};
apix.ui.input.EmailFieldLoader.__super__ = apix.ui.UICompoLoader;
apix.ui.input.EmailFieldLoader.prototype = $extend(apix.ui.UICompoLoader.prototype,{
	__class__: apix.ui.input.EmailFieldLoader
});
apix.ui.input.GeoFieldEvent = function(target,value,geoValue,inputElement,id) {
	apix.common.event.StandardEvent.call(this,target);
	this.value = value;
	this.geoValue = geoValue;
	this.inputElement = inputElement;
	this.value = value;
	this.id = id;
};
apix.ui.input.GeoFieldEvent.__name__ = ["apix","ui","input","GeoFieldEvent"];
apix.ui.input.GeoFieldEvent.__super__ = apix.common.event.StandardEvent;
apix.ui.input.GeoFieldEvent.prototype = $extend(apix.common.event.StandardEvent.prototype,{
	__class__: apix.ui.input.GeoFieldEvent
});
apix.ui.input.GeoField = function(p) {
	apix.ui.UICompo.call(this);
	this.click = new apix.common.event.EventSource();
	this.compoSkinList = apix.ui.input.GeoFieldLoader.__compoSkinList;
	this.setup(p);
};
apix.ui.input.GeoField.__name__ = ["apix","ui","input","GeoField"];
apix.ui.input.GeoField.init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	apix.ui.input.GeoFieldLoader.__init(skinName,pathStr);
};
apix.ui.input.GeoField.__super__ = apix.ui.UICompo;
apix.ui.input.GeoField.prototype = $extend(apix.ui.UICompo.prototype,{
	get_inputElement: function() {
		return this.valueInputField.inputElement;
	}
	,setup: function(p) {
		apix.ui.UICompo.prototype.setup.call(this,p);
		return this;
	}
	,enable: function() {
		this.labelElement = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "label"));
		this.displayElement = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "display"));
		this.buttonElement = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "button"));
		apix.common.display.ElementExtender.on(this.buttonElement,"click",$bind(this,this.onClickButton));
		apix.common.display.ElementExtender.on(this.buttonElement,apix.common.event.StandardEvent.MOUSE_OVER,$bind(this,this.onOverButton));
		apix.common.display.ElementExtender.on(this.buttonElement,apix.common.event.StandardEvent.MOUSE_DOWN,$bind(this,this.onOverButton));
		apix.common.display.ElementExtender.on(this.buttonElement,apix.common.event.StandardEvent.MOUSE_UP,$bind(this,this.onOutButton));
		apix.common.display.ElementExtender.on(this.buttonElement,apix.common.event.StandardEvent.MOUSE_OUT,$bind(this,this.onOutButton));
		this.imgOver = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "imgOver"));
		this.imgOut = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "imgOut"));
		this.imgDisplayStyle = apix.common.display.ElementExtender.hide(this.imgOver);
		this.valueInputField = new apix.ui.input.InputField({ into : "#" + this.get_id(), label : this.lang.geoLocWhereIs, disabled : true, placeHolder : "", value : this.get_value()});
		this.enabled = true;
		return this;
	}
	,remove: function() {
		apix.ui.UICompo.prototype.remove.call(this);
		apix.common.display.ElementExtender.off(this.buttonElement,"click",$bind(this,this.onClickButton));
		apix.common.display.ElementExtender.off(this.buttonElement,apix.common.event.StandardEvent.MOUSE_OVER,$bind(this,this.onOverButton));
		apix.common.display.ElementExtender.off(this.buttonElement,apix.common.event.StandardEvent.MOUSE_DOWN,$bind(this,this.onOverButton));
		apix.common.display.ElementExtender.off(this.buttonElement,apix.common.event.StandardEvent.MOUSE_UP,$bind(this,this.onOutButton));
		apix.common.display.ElementExtender.off(this.buttonElement,apix.common.event.StandardEvent.MOUSE_OUT,$bind(this,this.onOutButton));
		apix.common.display.ElementExtender["delete"](this.element);
		return this;
	}
	,update: function() {
		apix.ui.UICompo.prototype.update.call(this);
		apix.common.display.ElementExtender.text(this.labelElement,this.get_label());
		return this;
	}
	,onOverButton: function(e) {
		apix.common.display.ElementExtender.show(this.imgOver,this.imgDisplayStyle);
		apix.common.display.ElementExtender.hide(this.imgOut);
	}
	,onOutButton: function(e) {
		apix.common.display.ElementExtender.hide(this.imgOver);
		apix.common.display.ElementExtender.show(this.imgOut,this.imgDisplayStyle);
	}
	,onClickButton: function(e) {
		this.delay = new apix.common.event.timing.Delay($bind(this,this.onTimeOut),6);
		navigator.geolocation.getCurrentPosition($bind(this,this.onGeolocSuccess),$bind(this,this.onGeolocError),{ enableHighAccuracy : true});
	}
	,onTimeOut: function() {
		this.delay.remove();
		apix.common.util.StringExtender.alert("" + Std.string(this.lang.geoLocTimeOut),null,null);
	}
	,onGeolocSuccess: function(position) {
		this.delay.remove();
		this.storeGeoLoc(position);
		this.displayGeoLoc();
		if(this.click.hasListener()) this.click.dispatch(new apix.ui.input.GeoFieldEvent(this,this.get_value(),this.geoValue,this.get_inputElement(),this.get_id()));
	}
	,onGeolocError: function(error) {
		this.delay.remove();
		apix.common.util.StringExtender.alert("" + Std.string(this.lang.geoLocError) + "\n" + "#" + error.code + "\n" + error.message,null,null);
	}
	,storeGeoLoc: function(position) {
		this.geoValue = this.g.newObject(position.coords);
		var gl = new apix.common.tools.math.GeoLoc(this.geoValue.latitude,this.geoValue.longitude);
		if(gl._lat < 0) this.geoValue.latDir = "S"; else this.geoValue.latDir = "N";
		this.geoValue.latDeg = Math.floor(Math.abs(gl._lat));
		this.geoValue.latMin = Math.floor((Math.abs(gl._lat) - Math.floor(Math.abs(gl._lat))) * 60);
		this.geoValue.latSec = apix.common.tools.math.MathX.floor(60 * ((Math.abs(gl._lat) - Math.floor(Math.abs(gl._lat))) * 60 - Math.floor((Math.abs(gl._lat) - Math.floor(Math.abs(gl._lat))) * 60)),gl._secDec);
		if(gl._long < 0) this.geoValue.longDir = "W"; else this.geoValue.longDir = "E";
		this.geoValue.longDeg = Math.floor(Math.abs(gl._long));
		this.geoValue.longMin = Math.floor((Math.abs(gl._long) - Math.floor(Math.abs(gl._long))) * 60);
		this.geoValue.longSec = apix.common.tools.math.MathX.floor(60 * ((Math.abs(gl._long) - Math.floor(Math.abs(gl._long))) * 60 - Math.floor((Math.abs(gl._long) - Math.floor(Math.abs(gl._long))) * 60)),gl._secDec);
		this.geoValue.latitudeText = "" + this.geoValue.latDeg + Std.string(this.lang.geoLocDeg) + this.geoValue.latMin + Std.string(this.lang.geoLocMin) + this.geoValue.latSec + Std.string(this.lang.geoLocSec) + this.geoValue.latDir;
		this.geoValue.longitudeText = "" + this.geoValue.longDeg + Std.string(this.lang.geoLocDeg) + this.geoValue.longMin + Std.string(this.lang.geoLocMin) + this.geoValue.longSec + Std.string(this.lang.geoLocSec) + this.geoValue.longDir;
		this.set_value(this.geoValue.latitudeText + Std.string(this.lang.geoLocSepar) + this.geoValue.longitudeText);
	}
	,displayGeoLoc: function() {
		if(!this.get_shortDisplay()) {
			apix.common.display.ElementExtender.inner(this.displayElement,"");
			var arr = [];
			arr.push(new apix.ui.input.NumberInputField({ into : "#" + this.get_id() + " ." + ("apix_" + "display"), label : this.lang.geoLocLongitude, disabled : true, decimal : 7, value : apix.common.util.StringExtender.toDecimal(Std.string(this.geoValue.longitude),7)}));
			arr.push(new apix.ui.input.NumberInputField({ into : "#" + this.get_id() + " ." + ("apix_" + "display"), label : this.lang.geoLocLatitude, disabled : true, decimal : 7, value : apix.common.util.StringExtender.toDecimal(Std.string(this.geoValue.latitude),7)}));
			arr.push(new apix.ui.input.NumberInputField({ into : "#" + this.get_id() + " ." + ("apix_" + "display"), label : this.lang.geoLocAccuracy, disabled : true, decimal : 0, value : Std.string(this.geoValue.accuracy)}));
			var _g = 0;
			while(_g < arr.length) {
				var compo = arr[_g];
				++_g;
				apix.common.display.ElementExtender.css(compo.labelElement,"display","inline-block");
				apix.common.display.ElementExtender.css(compo.labelElement,"textAlign","right");
				apix.common.display.ElementExtender.css(compo.inputElement,"display","inline-block");
				apix.common.display.ElementExtender.css(compo.labelElement,"width","49%");
				apix.common.display.ElementExtender.css(compo.inputElement,"width","49%");
			}
		}
		this.valueInputField.set_value(this.get_value());
	}
	,get_label: function() {
		var v = null;
		if(this.compoProp.label != null) v = this.compoProp.label; else {
			v = this.lang.geoLocRecord;
			if(this.g.strVal(v,"") == "") v = "Save your geolocation :";
		}
		this.compoProp.label = v;
		return v;
	}
	,get_value: function() {
		var v = null;
		if(this.compoProp.value != null) v = this.compoProp.value; else v = "";
		this.compoProp.value = v;
		return v;
	}
	,set_value: function(v) {
		apix.common.display.ElementExtender.value(this.get_inputElement(),v);
		this.setCompoProp({ value : v});
		return v;
	}
	,get_shortDisplay: function() {
		var v;
		if(this.compoProp.shortDisplay != null) v = this.compoProp.shortDisplay; else v = false;
		this.compoProp.shortDisplay = v;
		return v;
	}
	,__class__: apix.ui.input.GeoField
});
apix.ui.input.GeoFieldLoader = function() { };
apix.ui.input.GeoFieldLoader.__name__ = ["apix","ui","input","GeoFieldLoader"];
apix.ui.input.GeoFieldLoader.__init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	if(pathStr != null && skinName == "default") haxe.Log.trace("f::Invalid skinName '" + skinName + "' when a custom path is given ! ",{ fileName : "GeoField.hx", lineNumber : 318, className : "apix.ui.input.GeoFieldLoader", methodName : "__init"}); else true;
	if(pathStr == null) pathStr = "apix/default/" + "GeoField/"; else pathStr = pathStr;
	apix.ui.UICompoLoader.__push(apix.ui.input.GeoFieldLoader.__load,apix.ui.UICompoLoader.baseUrl + pathStr,skinName);
};
apix.ui.input.GeoFieldLoader.__load = function(fromPath,sk) {
	var h = new haxe.Http(fromPath + ("skin." + "html"));
	h.onData = apix.ui.input.GeoFieldLoader.__onData;
	h.request(false);
	apix.ui.UICompoLoader.__currentSkinName = sk;
	apix.ui.UICompoLoader.__currentFromPath = fromPath;
};
apix.ui.input.GeoFieldLoader.__onData = function(result) {
	var skinContent = apix.ui.UICompoLoader.__storeData(result);
	apix.ui.input.GeoFieldLoader.__compoSkinList.push({ skinName : apix.ui.UICompoLoader.__currentSkinName, skinContent : skinContent, skinPath : apix.ui.UICompoLoader.__currentFromPath});
	apix.ui.UICompoLoader.__onEndLoad();
};
apix.ui.input.GeoFieldLoader.__super__ = apix.ui.UICompoLoader;
apix.ui.input.GeoFieldLoader.prototype = $extend(apix.ui.UICompoLoader.prototype,{
	__class__: apix.ui.input.GeoFieldLoader
});
apix.ui.input.InputFieldEvent = function(target,value,inputElement,id) {
	apix.common.event.StandardEvent.call(this,target);
	this.value = value;
	this.inputElement = inputElement;
	this.id = id;
};
apix.ui.input.InputFieldEvent.__name__ = ["apix","ui","input","InputFieldEvent"];
apix.ui.input.InputFieldEvent.__super__ = apix.common.event.StandardEvent;
apix.ui.input.InputFieldEvent.prototype = $extend(apix.common.event.StandardEvent.prototype,{
	__class__: apix.ui.input.InputFieldEvent
});
apix.ui.input.InputFieldLoader = function() { };
apix.ui.input.InputFieldLoader.__name__ = ["apix","ui","input","InputFieldLoader"];
apix.ui.input.InputFieldLoader.__init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	if(pathStr != null && skinName == "default") haxe.Log.trace("f::Invalid skinName '" + skinName + "' when a custom path is given ! ",{ fileName : "InputField.hx", lineNumber : 262, className : "apix.ui.input.InputFieldLoader", methodName : "__init"}); else true;
	if(pathStr == null) pathStr = "apix/default/" + "InputField/"; else pathStr = pathStr;
	apix.ui.UICompoLoader.__push(apix.ui.input.InputFieldLoader.__load,apix.ui.UICompoLoader.baseUrl + pathStr,skinName);
};
apix.ui.input.InputFieldLoader.__load = function(fromPath,sk) {
	var h = new haxe.Http(fromPath + ("skin." + "html"));
	h.onData = apix.ui.input.InputFieldLoader.__onData;
	h.request(false);
	apix.ui.UICompoLoader.__currentSkinName = sk;
	apix.ui.UICompoLoader.__currentFromPath = fromPath;
};
apix.ui.input.InputFieldLoader.__onData = function(result) {
	var skinContent = apix.ui.UICompoLoader.__storeData(result);
	apix.ui.input.InputFieldLoader.__compoSkinList.push({ skinName : apix.ui.UICompoLoader.__currentSkinName, skinContent : skinContent, skinPath : apix.ui.UICompoLoader.__currentFromPath});
	apix.ui.UICompoLoader.__onEndLoad();
};
apix.ui.input.InputFieldLoader.__super__ = apix.ui.UICompoLoader;
apix.ui.input.InputFieldLoader.prototype = $extend(apix.ui.UICompoLoader.prototype,{
	__class__: apix.ui.input.InputFieldLoader
});
apix.ui.input.LinkFieldEvent = function(target,values,value,inputTextElement,inputUrlElement,inputElement,id) {
	apix.common.event.StandardEvent.call(this,target);
	this.values = values;
	this.value = value;
	this.inputTextElement = inputTextElement;
	this.inputUrlElement = inputUrlElement;
	this.inputElement = inputElement;
	this.id = id;
};
apix.ui.input.LinkFieldEvent.__name__ = ["apix","ui","input","LinkFieldEvent"];
apix.ui.input.LinkFieldEvent.__super__ = apix.common.event.StandardEvent;
apix.ui.input.LinkFieldEvent.prototype = $extend(apix.common.event.StandardEvent.prototype,{
	__class__: apix.ui.input.LinkFieldEvent
});
apix.ui.input.LinkField = function(p) {
	apix.ui.UICompo.call(this);
	this.blur = new apix.common.event.EventSource();
	this.compoSkinList = apix.ui.input.LinkFieldLoader.__compoSkinList;
	this.setup(p);
};
apix.ui.input.LinkField.__name__ = ["apix","ui","input","LinkField"];
apix.ui.input.LinkField.init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	apix.ui.input.LinkFieldLoader.__init(skinName,pathStr);
};
apix.ui.input.LinkField.getLinkFrom = function(v,trgt,attr) {
	if(attr == null) attr = "";
	if(trgt == null) trgt = "_blank";
	var arr = apix.ui.input.LinkField.getArrayFrom(v);
	if(arr[0] == "") arr[0] = arr[1];
	var v1 = "<a href='" + arr[1] + "' target='" + trgt + "' " + attr + " >" + arr[0] + "</a>";
	return v1;
};
apix.ui.input.LinkField.getArrayFrom = function(v) {
	var arr;
	try {
		arr = JSON.parse(v);
	} catch( e ) {
		arr = ["",""];
	}
	return arr;
};
apix.ui.input.LinkField.__super__ = apix.ui.UICompo;
apix.ui.input.LinkField.prototype = $extend(apix.ui.UICompo.prototype,{
	enable: function() {
		this.labelTextElement = apix.common.util.StringExtender.get("#" + this.get_id() + " .apix_linkTextLabel");
		this.labelUrlElement = apix.common.util.StringExtender.get("#" + this.get_id() + " .apix_linkUrlLabel");
		this.inputTextElement = apix.common.util.StringExtender.get("#" + this.get_id() + " .apix_linkText");
		this.inputUrlElement = apix.common.util.StringExtender.get("#" + this.get_id() + " .apix_linkUrl");
		apix.common.display.ElementExtender.type(this.inputUrlElement,"url");
		this.labelElement = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "label"));
		apix.common.display.ElementExtender.on(this.inputUrlElement,"blur",$bind(this,this.onLeave));
		apix.common.display.ElementExtender.on(this.inputTextElement,"blur",$bind(this,this.onLeave));
		apix.common.display.ElementExtender.on(this.inputUrlElement,"change",$bind(this,this.onLeave));
		apix.common.display.ElementExtender.on(this.inputTextElement,"change",$bind(this,this.onLeave));
		this.inputElement = window.document.createElement("input");
		apix.common.display.ElementExtender.type(this.inputElement,"text");
		apix.common.display.ElementExtender.hide(this.inputElement);
		this.element.appendChild(this.inputElement);
		this.enabled = true;
		return this;
	}
	,update: function() {
		apix.ui.UICompo.prototype.update.call(this);
		apix.common.display.ElementExtender.text(this.labelElement,this.get_label());
		apix.common.display.ElementExtender.text(this.labelTextElement,this.get_textLabel());
		apix.common.display.ElementExtender.value(this.inputTextElement,this.get_textValue());
		apix.common.display.ElementExtender.placeHolder(this.inputTextElement,this.get_textPlaceHolder());
		apix.common.display.ElementExtender.css(this.inputTextElement,"width",this.get_width());
		apix.common.display.ElementExtender.text(this.labelUrlElement,this.get_urlLabel());
		apix.common.display.ElementExtender.value(this.inputUrlElement,this.get_urlValue());
		apix.common.display.ElementExtender.placeHolder(this.inputUrlElement,this.get_urlPlaceHolder());
		apix.common.display.ElementExtender.css(this.inputUrlElement,"width",this.get_width());
		apix.common.display.ElementExtender.value(this.inputElement,this.get_values().data);
		return this;
	}
	,remove: function() {
		apix.ui.UICompo.prototype.remove.call(this);
		apix.common.display.ElementExtender.off(this.inputUrlElement,"blur",$bind(this,this.onLeave));
		apix.common.display.ElementExtender.off(this.inputTextElement,"blur",$bind(this,this.onLeave));
		apix.common.display.ElementExtender.off(this.inputUrlElement,"change",$bind(this,this.onLeave));
		apix.common.display.ElementExtender.off(this.inputTextElement,"change",$bind(this,this.onLeave));
		if(this.blur.hasListener()) this.blur.off();
		apix.common.display.ElementExtender["delete"](this.element);
		return this;
	}
	,onLeave: function() {
		this.set_value(this.get_values().data);
		if(this.blur.hasListener()) this.blur.dispatch(new apix.ui.input.LinkFieldEvent(this,this.get_values(),this.get_value(),this.inputTextElement,this.inputUrlElement,this.inputElement,this.get_id()));
	}
	,get_values: function() {
		return { text : this.get_text(), url : this.get_url(), data : "[\"" + this.get_text() + "\",\"" + this.get_url() + "\"]"};
	}
	,get_text: function() {
		return apix.common.display.ElementExtender.value(this.inputTextElement);
	}
	,get_url: function() {
		var v = apix.common.display.ElementExtender.value(this.inputUrlElement);
		if(v != "" && HxOverrides.substr(v,0,4) != "http") v = "http://" + v;
		apix.common.display.ElementExtender.value(this.inputUrlElement,v);
		this.compoProp.urlValue = v;
		return apix.common.display.ElementExtender.value(this.inputUrlElement);
	}
	,get_label: function() {
		var v = null;
		if(this.compoProp.label != null) v = this.compoProp.label; else v = "Untitled";
		this.compoProp.label = v;
		return v;
	}
	,get_textPlaceHolder: function() {
		var v = null;
		if(this.compoProp.textPlaceHolder != null) v = this.compoProp.textPlaceHolder; else v = "Link text";
		this.compoProp.textPlaceHolder = v;
		return v;
	}
	,get_urlPlaceHolder: function() {
		var v = null;
		if(this.compoProp.urlPlaceHolder != null) v = this.compoProp.urlPlaceHolder; else v = "http://...";
		this.compoProp.urlPlaceHolder = v;
		return v;
	}
	,get_textValue: function() {
		return apix.ui.input.LinkField.getArrayFrom(this.get_value())[0];
	}
	,get_urlValue: function() {
		return apix.ui.input.LinkField.getArrayFrom(this.get_value())[1];
	}
	,get_value: function() {
		var v = null;
		if(this.compoProp.value != null) v = this.compoProp.value; else v = "[\"\"],[\"\"]";
		this.compoProp.value = v;
		return v;
	}
	,get_isEmpty: function() {
		return this.g.strVal(this.get_urlValue(),"") == "";
	}
	,set_value: function(v) {
		apix.common.display.ElementExtender.value(this.inputElement,v);
		this.setCompoProp({ value : v});
		return v;
	}
	,get_textLabel: function() {
		var v = null;
		if(this.compoProp.textLabel != null) v = this.compoProp.textLabel; else v = "Enter link text";
		this.compoProp.textLabel = v;
		return v;
	}
	,get_urlLabel: function() {
		var v = null;
		if(this.compoProp.urlLabel != null) v = this.compoProp.urlLabel; else v = "Enter link url";
		this.compoProp.urlLabel = v;
		return v;
	}
	,__class__: apix.ui.input.LinkField
});
apix.ui.input.LinkFieldLoader = function() { };
apix.ui.input.LinkFieldLoader.__name__ = ["apix","ui","input","LinkFieldLoader"];
apix.ui.input.LinkFieldLoader.__init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	if(pathStr != null && skinName == "default") haxe.Log.trace("f::Invalid skinName '" + skinName + "' when a custom path is given ! ",{ fileName : "LinkField.hx", lineNumber : 298, className : "apix.ui.input.LinkFieldLoader", methodName : "__init"}); else true;
	if(pathStr == null) pathStr = "apix/default/" + "LinkField/"; else pathStr = pathStr;
	apix.ui.UICompoLoader.__push(apix.ui.input.LinkFieldLoader.__load,apix.ui.UICompoLoader.baseUrl + pathStr,skinName);
};
apix.ui.input.LinkFieldLoader.__load = function(fromPath,sk) {
	var h = new haxe.Http(fromPath + ("skin." + "html"));
	h.onData = apix.ui.input.LinkFieldLoader.__onData;
	h.request(false);
	apix.ui.UICompoLoader.__currentSkinName = sk;
	apix.ui.UICompoLoader.__currentFromPath = fromPath;
};
apix.ui.input.LinkFieldLoader.__onData = function(result) {
	var skinContent = apix.ui.UICompoLoader.__storeData(result);
	apix.ui.input.LinkFieldLoader.__compoSkinList.push({ skinName : apix.ui.UICompoLoader.__currentSkinName, skinContent : skinContent, skinPath : apix.ui.UICompoLoader.__currentFromPath});
	apix.ui.UICompoLoader.__onEndLoad();
};
apix.ui.input.LinkFieldLoader.__super__ = apix.ui.UICompoLoader;
apix.ui.input.LinkFieldLoader.prototype = $extend(apix.ui.UICompoLoader.prototype,{
	__class__: apix.ui.input.LinkFieldLoader
});
apix.ui.input.NumberInputField = function(p) {
	apix.ui.input.InputField.call(this,p);
	this.setup({ type : "text"});
};
apix.ui.input.NumberInputField.__name__ = ["apix","ui","input","NumberInputField"];
apix.ui.input.NumberInputField.__super__ = apix.ui.input.InputField;
apix.ui.input.NumberInputField.prototype = $extend(apix.ui.input.InputField.prototype,{
	enable: function() {
		apix.ui.input.InputField.prototype.enable.call(this);
		apix.common.display.ElementExtender.on(this.inputElement,apix.common.event.StandardEvent.MOUSE_DOWN,$bind(this,this.onDownInputElement));
		apix.common.display.ElementExtender.on(this.inputElement,"blur",$bind(this,this.onLeaveInputElement));
		return this;
	}
	,remove: function() {
		apix.common.display.ElementExtender.off(this.inputElement,apix.common.event.StandardEvent.MOUSE_DOWN,$bind(this,this.onDownInputElement));
		apix.common.display.ElementExtender.off(this.inputElement,"blur",$bind(this,this.onLeaveInputElement));
		apix.ui.input.InputField.prototype.remove.call(this);
		return this;
	}
	,update: function() {
		var stp = "";
		var dot = ".";
		this.setCompoProp({ 'int' : this.get_decimal() == 0});
		apix.ui.input.InputField.prototype.update.call(this);
		this.align();
		apix.common.display.ElementExtender.type(this.inputElement,"number");
		this.type = "number";
		if(!this.get_int()) {
			var _g1 = 0;
			var _g = this.get_decimal();
			while(_g1 < _g) {
				var i = _g1++;
				stp += "0" + dot;
				dot = "";
			}
		}
		stp += "1";
		apix.common.display.ElementExtender.step(this.inputElement,stp);
		return this;
	}
	,onDownInputElement: function(e) {
		apix.common.display.ElementExtender.css(this.inputElement,"textAlign","left");
	}
	,onLeaveInputElement: function(e) {
		var v = null;
		if(!this.get_int()) {
			v = this.comaToDot(apix.common.display.ElementExtender.value(this.inputElement));
			v = Std.string(apix.common.tools.math.MathX.round(this.g.numVal(v),this.get_decimal()));
			v = apix.common.util.StringExtender.toDecimal(v,this.get_decimal());
		} else v = apix.common.display.ElementExtender.value(this.inputElement);
		if(this.g.numVal(v,0) == 0) apix.common.display.ElementExtender.value(this.inputElement,"");
		this.align();
		this.set_value(v);
		if(this.blur.hasListener()) this.blur.dispatch(new apix.ui.input.InputFieldEvent(this,this.get_value(),this.inputElement,this.get_id()));
	}
	,align: function() {
		apix.common.display.ElementExtender.css(this.inputElement,"textAlign","right");
	}
	,comaToDot: function(v) {
		var len = v.length;
		var p = v.indexOf(",");
		if(p > -1) {
			v = v.substring(0,p) + "." + v.substring(p + 1,len);
			this.comaConversion = true;
		} else this.comaConversion = false;
		return v;
	}
	,get_decimal: function() {
		var v = null;
		if(this.compoProp.decimal != null) v = this.compoProp.decimal; else if(this.get_int()) v = 0; else v = 2;
		this.compoProp.decimal = v;
		return v;
	}
	,get_int: function() {
		var v = null;
		if(this.compoProp["int"] != null) v = this.compoProp["int"]; else v = false;
		this.compoProp["int"] = v;
		return v;
	}
	,__class__: apix.ui.input.NumberInputField
});
apix.ui.input.PhotoFieldEvent = function(target,value,inputElementArray,id) {
	apix.common.event.StandardEvent.call(this,target);
	this.inputElementArray = inputElementArray;
	this.value = value;
	this.id = id;
};
apix.ui.input.PhotoFieldEvent.__name__ = ["apix","ui","input","PhotoFieldEvent"];
apix.ui.input.PhotoFieldEvent.__super__ = apix.common.event.StandardEvent;
apix.ui.input.PhotoFieldEvent.prototype = $extend(apix.common.event.StandardEvent.prototype,{
	__class__: apix.ui.input.PhotoFieldEvent
});
apix.ui.input.PhotoField = function(p) {
	apix.ui.UICompo.call(this);
	this.done = false;
	this.click = new apix.common.event.EventSource();
	this.inputElementArray = [];
	this.compoSkinList = apix.ui.input.PhotoFieldLoader.__compoSkinList;
	this.setup(p);
};
apix.ui.input.PhotoField.__name__ = ["apix","ui","input","PhotoField"];
apix.ui.input.PhotoField.init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	apix.ui.input.PhotoFieldLoader.__init(skinName,pathStr);
};
apix.ui.input.PhotoField.__super__ = apix.ui.UICompo;
apix.ui.input.PhotoField.prototype = $extend(apix.ui.UICompo.prototype,{
	setup: function(p) {
		apix.ui.UICompo.prototype.setup.call(this,p);
		return this;
	}
	,enable: function() {
		this.labelElement = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "label"));
		this.buttonElement = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "button"));
		this.photoCtnrElement = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "photoCtnr"));
		apix.common.display.ElementExtender.on(this.buttonElement,"click",$bind(this,this.onClickButton));
		this.enabled = true;
		return this;
	}
	,remove: function() {
		apix.ui.UICompo.prototype.remove.call(this);
		apix.common.display.ElementExtender.off(this.buttonElement,"click",$bind(this,this.onClickButton));
		var _g1 = 0;
		var _g = this.get_value().length;
		while(_g1 < _g) {
			var i = _g1++;
			var md = this.get_value()[i];
			if(md.button != null) {
				var but = md.button;
				apix.common.display.ElementExtender.off(but,"click",$bind(this,this.onClickRemoveButton));
			}
		}
		apix.common.display.ElementExtender["delete"](this.element);
		return this;
	}
	,update: function() {
		apix.ui.UICompo.prototype.update.call(this);
		apix.common.display.ElementExtender.text(this.labelElement,this.get_label());
		apix.common.display.ElementExtender.css(this.element,"width",this.get_width());
		apix.common.display.ElementExtender.css(this.element,"height",this.get_height());
		if(this.get_value() != [] && !this.done) {
			this.done = true;
			if(this.get_value().length > this.get_max()) haxe.Log.trace("f:: " + Std.string(this.lang.photoLimit),{ fileName : "PhotoField.hx", lineNumber : 138, className : "apix.ui.input.PhotoField", methodName : "update"});
			var _g1 = 0;
			var _g = this.get_value().length;
			while(_g1 < _g) {
				var i = _g1++;
				var md = this.get_value()[i];
				var pcEl = this.displayPicture(md.data);
				this.inputElementArray.push(apix.common.display.ElementExtender.elemByTag(pcEl,"img"));
				this.addRemoveButtonListener(pcEl,md);
			}
		}
		return this;
	}
	,renamePicture: function() {
		var _g1 = 0;
		var _g = this.get_value().length;
		while(_g1 < _g) {
			var i = _g1++;
			var md = this.get_value()[i];
			md.name = this.get_name() + "-" + (i + 1);
		}
	}
	,onClickButton: function(e) {
		if(this.get_value().length < this.get_max()) {
			if(this.g.get_isMobile()) navigator.camera.getPicture($bind(this,this.onCamSuccess),$bind(this,this.onCamError),{ targetWidth : 400, targetHeight : 400, quality : 50, destinationType : Camera.DestinationType.DATA_URL}); else {
				var pcEl = this.displayPicture("iVBORw0KGgoAAAANSUhEUgAAASIAAADICAYAAABMFuzmAAAVPklEQVR4Xu2dy/IlRRHGs+XuRi7qFngCdedO3wA0RNypEYZyEYQxxGEDM2zkJkQAhrggwB1jaMA8gfoCBuxdzFqDiyuJudhG9ZxzOKe7qrqq6979+y9nqquyvsz6TmZWVVYn/IEACIBAYQS6wuMzPAiAAAgIRIQRgAAIFEcAIiquAgQAARCAiLABEACB4ghARMVVgAAgAAIQETYAAiBQHAGIqLgKEAAEQAAiwgZAAASKIwARFVcBAoAACEBE2AAIgEBxBCCi4ipAABAAAYgIGwCBrAj0vxGRX4jITSLyskj3dNbhKx2sMSJCiZXaEWI5I9BfE5Ev7JpfFekUIW3+rzUiQombN9mWARh+SM+ezqBrbA2mwb8xEPoeJaYxBHrNgcCJN7QbECJSQDRORPI8MXaOBcQYcRAY/5AOS7CxNRgHiXEvjYGgUyRklMY06DUeAkNIdkZEbp72CRGtwSNSc7gs0t0Sz2joCQRiI6ALyfZjQERrISLc29jrhv4iITB4Qk8d7ZJp+oWIWiSi412zI6WizEgrh26iIdDfLiIf2UmIHNHBL4yGe5aOdNufw8AkrbPgzyBuCPSvicjP3TaD+BFt0CNSImsT1pCR2wqhVVIEZkOx10XksVMRIKJWiejy7nj82KRIWiddZHRuR8Aaiv1PRO4S6T6d/pBCRK0S0bsi8qDeKFAqdFEKgf59EblPM7o6hPvC5+fdOJSr01Bj54iG0EwlAT82xN+vi3SPlzJFxt0qAv2PRORtzew19ggRrYSIBjLS3Nk5TA8y2iofZJ23NR+kvKA7r4di4z+IaEVEZE1aq//8sUj3Tla7ZLANITC7NW/ZxZ1sttyhJ6wNwem2vVgrIL0pab0XGM+oVtU1K9dAQL/f5ShNaY2ZH8GJ3V4Q6X7QLCSRBG8wR7SfeW9JWhOmRbIPujkg0D8pIr+1/HircOyN+RzlxG7/K9J9cetAt0xE6tfpEwcF4hk5gEQTGwLWDZKjrXkXFIe+RnbLbm/DRDTkicZXPpRR7KvfHVsFZOSyRmgzQuBQEfQ2AzSjrXlXAElYj5FqnYh0u2ea06vDtLkG4rpOaLdDoL8qIjdo4Pi7iNy/PMkMEa2MiAavSFO1cbjrMzpKL54uNKtx2wjoQqgBkQh2BBFthIgGgtKR0UWR7v5tLzBmb0dgsJtHDJ7QwlBsPCJEtAEikqNzGdpj92q37eHlbjULeZ0I2Koo7j2hThemLYADIlojEV0RkRuPJnbk9Rh3O9Qv2zmR7rkFVsQnq0LA6gHtZ6rs5Zci3atxpg4RrZGIdOeJjhLT1usgb4l0P4ljXPTSHgLa8P14GoqA/iQiD8X1oCGiNRKR7hLs6OG6/hkROW9YKH/bXQm51N5CQuJlCMzWDVLdJjzyARGtkIiGxLTDw3VDmPamuYTIAI3aruUZ4GWru5GvZu+JqbNpL6V9pgoiWikRDWTk+Phi/7yI/Nqyajhy3wilLBPTWDcooQc0ltTVVpfNsMWvGj/QeBLOj4jIdoCxv0dE1O38bxmUxo3oFq15VmZjvjAjCfn8aM5OaDUN1kRE4+seozyRTmf9WyKiilqNr4Wwq7YaEx8WvulskKVuUEoA8IjWHJoZrnu4VGzs1WlZHSlT1yjleszSt3VnrNC1H4hoxUQ0/PLp3j1zMLahxMPLljeoFFH9br7EQ5aVxSDOCFhJ6IpIp3kC2rnzgIYQ0dqJSOcVOYRoA4m57KrhIQUsv3yfDgT0qOWHJcPOmG22ENHKieiQDxhfeHXwivbQGAuh7xtkTmzmW77rGMmqv0p0BxFtgIi0IZqjV3Qgo7lfVO6rVcla1lCsEhJi10xnOivaNTuennabdqEhGn9h2Vmrgoxm74o5lnDNORk8oo14RCGJa51BWn9pyRvlXMMnY83eFatUNxDRlogoIHGtJSPbfTX1ATtrWQlploQWesA5JgERbYiIYiSux3Cxs5ZjmZrHmA3DBqW7vaZRciYQ0caISJcYHCAIvNw6u7O295BUCYkGi7DNbn+7rOKIHuLhPTHb+18Ve0CTHzTHe5EuMK+jzUqT1SeJa90hx30Dj239iTHN7aztP1BG9wcReTpuTZulBhiFZBYP7u+tDCVczs08BtoQCel+HHlOaAtEpMsVHS+kCEbs5CEVJiQnr2Ipwfh+NxM+HWT9vuVQYiNhmDbfiEc0gmUDRDTYqyKjJ0TkVsOKiUFGlXpIw6JW8/9ZhU+Mq/Dtxeu1fw7k84ChcP2x6p5tu8wvOaIN5ohOwjSbdxRxq3dYVKrukVr8pr8M55CcwhqbfA5PKGt/8V1J2deTuhC/bKuvCDHaQ0QbJ6KDd3RGRHQXHgNyRtoF6UJIEQnwhHR1zykV9CqCclMN7IS5EpRLNVHXvtbTbiOhmfFXe3wn7bJId0t89Tp5SJF2mWbP16jE+dlyifNZ+fbwJypcH1+7fj1OKkR4Xj/yG62V1hsmosE7UkXR3h4pK2F1RqdzSCltJ+HcfMQ2viG2UvI58VQ9Kon6YNp2240T0UBGY8PIsLvltMsW27L45Y2N6KL+yA/pYIOIxFidMfKjemP4g3ImvkvgaHfK91Pax0OA/JAJS4hIrNUZe5FuXM86nl0eeopOSitK7iaAu0iX2ooQBatEFgHBOChENEBjTSZ/R6R7vy61IU17CPTqWtENI7kj79K2h8peYojoRHcDIamXX7+GwbRr1PVJjjc0pxOIaIJQf7+IvDf6Z3Vf7cvltrzn1Mj/143A0kcd6p5VTOkgIi2axgR24K39mKqjrzYQ0HpDn4l0t7Uhfx4pISI9EamrIOpZah0+PEmdxzZXMIrx8Ca5oZF2ISKjuQ/5oo8NZBThkuwK1tlmpnAoyKbWy+6S7tzkIaE5hI7/HyKyojW41U/NlKJQPbBd7mN1zbTVlk5xOBhqJCG26w26h4icFoV269X2JcTkhGvNjYbKBef1EtoKmRlJiEOlFnVDRE5rwXg3yulrj0b/ul46hHNLHpglaNp/XUT+Ya7fZCIiIwkRys9oCSLyMuPoJ6B1o38g0n3DSywaR0RgCMf+KiKKjEyBhGbdQEIhSoCIQtAbvo1OTh+KdJZFECwwHdjzgu+IyA/tIB17RFZvGU/I0dogIkeg3JsFEdO/ReSfIvLNXVjwF5Hue+5j0zIMAW1VhD9OiWlPRNozQnsRICEPZUBEHmDlaXpSJiLTpds8M6t/lP6SiNx9JOeHIvJtEfnkVHZFRJBQTH1CRDHRjNLXpD4Sh9+i4OrSSf+piHxp1/I/10mo+0BTs+qyodSw+hRPyAXqURuIaAFoaT+ZXC9xOLeSVqLt9N4r70dVWlBktKslbvV8xtDwo7HQWCCihcCl+0xr+AXOoDjnugrIlg79ac/OZ8ggoQC1QEQB4KX7VHtbWw2XwdidCWgj3sAkVB7Pe+VEnM7Kj3uGiPLg7DmKMRxI9MqIEi/KS7CRiNLrAGliIpgQkcodqdBNlYZ56frjkPyFIgARhSKY7PtcB+SivwQbSEZeOZk9+ikJmuehk9n45x1DRBlAXj6EcVEGLvbBA1IXen8187yz5c6clTA85XO+XGyD0nNMV63w6oYrUiHtIKIQ9LJ8q80XqXDkruUVIwcv6KOZqgIO78vHCCGdZHFBOpFXBBG5gB/aBiIKRTD598Z8yUWRTpW19fjr/ywi3zVf5hy68nwJ1kRGthvqxyL3arv8PsskDJ6OjqBdx/SAbPLuXYoxfORZZ1uIqBm9ahesZzhi3QG6ICIPLfOytGTk8PqJNbybSULneiMMjyjHEoGIcqAcZQxtxUjPw45aIgoM8/aTm/TtUEVg4tWonNSd7mSYgyRyjBHFQJruBCJqSn1aD8LDK5qEZmrhvxBnC3pCKpYqAsYQ0WMuQ8I9w45WjjGaMsIkwkJESWBN2WmtT9MMJPmEiNwqIqqKwE/NBd60ntk1ke5GP+R6VUjuK7tvLol09/p979IaInJBKbQNRBSKYPbvtV5Roh2jVJPTEpGnNzR4RCpZf05E1C7gE2kqW0JEqazguF+IKAfK0cfIsWM0LPJnd4v8ybiLfBKaVXxjHSKKbr6aDiGiHChHHyM0V+Qi0EltHofEs0ufLbaBiHJoDSLKgXKSMSbhTeTw7ISINly+FiJKYr6jTiGiHCgnGSN1eJYj/6IDJmVIuEQRENES1Hy/gYh8Eaumfa4DfbknXFtICBHlsACIKAfKycaouazsSULa4xGA2kJCiCiZ+R51DBHlQDnZGKnzREsFn3hrHo8AlAoJTXOFiJZagc93EJEPWtW1TZ0nWjrhWuVaMh+IaAlqvt9ARL6IVdW+1jzRxFO7KiIXj27+e4RqpQGHiHJoACLKgXLSMWpcKLrclZwdwbDgJHVSIA2d14hvCRzSjgkRpcU3Q+81LhSdTLXms+ZUVCO+czK39/8QUXs6G0lc40LREpEqNzKytxaKjNWIb/NGO5kARNS8TmtcKFoiUrfzGwzPasS3eaOFiNanwhoXikmmFsOzGvFdnxXjETWv09oWim0nr9ZaSjYjqA3f5g1WOwGIqHm91rZQbGeItFUDPMvd5lZYbfjmnn+e8SCiPDgnHKW2hTIXftV69smkotrwTWhKBbuGiAqCH2fo2haKy/03lzZx0AnrpTXSDJttya8hopLoRxm7JiJyXbiT8K3S8KwVOaMYUtFOIKKi8McYvCoiujZ9PVZ3VsiVsGLgE9JHK55byBzr+BYiqkMPAVJURUSj533EUjWyJrl18LdClgGmU9GnEFFFylgmSk0L2seDyPEU0DJEr39FWBaCnu+3EJEvYtW1r5mIbFc4aqs7NFasD6lWZxTNCQQRNaeyuQVT8v6Wr5czkNErIjL3MKLKPb0U50VaF4UTlrmgFLMNRBQTzSJ9VeUReT54eFIWdg69yK+U2IZbU2G3OVjr+H+IqA49BEhRExH5TsOLiNTl/Qz2qj39/ZlId5vv7GjvjkAGxboLQ8slCOQiIqcwyjOEGvp8z33WWYhIcwRBGini5o5kbS0hoto04i1PNiK6JCJ3O4h3RaS72aHdrolN/lxz20ub4wVdd2S21BIial7bqRfr5J16F8Qc37KfSwqnntvxVPrbReSj0YHMayLdjS4Tpk0YAhBRGH4VfJ16sU62sV3n7BCmzZ3VST23EyJ6V0QeHE2OkMxV24HtIKJAAMt/nnqxuvSvDWkUNDM7XXNndVzGjqEBrfwXRTqVw+IvAwIQUQaQ0w6RerG69t+/JiKPTedqPdQ4vhIy8kBcxw5FWFuw7Q6R7tPQnvneDQGIyA2nilulXqw+/evIyIuIZnBOsWumJdCMZ5YqNq2MokFEGcFOM5QPUSyRwLd/n/ZaT8QiZGwiMoaU5IaWmErANxBRAHh1fOqz8JdI7NP/3C7YeHwjEegETeCl9OoF2htGg0FCS8wk8BuIKBDA8p/7EMUSaX36n9sF040/kNEZEbGdPVJvor0Y966ZNiRzPHawBEe+sSEAETVvH3M7T6ETXLx9rwau1LtYklgPxZHvIaJV28CEKCKHML55nAPYlR4GNIaD3CcruE7wiAqCH2fo1DfFvfI4x1Oq1RvS3SVLEPrF0e5WeoGImtd0jvtRQyjz6LQetRY8dTboDZHu8XqgteahyAtVoCiIqAIlhIuQOjwLl7BsD8bwstLwsSxaJUaHiEqgHn3MFp9ynt1BixQuWUPLSsPH6AZSfYcQUfUqchGwxaec1bxmQ74IiXctSVcYPrroeb1tIKLV6FZLRpG8ihQgmbbQx2OFnKbWjoEXlEKdgX1CRIEA1vW59sxPBK8idJYDITyiOcXs0PESIjImp8kJOSBeoglEVAL1ZGMak7IFvQBXz8cEyiIi0m3RqwEK4pBM6avoGCJahRr3kzB6AgFe0aIKjb6oHm2h+1wpMQ2j9QzZpvfVSsb2EFFGsPMNpc0XLVyIQVc85qasSRqHElHMuc+Jz//HQgAiioVkdf1oCWRBaBKViBzIMISITFv1S8K76hS6aoEgotWqV1vi4qpId5PflKOEZh7b5UFEpMsNBYSlfkjRejkCENFy7Cr/0pgvWuAV5Zqqbz2jsVyxvMBc82WcPQIQ0eptoaXrH0vqGZ0k6s+O1Fkx6a7e8LwmCBF5wdViY+2WvkOuJvdcQy7vat8kWxCG5p4z4+ERbcYGWqjLrJXR4/Bh/76I3Ic31K5R4xG1qzsPyWsko9l7Zo5hlfbAJG+SeVhHDU0hohq0kEWGXM/m9OpRwldE5N6AaV0R6Ww1rHddawlW7dDdyZtkAegX+BQiKgB6uSFz3ETvL4nI3YFzdPWGdNv1jt8GSsjnURGAiKLCWXtn1to8Hmd9bPMMIiKPagGcoK7d2nzkg4h80FpFW68a1AvIaQjNXhWRexzgWtC/6pUT1A7YNtUEImpKXbGEnU0UjweqJNyxys0J6ljmUaAfiKgA6PUM6UVIhclotpxIYfnq0WqLkkBELWotusxOhHRFRL6afzfKSTZIKLpN5O0QIsqLd0OjGXfYzol0z6WbiBPx7If3SG6nk5iewxGAiMIxXGkPOXbYDonnMyLicG7oAHWFV1RWagaZpgURZQK6zWH6J0XkZcvDiu+KyMPLw7XZvM8YtoW7bG2ivyWpIaItaXvRXIcLpW+KyIOWzxVBXHAjJa/Qaz8kBLRId+18BBG1o6vCkjoRiCIMSw7J2QOCeAprO/fwEFFuxJsfr39GRM4nmAaJ5wSgttIlRNSKpqqS8xCuPWDJH7lKjPfjitSK20FEK1Zunqk55ZB0orDzlUdBTYwCETWhphaEdMohqYngAbWgzswyQkSZAWc4EACBKQIQEVYBAiBQHAGIqLgKEAAEQAAiwgZAAASKIwARFVcBAoAACEBE2AAIgEBxBCCi4ipAABAAAYgIGwABECiOAERUXAUIAAIgABFhAyAAAsURgIiKqwABQAAEICJsAARAoDgCEFFxFSAACIAARIQNgAAIFEcAIiquAgQAARCAiLABEACB4ghARMVVgAAgAAIQETYAAiBQHAGIqLgKEAAEQAAiwgZAAASKIwARFVcBAoAACEBE2AAIgEBxBCCi4ipAABAAAYgIGwABECiOAERUXAUIAAIgABFhAyAAAsURgIiKqwABQAAEICJsAARAoDgCEFFxFSAACIAARIQNgAAIFEcAIiquAgQAARCAiLABEACB4ghARMVVgAAgAAIQETYAAiBQHAGIqLgKEAAEQAAiwgZAAASKIwARFVcBAoAACEBE2AAIgEBxBCCi4ipAABAAgf8DcEXPFPnt8JkAAAAASUVORK5CYII=");
				this.inputElementArray.push(apix.common.display.ElementExtender.elemByTag(pcEl,"img"));
				var md = this.storePicture("iVBORw0KGgoAAAANSUhEUgAAASIAAADICAYAAABMFuzmAAAVPklEQVR4Xu2dy/IlRRHGs+XuRi7qFngCdedO3wA0RNypEYZyEYQxxGEDM2zkJkQAhrggwB1jaMA8gfoCBuxdzFqDiyuJudhG9ZxzOKe7qrqq6979+y9nqquyvsz6TmZWVVYn/IEACIBAYQS6wuMzPAiAAAgIRIQRgAAIFEcAIiquAgQAARCAiLABEACB4ghARMVVgAAgAAIQETYAAiBQHAGIqLgKEAAEQAAiwgZAAASKIwARFVcBAoAACEBE2AAIgEBxBCCi4ipAABAAAYgIGwCBrAj0vxGRX4jITSLyskj3dNbhKx2sMSJCiZXaEWI5I9BfE5Ev7JpfFekUIW3+rzUiQombN9mWARh+SM+ezqBrbA2mwb8xEPoeJaYxBHrNgcCJN7QbECJSQDRORPI8MXaOBcQYcRAY/5AOS7CxNRgHiXEvjYGgUyRklMY06DUeAkNIdkZEbp72CRGtwSNSc7gs0t0Sz2joCQRiI6ALyfZjQERrISLc29jrhv4iITB4Qk8d7ZJp+oWIWiSi412zI6WizEgrh26iIdDfLiIf2UmIHNHBL4yGe5aOdNufw8AkrbPgzyBuCPSvicjP3TaD+BFt0CNSImsT1pCR2wqhVVIEZkOx10XksVMRIKJWiejy7nj82KRIWiddZHRuR8Aaiv1PRO4S6T6d/pBCRK0S0bsi8qDeKFAqdFEKgf59EblPM7o6hPvC5+fdOJSr01Bj54iG0EwlAT82xN+vi3SPlzJFxt0qAv2PRORtzew19ggRrYSIBjLS3Nk5TA8y2iofZJ23NR+kvKA7r4di4z+IaEVEZE1aq//8sUj3Tla7ZLANITC7NW/ZxZ1sttyhJ6wNwem2vVgrIL0pab0XGM+oVtU1K9dAQL/f5ShNaY2ZH8GJ3V4Q6X7QLCSRBG8wR7SfeW9JWhOmRbIPujkg0D8pIr+1/HircOyN+RzlxG7/K9J9cetAt0xE6tfpEwcF4hk5gEQTGwLWDZKjrXkXFIe+RnbLbm/DRDTkicZXPpRR7KvfHVsFZOSyRmgzQuBQEfQ2AzSjrXlXAElYj5FqnYh0u2ea06vDtLkG4rpOaLdDoL8qIjdo4Pi7iNy/PMkMEa2MiAavSFO1cbjrMzpKL54uNKtx2wjoQqgBkQh2BBFthIgGgtKR0UWR7v5tLzBmb0dgsJtHDJ7QwlBsPCJEtAEikqNzGdpj92q37eHlbjULeZ0I2Koo7j2hThemLYADIlojEV0RkRuPJnbk9Rh3O9Qv2zmR7rkFVsQnq0LA6gHtZ6rs5Zci3atxpg4RrZGIdOeJjhLT1usgb4l0P4ljXPTSHgLa8P14GoqA/iQiD8X1oCGiNRKR7hLs6OG6/hkROW9YKH/bXQm51N5CQuJlCMzWDVLdJjzyARGtkIiGxLTDw3VDmPamuYTIAI3aruUZ4GWru5GvZu+JqbNpL6V9pgoiWikRDWTk+Phi/7yI/Nqyajhy3wilLBPTWDcooQc0ltTVVpfNsMWvGj/QeBLOj4jIdoCxv0dE1O38bxmUxo3oFq15VmZjvjAjCfn8aM5OaDUN1kRE4+seozyRTmf9WyKiilqNr4Wwq7YaEx8WvulskKVuUEoA8IjWHJoZrnu4VGzs1WlZHSlT1yjleszSt3VnrNC1H4hoxUQ0/PLp3j1zMLahxMPLljeoFFH9br7EQ5aVxSDOCFhJ6IpIp3kC2rnzgIYQ0dqJSOcVOYRoA4m57KrhIQUsv3yfDgT0qOWHJcPOmG22ENHKieiQDxhfeHXwivbQGAuh7xtkTmzmW77rGMmqv0p0BxFtgIi0IZqjV3Qgo7lfVO6rVcla1lCsEhJi10xnOivaNTuennabdqEhGn9h2Vmrgoxm74o5lnDNORk8oo14RCGJa51BWn9pyRvlXMMnY83eFatUNxDRlogoIHGtJSPbfTX1ATtrWQlploQWesA5JgERbYiIYiSux3Cxs5ZjmZrHmA3DBqW7vaZRciYQ0caISJcYHCAIvNw6u7O295BUCYkGi7DNbn+7rOKIHuLhPTHb+18Ve0CTHzTHe5EuMK+jzUqT1SeJa90hx30Dj239iTHN7aztP1BG9wcReTpuTZulBhiFZBYP7u+tDCVczs08BtoQCel+HHlOaAtEpMsVHS+kCEbs5CEVJiQnr2Ipwfh+NxM+HWT9vuVQYiNhmDbfiEc0gmUDRDTYqyKjJ0TkVsOKiUFGlXpIw6JW8/9ZhU+Mq/Dtxeu1fw7k84ChcP2x6p5tu8wvOaIN5ohOwjSbdxRxq3dYVKrukVr8pr8M55CcwhqbfA5PKGt/8V1J2deTuhC/bKuvCDHaQ0QbJ6KDd3RGRHQXHgNyRtoF6UJIEQnwhHR1zykV9CqCclMN7IS5EpRLNVHXvtbTbiOhmfFXe3wn7bJId0t89Tp5SJF2mWbP16jE+dlyifNZ+fbwJypcH1+7fj1OKkR4Xj/yG62V1hsmosE7UkXR3h4pK2F1RqdzSCltJ+HcfMQ2viG2UvI58VQ9Kon6YNp2240T0UBGY8PIsLvltMsW27L45Y2N6KL+yA/pYIOIxFidMfKjemP4g3ImvkvgaHfK91Pax0OA/JAJS4hIrNUZe5FuXM86nl0eeopOSitK7iaAu0iX2ooQBatEFgHBOChENEBjTSZ/R6R7vy61IU17CPTqWtENI7kj79K2h8peYojoRHcDIamXX7+GwbRr1PVJjjc0pxOIaIJQf7+IvDf6Z3Vf7cvltrzn1Mj/143A0kcd6p5VTOkgIi2axgR24K39mKqjrzYQ0HpDn4l0t7Uhfx4pISI9EamrIOpZah0+PEmdxzZXMIrx8Ca5oZF2ISKjuQ/5oo8NZBThkuwK1tlmpnAoyKbWy+6S7tzkIaE5hI7/HyKyojW41U/NlKJQPbBd7mN1zbTVlk5xOBhqJCG26w26h4icFoV269X2JcTkhGvNjYbKBef1EtoKmRlJiEOlFnVDRE5rwXg3yulrj0b/ul46hHNLHpglaNp/XUT+Ya7fZCIiIwkRys9oCSLyMuPoJ6B1o38g0n3DSywaR0RgCMf+KiKKjEyBhGbdQEIhSoCIQtAbvo1OTh+KdJZFECwwHdjzgu+IyA/tIB17RFZvGU/I0dogIkeg3JsFEdO/ReSfIvLNXVjwF5Hue+5j0zIMAW1VhD9OiWlPRNozQnsRICEPZUBEHmDlaXpSJiLTpds8M6t/lP6SiNx9JOeHIvJtEfnkVHZFRJBQTH1CRDHRjNLXpD4Sh9+i4OrSSf+piHxp1/I/10mo+0BTs+qyodSw+hRPyAXqURuIaAFoaT+ZXC9xOLeSVqLt9N4r70dVWlBktKslbvV8xtDwo7HQWCCihcCl+0xr+AXOoDjnugrIlg79ac/OZ8ggoQC1QEQB4KX7VHtbWw2XwdidCWgj3sAkVB7Pe+VEnM7Kj3uGiPLg7DmKMRxI9MqIEi/KS7CRiNLrAGliIpgQkcodqdBNlYZ56frjkPyFIgARhSKY7PtcB+SivwQbSEZeOZk9+ikJmuehk9n45x1DRBlAXj6EcVEGLvbBA1IXen8187yz5c6clTA85XO+XGyD0nNMV63w6oYrUiHtIKIQ9LJ8q80XqXDkruUVIwcv6KOZqgIO78vHCCGdZHFBOpFXBBG5gB/aBiIKRTD598Z8yUWRTpW19fjr/ywi3zVf5hy68nwJ1kRGthvqxyL3arv8PsskDJ6OjqBdx/SAbPLuXYoxfORZZ1uIqBm9ahesZzhi3QG6ICIPLfOytGTk8PqJNbybSULneiMMjyjHEoGIcqAcZQxtxUjPw45aIgoM8/aTm/TtUEVg4tWonNSd7mSYgyRyjBHFQJruBCJqSn1aD8LDK5qEZmrhvxBnC3pCKpYqAsYQ0WMuQ8I9w45WjjGaMsIkwkJESWBN2WmtT9MMJPmEiNwqIqqKwE/NBd60ntk1ke5GP+R6VUjuK7tvLol09/p979IaInJBKbQNRBSKYPbvtV5Roh2jVJPTEpGnNzR4RCpZf05E1C7gE2kqW0JEqazguF+IKAfK0cfIsWM0LPJnd4v8ybiLfBKaVXxjHSKKbr6aDiGiHChHHyM0V+Qi0EltHofEs0ufLbaBiHJoDSLKgXKSMSbhTeTw7ISINly+FiJKYr6jTiGiHCgnGSN1eJYj/6IDJmVIuEQRENES1Hy/gYh8Eaumfa4DfbknXFtICBHlsACIKAfKycaouazsSULa4xGA2kJCiCiZ+R51DBHlQDnZGKnzREsFn3hrHo8AlAoJTXOFiJZagc93EJEPWtW1TZ0nWjrhWuVaMh+IaAlqvt9ARL6IVdW+1jzRxFO7KiIXj27+e4RqpQGHiHJoACLKgXLSMWpcKLrclZwdwbDgJHVSIA2d14hvCRzSjgkRpcU3Q+81LhSdTLXms+ZUVCO+czK39/8QUXs6G0lc40LREpEqNzKytxaKjNWIb/NGO5kARNS8TmtcKFoiUrfzGwzPasS3eaOFiNanwhoXikmmFsOzGvFdnxXjETWv09oWim0nr9ZaSjYjqA3f5g1WOwGIqHm91rZQbGeItFUDPMvd5lZYbfjmnn+e8SCiPDgnHKW2hTIXftV69smkotrwTWhKBbuGiAqCH2fo2haKy/03lzZx0AnrpTXSDJttya8hopLoRxm7JiJyXbiT8K3S8KwVOaMYUtFOIKKi8McYvCoiujZ9PVZ3VsiVsGLgE9JHK55byBzr+BYiqkMPAVJURUSj533EUjWyJrl18LdClgGmU9GnEFFFylgmSk0L2seDyPEU0DJEr39FWBaCnu+3EJEvYtW1r5mIbFc4aqs7NFasD6lWZxTNCQQRNaeyuQVT8v6Wr5czkNErIjL3MKLKPb0U50VaF4UTlrmgFLMNRBQTzSJ9VeUReT54eFIWdg69yK+U2IZbU2G3OVjr+H+IqA49BEhRExH5TsOLiNTl/Qz2qj39/ZlId5vv7GjvjkAGxboLQ8slCOQiIqcwyjOEGvp8z33WWYhIcwRBGini5o5kbS0hoto04i1PNiK6JCJ3O4h3RaS72aHdrolN/lxz20ub4wVdd2S21BIial7bqRfr5J16F8Qc37KfSwqnntvxVPrbReSj0YHMayLdjS4Tpk0YAhBRGH4VfJ16sU62sV3n7BCmzZ3VST23EyJ6V0QeHE2OkMxV24HtIKJAAMt/nnqxuvSvDWkUNDM7XXNndVzGjqEBrfwXRTqVw+IvAwIQUQaQ0w6RerG69t+/JiKPTedqPdQ4vhIy8kBcxw5FWFuw7Q6R7tPQnvneDQGIyA2nilulXqw+/evIyIuIZnBOsWumJdCMZ5YqNq2MokFEGcFOM5QPUSyRwLd/n/ZaT8QiZGwiMoaU5IaWmErANxBRAHh1fOqz8JdI7NP/3C7YeHwjEegETeCl9OoF2htGg0FCS8wk8BuIKBDA8p/7EMUSaX36n9sF040/kNEZEbGdPVJvor0Y966ZNiRzPHawBEe+sSEAETVvH3M7T6ETXLx9rwau1LtYklgPxZHvIaJV28CEKCKHML55nAPYlR4GNIaD3CcruE7wiAqCH2fo1DfFvfI4x1Oq1RvS3SVLEPrF0e5WeoGImtd0jvtRQyjz6LQetRY8dTboDZHu8XqgteahyAtVoCiIqAIlhIuQOjwLl7BsD8bwstLwsSxaJUaHiEqgHn3MFp9ynt1BixQuWUPLSsPH6AZSfYcQUfUqchGwxaec1bxmQ74IiXctSVcYPrroeb1tIKLV6FZLRpG8ihQgmbbQx2OFnKbWjoEXlEKdgX1CRIEA1vW59sxPBK8idJYDITyiOcXs0PESIjImp8kJOSBeoglEVAL1ZGMak7IFvQBXz8cEyiIi0m3RqwEK4pBM6avoGCJahRr3kzB6AgFe0aIKjb6oHm2h+1wpMQ2j9QzZpvfVSsb2EFFGsPMNpc0XLVyIQVc85qasSRqHElHMuc+Jz//HQgAiioVkdf1oCWRBaBKViBzIMISITFv1S8K76hS6aoEgotWqV1vi4qpId5PflKOEZh7b5UFEpMsNBYSlfkjRejkCENFy7Cr/0pgvWuAV5Zqqbz2jsVyxvMBc82WcPQIQ0eptoaXrH0vqGZ0k6s+O1Fkx6a7e8LwmCBF5wdViY+2WvkOuJvdcQy7vat8kWxCG5p4z4+ERbcYGWqjLrJXR4/Bh/76I3Ic31K5R4xG1qzsPyWsko9l7Zo5hlfbAJG+SeVhHDU0hohq0kEWGXM/m9OpRwldE5N6AaV0R6Ww1rHddawlW7dDdyZtkAegX+BQiKgB6uSFz3ETvL4nI3YFzdPWGdNv1jt8GSsjnURGAiKLCWXtn1to8Hmd9bPMMIiKPagGcoK7d2nzkg4h80FpFW68a1AvIaQjNXhWRexzgWtC/6pUT1A7YNtUEImpKXbGEnU0UjweqJNyxys0J6ljmUaAfiKgA6PUM6UVIhclotpxIYfnq0WqLkkBELWotusxOhHRFRL6afzfKSTZIKLpN5O0QIsqLd0OjGXfYzol0z6WbiBPx7If3SG6nk5iewxGAiMIxXGkPOXbYDonnMyLicG7oAHWFV1RWagaZpgURZQK6zWH6J0XkZcvDiu+KyMPLw7XZvM8YtoW7bG2ivyWpIaItaXvRXIcLpW+KyIOWzxVBXHAjJa/Qaz8kBLRId+18BBG1o6vCkjoRiCIMSw7J2QOCeAprO/fwEFFuxJsfr39GRM4nmAaJ5wSgttIlRNSKpqqS8xCuPWDJH7lKjPfjitSK20FEK1Zunqk55ZB0orDzlUdBTYwCETWhphaEdMohqYngAbWgzswyQkSZAWc4EACBKQIQEVYBAiBQHAGIqLgKEAAEQAAiwgZAAASKIwARFVcBAoAACEBE2AAIgEBxBCCi4ipAABAAAYgIGwABECiOAERUXAUIAAIgABFhAyAAAsURgIiKqwABQAAEICJsAARAoDgCEFFxFSAACIAARIQNgAAIFEcAIiquAgQAARCAiLABEACB4ghARMVVgAAgAAIQETYAAiBQHAGIqLgKEAAEQAAiwgZAAASKIwARFVcBAoAACEBE2AAIgEBxBCCi4ipAABAAAYgIGwABECiOAERUXAUIAAIgABFhAyAAAsURgIiKqwABQAAEICJsAARAoDgCEFFxFSAACIAARIQNgAAIFEcAIiquAgQAARCAiLABEACB4ghARMVVgAAgAAIQETYAAiBQHAGIqLgKEAAEQAAiwgZAAASKIwARFVcBAoAACEBE2AAIgEBxBCCi4ipAABAAgf8DcEXPFPnt8JkAAAAASUVORK5CYII=");
				this.addRemoveButtonListener(pcEl,md);
			}
		} else apix.common.util.StringExtender.alert("" + Std.string(this.lang.photoLimit),null,null);
	}
	,onCamSuccess: function(imageData) {
		var pcEl = this.displayPicture(imageData);
		this.inputElementArray.push(apix.common.display.ElementExtender.elemByTag(pcEl,"img"));
		var md = this.storePicture(imageData);
		this.addRemoveButtonListener(pcEl,md);
	}
	,displayPicture: function(imageData) {
		var pcEl = apix.common.display.ElementExtender.clone(this.photoCtnrElement);
		this.element.appendChild(pcEl);
		apix.common.display.ElementExtender.css(pcEl,"display","block");
		var imgEl = apix.common.display.ElementExtender.elemByTag(pcEl,"img");
		if(imageData != null) apix.common.display.ElementExtender.prop(imgEl,"src","data:image/jpeg;base64," + imageData);
		apix.common.display.ElementExtender.width(pcEl,Math.min(apix.common.display.Common.get_screenWidth(),300));
		return pcEl;
	}
	,addRemoveButtonListener: function(pcEl,md) {
		var but = apix.common.util.StringExtender.get("." + ("apix_" + "removeButton"),pcEl);
		apix.common.display.ElementExtender.on(but,"click",$bind(this,this.onClickRemoveButton),null,{ ctnr : pcEl, but : but, md : md});
		md.button = but;
	}
	,onCamError: function(m) {
		apix.common.util.StringExtender.alert("" + Std.string(this.lang.photoError.label) + "\n" + m,null,null);
	}
	,storePicture: function(imageData) {
		var md = { name : null, type : "image", ext : "jpeg", code : "base64", data : imageData};
		this.get_value().push(md);
		this.renamePicture();
		if(this.click.hasListener()) this.click.dispatch(new apix.ui.input.PhotoFieldEvent(this,this.get_value(),this.inputElementArray,this.get_id()));
		return md;
	}
	,removePicture: function(data) {
		var but = data.but;
		apix.common.display.ElementExtender.off(but,"click",$bind(this,this.onClickRemoveButton));
		var _g1 = 0;
		var _g = this.get_value().length;
		while(_g1 < _g) {
			var i = _g1++;
			var mda = this.get_value()[i];
			var mdb = data.md;
			if(mda.name == mdb.name) {
				this.get_value().splice(i,1);
				this.inputElementArray.splice(i,1);
				break;
			}
		}
		var el = data.ctnr;
		apix.common.display.ElementExtender["delete"](el);
		this.renamePicture();
		if(this.click.hasListener()) this.click.dispatch(new apix.ui.input.PhotoFieldEvent(this,this.get_value(),this.inputElementArray,this.get_id()));
	}
	,onClickRemoveButton: function(e,data) {
		this.removePicture(data);
	}
	,get_label: function() {
		var v = null;
		if(this.compoProp.label != null) v = this.compoProp.label; else v = "Click to take a picture";
		this.compoProp.label = v;
		return v;
	}
	,get_max: function() {
		var v = null;
		if(this.compoProp.max != null) v = this.compoProp.max; else v = apix.ui.input.PhotoField.MAX;
		this.compoProp.max = v;
		return v;
	}
	,get_name: function() {
		var v = null;
		if(this.compoProp.name != null) v = this.compoProp.name; else v = apix.ui.input.PhotoFieldLoader.get_newSingleName();
		this.compoProp.name = v;
		return v;
	}
	,get_value: function() {
		if(this.imageDataList == null) {
			if(this.compoProp.value != null) this.imageDataList = this.compoProp.value; else this.imageDataList = [];
		}
		return this.imageDataList;
	}
	,get_isEmpty: function() {
		return this.imageDataList.length == 0;
	}
	,__class__: apix.ui.input.PhotoField
});
apix.ui.input.PhotoFieldLoader = function() { };
apix.ui.input.PhotoFieldLoader.__name__ = ["apix","ui","input","PhotoFieldLoader"];
apix.ui.input.PhotoFieldLoader.__init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	if(pathStr != null && skinName == "default") haxe.Log.trace("f::Invalid skinName '" + skinName + "' when a custom path is given ! ",{ fileName : "PhotoField.hx", lineNumber : 298, className : "apix.ui.input.PhotoFieldLoader", methodName : "__init"}); else true;
	if(pathStr == null) pathStr = "apix/default/" + "PhotoField/"; else pathStr = pathStr;
	apix.ui.UICompoLoader.__push(apix.ui.input.PhotoFieldLoader.__load,apix.ui.UICompoLoader.baseUrl + pathStr,skinName);
};
apix.ui.input.PhotoFieldLoader.__load = function(fromPath,sk) {
	var h = new haxe.Http(fromPath + ("skin." + "html"));
	h.onData = apix.ui.input.PhotoFieldLoader.__onData;
	h.request(false);
	apix.ui.UICompoLoader.__currentSkinName = sk;
	apix.ui.UICompoLoader.__currentFromPath = fromPath;
};
apix.ui.input.PhotoFieldLoader.__onData = function(result) {
	var skinContent = apix.ui.UICompoLoader.__storeData(result);
	apix.ui.input.PhotoFieldLoader.__compoSkinList.push({ skinName : apix.ui.UICompoLoader.__currentSkinName, skinContent : skinContent, skinPath : apix.ui.UICompoLoader.__currentFromPath});
	apix.ui.UICompoLoader.__onEndLoad();
};
apix.ui.input.PhotoFieldLoader.get_newSingleName = function() {
	apix.ui.input.PhotoFieldLoader._nextSingleName++;
	var name = "untitledPhoto_" + apix.ui.input.PhotoFieldLoader._nextSingleName;
	return name;
};
apix.ui.input.PhotoFieldLoader.__super__ = apix.ui.UICompoLoader;
apix.ui.input.PhotoFieldLoader.prototype = $extend(apix.ui.UICompoLoader.prototype,{
	__class__: apix.ui.input.PhotoFieldLoader
});
apix.ui.input.SignFieldEvent = function(target,value,inputElement,id) {
	apix.common.event.StandardEvent.call(this,target);
	this.inputElement = inputElement;
	this.value = value;
	this.id = id;
};
apix.ui.input.SignFieldEvent.__name__ = ["apix","ui","input","SignFieldEvent"];
apix.ui.input.SignFieldEvent.__super__ = apix.common.event.StandardEvent;
apix.ui.input.SignFieldEvent.prototype = $extend(apix.common.event.StandardEvent.prototype,{
	__class__: apix.ui.input.SignFieldEvent
});
apix.ui.input.SignField = function(p) {
	apix.ui.UICompo.call(this);
	this.click = new apix.common.event.EventSource();
	this.compoSkinList = apix.ui.input.SignFieldLoader.__compoSkinList;
	this.setup(p);
};
apix.ui.input.SignField.__name__ = ["apix","ui","input","SignField"];
apix.ui.input.SignField.init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	apix.ui.input.SignFieldLoader.__init(skinName,pathStr);
};
apix.ui.input.SignField.__super__ = apix.ui.UICompo;
apix.ui.input.SignField.prototype = $extend(apix.ui.UICompo.prototype,{
	get_inputElement: function() {
		return this.base64Img;
	}
	,setup: function(p) {
		apix.ui.UICompo.prototype.setup.call(this,p);
		return this;
	}
	,enable: function() {
		this.labelElement = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "label"));
		this.paintCtnr = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "paintCtnr"));
		if(apix.common.util.Global.get().get_isMobile() && apix.common.util.Global.get().get_isIE()) apix.common.display.ElementExtender.css(this.paintCtnr,"msTouchAction","none");
		this.bValid = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "valid"));
		this.bClear = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "clear"));
		this.base64Img = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "img"));
		apix.common.display.ElementExtender.on(this.bValid,"click",$bind(this,this.onClickValid));
		apix.common.display.ElementExtender.on(this.bClear,"click",$bind(this,this.onClickClear));
		apix.common.display.ElementExtender.visible(this.bClear,false);
		apix.common.display.ElementExtender.visible(this.bValid,false);
		apix.common.display.ElementExtender.on(this.paintCtnr,apix.common.event.StandardEvent.MOUSE_DOWN,$bind(this,this.startPaint));
		this.context = apix.common.display.ElementExtender.getContext2D(this.paintCtnr);
		this.enabled = true;
		apix.common.display.ElementExtender.inner(this.bClear,this.lang.signClear);
		return this;
	}
	,remove: function() {
		apix.ui.UICompo.prototype.remove.call(this);
		apix.common.display.ElementExtender.off(this.bValid,"click",$bind(this,this.onClickValid));
		apix.common.display.ElementExtender.off(this.bClear,"click",$bind(this,this.onClickClear));
		apix.common.display.ElementExtender.off(this.paintCtnr,apix.common.event.StandardEvent.MOUSE_DOWN,$bind(this,this.startPaint));
		apix.common.display.ElementExtender["delete"](this.element);
		return this;
	}
	,update: function() {
		apix.ui.UICompo.prototype.update.call(this);
		apix.common.display.ElementExtender.text(this.labelElement,this.get_label());
		apix.common.display.ElementExtender.attr(this.paintCtnr,"width",this.get_width(),true);
		apix.common.display.ElementExtender.attr(this.paintCtnr,"height",this.get_height(),true);
		apix.common.display.ElementExtender.width(this.paintCtnr,Std.parseFloat(this.get_width()));
		apix.common.display.ElementExtender.height(this.paintCtnr,Std.parseFloat(this.get_height()));
		if(this.get_border() != true) apix.common.display.ElementExtender.css(this.paintCtnr,"borderWidth","0"); else apix.common.display.ElementExtender.css(this.paintCtnr,"borderWidth","thin");
		this.context.strokeStyle = this.get_color();
		this.context.lineWidth = this.get_thickness();
		this.context.lineCap = "round";
		this.clear();
		this.bmpData = { name : this.get_name(), color : this.get_color(), thickness : this.get_thickness(), lineCap : this.context.lineCap, drawingData : this.drawingData, mediaData : null, empty : true};
		if(this.get_base64UrlValue() != "") {
			this.showBase64Img(this.get_base64UrlValue());
			apix.common.display.ElementExtender.hide(this.paintCtnr);
			apix.common.display.ElementExtender.visible(this.bClear,true);
			apix.common.display.ElementExtender.visible(this.bValid,false);
			this.bmpData.toUrlData = this.get_base64UrlValue();
		} else apix.common.display.ElementExtender.hide(this.base64Img);
		return this;
	}
	,showBase64Img: function(str) {
		apix.common.display.ElementExtender.show(this.base64Img,"block");
		if(!(this.g.get_isAndroidNative300() && this.g.get_isPhone())) apix.common.display.ElementExtender.attrib(this.base64Img,"src",str); else apix.common.display.ElementExtender.show(apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "imgOk")),"block");
	}
	,startPaint: function(e) {
		e.preventDefault();
		apix.common.display.ElementExtender.visible(this.bValid,true);
		apix.common.display.ElementExtender.visible(this.bClear,false);
		this.clearBmpData();
		this.mouseInPaintInitPos = apix.common.event.MouseTouchEvent.getVector(e).sub(apix.common.display.ElementExtender.getVector(this.paintCtnr));
		this.currFromPos = this.mouseInPaintInitPos;
		this.currToPos = this.currFromPos;
		if(this.mouseClock != null) this.mouseClock = this.mouseClock.remove();
		this.mouseClock = new apix.common.event.timing.MouseClock($bind(this,this.onClock),$bind(this,this.stopPaint));
		this.draw(this.currFromPos,this.currToPos);
		this.push(this.currFromPos,this.currToPos);
	}
	,stopPaint: function(clk) {
		this.mouseClock = clk.remove();
	}
	,onClock: function(clk) {
		this.currToPos = clk.get_vector().add(this.mouseInPaintInitPos);
		this.draw(this.currFromPos,this.currToPos);
		this.push(this.currFromPos,this.currToPos);
		this.currFromPos = this.currToPos;
	}
	,draw: function(from,to) {
		this.context.save();
		this.context.beginPath();
		this.context.moveTo(from.get_x(),from.get_y());
		this.context.lineTo(to.get_x(),to.get_y());
		this.context.stroke();
		this.context.closePath();
		this.context.restore();
	}
	,push: function(from,to) {
		this.drawingData.push(from);
		this.drawingData.push(to);
	}
	,clearBmpData: function() {
		this.bmpData.mediaData = null;
		this.bmpData.toUrlData = null;
		this.bmpData.empty = true;
	}
	,clear: function() {
		this.drawingData = [];
	}
	,onClickValid: function(e) {
		this.bmpData.mediaData = { name : this.get_name(), type : "image", ext : "png", code : "base64", data : apix.common.display.ElementExtender.toBase64(this.paintCtnr)};
		this.bmpData.toUrlData = apix.common.display.ElementExtender.toBase64Url(this.paintCtnr);
		this.bmpData.drawingData = this.drawingData;
		this.bmpData.empty = false;
		apix.common.display.ElementExtender.attrib(this.base64Img,"src",apix.common.display.ElementExtender.toBase64Url(this.paintCtnr));
		this.display();
		apix.common.display.ElementExtender.visible(this.bValid,false);
	}
	,onClickClear: function(e) {
		if(this.displayClock != null) this.displayClock = this.displayClock.remove();
		this.clearContext();
		this.clearBmpData();
		this.clear();
		apix.common.display.ElementExtender.hide(this.base64Img);
		apix.common.display.ElementExtender.attrib(this.base64Img,"src","");
		apix.common.display.ElementExtender.visible(this.bClear,false);
		apix.common.display.ElementExtender.visible(this.bValid,false);
		apix.common.display.ElementExtender.show(this.paintCtnr);
		if(this.click.hasListener()) this.click.dispatch(new apix.ui.input.SignFieldEvent(this,this.get_value(),this.get_inputElement(),this.get_id()));
	}
	,clearContext: function() {
		this.context.clearRect(0,0,this.get_contextWidth(),this.get_contextHeight());
	}
	,display: function() {
		if(this.displayClock != null) this.displayClock = this.displayClock.remove();
		this.clearContext();
		this.displayIndex = 0;
		this.displayClock = new apix.common.event.timing.Clock($bind(this,this.onDisplayClock),0.01);
	}
	,onDisplayClock: function() {
		if(this.displayIndex + 1 < this.bmpData.drawingData.length) {
			var from = this.bmpData.drawingData[this.displayIndex];
			var to = this.bmpData.drawingData[this.displayIndex + 1];
			this.draw(from,to);
			this.displayIndex += 2;
		} else {
			if(this.displayIndex < this.bmpData.drawingData.length) {
				var from1 = this.bmpData.drawingData[this.displayIndex];
				this.draw(from1,from1);
			}
			this.displayClock.remove();
			apix.common.display.ElementExtender.hide(this.paintCtnr);
			apix.common.display.ElementExtender.visible(this.bClear,true);
			this.showBase64Img(this.bmpData.toUrlData);
			if(this.click.hasListener()) this.click.dispatch(new apix.ui.input.SignFieldEvent(this,this.get_value(),this.get_inputElement(),this.get_id()));
		}
	}
	,get_color: function() {
		var v = null;
		if(this.compoProp.color != null) v = this.compoProp.color; else v = "#000000";
		this.compoProp.color = v;
		return v;
	}
	,get_thickness: function() {
		var v = null;
		if(this.compoProp.thickness != null) v = this.compoProp.thickness; else v = 3;
		this.compoProp.thickness = v;
		return v;
	}
	,get_border: function() {
		var v = null;
		if(this.compoProp.border != null) v = this.compoProp.border; else v = true;
		this.compoProp.border = v;
		return v;
	}
	,get_width: function() {
		var v = null;
		if(this.compoProp.width != null) v = this.compoProp.width; else {
			var el = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "paintCtnr"));
			if(el != null) v = "" + apix.common.display.ElementExtender.width(el) + "px";
			if(v == "" || v == "0px") v = "340px";
		}
		this.compoProp.width = v;
		return v;
	}
	,get_height: function() {
		var v = null;
		if(this.compoProp.height != null) v = this.compoProp.height; else {
			var el = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "paintCtnr"));
			if(el != null) v = "" + apix.common.display.ElementExtender.height(el) + "px";
			if(v == "" || v == "0px") v = "120px";
		}
		this.compoProp.height = v;
		return v;
	}
	,get_contextHeight: function() {
		return Std.parseFloat(this.get_height());
	}
	,get_contextWidth: function() {
		return Std.parseFloat(this.get_width());
	}
	,get_value: function() {
		return this.bmpData;
	}
	,get_isEmpty: function() {
		return this.get_value().empty;
	}
	,get_label: function() {
		var v = null;
		if(this.compoProp.label != null) v = this.compoProp.label; else {
			v = this.lang.signIt;
			if(this.g.strVal(v,"") == "") v = "Sign this document";
		}
		this.compoProp.label = v;
		return v;
	}
	,get_base64UrlValue: function() {
		var v = null;
		if(this.compoProp.base64UrlValue != null) v = this.compoProp.base64UrlValue; else v = "";
		this.compoProp.base64UrlValue = v;
		return v;
	}
	,__class__: apix.ui.input.SignField
});
apix.ui.input.SignFieldLoader = function() { };
apix.ui.input.SignFieldLoader.__name__ = ["apix","ui","input","SignFieldLoader"];
apix.ui.input.SignFieldLoader.__init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	if(pathStr != null && skinName == "default") haxe.Log.trace("f::Invalid skinName '" + skinName + "' when a custom path is given ! ",{ fileName : "SignField.hx", lineNumber : 437, className : "apix.ui.input.SignFieldLoader", methodName : "__init"}); else true;
	if(pathStr == null) pathStr = "apix/default/" + "SignField/"; else pathStr = pathStr;
	apix.ui.UICompoLoader.__push(apix.ui.input.SignFieldLoader.__load,apix.ui.UICompoLoader.baseUrl + pathStr,skinName);
};
apix.ui.input.SignFieldLoader.__load = function(fromPath,sk) {
	var h = new haxe.Http(fromPath + ("skin." + "html"));
	h.onData = apix.ui.input.SignFieldLoader.__onData;
	h.request(false);
	apix.ui.UICompoLoader.__currentSkinName = sk;
	apix.ui.UICompoLoader.__currentFromPath = fromPath;
};
apix.ui.input.SignFieldLoader.__onData = function(result) {
	var skinContent = apix.ui.UICompoLoader.__storeData(result);
	apix.ui.input.SignFieldLoader.__compoSkinList.push({ skinName : apix.ui.UICompoLoader.__currentSkinName, skinContent : skinContent, skinPath : apix.ui.UICompoLoader.__currentFromPath});
	apix.ui.UICompoLoader.__onEndLoad();
};
apix.ui.input.SignFieldLoader.__super__ = apix.ui.UICompoLoader;
apix.ui.input.SignFieldLoader.prototype = $extend(apix.ui.UICompoLoader.prototype,{
	__class__: apix.ui.input.SignFieldLoader
});
apix.ui.slider = {};
apix.ui.slider.SliderEvent = function(target,lastSelector,value,inputElement,selectors) {
	apix.common.event.StandardEvent.call(this,target);
	this.lastSelector = lastSelector;
	this.value = value;
	this.selectors = selectors;
	this.inputElement = inputElement;
};
apix.ui.slider.SliderEvent.__name__ = ["apix","ui","slider","SliderEvent"];
apix.ui.slider.SliderEvent.__super__ = apix.common.event.StandardEvent;
apix.ui.slider.SliderEvent.prototype = $extend(apix.common.event.StandardEvent.prototype,{
	__class__: apix.ui.slider.SliderEvent
});
apix.ui.slider.Slider = function(p) {
	apix.ui.UICompo.call(this);
	this.compoProp.auto = false;
	this.change = new apix.common.event.EventSource();
	this.selectors = new Array();
	this.compoSkinList = apix.ui.slider.SliderLoader.__compoSkinList;
	this.setup(p);
};
apix.ui.slider.Slider.__name__ = ["apix","ui","slider","Slider"];
apix.ui.slider.Slider.init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	apix.ui.slider.SliderLoader.__init(skinName,pathStr);
};
apix.ui.slider.Slider.__super__ = apix.ui.UICompo;
apix.ui.slider.Slider.prototype = $extend(apix.ui.UICompo.prototype,{
	get_inputElement: function() {
		return this.lastSelector.inputElem;
	}
	,setup: function(p) {
		this.setCompoProp(p);
		if(this.isInitialized()) {
			if(!this.isCreated()) this.create();
			if(this.ctnrExist()) {
				if(this.get_auto() && !this.enabled) this.enable();
				this.update();
			}
		}
		return this;
	}
	,enable: function() {
		this.labelElement = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "label"));
		if(this.labelElement != null) {
			if(this.get_label() != "") {
				apix.common.display.ElementExtender.text(this.labelElement,this.get_label());
				apix.common.display.ElementExtender.show(this.labelElement);
			} else apix.common.display.ElementExtender.hide(this.labelElement);
		}
		var size;
		if(this.get_vertical()) {
			size = apix.common.display.ElementExtender.height(apix.common.display.ElementExtender.parent(this.element));
			var pct = (size - apix.common.display.ElementExtender.height(apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "selector")))) * 100 / size;
			apix.common.display.ElementExtender.css(apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "bounds")),"height",(pct == null?"null":"" + pct) + "%");
			apix.common.display.ElementExtender.css(apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "bar")),"height",(pct == null?"null":"" + pct) + "%");
		} else {
			size = apix.common.display.ElementExtender.width(apix.common.display.ElementExtender.parent(this.element));
			var pct1 = (size - apix.common.display.ElementExtender.width(apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "selector")))) * 100 / size;
			apix.common.display.ElementExtender.css(apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "bounds")),"width",(pct1 == null?"null":"" + pct1) + "%");
			apix.common.display.ElementExtender.css(apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "bar")),"width",(pct1 == null?"null":"" + pct1) + "%");
		}
		var idx = 0;
		var shft = 0;
		var arr = apix.common.util.StringExtender.all("#" + this.get_id() + " ." + ("apix_" + "selector"),this.element);
		var inputValuesArray = this.checkInputValues(JSON.parse(this.g.jsonParseCheck(this.get_inputValue(),"[]")));
		if(arr.length > 0) {
			var _g = 0;
			while(_g < arr.length) {
				var el = arr[_g];
				++_g;
				var val = null;
				var inEl = window.document.createElement("input");
				apix.common.display.ElementExtender.type(inEl,"text");
				apix.common.display.ElementExtender.enable(inEl,false);
				apix.common.display.ElementExtender.height(inEl,30);
				apix.common.display.ElementExtender.width(inEl,100);
				apix.common.display.ElementExtender.show(inEl,"inline");
				apix.common.display.ElementExtender.posy(inEl,5);
				apix.common.display.ElementExtender.posx(inEl,shft);
				shft += 5;
				this.element.appendChild(inEl);
				if(this.get_hideValue()) apix.common.display.ElementExtender.hide(inEl);
				if(inputValuesArray.length > idx) {
					val = inputValuesArray[idx];
					this.selectors.push(this.initSelector({ inputElem : inEl, elem : el, value : val, pos : null, xpos : null, ypos : null, round : null}));
				} else this.selectors.push(this.updateSelector({ inputElem : inEl, elem : el, value : null, pos : null, xpos : apix.common.display.ElementExtender.posx(el), ypos : apix.common.display.ElementExtender.posy(el), round : null}));
				apix.common.display.ElementExtender.on(el,this.g.get_isMobile()?"touchstart":apix.common.event.StandardEvent.MOUSE_DOWN,$bind(this,this.startDrag));
				apix.common.display.ElementExtender.on(el,this.g.get_isMobile()?"touchend":apix.common.event.StandardEvent.MOUSE_UP,$bind(this,this.stopDrag));
				apix.common.display.ElementExtender.on(el,apix.common.event.StandardEvent.MOUSE_DOWN,$bind(this,this.startDrag));
				apix.common.display.ElementExtender.on(el,apix.common.event.StandardEvent.MOUSE_UP,$bind(this,this.stopDrag));
				idx++;
			}
			this.lastSelector = this.selectors[0];
		}
		this.enabled = true;
		this.change.dispatch(new apix.ui.slider.SliderEvent(this,this.lastSelector,this.get_value(),this.get_inputElement(),this.selectors));
		return this;
	}
	,remove: function() {
		apix.ui.UICompo.prototype.remove.call(this);
		var _g = 0;
		var _g1 = this.selectors;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			apix.common.display.ElementExtender.off(s.elem,this.g.get_isMobile()?"touchstart":apix.common.event.StandardEvent.MOUSE_DOWN,$bind(this,this.startDrag));
			apix.common.display.ElementExtender.off(s.elem,this.g.get_isMobile()?"touchend":apix.common.event.StandardEvent.MOUSE_UP,$bind(this,this.stopDrag));
			apix.common.display.ElementExtender.off(s.elem,apix.common.event.StandardEvent.MOUSE_DOWN,$bind(this,this.startDrag));
			apix.common.display.ElementExtender.off(s.elem,apix.common.event.StandardEvent.MOUSE_UP,$bind(this,this.stopDrag));
		}
		apix.common.display.ElementExtender["delete"](this.element);
		return this;
	}
	,update: function() {
		apix.ui.UICompo.prototype.update.call(this);
		return this;
	}
	,startDrag: function(e) {
		e.preventDefault();
		var el = e.currentTarget;
		var o = apix.common.util.ArrayExtender.objectOf(this.selectors,el,"elem");
		this.lastSelector = o.object;
		this.lastSelectorIndex = o.index;
		apix.common.display.ElementExtender.startDrag(el,this.getSelectorBounds(),this.get_mouseScaleVector());
		apix.common.util.Global.get_mouseClock().top.on($bind(this,this.onClock),{ elem : el});
	}
	,stopDrag: function(e) {
		var el = e.currentTarget;
		apix.common.display.ElementExtender.stopDrag(el);
	}
	,onClock: function(e) {
		var elem = e.data.elem;
		this.lastSelector.xpos = apix.common.display.ElementExtender.posx(elem);
		this.lastSelector.ypos = apix.common.display.ElementExtender.posy(elem);
		this.lastSelector.used = true;
		this.updateSelector(this.lastSelector);
		this.change.dispatch(new apix.ui.slider.SliderEvent(this,this.lastSelector,this.get_value(),this.get_inputElement(),this.selectors));
	}
	,initSelector: function(o) {
		var sc = this.get_length() / this.get_bounds().get_length();
		o.pos = (!this.get_vertical()?this.get_bounds().get_x():this.get_bounds().get_y()) + (o.value - this.get_start()) / sc;
		if(this.get_vertical()) {
			o.ypos = o.pos;
			apix.common.display.ElementExtender.posy(o.elem,o.pos);
		} else {
			o.xpos = o.pos;
			apix.common.display.ElementExtender.posx(o.elem,o.pos);
		}
		if(o.round != null) o.round = o.round; else o.round = function(n) {
			if(n == null) n = 0;
			return apix.common.tools.math.MathX.round(o.value,n);
		};
		apix.common.display.ElementExtender.value(o.inputElem,this.g.strVal(o.round(this.get_decimal()),""));
		return o;
	}
	,updateSelector: function(o) {
		var sc = this.get_length() / this.get_bounds().get_length();
		if(!this.get_vertical()) o.pos = o.xpos; else o.pos = o.ypos;
		if(o.round != null) {
			o.value = this.get_start() + (o.pos - (!this.get_vertical()?this.get_bounds().get_x():this.get_bounds().get_y())) * sc;
			apix.common.display.ElementExtender.value(o.inputElem,this.g.strVal(o.round(this.get_decimal()),""));
		}
		if(o.round != null) o.round = o.round; else o.round = function(n) {
			if(n == null) n = 0;
			return apix.common.tools.math.MathX.round(o.value,n);
		};
		return o;
	}
	,checkInputValues: function(arr) {
		var _g1 = 0;
		var _g = arr.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.get_ascending()) {
				if(arr[i] < this.get_start()) arr[i] = this.get_start();
				if(arr[i] > this.get_end()) arr[i] = this.get_end();
			} else {
				if(arr[i] > this.get_start()) arr[i] = this.get_start();
				if(arr[i] < this.get_end()) arr[i] = this.get_end();
			}
		}
		return arr;
	}
	,get_mouseScale: function() {
		if(this.compoProp.mouseScale == null) this.compoProp.mouseScale = 1;
		return this.compoProp.mouseScale;
	}
	,get_bounds: function() {
		var r = null;
		if(this.compoProp.bounds != null) r = this.compoProp.bounds; else {
			var b = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "bounds"));
			if(b != null) r = new apix.common.tools.math.Rectangle(apix.common.display.ElementExtender.posx(b),apix.common.display.ElementExtender.posy(b),apix.common.display.ElementExtender.width(b),apix.common.display.ElementExtender.height(b)); else if(apix.common.display.ElementExtender.width(this.element) > apix.common.display.ElementExtender.height(this.element)) r = new apix.common.tools.math.Rectangle(0,0,apix.common.display.ElementExtender.width(this.element),0); else r = new apix.common.tools.math.Rectangle(0,0,0,apix.common.display.ElementExtender.height(this.element));
		}
		this.compoProp.bounds = r;
		return r;
	}
	,getSelectorBounds: function() {
		var v = this.get_bounds();
		if(this.get_multiple()) {
			if(!this.get_overlay()) {
				var vx = 0.;
				var vy = 0.;
				var w = 0.;
				var h = 0.;
				var prev = this.lastSelectorIndex - 1;
				var next = this.lastSelectorIndex + 1;
				if(this.lastSelectorIndex == 0) {
					vx = this.get_bounds().get_x();
					vy = this.get_bounds().get_y();
					w = this.selectors[next].xpos - vx - (!this.get_vertical()?this.get_gap():0);
					h = this.selectors[next].ypos - vy - (this.get_vertical()?this.get_gap():0);
				} else if(this.lastSelectorIndex == this.selectors.length - 1) {
					vx = this.selectors[prev].xpos + (!this.get_vertical()?this.get_gap():0);
					vy = this.selectors[prev].ypos + (this.get_vertical()?this.get_gap():0);
					w = this.get_bounds().get_x() + this.get_bounds().get_width() - vx;
					h = this.get_bounds().get_y() + this.get_bounds().get_height() - vy;
				} else if(this.lastSelectorIndex > 0 && this.lastSelectorIndex < this.selectors.length - 1) {
					vx = this.selectors[prev].xpos + (!this.get_vertical()?this.get_gap():0);
					vy = this.selectors[prev].ypos + (this.get_vertical()?this.get_gap():0);
					w = this.selectors[next].xpos - vx - (!this.get_vertical()?this.get_gap():0);
					h = this.selectors[next].ypos - vy - (this.get_vertical()?this.get_gap():0);
				} else haxe.Log.trace("f:: Selector index error ! ",{ fileName : "Slider.hx", lineNumber : 465, className : "apix.ui.slider.Slider", methodName : "getSelectorBounds"});
				v = new apix.common.tools.math.Rectangle(vx,vy,w,h);
			}
		}
		return v;
	}
	,get_start: function() {
		var v = null;
		if(this.compoProp.start != null) v = this.compoProp.start; else if(!this.get_vertical()) v = this.get_bounds().get_x(); else v = this.get_bounds().get_y();
		this.compoProp.start = v;
		return this.g.numVal(v);
	}
	,get_end: function() {
		var v = null;
		if(this.compoProp.end != null) v = this.compoProp.end; else v = this.get_start() + this.get_bounds().get_length();
		this.compoProp.end = v;
		return this.g.numVal(v);
	}
	,get_decimal: function() {
		var v = 0;
		if(this.compoProp.decimal != null) v = this.compoProp.decimal;
		this.compoProp.decimal = v;
		return this.g.intVal(v);
	}
	,get_length: function() {
		return this.get_end() - this.get_start();
	}
	,get_overlay: function() {
		var v = null;
		if(this.get_multiple()) {
			if(this.compoProp.overlay != null) v = this.compoProp.overlay; else v = false;
			this.compoProp.overlay = v;
		}
		return v;
	}
	,get_gap: function() {
		var v;
		if(this.compoProp.gap != null) v = this.compoProp.gap; else v = 5;
		this.compoProp.gap = v;
		return v;
	}
	,get_multiple: function() {
		return this.selectors.length > 1;
	}
	,get_vertical: function() {
		return apix.common.display.ElementExtender.width(this.element) < apix.common.display.ElementExtender.height(this.element);
	}
	,get_value: function() {
		return this.lastSelector.value;
	}
	,get_inputValue: function() {
		var v = null;
		if(this.compoProp.inputValue != null) v = this.compoProp.inputValue; else v = "[]";
		this.compoProp.inputValue = v;
		return v;
	}
	,get_hideValue: function() {
		var v = false;
		if(this.compoProp.hideValue != null) v = this.compoProp.hideValue;
		this.compoProp.hideValue = v;
		return v;
	}
	,get_ascending: function() {
		return this.get_start() < this.get_end();
	}
	,get_label: function() {
		var v = null;
		if(this.compoProp.label != null) v = this.compoProp.label; else {
			v = this.lang.slider.label;
			if(this.g.strVal(v,"") == "") v = "Move slider's buttons";
		}
		this.compoProp.label = v;
		return v;
	}
	,get_mouseScaleVector: function() {
		if(this.mouseScaleVector == null) this.mouseScaleVector = new apix.common.tools.math.Vector(this.get_mouseScale(),this.get_mouseScale());
		return this.mouseScaleVector;
	}
	,__class__: apix.ui.slider.Slider
});
apix.ui.slider.SliderLoader = function() { };
apix.ui.slider.SliderLoader.__name__ = ["apix","ui","slider","SliderLoader"];
apix.ui.slider.SliderLoader.__init = function(skinName,pathStr) {
	if(skinName == null) skinName = "default";
	if(pathStr != null && skinName == "default") haxe.Log.trace("f::Invalid skinName '" + skinName + "' when a custom path is given ! ",{ fileName : "Slider.hx", lineNumber : 590, className : "apix.ui.slider.SliderLoader", methodName : "__init"}); else true;
	if(pathStr == null) pathStr = "apix/default/" + "Slider/"; else pathStr = pathStr;
	apix.ui.UICompoLoader.__push(apix.ui.slider.SliderLoader.__load,apix.ui.UICompoLoader.baseUrl + pathStr,skinName);
};
apix.ui.slider.SliderLoader.__load = function(fromPath,sk) {
	var h = new haxe.Http(fromPath + ("skin." + "html"));
	h.onData = apix.ui.slider.SliderLoader.__onData;
	h.request(false);
	apix.ui.UICompoLoader.__currentSkinName = sk;
	apix.ui.UICompoLoader.__currentFromPath = fromPath;
};
apix.ui.slider.SliderLoader.__onData = function(result) {
	var skinContent = apix.ui.UICompoLoader.__storeData(result);
	apix.ui.slider.SliderLoader.__compoSkinList.push({ skinName : apix.ui.UICompoLoader.__currentSkinName, skinContent : skinContent, skinPath : apix.ui.UICompoLoader.__currentFromPath});
	apix.ui.UICompoLoader.__onEndLoad();
};
apix.ui.slider.SliderLoader.__super__ = apix.ui.UICompoLoader;
apix.ui.slider.SliderLoader.prototype = $extend(apix.ui.UICompoLoader.prototype,{
	__class__: apix.ui.slider.SliderLoader
});
apix.ui.tools = {};
apix.ui.tools.InfoBubble = function(p) {
	this.g = apix.common.util.Global.get();
	this.compoProp = new apix.common.util.Object();
	this.setup(p);
	this.load();
};
apix.ui.tools.InfoBubble.__name__ = ["apix","ui","tools","InfoBubble"];
apix.ui.tools.InfoBubble.get = function(p) {
	if(apix.ui.tools.InfoBubble._instance == null) apix.ui.tools.InfoBubble._instance = new apix.ui.tools.InfoBubble(p);
	return apix.ui.tools.InfoBubble._instance;
};
apix.ui.tools.InfoBubble.prototype = {
	text: function(info) {
		apix.common.display.ElementExtender.inner(this.element,info);
		return this;
	}
	,show: function(co) {
		var compoElem = co.element;
		var parent = apix.common.display.ElementExtender.parent(compoElem);
		if(apix.common.display.ElementExtender.parent(this.element) != parent) parent.appendChild(this.element);
		apix.common.display.ElementExtender.show(this.element);
		apix.common.display.ElementExtender.posy(this.element,apix.common.display.ElementExtender.posy(compoElem) - apix.common.display.ElementExtender.height(this.element) - 10);
		apix.common.display.ElementExtender.posx(this.element,apix.common.display.ElementExtender.posx(compoElem));
		apix.common.display.ElementExtender.css(this.element,"width",apix.common.display.ElementExtender.css(this.element,"maxWidth"));
		if(co.get_labelAlign() == "left" && !this.g.get_isMobile()) {
			apix.common.display.ElementExtender.posy(this.element,apix.common.display.ElementExtender.posy(compoElem));
			apix.common.display.ElementExtender.posx(this.element,apix.common.display.ElementExtender.posx(compoElem) + apix.common.display.ElementExtender.width(compoElem) + 5);
			apix.common.display.ElementExtender.width(this.element,apix.common.display.ElementExtender.width(parent) - apix.common.display.ElementExtender.width(compoElem) - 15);
		}
		return this;
	}
	,hide: function() {
		apix.common.display.ElementExtender.hide(this.element);
		return this;
	}
	,setup: function(p) {
		var _g = this;
		var o = new apix.common.util.Object(p);
		if(!o.empty()) o.forEach(function(k,v,i) {
			_g.compoProp.set(k,v);
		});
	}
	,load: function() {
		var h = new haxe.Http(apix.ui.UICompoLoader.baseUrl + this.get_skinPath() + ("skin." + "html"));
		h.onData = $bind(this,this.onData);
		h.request(false);
		return this;
	}
	,onData: function(result) {
		var tmp = apix.common.display.Common.createElem(null);
		tmp.id = "apix_tmp_ctnr";
		apix.common.display.ElementExtender.addChild(apix.common.display.Common.get_body(),tmp);
		apix.ui.UICompoLoader.__currentFromPath = this.get_skinPath();
		this.skinContent = apix.ui.UICompoLoader.__storeData(result);
		apix.common.display.Common.get_body().removeChild(tmp);
		this.create();
	}
	,create: function() {
		var el = apix.common.display.Common.createElem(null);
		apix.common.display.ElementExtender.inner(el,this.skinContent);
		this.element = el.firstElementChild;
		apix.common.display.ElementExtender.addChild(apix.common.display.Common.get_body(),this.element);
		apix.common.display.ElementExtender.posy(this.element,0);
		apix.common.display.ElementExtender.posx(this.element,0);
		if(this.get_color() != null) apix.common.display.ElementExtender.css(el,"color",this.get_color());
		if(this.get_bgColor() != null) apix.common.display.ElementExtender.css(el,"backgroundColor",this.get_bgColor());
		apix.common.display.ElementExtender.hide(this.element);
		if(this.get_callBack() != null) {
			(this.get_callBack())();
			this.callBack = null;
		}
	}
	,get_skinPath: function() {
		var v = null;
		if(this.compoProp.skinPath != null) v = this.compoProp.skinPath; else v = "apix/default/" + "InfoBubble/";
		this.compoProp.skinPath = v;
		return v;
	}
	,get_color: function() {
		var v = null;
		if(this.compoProp.color != null) v = this.compoProp.color;
		this.compoProp.color = v;
		return v;
	}
	,get_bgColor: function() {
		var v = null;
		if(this.compoProp.bgColor != null) v = this.compoProp.bgColor;
		this.compoProp.bgColor = v;
		return v;
	}
	,get_callBack: function() {
		var v = null;
		if(this.compoProp.callBack != null) v = this.compoProp.callBack; else v = null;
		this.compoProp.callBack = v;
		return v;
	}
	,__class__: apix.ui.tools.InfoBubble
};
apix.ui.tools.PopBox = function() {
	this.g = apix.common.util.Global.get();
};
apix.ui.tools.PopBox.__name__ = ["apix","ui","tools","PopBox"];
apix.ui.tools.PopBox.prototype = {
	create: function(p) {
		if(this.element != null) haxe.Log.trace("f::Popup already created ! Remove it before...",{ fileName : "PopBox.hx", lineNumber : 45, className : "apix.ui.tools.PopBox", methodName : "create"});
		if(p == null) p = { backgroundColor : "", parent : null, elementToHide : null};
		if(this.g.strVal(p.backgroundColor,"") == "") p.backgroundColor = "rgba(0,0,0,.8)";
		if(p.parent == null) p.parent = apix.common.display.Common.get_body();
		this.parent = p.parent;
		this.elementToHide = p.elementToHide;
		this.element = apix.common.display.Common.createElem(null);
		apix.common.display.ElementExtender.css(this.element,"position","fixed");
		apix.common.display.ElementExtender.css(this.element,"top","0px");
		apix.common.display.ElementExtender.css(this.element,"left","0px");
		apix.common.display.ElementExtender.css(this.element,"width","" + apix.common.display.Common.get_screenWidth() + "px");
		if(this.g.get_isMobile()) {
			if(apix.ui.UICompo.get_orientation() == "landscape") {
				var w = Math.max(apix.common.display.Common.get_windowWidth(),apix.common.display.Common.get_body().scrollHeight);
				apix.common.display.ElementExtender.css(this.element,"width","" + w + "px");
			}
			apix.common.display.ElementExtender.css(this.element,"height","" + apix.common.display.Common.get_body().scrollHeight + "px");
		} else apix.common.display.ElementExtender.css(this.element,"height","" + apix.common.display.Common.get_screenHeight() + "px");
		apix.common.display.ElementExtender.css(this.element,"display","none");
		apix.common.display.ElementExtender.css(this.element,"backgroundColor",p.backgroundColor);
		apix.common.display.ElementExtender.css(this.element,"zIndex",Std.string(this.g.getNextZindex()));
		this.parent.appendChild(this.element);
		this.element.id = apix.common.display.Common.get_newSingleId();
		return this;
	}
	,open: function() {
		apix.common.display.ElementExtender.css(this.element,"zIndex",Std.string(this.g.getNextZindex()));
		apix.common.display.ElementExtender.on(window,"resize",$bind(this,this.onResize));
		apix.common.display.ElementExtender.css(this.parent,"overflow","hidden");
		if(this.g.get_isMobile()) {
			if(this.g.get_isFirefox()) this.saveYpos = apix.common.display.Common.get_documentElement().scrollTop; else this.saveYpos = apix.common.display.Common.get_body().scrollTop;
			if(!this.g.get_isTablet() || this.g.get_isFirefox()) apix.common.display.ElementExtender.css(this.parent,"position","fixed");
			if(this.elementToHide != null) apix.common.display.ElementExtender.visible(this.elementToHide,false);
		}
		apix.common.display.ElementExtender.css(this.element,"display","block");
		apix.common.display.ElementExtender.css(this.element,"position","fixed");
		apix.common.display.ElementExtender.posx(this.child,(apix.common.display.Common.get_windowWidth() - apix.common.display.ElementExtender.width(this.child)) * .5);
		if(this.g.get_isMobile()) apix.common.display.ElementExtender.posy(this.child,(apix.common.display.Common.get_windowHeight() - apix.common.display.ElementExtender.height(this.child)) * .5); else apix.common.display.ElementExtender.posy(this.child,(apix.common.display.Common.get_windowHeight() - apix.common.display.ElementExtender.height(this.child)) * .5);
		return this;
	}
	,close: function() {
		apix.common.display.ElementExtender.off(window,"resize",$bind(this,this.onResize));
		apix.common.display.ElementExtender.css(this.parent,"overflow","auto");
		apix.common.display.ElementExtender.css(this.element,"display","none");
		if(this.g.get_isMobile()) {
			if(this.elementToHide != null) apix.common.display.ElementExtender.visible(this.elementToHide,true);
			if(!this.g.get_isTablet() || this.g.get_isFirefox()) {
				apix.common.display.ElementExtender.css(this.parent,"position","relative");
				window.scrollTo(0,Math.round(this.saveYpos));
			}
		}
		return this;
	}
	,addChild: function(el) {
		if(this.child != null) haxe.Log.trace("f::A child already exists in popup !!",{ fileName : "PopBox.hx", lineNumber : 110, className : "apix.ui.tools.PopBox", methodName : "addChild"});
		this.child = el;
		this.element.appendChild(this.child);
		apix.common.display.ElementExtender.css(this.child,"position","relative");
		apix.common.display.ElementExtender.posx(this.child,(apix.common.display.Common.get_windowWidth() - apix.common.display.ElementExtender.width(this.child)) * .5);
		if(this.g.get_isMobile()) apix.common.display.ElementExtender.posy(this.child,(apix.common.display.Common.get_windowHeight() - apix.common.display.ElementExtender.height(this.child)) * .5); else apix.common.display.ElementExtender.posy(this.child,(apix.common.display.Common.get_windowHeight() - apix.common.display.ElementExtender.height(this.child)) * .5);
		return this.child;
	}
	,onResize: function(e) {
		apix.common.display.ElementExtender.posx(this.child,(apix.common.display.Common.get_windowWidth() - apix.common.display.ElementExtender.width(this.child)) * .5);
		if(this.g.get_isMobile()) apix.common.display.ElementExtender.posy(this.child,(apix.common.display.Common.get_windowHeight() - apix.common.display.ElementExtender.height(this.child)) * .5); else apix.common.display.ElementExtender.posy(this.child,(apix.common.display.Common.get_windowHeight() - apix.common.display.ElementExtender.height(this.child)) * .5);
	}
	,__class__: apix.ui.tools.PopBox
};
apix.ui.tools.Spinner = function(p) {
	this.g = apix.common.util.Global.get();
	if(this.g.get_isMobile()) apix.ui.tools.Spinner.TEXT_DEFAULT = "Loading...";
	this.compoProp = new apix.common.util.Object();
	this.setup(p);
};
apix.ui.tools.Spinner.__name__ = ["apix","ui","tools","Spinner"];
apix.ui.tools.Spinner.get = function(p) {
	if(apix.ui.tools.Spinner._instance == null) apix.ui.tools.Spinner._instance = new apix.ui.tools.Spinner(p); else apix.ui.tools.Spinner._instance.setup(p);
	return apix.ui.tools.Spinner._instance;
};
apix.ui.tools.Spinner.prototype = {
	start: function() {
		if(this.spinnerBox == null) this.load(); else this.run();
	}
	,stop: function() {
		if(this.spinnerBox != null) {
			apix.common.display.ElementExtender.hide(this.element);
			this.spinnerBox.close();
		} else apix.common.util.StringExtender.trace("f::error : Spinner not initialized",null);
	}
	,run: function() {
		if(this.spinnerBox != null) {
			apix.common.display.ElementExtender.show(this.element,this.elementBeforeDisplay);
			this.spinnerBox.open();
			if(this.get_callBack() != null) {
				(this.get_callBack())();
				this.setup({ callBack : null});
			}
		} else apix.common.util.StringExtender.trace("f::error : Spinner not initialized",null);
	}
	,setup: function(p) {
		var _g = this;
		var o = new apix.common.util.Object(p);
		if(!o.empty()) o.forEach(function(k,v,i) {
			_g.compoProp.set(k,v);
		});
	}
	,load: function() {
		var h = new haxe.Http(apix.ui.UICompoLoader.baseUrl + this.get_skinPath() + ("skin." + "html"));
		h.onData = $bind(this,this.onData);
		h.request(false);
		return this;
	}
	,onData: function(result) {
		var tmp = apix.common.display.Common.createElem(null);
		tmp.id = "apix_tmp_ctnr";
		apix.common.display.ElementExtender.addChild(apix.common.display.Common.get_body(),tmp);
		apix.ui.UICompoLoader.__currentFromPath = this.get_skinPath();
		this.skinContent = apix.ui.UICompoLoader.__storeData(result);
		apix.common.display.Common.get_body().removeChild(tmp);
		this.create();
		this.run();
	}
	,create: function() {
		if(this.spinnerBox == null) {
			this.spinnerBox = new apix.ui.tools.PopBox().create({ backgroundColor : this.get_bgColor()});
			var el = apix.common.display.Common.createElem(null);
			apix.common.display.ElementExtender.inner(el,this.skinContent);
			this.element = el.firstElementChild;
			this.element.id = this.get_id();
			this.spinnerBox.addChild(this.element);
			this.doColored();
			var txEl = apix.common.util.StringExtender.get("#" + this.get_id() + " ." + ("apix_" + "text"));
			if(txEl != null && this.get_text() != "") apix.common.display.ElementExtender.inner(txEl,this.get_text());
			this.elementBeforeDisplay = apix.common.display.ElementExtender.hide(this.element);
		} else apix.common.util.StringExtender.trace("f::error : Spinner already initialized",null);
	}
	,doColored: function() {
		if(this.spinnerBox != null) apix.common.util.StringExtender.each("#" + this.get_id() + " .apix_colored",$bind(this,this.setColor)); else apix.common.util.StringExtender.trace("f::error",null);
	}
	,setColor: function(el) {
		apix.common.display.ElementExtender.css(el,"backgroundColor",this.get_color());
	}
	,get_skinPath: function() {
		var v = null;
		if(this.compoProp.skinPath != null) v = this.compoProp.skinPath; else v = "apix/default/" + "Spinner/cubeGrid/";
		this.compoProp.skinPath = v;
		return v;
	}
	,get_color: function() {
		var v = null;
		if(this.compoProp.color != null) v = this.compoProp.color; else v = "#3399dd";
		this.compoProp.color = v;
		return v;
	}
	,get_text: function() {
		var v = null;
		if(this.compoProp.text != null) v = this.compoProp.text; else v = apix.ui.tools.Spinner.TEXT_DEFAULT;
		this.compoProp.text = v;
		return v;
	}
	,get_bgColor: function() {
		var v = null;
		if(this.compoProp.bgColor != null) v = this.compoProp.bgColor; else v = "rgba(0,0,0,.7)";
		this.compoProp.bgColor = v;
		return v;
	}
	,get_callBack: function() {
		var v = null;
		if(this.compoProp.callBack != null) v = this.compoProp.callBack; else v = null;
		this.compoProp.callBack = v;
		return v;
	}
	,get_id: function() {
		var v = null;
		if(this.compoProp.id != null) v = this.compoProp.id; else v = apix.common.display.Common.get_newSingleId();
		this.compoProp.id = v;
		return v;
	}
	,__class__: apix.ui.tools.Spinner
};
haxe.Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
};
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.prototype = {
	setParameter: function(param,value) {
		this.params = Lambda.filter(this.params,function(p) {
			return p.param != param;
		});
		this.params.push({ param : param, value : value});
		return this;
	}
	,request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js.Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s;
			try {
				s = r.status;
			} catch( e ) {
				s = null;
			}
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else switch(s) {
			case 12029:
				me.req = null;
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.req = null;
				me.onError("Unknown host");
				break;
			default:
				me.req = null;
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.iterator();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e1 ) {
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.iterator();
		while( $it1.hasNext() ) {
			var h1 = $it1.next();
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,__class__: haxe.Http
};
haxe.Log = function() { };
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.ds = {};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.StringMap
};
haxe.io = {};
haxe.io.Eof = function() { };
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
haxe.xml = {};
haxe.xml.Parser = function() { };
haxe.xml.Parser.__name__ = ["haxe","xml","Parser"];
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
};
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	var buf = new StringBuf();
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start));
				buf = new StringBuf();
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			} else if(c == 38) {
				buf.addSub(str,start,p - start);
				state = 18;
				next = 13;
				start = p + 1;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child1 = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child1);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.get_nodeName()) throw "Expected </" + parent.get_nodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProcessingInstruction(str1));
				state = 1;
			}
			break;
		case 18:
			if(c == 59) {
				var s = HxOverrides.substr(str,start,p - start);
				if(s.charCodeAt(0) == 35) {
					var i;
					if(s.charCodeAt(1) == 120) i = Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)); else i = Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
					buf.add(String.fromCharCode(i));
				} else if(!haxe.xml.Parser.escapes.exists(s)) buf.b += Std.string("&" + s + ";"); else buf.add(haxe.xml.Parser.escapes.get(s));
				start = p + 1;
				state = next;
			}
			break;
		}
		c = StringTools.fastCodeAt(str,++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
js.Browser = function() { };
js.Browser.__name__ = ["js","Browser"];
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
};
js.Cookie = function() { };
js.Cookie.__name__ = ["js","Cookie"];
js.Cookie.set = function(name,value,expireDelay,path,domain) {
	var s = name + "=" + encodeURIComponent(value);
	if(expireDelay != null) {
		var d = DateTools.delta(new Date(),expireDelay * 1000);
		s += ";expires=" + d.toGMTString();
	}
	if(path != null) s += ";path=" + path;
	if(domain != null) s += ";domain=" + domain;
	window.document.cookie = s;
};
js.Cookie.all = function() {
	var h = new haxe.ds.StringMap();
	var a = window.document.cookie.split(";");
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		e = StringTools.ltrim(e);
		var t = e.split("=");
		if(t.length < 2) continue;
		h.set(t[0],decodeURIComponent(t[1].split("+").join(" ")));
	}
	return h;
};
js.Cookie.get = function(name) {
	return js.Cookie.all().get(name);
};
js.Cookie.exists = function(name) {
	return js.Cookie.all().exists(name);
};
js.Cookie.remove = function(name,path,domain) {
	js.Cookie.set(name,"",-10,path,domain);
};
var mybox = {};
mybox.Controler = function(m,v) {
	this.view = v;
	this.model = m;
	this.lang = this.model.lang;
	this.server = this.model.server;
	this.model.version = "v 2.0.1 - r 3";
	mybox.Controler.g = apix.common.util.Global.get();
};
mybox.Controler.__name__ = ["mybox","Controler"];
mybox.Controler.prototype = {
	initEvent: function() {
		apix.common.display.ElementExtender.on(window,"resize",$bind(this,this.onResize));
		this.view.resize();
	}
	,start: function(fl) {
		if(fl == null) fl = false;
		this.cb = apix.common.display.Confirm.get();
		if(fl) this.showWarning(); else this.askConnectInfo();
	}
	,showWarning: function() {
		mybox.Controler.g.alert(this.lang.warning,$bind(this,this.askConnectInfo),this.lang.warningTitle,this.lang.warningValidText);
	}
	,askConnectInfo: function() {
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerConnectInfo));
		this.server.ask({ req : "isConnectionOpen"});
	}
	,onAnswerConnectInfo: function(e) {
		this.server.serverEvent.off($bind(this,this.onAnswerConnectInfo));
		var answ = e.result.answ;
		if(answ == "connectionIsOpen") {
			this.model.set_currUserId(e.result.id);
			this.model.currUserPwd = this.model.readUserCookie(false).pwd;
			this.model.data = e.result.jsonData;
			if(this.model.data.folders == null) {
				mybox.Controler.g.alert(this.lang.serverFatalError);
				this.model.data = null;
			} else this.doAfterConnection();
		} else if(answ == "connectionIsNotOpen") this.goSignIn(); else if(answ == "error") mybox.Controler.g.alert(Std.string(this.lang.serverReadError) + "\n" + Std.string(e.result.msg),$bind(this,this.goSignIn)); else mybox.Controler.g.alert(this.lang.serverFatalError,$bind(this,this.goSignIn));
	}
	,askSignIn: function(id,pwd) {
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerSignIn));
		this.server.ask({ req : "signIn", data : JSON.stringify({ id : id, pwd : pwd})});
		this.model.currUserPwd = pwd;
	}
	,onAnswerSignIn: function(e) {
		this.server.serverEvent.off($bind(this,this.onAnswerSignIn));
		var answ = e.result.answ;
		if(answ == "error") {
			this.model.currUserPwd = null;
			var msg = e.result.msg;
			if(msg == "noValidLogin") mybox.Controler.g.alert(this.lang.noValidLoginError,$bind(this,this.onErrorCallBackSignIn)); else if(msg == "loginDoesntExist") mybox.Controler.g.alert(this.lang.loginDoesntExist,$bind(this,this.onErrorCallBackSignIn)); else if(msg == "connectionAlreadyOpen") mybox.Controler.g.alert(this.lang.connectAlreadyExists,$bind(this,this.onErrorCallBackSignIn)); else if(msg == "loginFrozen") {
				var d = mybox.Controler.g.numVal(e.result.delay,0);
				var mn = Math.floor(d / 60);
				var sec = d % 60;
				var id = e.result.id;
				var arr = [];
				arr.push(Std.string(this.lang.loginFrozen1) + (mn == null?"null":"" + mn));
				arr.push(Std.string(this.lang.loginFrozen2) + (sec == null?"null":"" + sec));
				arr = arr.concat(this.lang.loginFrozen3);
				mybox.Controler.g.alert(arr,$bind(this,this.onErrorCallBackSignIn));
			} else if(msg != "") mybox.Controler.g.alert(Std.string(this.lang.serverReadError) + msg,$bind(this,this.onErrorCallBackSignIn)); else mybox.Controler.g.alert(this.lang.serverFatalError,$bind(this,this.onErrorCallBackSignIn));
		} else if(answ == "signInOk") {
			this.model.set_currUserId(e.result.id);
			this.model.data = e.result.jsonData;
			if(this.model.data.folders == null) {
				mybox.Controler.g.alert(this.lang.serverFatalError,$bind(this,this.onErrorCallBackSignIn));
				this.model.data = null;
			} else {
				this.model.writeUserCookie();
				this.doAfterConnection();
			}
		} else mybox.Controler.g.alert(this.lang.serverFatalError,$bind(this,this.onErrorCallBackSignIn));
	}
	,onErrorCallBackSignIn: function() {
		this.model.currUserPwd = null;
		this.goSignIn();
	}
	,askSignUp: function(id,pwd) {
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerSignUp));
		this.model.currUserPwd = pwd;
		this.server.ask({ req : "signUp", data : JSON.stringify({ id : id, pwd : pwd})});
	}
	,onAnswerSignUp: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			var msg = e.result.msg;
			if(msg == "idAlreadyExist") mybox.Controler.g.alert(this.lang.alreadyExistError,$bind(this,this.onErrorCallBackSignUp)); else if(msg == "noValidLogin") mybox.Controler.g.alert(this.lang.noValidLoginError,$bind(this,this.onErrorCallBackSignUp)); else mybox.Controler.g.alert(Std.string(this.lang.serverReadError) + msg,$bind(this,this.onErrorCallBackSignUp));
			this.model.currUserPwd = null;
		} else if(answ == "signUpOk") {
			this.model.set_currUserId(e.result.id);
			this.model.writeUserCookie();
			this.goMain();
		} else mybox.Controler.g.alert(this.lang.serverFatalError,$bind(this,this.onErrorCallBackSignUp));
	}
	,onErrorCallBackSignUp: function() {
		this.model.currUserPwd = null;
	}
	,askLogOff: function() {
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerLogOff));
		this.server.ask({ req : "logOff"});
	}
	,onAnswerLogOff: function(e) {
		var answ = e.result.answ;
		if(answ == "logOffOk") {
			var id = e.result.id;
			this.model.set_currUserId(null);
			this.model.currUserPwd = null;
		} else {
			this.model.set_currUserId(null);
			this.model.currUserPwd = null;
		}
		this.goSignIn();
	}
	,doAfterConnection: function() {
		this.model.initDataObject();
		this.model.setupTree();
		this.goMain();
	}
	,goSignIn: function() {
		var o = this.model.readUserCookie();
		this.view.showLoginView(mybox.Controler.g.strVal(o.id,""),mybox.Controler.g.strVal(o.pwd,""),"signIn");
		apix.common.display.ElementExtender.joinEnterKeyToClick(this.view.get_bConnect());
		this.setupSignInEvent();
	}
	,goSignUp: function() {
		this.view.showLoginView(null,null,"signUp");
		this.setupSignUpEvent();
	}
	,goMain: function() {
		this.view.showStdView();
		this.setupStdViewEvent();
		this.model.root.display();
		if(this.model.dataIsEmpty()) mybox.Controler.g.alert(this.lang.alertBeforeFolderCreation,null,this.lang.startAlertTitle); else if(this.model.dataIsFormLess()) mybox.Controler.g.alert(this.lang.alertBeforeFormCreation,null,this.lang.startAlertTitle);
	}
	,logOff: function() {
		this.model.clear();
		this.view.clear();
		this.model.root.click.off($bind(this,this.onFormOrFolderClick));
		this.setupUsingMode();
		this.askLogOff();
	}
	,setupAdminMode: function() {
		this.view.setupAdminMode();
		this.view.model.root.setupAdminMode();
		this.setupAdminModeEvent();
		this.model.mode = "admin";
		this.setStateOfAddButtons(this.model.selectedFormOrFolder);
	}
	,setupUsingMode: function() {
		this.view.setupUsingMode();
		this.view.model.root.setupUsingMode();
		this.setupUsingModeEvent();
		this.model.mode = "using";
	}
	,setupSignInEvent: function() {
		if(apix.common.display.ElementExtender.hasLst(this.view.get_bConnect(),"click")) apix.common.display.ElementExtender.off(this.view.get_bConnect(),"click",$bind(this,this.onSignUpClick));
		if(apix.common.display.ElementExtender.hasLst(this.view.get_bBackSignIn(),"click")) apix.common.display.ElementExtender.off(this.view.get_bBackSignIn(),"click",$bind(this,this.onBackSignInClick));
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bConnect(),"click")) apix.common.display.ElementExtender.on(this.view.get_bConnect(),"click",$bind(this,this.onSignInClick));
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bGoSignUp(),"click")) apix.common.display.ElementExtender.on(this.view.get_bGoSignUp(),"click",$bind(this,this.onGoSignUpClick));
		this.setupLangEvent();
	}
	,setupSignUpEvent: function() {
		if(apix.common.display.ElementExtender.hasLst(this.view.get_bConnect(),"click")) apix.common.display.ElementExtender.off(this.view.get_bConnect(),"click",$bind(this,this.onSignInClick));
		if(apix.common.display.ElementExtender.hasLst(this.view.get_bGoSignUp(),"click")) apix.common.display.ElementExtender.off(this.view.get_bGoSignUp(),"click",$bind(this,this.onGoSignUpClick));
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bConnect(),"click")) apix.common.display.ElementExtender.on(this.view.get_bConnect(),"click",$bind(this,this.onSignUpClick));
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bBackSignIn(),"click")) apix.common.display.ElementExtender.on(this.view.get_bBackSignIn(),"click",$bind(this,this.onBackSignInClick));
		this.setupLangEvent();
	}
	,setupLangEvent: function() {
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_linkLang1(),"click")) apix.common.display.ElementExtender.on(this.view.get_linkLang1(),"click",$bind(this,this.onChangeLang),false,{ lg : this.lang.langApp1Src});
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_linkLang2(),"click")) apix.common.display.ElementExtender.on(this.view.get_linkLang2(),"click",$bind(this,this.onChangeLang),false,{ lg : this.lang.langApp2Src});
	}
	,setupStdViewEvent: function() {
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bAdmin(),"click")) apix.common.display.ElementExtender.on(this.view.get_bAdmin(),"click",$bind(this,this.onAdminClick));
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bDoc(),"click")) apix.common.display.ElementExtender.on(this.view.get_bDoc(),"click",$bind(this,this.onDocClick));
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bTip(),"click")) apix.common.display.ElementExtender.on(this.view.get_bTip(),"click",$bind(this,this.onTipClick));
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bLang1(),"click")) apix.common.display.ElementExtender.on(this.view.get_bLang1(),"click",$bind(this,this.onChangeLang),false,{ lg : this.lang.langApp1Src});
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bLang2(),"click")) apix.common.display.ElementExtender.on(this.view.get_bLang2(),"click",$bind(this,this.onChangeLang),false,{ lg : this.lang.langApp2Src});
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bOpenMenu(),"click")) apix.common.display.ElementExtender.on(this.view.get_bOpenMenu(),"click",$bind(this,this.onOpenMenuClick));
		apix.common.display.ElementExtender.off(this.view.get_bGoPrevious());
		apix.common.display.ElementExtender.on(this.view.get_bGoPrevious(),"click",$bind(this,this.onLogOffClick));
		if(!apix.common.display.ElementExtender.hasLst(window,"click")) apix.common.display.ElementExtender.on(window,"click",$bind(this,this.onWindowClick));
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bLogOff(),"click")) apix.common.display.ElementExtender.on(this.view.get_bLogOff(),"click",$bind(this,this.onLogOffClick));
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bQuitAdmin(),"click")) apix.common.display.ElementExtender.on(this.view.get_bQuitAdmin(),"click",$bind(this,this.onBackFromAdmin));
		if(!this.model.root.click.hasListener()) this.model.root.click.on($bind(this,this.onFormOrFolderClick));
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bGoUp(),"click")) apix.common.display.ElementExtender.on(this.view.get_bGoUp(),"click",$bind(this,this.onGoUpClick));
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bSafeMode(),"click")) apix.common.display.ElementExtender.on(this.view.get_bSafeMode(),"click",$bind(this,this.onChangeSafeModeClick));
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bAbout(),"click")) apix.common.display.ElementExtender.on(this.view.get_bAbout(),"click",$bind(this,this.onAboutClick));
	}
	,enableAddButtonEvent: function(fd,fo) {
		if(fo == null) fo = true;
		if(fd == null) fd = true;
		if(fd && !apix.common.display.ElementExtender.hasLst(this.view.get_bAddFolder(),"click")) apix.common.display.ElementExtender.on(this.view.get_bAddFolder(),"click",$bind(this,this.onAddFolderClick));
		if(fo && !apix.common.display.ElementExtender.hasLst(this.view.get_bAddForm(),"click")) apix.common.display.ElementExtender.on(this.view.get_bAddForm(),"click",$bind(this,this.onAddFormClick));
	}
	,disableAddButtonEvent: function(fd,fo) {
		if(fo == null) fo = true;
		if(fd == null) fd = true;
		if(fd && apix.common.display.ElementExtender.hasLst(this.view.get_bAddFolder(),"click")) apix.common.display.ElementExtender.off(this.view.get_bAddFolder(),"click",$bind(this,this.onAddFolderClick));
		if(fo && apix.common.display.ElementExtender.hasLst(this.view.get_bAddForm(),"click")) apix.common.display.ElementExtender.off(this.view.get_bAddForm(),"click",$bind(this,this.onAddFormClick));
	}
	,enableAddFieldButtonEvent: function() {
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bAddField(),"click")) apix.common.display.ElementExtender.on(this.view.get_bAddField(),"click",$bind(this,this.onAddFieldClick));
	}
	,disableAddFieldButtonEvent: function() {
		if(apix.common.display.ElementExtender.hasLst(this.view.get_bAddField(),"click")) apix.common.display.ElementExtender.off(this.view.get_bAddField(),"click",$bind(this,this.onAddFieldClick));
	}
	,enableAddRecordButtonEvent: function() {
		if(!apix.common.display.ElementExtender.hasLst(this.view.get_bAddRecord(),"click")) apix.common.display.ElementExtender.on(this.view.get_bAddRecord(),"click",$bind(this,this.onAddRecordClick));
	}
	,setupAdminModeEvent: function() {
		apix.common.display.ElementExtender.off(this.view.get_bGoPrevious());
		apix.common.display.ElementExtender.on(this.view.get_bGoPrevious(),"click",$bind(this,this.onBackFromAdmin));
		apix.common.display.ElementExtender.show(this.view.get_bQuitAdmin());
		this.enableAddButtonEvent();
	}
	,setupUsingModeEvent: function() {
		apix.common.display.ElementExtender.off(this.view.get_bGoPrevious());
		apix.common.display.ElementExtender.on(this.view.get_bGoPrevious(),"click",$bind(this,this.onLogOffClick));
		apix.common.display.ElementExtender.hide(this.view.get_bQuitAdmin());
		this.disableAddButtonEvent();
		this.disableAddFieldButtonEvent();
	}
	,onSignInClick: function(e) {
		apix.common.display.ElementExtender.clearEnterKeyToClick(this.view.get_bConnect());
		var str = this.model.isValidSignInInput(this.view.get_idValue(),this.view.get_pwdValue());
		if(str != "") mybox.Controler.g.alert(str); else this.askSignIn(this.view.get_idValue(),this.view.get_pwdValue());
	}
	,onSignUpClick: function(e) {
		apix.common.display.ElementExtender.clearEnterKeyToClick(this.view.get_bConnect());
		var str = this.model.isValidSignUpInput(this.view.get_idValue(),this.view.get_pwdValue(),this.view.get_confirmValue());
		if(str != "") mybox.Controler.g.alert(str); else this.askSignUp(this.view.get_idValue(),this.view.get_pwdValue());
	}
	,onGoSignUpClick: function(e) {
		this.goSignUp();
	}
	,onBackSignInClick: function(e) {
		this.goSignIn();
	}
	,onOpenMenuClick: function(e) {
		e.stopPropagation();
		this.view.setMenuSafeModeLabel();
		apix.common.display.ElementExtender.show(this.view.get_menu());
		this.view.resize();
	}
	,onLogOffClick: function(e) {
		this.logOff();
	}
	,onAdminClick: function(e) {
		this.setupAdminMode();
	}
	,onDocClick: function(e) {
		mybox.Controler.g.open(this.lang.menuDocSrc,"_self");
	}
	,onTipClick: function(e) {
		var arr = this.lang.tipArray;
		this.view.tipArray = arr.slice();
		this.view.showTips();
	}
	,onChangeLang: function(e,p) {
		this.model.set_language(p.lg);
		mybox.Controler.g.replace("./index.html");
	}
	,onChangeSafeModeClick: function(e) {
		if(this.model.get_isSafeMode()) this.cb.show(this.lang.goToNoSafeMode,$bind(this,this.onChangeSafeMode)); else this.cb.show(this.lang.goToSafeMode,$bind(this,this.onChangeSafeMode));
	}
	,onChangeSafeMode: function(b,f) {
		if(b) {
			if(this.model.get_isSafeMode()) this.model.setSafeMode(false); else this.model.setSafeMode(true);
			this.view.setMenuSafeModeLabel();
			this.cb.hide();
		}
	}
	,onAboutClick: function(e) {
		mybox.Controler.g.alert(this.lang.about,null,this.lang.aboutTitle);
	}
	,onBackFromAdmin: function(e) {
		this.setupUsingMode();
		this.model.root.click.off($bind(this,this.onFormOrFolderClick));
		this.model.clear();
		this.askConnectInfo();
	}
	,onGoUpClick: function(e) {
		this.setupCurrentFormOrFolder(this.model.root);
	}
	,onFormOrFolderClick: function(ev) {
		this.setupCurrentFormOrFolder(ev.target);
	}
	,setupCurrentFormOrFolder: function(f) {
		if(this.model.selectedFormOrFolder != this.model.root) this.model.selectedFormOrFolder.unselect();
		this.model.selectedFormOrFolder = f;
		if(this.model.selectedFormOrFolder != this.model.root) this.model.selectedFormOrFolder.select();
		this.setStateOfAddButtons(this.model.selectedFormOrFolder);
		apix.common.display.ElementExtender.text(this.view.get_pathElem(),f.get_path());
	}
	,setStateOfAddButtons: function(fo) {
		if(this.model.mode == "admin") {
			if(fo["is"]("Folder")) {
				var fd;
				fd = js.Boot.__cast(fo , mybox.boxes.Folder);
				if(fd.get_level() < 3) {
					this.enableAddButtonEvent();
					fd.setStateOfAddButtons();
				} else if(fd.get_level() < 4) {
					this.disableAddButtonEvent();
					this.enableAddButtonEvent(false,true);
					fd.setStateOfAddButtons(".4","1");
				} else {
					fd.setStateOfAddButtons(".5");
					this.disableAddButtonEvent();
				}
			} else {
				apix.common.display.ElementExtender.hide(this.view.get_bAddRecord());
				apix.common.display.ElementExtender.show(this.view.get_bAddField());
				this.view.resize();
				fo.setStateOfAddButtons();
				this.enableAddFieldButtonEvent();
			}
		} else if(fo["is"]("Form")) {
			apix.common.display.ElementExtender.show(this.view.get_bAddRecord());
			this.view.resize();
			this.enableAddRecordButtonEvent();
		} else apix.common.display.ElementExtender.hide(this.view.get_bAddRecord());
	}
	,onAddFolderClick: function(e) {
		var fd;
		fd = js.Boot.__cast(this.model.selectedFormOrFolder , mybox.boxes.Folder);
		fd.insertNewFolder();
	}
	,onAddFormClick: function(e) {
		var fd;
		fd = js.Boot.__cast(this.model.selectedFormOrFolder , mybox.boxes.Folder);
		fd.insertNewForm();
	}
	,onAddFieldClick: function(e) {
		var fo;
		fo = js.Boot.__cast(this.model.selectedFormOrFolder , mybox.boxes.Form);
		fo.insertNewField();
	}
	,onAddRecordClick: function(e) {
		var fo;
		fo = js.Boot.__cast(this.model.selectedFormOrFolder , mybox.boxes.Form);
		fo.insertNewRecord();
	}
	,onWindowClick: function(e) {
		apix.common.display.ElementExtender.hide(this.view.get_menu());
	}
	,onResize: function(e) {
		this.view.resize();
	}
	,__class__: mybox.Controler
};
mybox.Model = function(bu,su,l,p) {
	this.baseUrl = bu;
	this.serverUrl = su;
	this.lang = l;
	this.param = p;
	if(HxOverrides.substr(this.serverUrl,0,4) != "http") su = this.baseUrl + this.serverUrl;
	this.server = new mybox.Server(su,this);
	this.mode = "using";
	mybox.Model.g = apix.common.util.Global.get();
};
mybox.Model.__name__ = ["mybox","Model"];
mybox.Model.prototype = {
	set_currUserId: function(v) {
		this._currUserId = v;
		if(this._currUserId == null) this.view.set_currUserId(""); else this.view.set_currUserId(this._currUserId);
		return this._currUserId;
	}
	,get_currUserId: function() {
		return this._currUserId;
	}
	,set_language: function(v) {
		var del = 31536000 * 1000;
		js.Cookie.set("safeboxLanguage",v,del);
		return v;
	}
	,get_isSafeMode: function() {
		return !js.Cookie.exists("safeboxUnsafe");
	}
	,setSafeMode: function(isSafe) {
		if(isSafe == null) isSafe = true;
		var del = 31536000 * 1000;
		if(isSafe) {
			if(js.Cookie.exists("safeboxUnsafe")) js.Cookie.remove("safeboxUnsafe");
			js.Cookie.remove("safeboxId");
			js.Cookie.remove("safeboxPwd");
			this.currCookieId = null;
			this.currCookiePwd = null;
		} else {
			if(!js.Cookie.exists("safeboxUnsafe")) js.Cookie.set("safeboxUnsafe","true",del);
			this.currCookieId = null;
			this.currCookiePwd = null;
			this.writeUserCookie();
		}
	}
	,createRootFolder: function(v) {
		this.view = v;
		this.root = new mybox.boxes.Folder(this,this.view);
		this.root.init(0,"root");
		this.root.index = 0;
		this.root.shift = 0 - this.root.shiftVal;
		this.root.set_elemsCtnr(this.view.get_rootElemsCtnr());
		this.selectedFormOrFolder = this.root;
	}
	,readUserCookie: function(b) {
		if(b == null) b = true;
		var o = new apix.common.util.Object({ currCookieId : null, currCookiePwd : null});
		if(!this.get_isSafeMode()) {
			if(js.Cookie.exists("safeboxId")) {
				this.currCookieId = js.Cookie.get("safeboxId");
				this.currCookiePwd = js.Cookie.get("safeboxPwd");
				o.id = this.currCookieId;
				o.pwd = this.currCookiePwd;
				this.currUserPwd = this.currCookiePwd;
			} else if(b) {
				if(mybox.Model.g.strVal(this.get_currUserId(),"") != "") {
					this.writeUserCookie();
					o = this.readUserCookie(false);
				}
			}
		}
		return o;
	}
	,writeUserCookie: function() {
		if(!this.get_isSafeMode()) {
			if(this.currCookieId != this.get_currUserId() || this.currCookiePwd != this.currUserPwd) {
				var del = 31536000 * 1000;
				if(mybox.Model.g.strVal(this.get_currUserId(),"") != "") {
					js.Cookie.set("safeboxId",this.get_currUserId(),del);
					this.currCookieId = this.get_currUserId();
					if(mybox.Model.g.strVal(this.currUserPwd,"") != "") {
						js.Cookie.set("safeboxPwd",this.currUserPwd,del);
						this.currCookiePwd = this.currUserPwd;
					}
				}
			}
		}
	}
	,isValidSignInInput: function(id,pwd) {
		var str = "";
		if(!apix.common.util.StringExtender.isMail(id)) str += Std.string(this.lang.notEmailError);
		if(Std.parseInt(this.param.pwdMinLen) > pwd.length) str += Std.string(this.lang.pwdLengthError);
		return str;
	}
	,isValidSignUpInput: function(id,pwd,confirm) {
		var str = this.isValidSignInInput(id,pwd);
		if(pwd != confirm) str += Std.string(this.lang.confirmPwdError);
		return str;
	}
	,initDataObject: function() {
		var arr = this.data.folders;
		var _g1 = 0;
		var _g = arr.length;
		while(_g1 < _g) {
			var i = _g1++;
			var o = new apix.common.util.Object(arr[i]);
			arr[i] = o;
			o.id = mybox.Model.g.intVal(o.id,1);
			if(o.is_form == 1) o.is_form = true; else o.is_form = false;
			if(o.is_form && o.fields != null) {
				var arrf = o.fields;
				var _g3 = 0;
				var _g2 = arrf.length;
				while(_g3 < _g2) {
					var i1 = _g3++;
					var of = new apix.common.util.Object(arrf[i1]);
					arrf[i1] = of;
					of.id = mybox.Model.g.intVal(of.id,1);
					of.row_number = mybox.Model.g.intVal(of.row_number,1);
					if(of.is_hidden == 1) of.is_hidden = true; else of.is_hidden = false;
					if(of.required == 1) of.required = true; else of.required = false;
					if(of.copy_enable == 1) of.copy_enable = true; else of.copy_enable = false;
					if(of.is_primary == 1) of.is_primary = true; else of.is_primary = false;
					if(of.is_secure == 1) of.is_secure = true; else of.is_secure = false;
					if(of.selectfields != null) {
						var osf = new apix.common.util.Object(of.selectfields);
						of.selectfields = osf;
						if(osf.is_multiple == 1) osf.is_multiple = true; else osf.is_multiple = false;
					}
				}
			}
		}
	}
	,dataIsEmpty: function() {
		return !(this.data != null && this.data != { } && this.data.folders != null && ((this.data.folders instanceof Array) && this.data.folders.__enum__ == null) && this.data.folders.length > 0);
	}
	,dataIsFormLess: function() {
		var arr = this.data.folders;
		var b = true;
		var len = arr.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b = !arr[i].is_form;
			if(!b) break;
		}
		return b;
	}
	,setupTree: function() {
		var arr = this.data.folders;
		var _g1 = 0;
		var _g = arr.length;
		while(_g1 < _g) {
			var i = _g1++;
			var o = arr[i];
			if(!o.is_form) {
				var fd = new mybox.boxes.Folder(this,this.view);
				fd.init(o.id,o.label);
				this.root.setupFolderTreeRelation(o,fd);
			} else {
				var f = new mybox.boxes.Form(this,this.view);
				f.init(o.id,o.label);
				this.root.setupFormTreeRelation(o,f);
				if(o.fields != null) f.setupFormFields(o.fields);
			}
		}
	}
	,clear: function() {
		this.root.clear();
		this.data = null;
		this.selectedFormOrFolder = this.root;
	}
	,__class__: mybox.Model
};
mybox.SafeBox = function(bu,su,l,p,fl) {
	if(fl == null) fl = false;
	this.model = new mybox.Model(bu,su,l,p);
	this.view = new mybox.View(this.model);
	this.controler = new mybox.Controler(this.model,this.view);
	this.firstLaunch = fl;
	this.start();
};
mybox.SafeBox.__name__ = ["mybox","SafeBox"];
mybox.SafeBox.prototype = {
	start: function() {
		apix.ui.tools.Spinner.get().stop();
		this.view.initDisplay();
		this.view.initAlert();
		this.view.initConfirm();
		this.model.createRootFolder(this.view);
		this.controler.initEvent();
		this.controler.start(this.firstLaunch);
	}
	,__class__: mybox.SafeBox
};
mybox.Server = function(su,m) {
	this.serverUrl = su;
	this.serverEvent = new apix.common.event.EventSource();
	mybox.Server._instance = this;
	this.spinner = apix.ui.tools.Spinner.get();
	this.model = m;
	this.g = apix.common.util.Global.get();
};
mybox.Server.__name__ = ["mybox","Server"];
mybox.Server.prototype = {
	ask: function(o) {
		this.spinner.start();
		this.initServer();
		var httpRequest;
		httpRequest = this.httpStandardRequest;
		httpRequest.onData = $bind(this,this.onServerData);
		httpRequest.onError = $bind(this,this.onServerError);
		this.currentAskObject = o;
		if(o != null) {
			var arr = Reflect.fields(o);
			var _g1 = 0;
			var _g = arr.length;
			while(_g1 < _g) {
				var i = _g1++;
				httpRequest.setParameter(arr[i],Reflect.field(o,arr[i]));
			}
		}
		httpRequest.request(true);
	}
	,initServer: function() {
		if(this.httpStandardRequest == null) this.httpStandardRequest = new haxe.Http(this.serverUrl);
	}
	,onServerData: function(data) {
		data = StringTools.trim(data);
		var e = new apix.common.event.StandardEvent(this);
		if(HxOverrides.substr(data,0,5) == "<?xml") e.result = new apix.common.util.xml.XmlParser().parse(Xml.parse(data)); else {
			e.result = apix.common.io.HttpExtender.getParameter(this.httpStandardRequest,data);
			if(e.result.data != null && e.result.data.substr(0,1) == "{") e.result.jsonData = new apix.common.util.Object(JSON.parse(this.g.decodeAmp(e.result.data)));
		}
		this.currentAnswerObject = e;
		if(this.isDeconnected(e.result)) this.askAutoLogin(); else {
			this.spinner.stop();
			this.serverEvent.dispatch(e);
		}
	}
	,onServerError: function(msg) {
		var e = new apix.common.event.StandardEvent(this);
		e.result = { answ : "error", msg : msg};
		this.serverEvent.dispatch(e);
		haxe.Log.trace("f::From server:\n" + msg,{ fileName : "Server.hx", lineNumber : 115, className : "mybox.Server", methodName : "onServerError"});
	}
	,askAutoLogin: function() {
		this.httpStandardRequest.onData = $bind(this,this.onAnswerAutoLogin);
		this.httpStandardRequest.onError = $bind(this,this.onServerError);
		var o = { req : "signIn", id : this.model.get_currUserId(), pwd : this.model.currUserPwd};
		var arr = Reflect.fields(o);
		var _g1 = 0;
		var _g = arr.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.httpStandardRequest.setParameter(arr[i],Reflect.field(o,arr[i]));
		}
		this.httpStandardRequest.request(true);
	}
	,onAnswerAutoLogin: function(data) {
		var answ = apix.common.io.HttpExtender.getParameter(this.httpStandardRequest,StringTools.trim(data)).answ;
		if(answ != "signInOk") {
			this.spinner.stop();
			this.serverEvent.dispatch(this.currentAnswerObject);
		} else this.ask(this.currentAskObject);
	}
	,isDeconnected: function(result) {
		var er = false;
		if(result.answ == "error" && result.msg != null && result.msg == "connectionHasBeenClosed") er = true; else if(result.records != null && result.records.error != null && result.records.error.value == "connectionHasBeenClosed") er = true;
		if(er && this.currentAskObject != null && this.model.get_isSafeMode() == false && this.model.get_currUserId() != null && this.model.currUserPwd != null) return true; else return false;
	}
	,__class__: mybox.Server
};
mybox.View = function(m) {
	this.model = m;
	this.lang = m.lang;
	this.param = this.model.param;
	this.g = apix.common.util.Global.get();
	this.tipBoxElem = apix.common.util.StringExtender.get("#safeBox #apix_tipBox");
};
mybox.View.__name__ = ["mybox","View"];
mybox.View.prototype = {
	get_linkDoc: function() {
		return apix.common.util.StringExtender.get("#safeBox #loginView .apix_links .apix_linkDoc");
	}
	,get_linkLang1: function() {
		return apix.common.util.StringExtender.get("#safeBox #loginView .apix_links .apix_linkLang1");
	}
	,get_linkLang2: function() {
		return apix.common.util.StringExtender.get("#safeBox #loginView .apix_links .apix_linkLang2");
	}
	,get_bLang1: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_bLang1");
	}
	,get_bLang2: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_bLang2");
	}
	,set_currUserId: function(v) {
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bLogOff(),"apix_userId"),v);
		return v;
	}
	,get_bConnect: function() {
		return apix.common.util.StringExtender.get("#safeBox #bConnect");
	}
	,get_bGoSignUp: function() {
		return apix.common.util.StringExtender.get("#safeBox #bGoSignUp");
	}
	,get_bBackSignIn: function() {
		return apix.common.util.StringExtender.get("#safeBox .connectForm .apix_goPrevious");
	}
	,get_idValue: function() {
		return apix.common.display.ElementExtender.value(apix.common.util.StringExtender.get("#safeBox #idMail"));
	}
	,get_pwdValue: function() {
		return apix.common.display.ElementExtender.value(apix.common.util.StringExtender.get("#safeBox #pwd"));
	}
	,get_confirmValue: function() {
		return apix.common.display.ElementExtender.value(apix.common.util.StringExtender.get("#safeBox #confirm"));
	}
	,get_bOpenMenu: function() {
		return apix.common.util.StringExtender.get("#safeBox #stdView .apix_openMenu");
	}
	,get_bGoPrevious: function() {
		return apix.common.util.StringExtender.get("#safeBox #stdView .apix_goPrevious");
	}
	,get_bGoUp: function() {
		return apix.common.util.StringExtender.get("#safeBox #stdView .apix_goUp");
	}
	,get_menu: function() {
		return apix.common.util.StringExtender.get("#safeBox .menu");
	}
	,get_bLogOff: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_bLogOff");
	}
	,get_bAdmin: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_bAdmin");
	}
	,get_bDoc: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_bDoc");
	}
	,get_bTip: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_bTip");
	}
	,get_bQuitAdmin: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_bQuitAdmin");
	}
	,get_bSafeMode: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_bSafeMode");
	}
	,get_bAbout: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_bAbout");
	}
	,get_rootElemsCtnr: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_buttonCtnr");
	}
	,get_fButtonProto: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_folderButton");
	}
	,get_fieldDataProto: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_fieldDataProto");
	}
	,get_frameFieldDataProto: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_frameFieldDataProto");
	}
	,get_nameFrame: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame");
	}
	,get_nameFrameTitle: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_title");
	}
	,get_nameFrameName: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_name");
	}
	,get_nameFramePath: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_path");
	}
	,get_bNameFrameCancel: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_cancelPicto");
	}
	,get_bNameFrameValid: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_validPicto");
	}
	,get_foName: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame input[name='foName']");
	}
	,get_nameFramefieldsCtnr: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr");
	}
	,get_rowNumberLabel: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_rowNumber .apix_label");
	}
	,get_decimalNumberLabel: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_decimalNumber .apix_label");
	}
	,get_minValueLabel: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_minValue .apix_label");
	}
	,get_maxValueLabel: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_maxValue .apix_label");
	}
	,get_copyEnableLabel: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_copyEnable .apix_label");
	}
	,get_requiredLabel: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_required .apix_label");
	}
	,get_isHiddenLabel: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_isHidden .apix_label");
	}
	,get_isSecureLabel: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_isSecure .apix_label");
	}
	,get_isPrimaryLabel: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_isPrimary .apix_label");
	}
	,get_controlLabel: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_control .apix_label");
	}
	,get_isMultipleLabel: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_isMultiple .apix_label");
	}
	,get_rowNumberInput: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame input[name='rowNumber']");
	}
	,get_decimalNumberInput: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame input[name='decimalNumber']");
	}
	,get_minValueInput: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame input[name='minValue']");
	}
	,get_maxValueInput: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame input[name='maxValue']");
	}
	,get_copyEnableInput: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame input[name='copyEnable']");
	}
	,get_requiredInput: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame input[name='required']");
	}
	,get_isHiddenInput: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame input[name='isHidden']");
	}
	,get_isSecureInput: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame input[name='isSecure']");
	}
	,get_isPrimaryInput: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame input[name='isPrimary']");
	}
	,get_controlInput: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_control select");
	}
	,get_controlDetailCtnr: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_controlDetailCtnr");
	}
	,get_selectListCtnr: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_selectListCtnr");
	}
	,get_selectLineProto: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_selectLineProto");
	}
	,get_bAddSelectLine: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_addSelectLine");
	}
	,get_frameSelectFieldDataProto: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_frameSelectFieldDataProto");
	}
	,get_frameCheckFieldDataProto: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_frameCheckFieldDataProto");
	}
	,get_frameRadioFieldDataProto: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_frameRadioFieldDataProto");
	}
	,get_isMultipleInput: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame input[name='isMultiple']");
	}
	,get_secureFrame: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_secureFrame");
	}
	,get_secureFrameInner: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_secureFrame .inner");
	}
	,get_secureFrameTitle: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_secureFrame .apix_title");
	}
	,get_secureFrameCmt: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_secureFrame .apix_cmt");
	}
	,get_secureFrameCode: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_secureFrame .apix_secureCode");
	}
	,get_bValidSecureFrame: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_secureFrame .apix_validPicto");
	}
	,get_bRubSecureFrame: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_secureFrame .apix_rubPicto");
	}
	,get_secureFrameCodePictoString: function() {
		return "#apix_secureFrame .apix_codePicto";
	}
	,get_pathElem: function() {
		return apix.common.util.StringExtender.get("#safeBox .apix_path");
	}
	,get_bAddFolder: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_addFolder");
	}
	,get_bAddForm: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_addForm");
	}
	,get_bAddField: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_addField");
	}
	,get_bAddRecord: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_addRecord");
	}
	,initDisplay: function() {
		var _g = this;
		apix.common.display.ElementExtender.hide(apix.common.util.StringExtender.get("#safeBox #loginView"));
		apix.common.display.ElementExtender.hide(apix.common.util.StringExtender.get("#safeBox #stdView"));
		apix.common.util.StringExtender.each("#safeBox .apix_initHidden",apix.common.display.ElementExtender.hide);
		apix.common.display.ElementExtender.show(this.get_rootElemsCtnr());
		apix.common.display.ElementExtender.inner(apix.common.util.StringExtender.get("#safeBox .headInfo"),this.lang.headInfo);
		apix.common.display.ElementExtender.text(apix.common.util.StringExtender.get("#safeBox #bConnect .apix_label"),this.lang.bConnectLabel);
		apix.common.display.ElementExtender.text(apix.common.util.StringExtender.get("#safeBox #bGoSignUp .apix_label"),this.lang.bGoSignupLabel);
		apix.common.display.ElementExtender.tip(apix.common.util.StringExtender.get("#safeBox #loginView .apix_goPrevious"),this.lang.goPreviousTitle);
		apix.common.display.ElementExtender.tip(apix.common.util.StringExtender.get("#safeBox #stdView .apix_goPrevious"),this.lang.goPreviousTitle);
		apix.common.display.ElementExtender.tip(apix.common.util.StringExtender.get("#safeBox .topText"),this.lang.topTextTitle);
		apix.common.display.ElementExtender.tip(apix.common.util.StringExtender.get("#safeBox .apix_goUp"),this.lang.goUpTitle);
		apix.common.display.ElementExtender.tip(apix.common.util.StringExtender.get("#safeBox .apix_openMenu"),this.lang.openMenuTitle);
		apix.common.display.ElementExtender.tip(apix.common.util.StringExtender.get("#safeBox .removePicto"),this.lang.removePictoTitle);
		apix.common.display.ElementExtender.tip(apix.common.util.StringExtender.get("#safeBox .updatePicto"),this.lang.updatePictoTitle);
		apix.common.display.ElementExtender.tip(apix.common.util.StringExtender.get("#safeBox .showPicto"),this.lang.showPictoTitle);
		apix.common.display.ElementExtender.tip(apix.common.util.StringExtender.get("#safeBox .rubPicto"),this.lang.rubPictoTitle);
		apix.common.util.StringExtender.each("#safeBox .copyPicto",function(c) {
			apix.common.display.ElementExtender.tip(c,_g.lang.copyPictoTitle);
		});
		apix.common.util.StringExtender.each("#safeBox .apix_cancelPicto",function(c1) {
			apix.common.display.ElementExtender.tip(c1,_g.lang.cancelPictoTitle);
		});
		apix.common.util.StringExtender.each("#safeBox .apix_validPicto",function(c2) {
			apix.common.display.ElementExtender.tip(c2,_g.lang.validPictoTitle);
		});
		apix.common.util.StringExtender.each("#safeBox .apix_codePicto",function(c3) {
			apix.common.display.ElementExtender.tip(c3,_g.lang.codePictoTitle);
		});
		apix.common.display.ElementExtender.text(this.get_linkLang1(),this.lang.langApp1);
		apix.common.display.ElementExtender.text(this.get_linkLang2(),this.lang.langApp2);
		apix.common.display.ElementExtender.link(this.get_linkDoc(),this.lang.menuDocSrc);
		apix.common.display.ElementExtender.text(this.get_linkDoc(),this.lang.menuDoc);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bLang1(),"apix_label"),this.lang.langApp1);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bLang2(),"apix_label"),this.lang.langApp2);
		apix.common.display.ElementExtender.tip(this.get_bAdmin(),this.lang.menuAdminTitle);
		apix.common.display.ElementExtender.tip(this.get_bDoc(),this.lang.menuDocTitle);
		apix.common.display.ElementExtender.tip(this.get_bTip(),this.lang.menuTipTitle);
		apix.common.display.ElementExtender.tip(this.get_bQuitAdmin(),this.lang.menuQuitAdminTitle);
		apix.common.display.ElementExtender.tip(this.get_bSafeMode(),this.lang.menuSafeModeTitle);
		apix.common.display.ElementExtender.tip(this.get_bLogOff(),this.lang.menuLogOffTitle);
		apix.common.display.ElementExtender.tip(this.get_bAbout(),this.lang.menuAboutTitle);
		apix.common.display.ElementExtender.tip(apix.common.display.ElementExtender.elemByClass(this.get_bAbout(),"apix_version"),this.lang.menuVersionTitle);
		apix.common.display.ElementExtender.tip(apix.common.display.ElementExtender.elemByClass(this.get_bLogOff(),"apix_userId"),this.lang.menuUserIdTitle);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bAdmin(),"apix_label"),this.lang.menuAdmin);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bDoc(),"apix_label"),this.lang.menuDoc);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bTip(),"apix_label"),this.lang.menuTip);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bQuitAdmin(),"apix_label"),this.lang.menuQuitAdmin);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bLogOff(),"apix_label"),this.lang.menuLogOff);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bAbout(),"apix_label"),this.lang.menuAbout);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bAbout(),"apix_version"),this.model.version);
		this.setMenuSafeModeLabel();
		apix.common.display.ElementExtender.text(this.get_rowNumberLabel(),this.lang.fiRowNumberLabel);
		apix.common.display.ElementExtender.text(this.get_decimalNumberLabel(),this.lang.fiDecimalNumberLabel);
		apix.common.display.ElementExtender.text(this.get_minValueLabel(),this.lang.fiMinValueLabel);
		apix.common.display.ElementExtender.text(this.get_maxValueLabel(),this.lang.fiMaxValueLabel);
		apix.common.display.ElementExtender.text(this.get_copyEnableLabel(),this.lang.fiCopyEnableLabel);
		apix.common.display.ElementExtender.text(this.get_requiredLabel(),this.lang.fiRequiredLabel);
		apix.common.display.ElementExtender.text(this.get_isHiddenLabel(),this.lang.fiHiddenLabel);
		apix.common.display.ElementExtender.text(this.get_isSecureLabel(),this.lang.fiSecureLabel);
		apix.common.display.ElementExtender.text(this.get_isPrimaryLabel(),this.lang.fiPrimaryLabel);
		apix.common.display.ElementExtender.text(this.get_controlLabel(),this.lang.fiControlLabel);
		var arr = apix.common.util.StringExtender.all("#safeBox .apix_control option");
		var _g1 = 0;
		var _g2 = arr.length;
		while(_g1 < _g2) {
			var i = _g1++;
			apix.common.display.ElementExtender.inner(arr[i],this.lang.fiControlSelectLabel[i]);
			apix.common.display.ElementExtender.value(arr[i],this.param.fiControlSelectValue[i]);
		}
		apix.common.display.ElementExtender.text(this.get_isMultipleLabel(),this.lang.fiMultipleLabel);
		apix.common.display.ElementExtender.tip(this.get_bAddFolder(),this.lang.addFolderTitle);
		apix.common.display.ElementExtender.tip(this.get_bAddForm(),this.lang.addFormTitle);
		apix.common.display.ElementExtender.tip(this.get_bAddField(),this.lang.addFieldTitle);
		apix.common.display.ElementExtender.tip(this.get_bAddSelectLine(),this.lang.addSelectLineTitle);
		apix.common.display.ElementExtender.tip(this.get_bAddRecord(),this.lang.addRecordTitle);
		apix.common.display.ElementExtender.cssStyle(this.get_bAddFolder(),"backgroundColor",this.param.bAddFolderColor);
		apix.common.display.ElementExtender.cssStyle(this.get_bAddForm(),"backgroundColor",this.param.bAddFormColor);
		apix.common.display.ElementExtender.cssStyle(this.get_bAddField(),"backgroundColor",this.param.bAddFieldColor);
		apix.common.display.ElementExtender.cssStyle(this.get_bAddRecord(),"backgroundColor",this.param.bAddRecordColor);
		apix.common.display.ElementExtender.cssStyle(this.get_bAddSelectLine(),"backgroundColor",this.param.bAddSelectLineColor);
	}
	,setMenuSafeModeLabel: function() {
		if(this.model.get_isSafeMode()) apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bSafeMode(),"apix_label"),this.lang.menuSafeModeOff); else apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bSafeMode(),"apix_label"),this.lang.menuSafeModeOn);
	}
	,clear: function() {
		apix.common.display.ElementExtender.text(this.get_pathElem(),"");
	}
	,initAlert: function() {
		var el = apix.common.util.StringExtender.get("#safeBox #apix_alertBox");
		var txEl = apix.common.util.StringExtender.get("#safeBox #apix_alertBox .apix_content");
		var btEl = apix.common.util.StringExtender.get("#safeBox #apix_alertBox .apix_enter");
		var titleEl = apix.common.util.StringExtender.get("#safeBox #apix_alertBox .apix_label");
		return new apix.common.display.Alert(el,txEl,btEl,titleEl,"<b>" + Std.string(this.lang.alertTitle) + "</b>",this.lang.alertValidLabel);
	}
	,initConfirm: function() {
		var el = apix.common.util.StringExtender.get("#safeBox #apix_confirmBox");
		var txEl = apix.common.util.StringExtender.get("#safeBox #apix_confirmBox .apix_content");
		var btEl = apix.common.util.StringExtender.get("#safeBox #apix_confirmBox .apix_enter");
		var cbtEl = apix.common.util.StringExtender.get("#safeBox #apix_confirmBox .apix_cancel");
		var titleEl = apix.common.util.StringExtender.get("#safeBox #apix_confirmBox .apix_label");
		var titleEl1 = apix.common.util.StringExtender.get("#safeBox #apix_confirmBox .apix_label");
		return new apix.common.display.Confirm(el,txEl,btEl,cbtEl,titleEl1,"<b>" + Std.string(this.lang.confirmTitle) + "</b>",this.lang.confirmValidLabel,this.lang.confirmCancelLabel);
	}
	,resize: function() {
		var o = this.hideAbsoluteElem();
		var view = apix.common.util.StringExtender.get("#stdView");
		var w = apix.common.display.Common.get_windowWidth();
		w = Math.min(w,apix.common.display.Common.get_screenWidth());
		if(w > 800) w = 800;
		var h = apix.common.display.Common.get_windowHeight();
		h = Math.min(h,apix.common.display.Common.get_screenHeight());
		this.restoreAbsoluteElem(o);
		var bm = this.model.param.bottomMrg;
		var bam = this.model.param.bottomAddMrg;
		var ram = this.model.param.rigthAddMrg;
		if(h > bm) apix.common.display.ElementExtender.height(view,h - bm);
		var el = this.get_bAddRecord();
		apix.common.display.ElementExtender.posy(el,h - apix.common.display.ElementExtender.height(el) - bam);
		apix.common.display.ElementExtender.posx(el,apix.common.display.ElementExtender.posx(view) + w - apix.common.display.ElementExtender.width(el) - ram);
		el = this.get_bAddField();
		apix.common.display.ElementExtender.posy(el,h - apix.common.display.ElementExtender.height(el) - bam);
		apix.common.display.ElementExtender.posx(el,apix.common.display.ElementExtender.posx(view) + w - apix.common.display.ElementExtender.width(el) - ram);
		el = this.get_bAddFolder();
		apix.common.display.ElementExtender.posy(el,h - apix.common.display.ElementExtender.height(el) - bam);
		apix.common.display.ElementExtender.posx(el,apix.common.display.ElementExtender.posx(view) + w - apix.common.display.ElementExtender.width(el) * 2 - 2 * ram);
		el = this.get_bAddForm();
		apix.common.display.ElementExtender.posy(el,h - apix.common.display.ElementExtender.height(el) - bam);
		apix.common.display.ElementExtender.posx(el,apix.common.display.ElementExtender.posx(view) + w - apix.common.display.ElementExtender.width(el) - ram);
		el = apix.common.util.StringExtender.get("#safeBox .menu");
		apix.common.display.ElementExtender.posx(el,apix.common.display.ElementExtender.posx(view) + w - apix.common.display.ElementExtender.width(el));
		el = apix.common.util.StringExtender.get("#safeBox #apix_buttonCtnr");
		var viewTop = apix.common.util.StringExtender.get("#safeBox .viewTop");
		apix.common.display.ElementExtender.height(el,apix.common.display.ElementExtender.height(view) - (apix.common.display.ElementExtender.height(viewTop) + 10));
	}
	,showLoginView: function(id,pwd,mode) {
		if(mode == null) mode = "signIn";
		apix.common.display.ElementExtender.show(apix.common.util.StringExtender.get("#safeBox #loginView"));
		apix.common.display.ElementExtender.hide(apix.common.util.StringExtender.get("#safeBox #stdView"));
		apix.common.util.StringExtender.each("#safeBox .addPicto",apix.common.display.ElementExtender.hide);
		if(mode == "signIn") {
			apix.common.display.ElementExtender.hide(apix.common.util.StringExtender.get("#safeBox #confirm"));
			apix.common.display.ElementExtender.hide(apix.common.util.StringExtender.get("#safeBox .connectForm .apix_goPrevious"));
			apix.common.display.ElementExtender.show(apix.common.util.StringExtender.get("#safeBox #bGoSignUp"),"inline");
			if(id != null) apix.common.display.ElementExtender.value(apix.common.util.StringExtender.get("#idMail"),id);
			if(pwd != null) apix.common.display.ElementExtender.value(apix.common.util.StringExtender.get("#pwd"),pwd);
			apix.common.display.ElementExtender.placeHolder(apix.common.util.StringExtender.get("#safeBox #idMail"),this.lang.signInIdHolder);
			apix.common.display.ElementExtender.placeHolder(apix.common.util.StringExtender.get("#safeBox #pwd"),this.lang.signInPwdHolder);
		} else {
			apix.common.display.ElementExtender.hide(apix.common.util.StringExtender.get("#safeBox #bGoSignUp"));
			apix.common.display.ElementExtender.show(apix.common.util.StringExtender.get("#safeBox #confirm"));
			apix.common.display.ElementExtender.show(apix.common.util.StringExtender.get("#safeBox .connectForm .apix_goPrevious"),"inline-block");
			apix.common.display.ElementExtender.value(apix.common.util.StringExtender.get("#safeBox #idMail"),"");
			apix.common.display.ElementExtender.value(apix.common.util.StringExtender.get("#safeBox #pwd"),"");
			apix.common.display.ElementExtender.value(apix.common.util.StringExtender.get("#safeBox #confirm"),"");
			apix.common.display.ElementExtender.placeHolder(apix.common.util.StringExtender.get("#safeBox #idMail"),this.lang.signUpIdHolder);
			apix.common.display.ElementExtender.placeHolder(apix.common.util.StringExtender.get("#safeBox #pwd"),this.lang.signUpPwdHolder);
			apix.common.display.ElementExtender.placeHolder(apix.common.util.StringExtender.get("#safeBox #confirm"),this.lang.signUpConfirmHolder);
		}
	}
	,showStdView: function() {
		apix.common.display.ElementExtender.hide(apix.common.util.StringExtender.get("#safeBox #loginView"));
		apix.common.display.ElementExtender.show(apix.common.util.StringExtender.get("#safeBox #stdView"));
		this.resize();
	}
	,setupAdminMode: function() {
		apix.common.display.ElementExtender.hide(apix.common.util.StringExtender.get("#apix_bAdmin"));
		apix.common.display.ElementExtender.show(this.get_bAddFolder());
		apix.common.display.ElementExtender.show(this.get_bAddForm());
		this.resize();
	}
	,setupUsingMode: function() {
		apix.common.display.ElementExtender.show(apix.common.util.StringExtender.get("#safeBox #apix_bAdmin"));
		apix.common.display.ElementExtender.hide(this.get_bAddFolder());
		apix.common.display.ElementExtender.hide(this.get_bAddForm());
		apix.common.display.ElementExtender.hide(this.get_bAddField());
	}
	,showTips: function() {
		var txt = this.tipArray.pop();
		if(txt != null) {
			if(this.tipArray.length == 0) this.g.alert(txt,$bind(this,this.showTips),this.lang.menuTip,this.lang.endValidLabel); else this.g.alert(txt,$bind(this,this.showTips),this.lang.menuTip,this.lang.nextValidLabel);
		}
	}
	,showTipBox: function(str,ctnr,vx,vy,d) {
		if(d == null) d = 2;
		if(vy == null) vy = 0;
		if(vx == null) vx = 0;
		var _g = this;
		ctnr.appendChild(this.tipBoxElem);
		apix.common.display.ElementExtender.css(ctnr,"zIndex","2");
		apix.common.display.ElementExtender.posx(this.tipBoxElem,vx);
		apix.common.display.ElementExtender.posy(this.tipBoxElem,vy);
		apix.common.display.ElementExtender.inner(this.tipBoxElem,str);
		apix.common.display.ElementExtender.show(this.tipBoxElem);
		apix.common.display.ElementExtender.css(ctnr,"overflow","visible");
		new apix.common.event.timing.Delay(function() {
			apix.common.display.ElementExtender.hide(_g.tipBoxElem);
			apix.common.display.ElementExtender.css(ctnr,"overflow","hidden");
		},d);
	}
	,hideAbsoluteElem: function() {
		var o = { menu : "", addFolder : "", addForm : "", addField : ""};
		var el = apix.common.util.StringExtender.get("#safeBox .menu");
		o.menu = apix.common.util.Global.get().strVal(el.style.display,"");
		apix.common.display.ElementExtender.hide(el);
		el = this.get_bAddFolder();
		o.addFolder = apix.common.util.Global.get().strVal(el.style.display,"");
		apix.common.display.ElementExtender.hide(el);
		el = this.get_bAddForm();
		o.addForm = apix.common.util.Global.get().strVal(el.style.display,"");
		apix.common.display.ElementExtender.hide(el);
		el = this.get_bAddField();
		o.addField = apix.common.util.Global.get().strVal(el.style.display,"");
		apix.common.display.ElementExtender.hide(el);
		return o;
	}
	,restoreAbsoluteElem: function(o) {
		apix.common.display.ElementExtender.setDisplay(apix.common.util.StringExtender.get("#safeBox .menu"),o.menu);
		apix.common.display.ElementExtender.setDisplay(this.get_bAddFolder(),o.addFolder);
		apix.common.display.ElementExtender.setDisplay(this.get_bAddForm(),o.addForm);
		apix.common.display.ElementExtender.setDisplay(this.get_bAddField(),o.addField);
	}
	,__class__: mybox.View
};
mybox.boxes = {};
mybox.boxes.AbstractBox = function(m,v) {
	this.g = apix.common.util.Global.get();
	this.cb = apix.common.display.Confirm.get();
	this.model = m;
	this.view = v;
	this.lang = this.model.lang;
	this.param = this.model.param;
	this.server = this.model.server;
};
mybox.boxes.AbstractBox.__name__ = ["mybox","boxes","AbstractBox"];
mybox.boxes.AbstractBox.prototype = {
	get_path: function() {
		if(this.parent != null) return this.parent.get_path() + "/" + this.label; else return "";
	}
	,get_recordsCtnr: function() {
		return apix.common.display.ElementExtender.elemByClass(this.elem,"apix_recordsSubCtnr");
	}
	,get_bElem: function() {
		return apix.common.display.ElementExtender.elemByClass(this.elem,"apix_txtField");
	}
	,get_labelElem: function() {
		return apix.common.display.ElementExtender.elemByTag(this.get_bElem(),"input");
	}
	,get_pictoCtnr: function() {
		return apix.common.display.ElementExtender.elemByClass(this.elem,"apix_pictoCtnr");
	}
	,get_bUpdate: function() {
		return apix.common.util.StringExtender.get("#" + this.vId + " .apix_pictoCtnr .updatePicto");
	}
	,get_bRemove: function() {
		return apix.common.util.StringExtender.get("#" + this.vId + " .apix_pictoCtnr .removePicto");
	}
	,'is': function(v) {
		return this.get_what() == v;
	}
	,get_what: function() {
		return this.g.className(this);
	}
	,__class__: mybox.boxes.AbstractBox
};
mybox.boxes.AbstractFolderFormField = function(m,v) {
	mybox.boxes.AbstractBox.call(this,m,v);
	this.isClosed = true;
	this.click = new apix.common.event.EventSource();
	if(apix.common.display.Common.get_windowWidth() > 679) this.shiftVal = 15; else this.shiftVal = 5;
};
mybox.boxes.AbstractFolderFormField.__name__ = ["mybox","boxes","AbstractFolderFormField"];
mybox.boxes.AbstractFolderFormField.__super__ = mybox.boxes.AbstractBox;
mybox.boxes.AbstractFolderFormField.prototype = $extend(mybox.boxes.AbstractBox.prototype,{
	get_mode: function() {
		return this.model.mode;
	}
	,get_level: function() {
		return Math.round(this.shift / this.shiftVal);
	}
	,get_subCtnr: function() {
		if(this.get_mode() == "admin") return apix.common.display.ElementExtender.elemByClass(this.elem,"apix_subCtnr"); else return this.get_recordsCtnr();
	}
	,get_elemsCtnr: function() {
		if(this._elemsCtnr == null) this._elemsCtnr = apix.common.util.StringExtender.get("#" + this.vId + " .apix_subCtnr");
		return this._elemsCtnr;
	}
	,set_elemsCtnr: function(v) {
		this._elemsCtnr = v;
		return v;
	}
	,get_color: function() {
		return "#00000";
	}
	,get_nameHolderTxt: function() {
		return this.lang.foNameHolder;
	}
	,get_updateTitleTxt: function() {
		return this.lang.foUpdateTitle;
	}
	,get_nameTxt: function() {
		return this.lang.name;
	}
	,get_primary: function() {
		haxe.Log.trace("f::Must be override by Form !",{ fileName : "AbstractFolderFormField.hx", lineNumber : 80, className : "mybox.boxes.AbstractFolderFormField", methodName : "get_primary"});
		return null;
	}
	,open: function() {
		if(apix.common.display.ElementExtender.isEmpty(this.get_subCtnr()) && this.get_mode() == "admin") this.view.showTipBox(this.lang.alertEmptyCtnr,apix.common.display.ElementExtender.parent(this.get_bElem()),apix.common.display.ElementExtender.posx(this.get_bElem()),apix.common.display.ElementExtender.posy(this.get_bElem()),2); else {
			apix.common.display.ElementExtender.show(this.get_subCtnr());
			this.isClosed = false;
		}
	}
	,close: function() {
		apix.common.display.ElementExtender.hide(this.get_subCtnr());
		this.isClosed = true;
	}
	,select: function() {
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"opacity","1");
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"borderColor",this.param.black);
	}
	,unselect: function() {
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"opacity",".7");
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"borderColor",this.get_color());
	}
	,setStateOfAddButtons: function(opacFd,opacFo,opacFi) {
		if(opacFi == null) opacFi = "1";
		if(opacFo == null) opacFo = "0";
		if(opacFd == null) opacFd = "0";
		apix.common.display.ElementExtender.show(this.view.get_bAddFolder());
		apix.common.display.ElementExtender.show(this.view.get_bAddForm());
		apix.common.display.ElementExtender.show(this.view.get_bAddField());
		if(opacFd == "0") apix.common.display.ElementExtender.hide(this.view.get_bAddFolder()); else apix.common.display.ElementExtender.cssStyle(this.view.get_bAddFolder(),"opacity",opacFd);
		if(opacFo == "0") apix.common.display.ElementExtender.hide(this.view.get_bAddForm()); else apix.common.display.ElementExtender.cssStyle(this.view.get_bAddForm(),"opacity",opacFo);
		if(opacFi == "0") apix.common.display.ElementExtender.hide(this.view.get_bAddField()); else apix.common.display.ElementExtender.cssStyle(this.view.get_bAddField(),"opacity",opacFi);
		this.view.resize();
	}
	,selectAndDispatch: function() {
		var ev = new apix.common.event.StandardEvent(this);
		ev.path = this.get_path();
		this.click.dispatch(ev);
	}
	,getParent: function() {
		haxe.Log.trace("f::is override by FormFolderAbstract, Folder, Form and Field !",{ fileName : "AbstractFolderFormField.hx", lineNumber : 143, className : "mybox.boxes.AbstractFolderFormField", methodName : "getParent"});
		return null;
	}
	,init: function(ri,l) {
		this.recId = ri;
		this.label = l;
	}
	,setup: function() {
		this.setupView();
		this.setupEvent();
	}
	,setupEvent: function() {
		if(!apix.common.display.ElementExtender.hasLst(this.get_bElem(),"click")) {
			apix.common.display.ElementExtender.on(this.get_bElem(),"click",$bind(this,this.onButtonClick));
			apix.common.display.ElementExtender.handCursor(this.get_labelElem(),true);
		}
		if(!apix.common.display.ElementExtender.hasLst(this.get_bUpdate(),"click")) apix.common.display.ElementExtender.on(this.get_bUpdate(),"click",$bind(this,this.onUpdateClick));
		if(!apix.common.display.ElementExtender.hasLst(this.get_bRemove(),"click")) apix.common.display.ElementExtender.on(this.get_bRemove(),"click",$bind(this,this.onRemoveClick));
	}
	,removeEvent: function() {
		if(apix.common.display.ElementExtender.hasLst(this.get_bElem(),"click")) {
			apix.common.display.ElementExtender.off(this.get_bElem(),"click",$bind(this,this.onButtonClick));
			apix.common.display.ElementExtender.handCursor(this.get_labelElem(),false);
		}
		if(apix.common.display.ElementExtender.hasLst(this.get_bUpdate(),"click")) apix.common.display.ElementExtender.off(this.get_bUpdate(),"click",$bind(this,this.onUpdateClick));
		if(apix.common.display.ElementExtender.hasLst(this.get_bRemove(),"click")) apix.common.display.ElementExtender.off(this.get_bRemove(),"click",$bind(this,this.onRemoveClick));
	}
	,removeFromList: function(c) {
		haxe.Log.trace("f::Must be override by Folder and Form ",{ fileName : "AbstractFolderFormField.hx", lineNumber : 171, className : "mybox.boxes.AbstractFolderFormField", methodName : "removeFromList"});
	}
	,onElemClick: function(ev) {
		this.click.dispatch(ev);
	}
	,setupView: function() {
		apix.common.display.ElementExtender.value(this.get_labelElem(),this.label);
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"backgroundColor",this.get_color());
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"opacity",".7");
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"borderColor",this.get_color());
		apix.common.display.ElementExtender.hide(this.get_pictoCtnr());
	}
	,showNameFrame: function(tl,n,hld,type) {
		if(hld == null) hld = "$holder";
		if(n == null) n = "$name";
		if(tl == null) tl = "$Title";
		apix.common.display.ElementExtender.text(this.view.get_nameFrameTitle(),tl);
		apix.common.display.ElementExtender.text(this.view.get_nameFrameName(),n);
		apix.common.display.ElementExtender.text(this.view.get_nameFramePath(),this.get_path());
		apix.common.display.ElementExtender.placeHolder(this.view.get_foName(),hld);
		if(type == "field") apix.common.display.ElementExtender.show(this.view.get_nameFramefieldsCtnr()); else apix.common.display.ElementExtender.hide(this.view.get_nameFramefieldsCtnr());
		apix.common.display.ElementExtender.show(this.view.get_nameFrame());
		apix.common.display.ElementExtender.joinEnterKeyToClick(this.view.get_bNameFrameValid(),null,this.view.get_foName());
	}
	,insertNewElement: function(type) {
		var tl;
		var hd;
		var na = this.lang.name;
		if(type == "folder") {
			tl = this.lang.fdCreateTitle;
			hd = this.lang.fdNameHolder;
		} else if(type == "form") {
			tl = this.lang.foCreateTitle;
			hd = this.lang.foNameHolder;
		} else if(type == "field") {
			tl = this.lang.fiCreateTitle;
			hd = this.lang.fiNameHolder;
			na = this.lang.fiName;
		} else {
			tl = null;
			hd = null;
			haxe.Log.trace("f:: Form. insertNewElement() type error",{ fileName : "AbstractFolderFormField.hx", lineNumber : 208, className : "mybox.boxes.AbstractFolderFormField", methodName : "insertNewElement"});
		}
		this.showNameFrame(tl,na,hd,type);
		apix.common.display.ElementExtender.off(this.view.get_bNameFrameCancel());
		apix.common.display.ElementExtender.on(this.view.get_bNameFrameCancel(),"click",$bind(this,this.onFrameCancel));
		apix.common.display.ElementExtender.off(this.view.get_bNameFrameValid());
		apix.common.display.ElementExtender.on(this.view.get_bNameFrameValid(),"click",$bind(this,this.onInsertElementValid),false,{ type : type});
		apix.common.display.ElementExtender.value(this.view.get_foName(),"");
	}
	,onFrameCancel: function(e) {
		this.closeNameFrame();
	}
	,onInsertElementValid: function(e,d) {
		var o = null;
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerInsertElement),{ type : d.type});
		o = { req : "insert" + this.insertSrvTxtMsg, data : JSON.stringify({ id : this.model.get_currUserId(), label : apix.common.display.ElementExtender.value(this.view.get_foName()), parentRecId : this.recId, type : d.type})};
		this.server.ask(o);
	}
	,onAnswerInsertElement: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else if(e.result.msg == "parentFormDoesntExist") this.g.alert(this.lang.parentFormDoesntExist); else this.g.alert(this.lang.serverReadError + e.result.msg);
		} else if(answ != "insert" + this.insertSrvTxtMsg + "Ok") this.g.alert(this.lang.serverFatalError); else {
			var el;
			if(this == this.model.root) el = this.get_elemsCtnr(); else el = this.get_bElem();
			this.view.showTipBox(this.lang.createOk,apix.common.display.ElementExtender.parent(el),apix.common.display.ElementExtender.posx(el),apix.common.display.ElementExtender.posy(el),1);
			this.closeNameFrame();
			if(e.result.msg != null) haxe.Log.trace(e.result.msg,{ fileName : "AbstractFolderFormField.hx", lineNumber : 239, className : "mybox.boxes.AbstractFolderFormField", methodName : "onAnswerInsertElement"});
		}
		return answ;
	}
	,insertElementInit: function(ff,rci) {
		ff.init(rci,apix.common.display.ElementExtender.value(this.view.get_foName()));
		ff.parent = this;
	}
	,onUpdateClick: function(e) {
		this.showNameFrame(this.get_updateTitleTxt(),this.get_nameTxt(),this.get_nameHolderTxt());
		apix.common.display.ElementExtender.off(this.view.get_bNameFrameCancel());
		apix.common.display.ElementExtender.on(this.view.get_bNameFrameCancel(),"click",$bind(this,this.onFrameCancel));
		apix.common.display.ElementExtender.off(this.view.get_bNameFrameValid());
		apix.common.display.ElementExtender.on(this.view.get_bNameFrameValid(),"click",$bind(this,this.onUpdateFrameValid));
		apix.common.display.ElementExtender.value(this.view.get_foName(),this.label);
		this.selectAndDispatch();
	}
	,onRemoveClick: function(e) {
		this.selectAndDispatch();
		this.cb.show(Std.string(this.lang.deleteConfirm) + " " + this.get_path() + " ?",$bind(this,this.askDelete));
	}
	,onUpdateFrameValid: function(e) {
		this.label = apix.common.display.ElementExtender.value(this.view.get_foName());
		apix.common.display.ElementExtender.value(this.get_labelElem(),this.label);
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerUpdate));
		this.server.ask({ req : "updateFormFolder", data : JSON.stringify({ id : this.model.get_currUserId(), recId : this.recId, label : this.label})});
	}
	,onAnswerUpdate: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else this.g.alert(this.lang.serverReadError + e.result.msg);
		} else if(answ == "update" + this.srvTxtMsg + "Ok") {
			this.closeNameFrame();
			this.view.showTipBox(this.lang.updateOk,apix.common.display.ElementExtender.parent(this.get_bElem()),apix.common.display.ElementExtender.posx(this.get_bElem()),apix.common.display.ElementExtender.posy(this.get_bElem()),2);
		} else this.g.alert(this.lang.serverFatalError);
	}
	,closeNameFrame: function() {
		apix.common.display.ElementExtender.off(this.view.get_bNameFrameCancel());
		apix.common.display.ElementExtender.off(this.view.get_bNameFrameValid());
		apix.common.display.ElementExtender.hide(this.view.get_nameFrame());
	}
	,askDelete: function(b,f) {
		if(b) {
			this.server.serverEvent.off();
			this.server.serverEvent.on($bind(this,this.onAnswerDelete));
			this.server.ask({ req : "delete" + this.srvTxtMsg, data : JSON.stringify({ id : this.model.get_currUserId(), formRecId : this.getParent().recId, recId : this.recId})});
		}
	}
	,onAnswerDelete: function(e) {
		this.cb.hide();
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else if(e.result.msg == "elemDoesntExist") this.g.alert(this.lang.elemDoesntExist); else if(e.result.msg == "invalidFormOwner") this.g.alert(this.lang.invalidFormOwner); else this.g.alert(this.lang.serverReadError + e.result.msg);
		} else if(answ == "delete" + this.srvTxtMsg + "Ok") {
			if(this.getParent() != this.model.root) this.view.showTipBox(this.lang.deleteOk,apix.common.display.ElementExtender.parent(this.getParent().get_bElem()),apix.common.display.ElementExtender.posx(this.get_bElem()),apix.common.display.ElementExtender.posy(this.get_bElem()),1);
			this.remove();
		} else this.g.alert(this.lang.serverFatalError);
	}
	,remove: function() {
		haxe.Log.trace("f::Must be override by Folder, Form and Field !",{ fileName : "AbstractFolderFormField.hx", lineNumber : 312, className : "mybox.boxes.AbstractFolderFormField", methodName : "remove"});
	}
	,createFieldAfterInsert: function(rci,shift) {
		if(shift == null) shift = 0;
		haxe.Log.trace("f::Must be override by Form !",{ fileName : "AbstractFolderFormField.hx", lineNumber : 315, className : "mybox.boxes.AbstractFolderFormField", methodName : "createFieldAfterInsert"});
	}
	,onButtonClick: function(e) {
		haxe.Log.trace("f::Must be override by Form and Folder !",{ fileName : "AbstractFolderFormField.hx", lineNumber : 316, className : "mybox.boxes.AbstractFolderFormField", methodName : "onButtonClick"});
	}
	,__class__: mybox.boxes.AbstractFolderFormField
});
mybox.boxes.AbstractFormField = function(m,v) {
	mybox.boxes.AbstractFolderFormField.call(this,m,v);
};
mybox.boxes.AbstractFormField.__name__ = ["mybox","boxes","AbstractFormField"];
mybox.boxes.AbstractFormField.__super__ = mybox.boxes.AbstractFolderFormField;
mybox.boxes.AbstractFormField.prototype = $extend(mybox.boxes.AbstractFolderFormField.prototype,{
	showSecureFrame: function(tl,cmt,sc) {
		if(sc == null) sc = "";
		if(cmt == null) cmt = "";
		if(tl == null) tl = "";
		apix.common.display.ElementExtender.text(this.view.get_secureFrameTitle(),tl);
		apix.common.display.ElementExtender.text(this.view.get_secureFrameCmt(),cmt);
		apix.common.display.ElementExtender.text(this.view.get_secureFrameCode(),sc);
		apix.common.display.ElementExtender.show(this.view.get_secureFrame());
		apix.common.display.ElementExtender.css(this.view.get_secureFrame(),"height","" + apix.common.display.Common.get_body().scrollHeight * 2 + "px");
		apix.common.display.ElementExtender.posx(this.view.get_secureFrameInner(),(apix.common.display.ElementExtender.width(apix.common.display.ElementExtender.parent(this.view.get_secureFrameInner())) - apix.common.display.ElementExtender.width(this.view.get_secureFrameInner())) / 2);
	}
	,hideSecureFrame: function() {
		apix.common.display.ElementExtender.css(this.view.get_secureFrame(),"height","100%");
		apix.common.display.ElementExtender.hide(this.view.get_secureFrame());
	}
	,pushSecureCode: function(el,forWhat) {
		if(forWhat == null) forWhat = "";
		apix.common.display.ElementExtender.visible(this.view.get_bRubSecureFrame(),true);
		if(this.currSecureCode.length < this.param.secureCodeLen) {
			this.currSecureCode += apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(el,"apix_num"));
			apix.common.display.ElementExtender.cssStyle(el,"backgroundColor",this.param.secureCodeClickBgColor);
			apix.common.display.ElementExtender.cssStyle(apix.common.display.ElementExtender.elemByClass(el,"apix_num"),"color",this.param.secureCodeClickColor);
			apix.common.display.ElementExtender.visible(this.view.get_bValidSecureFrame(),false);
		}
		if(this.currSecureCode.length == this.param.secureCodeLen) {
			if(forWhat != "forEnter") apix.common.display.ElementExtender.text(this.view.get_secureFrameCode(),this.lang.secureCode);
			apix.common.display.ElementExtender.visible(this.view.get_bValidSecureFrame(),true);
		}
	}
	,assignSecureCode: function(el) {
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(el,"apix_num"),"" + this.secureCodes.pop());
	}
	,clearSecureCode: function() {
		var _g = this;
		this.currSecureCode = "";
		apix.common.display.ElementExtender.text(this.view.get_secureFrameCode(),"");
		apix.common.display.ElementExtender.visible(this.view.get_bRubSecureFrame(),false);
		apix.common.display.ElementExtender.visible(this.view.get_bValidSecureFrame(),true);
		apix.common.util.StringExtender.each(this.view.get_secureFrameCodePictoString(),function(el) {
			apix.common.display.ElementExtender.cssStyle(el,"backgroundColor",_g.param.secureCodeBgColor);
			apix.common.display.ElementExtender.cssStyle(apix.common.display.ElementExtender.elemByClass(el,"apix_num"),"color",_g.param.secureCodeColor);
		});
	}
	,remove: function() {
		this.getParent().selectAndDispatch();
		this.clear();
		if(this.elem == null) haxe.Log.trace("Erreur in Form.remove(). Instance : " + this.g.className(this) + " label=" + this.label + " recId=" + this.recId,{ fileName : "AbstractFormField.hx", lineNumber : 79, className : "mybox.boxes.AbstractFormField", methodName : "remove"}); else apix.common.display.ElementExtender["delete"](this.elem);
		this.getParent().removeFromList(this);
	}
	,closeNameFrame: function() {
		apix.common.display.ElementExtender.off(this.view.get_isSecureInput());
		apix.common.display.ElementExtender.off(this.view.get_isPrimaryInput());
		apix.common.display.ElementExtender.off(this.view.get_controlInput());
		apix.common.display.ElementExtender.off(this.view.get_bRubSecureFrame());
		apix.common.display.ElementExtender.off(this.view.get_bValidSecureFrame());
		apix.common.util.StringExtender.off(this.view.get_secureFrameCodePictoString());
		apix.common.display.ElementExtender.off(this.view.get_bAddSelectLine());
		mybox.boxes.AbstractFolderFormField.prototype.closeNameFrame.call(this);
	}
	,clear: function() {
		haxe.Log.trace("f::Must be override by Folder, Form and Field !",{ fileName : "AbstractFormField.hx", lineNumber : 97, className : "mybox.boxes.AbstractFormField", methodName : "clear"});
	}
	,insertNewElement: function(type) {
		mybox.boxes.AbstractFolderFormField.prototype.insertNewElement.call(this,type);
		apix.common.display.ElementExtender.show(this.view.get_nameFramefieldsCtnr());
		this.showAdminFields();
		this.enableAdminFields();
		apix.common.display.ElementExtender.enable(this.view.get_isPrimaryInput(),true,true);
		apix.common.display.ElementExtender.value(this.view.get_rowNumberInput(),"1");
		apix.common.display.ElementExtender.selected(this.view.get_isMultipleInput(),false);
		apix.common.display.ElementExtender.hide(this.view.get_controlDetailCtnr());
		apix.common.display.ElementExtender.selected(apix.common.display.ElementExtender.getOption(this.view.get_controlInput(),0),true);
		apix.common.display.ElementExtender.removeChildren(this.view.get_selectListCtnr());
		apix.common.display.ElementExtender.hide(this.view.get_selectListCtnr());
		apix.common.display.ElementExtender.selected(this.view.get_copyEnableInput(),true);
		apix.common.display.ElementExtender.selected(this.view.get_requiredInput(),false);
		apix.common.display.ElementExtender.selected(this.view.get_isHiddenInput(),false);
		apix.common.display.ElementExtender.selected(this.view.get_isSecureInput(),false);
		apix.common.display.ElementExtender.off(this.view.get_isPrimaryInput());
		this.setupAdminFieldsEvent();
		this.setupAdminFieldsInput();
		this.model.isFieldCreation = true;
	}
	,setupAdminFieldsEvent: function() {
		apix.common.display.ElementExtender.off(this.view.get_isSecureInput());
		apix.common.display.ElementExtender.on(this.view.get_isSecureInput(),"change",$bind(this,this.onSecureChange));
		apix.common.display.ElementExtender.off(this.view.get_controlInput());
		apix.common.display.ElementExtender.on(this.view.get_controlInput(),"change",$bind(this,this.onControlChange));
	}
	,setupAdminFieldsInput: function() {
		if(this.get_primary() != null) {
			this.hideIsPrimaryInput();
			this.enableAdminFields();
			apix.common.display.ElementExtender.value(this.view.get_foName(),"");
		} else {
			this.showIsPrimaryInput();
			this.disableAdminFields();
			apix.common.display.ElementExtender.inner(this.view.get_nameFrameTitle(),this.lang.fiPrimCreateTitle);
			apix.common.display.ElementExtender.value(this.view.get_foName(),this.lang.fiPrimDefaultLabel);
		}
	}
	,showIsPrimaryInput: function() {
		apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_isPrimaryInput()),"inline");
		apix.common.display.ElementExtender.selected(this.view.get_isPrimaryInput(),true);
		apix.common.display.ElementExtender.enable(this.view.get_isPrimaryInput(),false,true);
		this.hideAdminFields();
		this.view.showTipBox(this.lang.primaryMustBeCreated,apix.common.display.ElementExtender.parent(this.view.get_isPrimaryInput()),0,0,3);
	}
	,hideIsPrimaryInput: function() {
		apix.common.display.ElementExtender.selected(this.view.get_isPrimaryInput(),false);
		apix.common.display.ElementExtender.enable(this.view.get_isPrimaryInput(),false,true);
		apix.common.display.ElementExtender.off(this.view.get_isPrimaryInput());
		apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isPrimaryInput()));
	}
	,showAdminFields: function() {
		apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_controlInput()));
		apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_rowNumberInput()));
		apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_isHiddenInput()));
		apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_requiredInput()));
		apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_copyEnableInput()));
		apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_isSecureInput()));
	}
	,hideAdminFields: function() {
		apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_controlInput()));
		apix.common.display.ElementExtender.hide(this.view.get_controlDetailCtnr());
		apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_rowNumberInput()));
		apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isHiddenInput()));
		apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_copyEnableInput()));
		apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isSecureInput()));
	}
	,enableAdminFields: function() {
		apix.common.display.ElementExtender.enable(this.view.get_controlInput(),true,true);
		apix.common.display.ElementExtender.enable(this.view.get_isHiddenInput(),true,true);
		apix.common.display.ElementExtender.enable(this.view.get_requiredInput(),true,true);
		apix.common.display.ElementExtender.enable(this.view.get_copyEnableInput(),true,true);
		apix.common.display.ElementExtender.enable(this.view.get_isSecureInput(),true,true);
	}
	,disableAdminFields: function() {
		apix.common.display.ElementExtender.enable(this.view.get_controlInput(),false,true);
		apix.common.display.ElementExtender.selected(apix.common.display.ElementExtender.getOption(this.view.get_controlInput(),0),true);
		apix.common.display.ElementExtender.selected(this.view.get_isHiddenInput(),false);
		apix.common.display.ElementExtender.enable(this.view.get_isHiddenInput(),false,true);
		apix.common.display.ElementExtender.selected(this.view.get_copyEnableInput(),false);
		apix.common.display.ElementExtender.enable(this.view.get_copyEnableInput(),false,true);
		apix.common.display.ElementExtender.selected(this.view.get_isSecureInput(),false);
		apix.common.display.ElementExtender.enable(this.view.get_isSecureInput(),false,true);
		this.currSecureCode = "";
	}
	,onPrimaryChange: function(e) {
		if(apix.common.display.ElementExtender.selected(this.view.get_isPrimaryInput())) this.disableAdminFields(); else this.enableAdminFields();
	}
	,onSecureChange: function(e) {
		if(apix.common.display.ElementExtender.selected(this.view.get_isSecureInput())) this.createSecureCode(); else this.doSecureChange();
	}
	,doSecureChange: function() {
		if(apix.common.display.ElementExtender.selected(this.view.get_isSecureInput())) {
			apix.common.display.ElementExtender.selected(this.view.get_isHiddenInput(),true);
			apix.common.display.ElementExtender.enable(this.view.get_isHiddenInput(),false,true);
		} else apix.common.display.ElementExtender.enable(this.view.get_isHiddenInput(),true,true);
	}
	,createSecureCode: function(forWhat) {
		if(forWhat == null) forWhat = "";
		var _g = this;
		this.showSecureFrame(this.lang.secureCreateTitle,this.lang.secureCreateComment,"");
		apix.common.display.ElementExtender.off(this.view.get_bRubSecureFrame());
		apix.common.display.ElementExtender.on(this.view.get_bRubSecureFrame(),"click",function(e) {
			_g.clearSecureCode();
		});
		apix.common.display.ElementExtender.off(this.view.get_bValidSecureFrame());
		apix.common.display.ElementExtender.on(this.view.get_bValidSecureFrame(),"click",$bind(this,this.onValidSecureCreate));
		this.clearSecureCode();
		this.secureCodes = apix.common.tools.math.MathX.randomExclusiveList(9);
		apix.common.util.StringExtender.each(this.view.get_secureFrameCodePictoString(),$bind(this,this.assignSecureCode));
		apix.common.util.StringExtender.off(this.view.get_secureFrameCodePictoString());
		apix.common.util.StringExtender.on(this.view.get_secureFrameCodePictoString(),"click",$bind(this,this.onClickSecureCode),null,{ forWhat : forWhat});
	}
	,onClickSecureCode: function(e,d) {
		var el;
		el = js.Boot.__cast(e.currentTarget , Element);
		this.pushSecureCode(el,d.forWhat);
	}
	,onValidSecureCreate: function(e) {
		if(this.currSecureCode == "") {
			apix.common.display.ElementExtender.value(this.view.get_isSecureInput(),"false");
			apix.common.display.ElementExtender.selected(this.view.get_isSecureInput(),false);
		} else {
			apix.common.display.ElementExtender.selected(this.view.get_isSecureInput(),true);
			this.doSecureChange();
		}
		this.hideSecureFrame();
	}
	,onControlChange: function(e) {
		var v = apix.common.display.ElementExtender.getSelectedOption(this.view.get_controlInput()).value;
		this.setupFromControl(v);
		if(this.model.isFieldCreation) this.initFieldValue(v);
		if(v == "SelectField") this.pushLineInSelectList(); else if(v == "CheckField") this.pushLineInSelectList(); else if(v == "RadioField") this.pushLineInSelectList(); else this.popLineInSelectList();
	}
	,setupFromControl: function(v) {
		if(this.g.strVal(apix.common.display.ElementExtender.value(this.view.get_foName()),"") == this.lang.fiGeoDefaultLabel) apix.common.display.ElementExtender.value(this.view.get_foName(),"");
		if(this.g.strVal(apix.common.display.ElementExtender.value(this.view.get_foName()),"") == this.lang.fiSignDefaultLabel) apix.common.display.ElementExtender.value(this.view.get_foName(),"");
		if(this.g.strVal(apix.common.display.ElementExtender.value(this.view.get_foName()),"") == this.lang.fiPhotoDefaultLabel) apix.common.display.ElementExtender.value(this.view.get_foName(),"");
		apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_rowNumberInput()));
		apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isMultipleInput()));
		apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_decimalNumberInput()));
		apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_minValueInput()));
		apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_maxValueInput()));
		apix.common.display.ElementExtender.hide(this.view.get_selectListCtnr());
		apix.common.display.ElementExtender.off(this.view.get_bAddSelectLine());
		apix.common.display.ElementExtender.hide(this.view.get_bAddSelectLine());
		apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_isSecureInput()));
		apix.common.display.ElementExtender.selected(this.view.get_copyEnableInput(),true);
		apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_copyEnableInput()));
		apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_requiredInput()));
		apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_isHiddenInput()));
		apix.common.display.ElementExtender.hide(this.view.get_controlDetailCtnr());
		if(v == "AreaField") {
			apix.common.display.ElementExtender.show(this.view.get_controlDetailCtnr());
			apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_rowNumberInput()));
		} else if(v == "NumberField") {
			apix.common.display.ElementExtender.show(this.view.get_controlDetailCtnr());
			apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_decimalNumberInput()));
		} else if(v == "SelectField") {
			apix.common.display.ElementExtender.show(this.view.get_controlDetailCtnr());
			apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_isMultipleInput()));
			apix.common.display.ElementExtender.show(this.view.get_selectListCtnr());
			apix.common.display.ElementExtender.show(this.view.get_bAddSelectLine());
			apix.common.display.ElementExtender.on(this.view.get_bAddSelectLine(),"click",$bind(this,this.onAddSelectLine));
			apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isSecureInput()));
		} else if(v == "CheckField" || v == "RadioField") {
			apix.common.display.ElementExtender.show(this.view.get_controlDetailCtnr());
			apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isMultipleInput()));
			apix.common.display.ElementExtender.show(this.view.get_selectListCtnr());
			apix.common.display.ElementExtender.show(this.view.get_bAddSelectLine());
			apix.common.display.ElementExtender.on(this.view.get_bAddSelectLine(),"click",$bind(this,this.onAddSelectLine));
			apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isSecureInput()));
		} else if(v == "GeoField") {
			if(this.g.strVal(apix.common.display.ElementExtender.value(this.view.get_foName()),"") == "") apix.common.display.ElementExtender.value(this.view.get_foName(),this.lang.fiGeoDefaultLabel);
		} else if(v == "SignField") {
			apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isSecureInput()));
			apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isHiddenInput()));
			apix.common.display.ElementExtender.selected(this.view.get_copyEnableInput(),false);
			apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_copyEnableInput()));
			if(this.g.strVal(apix.common.display.ElementExtender.value(this.view.get_foName()),"") == "") apix.common.display.ElementExtender.value(this.view.get_foName(),this.lang.fiSignDefaultLabel);
		} else if(v == "PhotoField") {
			apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isSecureInput()));
			apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isHiddenInput()));
			apix.common.display.ElementExtender.selected(this.view.get_copyEnableInput(),false);
			apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_copyEnableInput()));
			if(this.g.strVal(apix.common.display.ElementExtender.value(this.view.get_foName()),"") == "") apix.common.display.ElementExtender.value(this.view.get_foName(),this.lang.fiPhotoDefaultLabel);
		} else if(v == "Slider") {
			apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isSecureInput()));
			apix.common.display.ElementExtender.show(this.view.get_controlDetailCtnr());
			apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_minValueInput()));
			apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_maxValueInput()));
			apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_decimalNumberInput()));
		} else if(v == "ColorField") {
			apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isSecureInput()));
			apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isHiddenInput()));
		} else if(v == "DateField") apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isSecureInput())); else if(v == "LinkField") apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.parent(this.view.get_isSecureInput()));
	}
	,initFieldValue: function(v) {
		if(v == "AreaField") apix.common.display.ElementExtender.value(this.view.get_rowNumberInput(),"1");
		if(v == "SelectField") apix.common.display.ElementExtender.selected(this.view.get_isMultipleInput(),false);
		if(v == "SelectField" || v == "CheckField" || v == "RadioField") apix.common.display.ElementExtender.removeChildren(this.view.get_selectListCtnr());
		if(v == "NumberField" || v == "Slider") apix.common.display.ElementExtender.value(this.view.get_decimalNumberInput(),"0");
		if(v == "Slider") {
			apix.common.display.ElementExtender.value(this.view.get_minValueInput(),"1");
			apix.common.display.ElementExtender.value(this.view.get_maxValueInput(),"999");
		}
	}
	,pushLineInSelectList: function() {
		this.popLineInSelectList();
		var proto = this.view.get_selectLineProto();
		var el = apix.common.display.ElementExtender.clone(proto);
		apix.common.display.ElementExtender.addChild(this.view.get_selectListCtnr(),el);
		apix.common.display.ElementExtender.show(el);
		el = apix.common.display.ElementExtender.elemByClass(el,"apix_selectText");
		apix.common.display.ElementExtender.placeHolder(el,this.lang.fiSelectTextHolder);
		this.renumLineInSelectList();
		apix.common.display.ElementExtender.setFocus(el);
		return el;
	}
	,popLineInSelectList: function() {
		apix.common.display.ElementExtender.forEachChildren(this.view.get_selectListCtnr(),function(c) {
			if(apix.common.display.ElementExtender.value(apix.common.display.ElementExtender.elemByClass(c,"apix_selectText")) == "") {
				var b = apix.common.display.ElementExtender["delete"](c);
			}
		});
		this.renumLineInSelectList();
	}
	,renumLineInSelectList: function() {
		var i = 0;
		apix.common.display.ElementExtender.forEachChildren(this.view.get_selectListCtnr(),function(c) {
			i++;
			apix.common.display.ElementExtender.setId(c,"selLine_" + i);
			apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(c,"apix_label"),"" + i + ": ");
		});
	}
	,onAddSelectLine: function(e) {
		this.pushLineInSelectList();
	}
	,makeFieldsEntryCoherent: function() {
		var v = apix.common.display.ElementExtender.getSelectedOption(this.view.get_controlInput()).value;
		if(v != "AreaField") apix.common.display.ElementExtender.value(this.view.get_rowNumberInput(),"1");
		if(v != "SelectField") apix.common.display.ElementExtender.selected(this.view.get_isMultipleInput(),false);
		if(v != "SelectField" && v != "CheckField" && v != "RadioField") apix.common.display.ElementExtender.removeChildren(this.view.get_selectListCtnr());
		if(v != "NumberField" && v != "Slider") apix.common.display.ElementExtender.value(this.view.get_decimalNumberInput(),"");
		if(v != "Slider") {
			apix.common.display.ElementExtender.value(this.view.get_minValueInput(),"1");
			apix.common.display.ElementExtender.value(this.view.get_maxValueInput(),"999");
		}
		return v;
	}
	,selectedControl: function() {
		return apix.common.display.ElementExtender.getSelectedOption(this.view.get_controlInput()).value;
	}
	,selectListEntry: function() {
		var arr = [];
		apix.common.display.ElementExtender.forEachChildren(this.view.get_selectListCtnr(),function(c) {
			var el = apix.common.display.ElementExtender.elemByClass(c,"apix_selectText");
			if(apix.common.display.ElementExtender.value(el) != "") arr.push(apix.common.display.ElementExtender.value(el));
		});
		return JSON.stringify(arr);
	}
	,onInsertElementValid: function(e,d) {
		var o = null;
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerInsertElement),{ type : d.type});
		o = { req : "insert" + this.insertSrvTxtMsg, data : JSON.stringify({ id : this.model.get_currUserId(), formRecId : this.recId, label : apix.common.display.ElementExtender.value(this.view.get_foName()), rowNumber : apix.common.display.ElementExtender.value(this.view.get_rowNumberInput()), required : apix.common.display.ElementExtender.selected(this.view.get_requiredInput()), copyEnable : apix.common.display.ElementExtender.selected(this.view.get_copyEnableInput()), isHidden : apix.common.display.ElementExtender.selected(this.view.get_isHiddenInput()), isSecure : apix.common.display.ElementExtender.selected(this.view.get_isSecureInput()), secureCode : this.currSecureCode, isPrimary : apix.common.display.ElementExtender.selected(this.view.get_isPrimaryInput()), control : this.makeFieldsEntryCoherent()})};
		this.server.ask(o);
	}
	,onAnswerInsertElement: function(e) {
		var answ = mybox.boxes.AbstractFolderFormField.prototype.onAnswerInsertElement.call(this,e);
		if(answ == "insert" + this.insertSrvTxtMsg + "Ok") this.createFieldAfterInsert(e.result.recId,this.shift);
		return answ;
	}
	,__class__: mybox.boxes.AbstractFormField
});
mybox.boxes.Field = function(m,v) {
	mybox.boxes.AbstractFormField.call(this,m,v);
	this.srvTxtMsg = "Field";
};
mybox.boxes.Field.__name__ = ["mybox","boxes","Field"];
mybox.boxes.Field.__super__ = mybox.boxes.AbstractFormField;
mybox.boxes.Field.prototype = $extend(mybox.boxes.AbstractFormField.prototype,{
	getParent: function() {
		return js.Boot.__cast(this.parent , mybox.boxes.Form);
	}
	,get_dbColName: function() {
		return "fd_" + this.recId;
	}
	,get_nameTxt: function() {
		return this.lang.fiName;
	}
	,get_color: function() {
		return this.param.fieldColor;
	}
	,get_nameHolderTxt: function() {
		return this.lang.fiNameHolder;
	}
	,get_updateTitleTxt: function() {
		return this.lang.fiUpdateTitle;
	}
	,get_primary: function() {
		var flds = this.getParent().fields;
		var len = flds.length;
		var v = null;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(flds[i].isPrimary) {
				v = flds[i];
				break;
			}
		}
		return v;
	}
	,get_inputFieldString: function() {
		if(this.rowNumber > 1) return "apix_textArea"; else return "apix_textInput";
	}
	,get_isMultiLines: function() {
		return this.rowNumber > 1;
	}
	,get_inputFieldToHideString: function() {
		if(this.rowNumber > 1) return "apix_textInput"; else return "apix_textArea";
	}
	,get_inputFieldHeight: function() {
		if(this.rowNumber > 1) return this.rowNumber * 22; else return -1;
	}
	,getDisplayValue: function(v) {
		return v;
	}
	,getValueToSave: function(e) {
		return apix.common.display.ElementExtender.value(e);
	}
	,checkAndRepare: function(v) {
		return v;
	}
	,initField: function(ri,l,rn,re,ce,ih,$is,ip,ct,im,sl) {
		this.recId = ri;
		this.label = l;
		this.rowNumber = rn;
		this.required = re;
		this.copyEnable = ce;
		this.isHidden = ih;
		this.isSecure = $is;
		this.isPrimary = ip;
		this.control = ct;
	}
	,clear: function() {
		this.removeEvent();
	}
	,setupEvent: function() {
		mybox.boxes.AbstractFormField.prototype.setupEvent.call(this);
		apix.common.display.ElementExtender.off(this.get_bElem(),"click",$bind(this,this.onButtonClick));
		apix.common.display.ElementExtender.on(this.get_bElem(),"click",$bind(this,this.onUpdateClick));
	}
	,removeEvent: function() {
		if(apix.common.display.ElementExtender.hasLst(this.get_bElem(),"click")) apix.common.display.ElementExtender.off(this.get_bElem(),"click",$bind(this,this.onUpdateClick));
		mybox.boxes.AbstractFormField.prototype.removeEvent.call(this);
	}
	,setupAdminMode: function() {
		apix.common.display.ElementExtender.show(this.get_pictoCtnr(),"inline-block");
	}
	,setupUsingMode: function() {
		apix.common.display.ElementExtender.hide(this.get_pictoCtnr());
	}
	,displayInRecordFrame: function(elemsCtnr,placeHolder,valInit) {
		if(valInit == null) valInit = "";
		var el = apix.common.display.ElementExtender.clone(this.view.get_frameFieldDataProto(),true);
		elemsCtnr.appendChild(el);
		apix.common.display.ElementExtender.show(el);
		apix.common.display.ElementExtender.setId(el,"recFrameField_" + this.index);
		var labEl = apix.common.display.ElementExtender.elemByClass(el,"apix_label");
		apix.common.display.ElementExtender.text(labEl,this.label);
		apix.common.display.ElementExtender.hide(apix.common.display.ElementExtender.elemByClass(el,this.get_inputFieldToHideString()));
		apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.elemByClass(el,this.get_inputFieldString()));
		var valEl = apix.common.display.ElementExtender.elemByClass(apix.common.display.ElementExtender.elemByClass(el,this.get_inputFieldString()),"apix_value");
		if(this.get_inputFieldHeight() > 0) apix.common.display.ElementExtender.height(valEl,this.get_inputFieldHeight());
		apix.common.display.ElementExtender.value(valEl,valInit);
		apix.common.display.ElementExtender.placeHolder(valEl,placeHolder + " " + this.label);
		apix.common.display.ElementExtender.$name(valEl,this.get_dbColName());
		return { elem : el, labelElem : labEl, valueElem : valEl};
	}
	,onUpdateClick: function(e) {
		mybox.boxes.AbstractFormField.prototype.onUpdateClick.call(this,e);
		this.getParent().selectAndDispatch();
		this.clearSecureCode();
		this.dataToScreen();
		this.showNameFrame(this.get_updateTitleTxt(),this.get_nameTxt(),this.get_nameHolderTxt(),"field");
		this.showAdminFields();
		this.enableAdminFields();
		apix.common.display.ElementExtender.enable(this.view.get_isPrimaryInput(),true,true);
		this.setupAdminFieldsInput();
		this.setupAdminFieldsEvent();
		apix.common.display.ElementExtender.enable(this.view.get_controlInput(),false,true);
		apix.common.display.ElementExtender.off(this.view.get_isPrimaryInput());
		apix.common.display.ElementExtender.on(this.view.get_isPrimaryInput(),"change",$bind(this,this.onPrimaryChange));
		this.model.isFieldCreation = false;
	}
	,setupAdminFieldsInput: function() {
		if(this.isPrimary) {
			apix.common.display.ElementExtender.show(apix.common.display.ElementExtender.parent(this.view.get_isPrimaryInput()),"inline");
			this.disableAdminFields();
			this.hideAdminFields();
		} else {
			if(this.get_primary() != null) this.hideIsPrimaryInput(); else if(!this.isSecure && this.control == "InputField") {
				apix.common.display.ElementExtender.off(this.view.get_isPrimaryInput());
				this.showIsPrimaryInput();
				apix.common.display.ElementExtender.inner(this.view.get_nameFrameTitle(),this.lang.fiPrimUpdateTitle);
				if(this.g.strVal(apix.common.display.ElementExtender.value(this.view.get_foName()),"") == "") apix.common.display.ElementExtender.value(this.view.get_foName(),this.lang.fiPrimDefaultLabel);
			}
			if(this.control != "InputField" || this.isSecure) this.hideIsPrimaryInput();
			if(this.isSecure) {
				apix.common.display.ElementExtender.enable(this.view.get_isHiddenInput(),false,true);
				apix.common.display.ElementExtender.selected(this.view.get_isHiddenInput(),true);
			} else apix.common.display.ElementExtender.enable(this.view.get_isHiddenInput(),true,true);
			this.setupFromControl(this.control);
		}
	}
	,onUpdateFrameValid: function(e) {
		var o = this.screenToData();
		var oo = new apix.common.util.Object(o);
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerUpdate));
		this.server.ask(o);
	}
	,dataToScreen: function() {
		apix.common.display.ElementExtender.value(this.view.get_foName(),this.label);
		apix.common.display.ElementExtender.value(this.view.get_rowNumberInput(),"" + this.rowNumber);
		apix.common.display.ElementExtender.value(this.view.get_controlInput(),this.control);
		apix.common.display.ElementExtender.selected(this.view.get_requiredInput(),this.required);
		apix.common.display.ElementExtender.selected(this.view.get_copyEnableInput(),this.copyEnable);
		apix.common.display.ElementExtender.selected(this.view.get_isHiddenInput(),this.isHidden);
		apix.common.display.ElementExtender.selected(this.view.get_isSecureInput(),this.isSecure);
		apix.common.display.ElementExtender.selected(this.view.get_isPrimaryInput(),this.isPrimary);
	}
	,screenToData: function() {
		this.rowNumber = this.g.intVal(apix.common.display.ElementExtender.value(this.view.get_rowNumberInput()),1);
		this.required = this.g.boolVal(apix.common.display.ElementExtender.selected(this.view.get_requiredInput()),true);
		this.copyEnable = this.g.boolVal(apix.common.display.ElementExtender.selected(this.view.get_copyEnableInput()),true);
		this.isHidden = this.g.boolVal(apix.common.display.ElementExtender.selected(this.view.get_isHiddenInput()),true);
		this.isSecure = this.g.boolVal(apix.common.display.ElementExtender.selected(this.view.get_isSecureInput()),false);
		this.isPrimary = this.g.boolVal(apix.common.display.ElementExtender.selected(this.view.get_isPrimaryInput()),true);
		this.control = this.makeFieldsEntryCoherent();
		this.label = apix.common.display.ElementExtender.value(this.view.get_foName());
		apix.common.display.ElementExtender.value(this.get_labelElem(),this.label);
		var o = { req : "updateField", data : JSON.stringify({ id : this.model.get_currUserId(), formRecId : this.getParent().recId, recId : this.recId, label : this.label, rowNumber : this.rowNumber, copyEnable : this.copyEnable, required : this.required, isHidden : this.isHidden, isSecure : this.isSecure, secureCode : this.currSecureCode, isPrimary : this.isPrimary, control : this.control})};
		return o;
	}
	,onSecureChange: function(e) {
		if(apix.common.display.ElementExtender.selected(this.view.get_isSecureInput())) this.createSecureCodeForUpdate(); else if(this.isSecure) {
			this.setSecure(true);
			this.enterSecureCode();
		} else this.doSecureChange();
	}
	,doSecureChange: function() {
		mybox.boxes.AbstractFormField.prototype.doSecureChange.call(this);
		if(!apix.common.display.ElementExtender.selected(this.view.get_isSecureInput()) && this.get_primary() == null) {
			apix.common.display.ElementExtender.off(this.view.get_isPrimaryInput());
			apix.common.display.ElementExtender.on(this.view.get_isPrimaryInput(),"change",$bind(this,this.onPrimaryChange));
			apix.common.display.ElementExtender.selected(this.view.get_isPrimaryInput(),true);
			apix.common.display.ElementExtender.enable(this.view.get_isPrimaryInput(),true,true);
			this.disableAdminFields();
			this.view.showTipBox(this.lang.primaryMustBeCreated,apix.common.display.ElementExtender.parent(this.view.get_isPrimaryInput()),0,0,3);
		}
	}
	,setSecure: function(b) {
		if(b == null) b = true;
		apix.common.display.ElementExtender.selected(this.view.get_isSecureInput(),b);
		if(!b) this.currSecureCode = "";
	}
	,createSecureCodeForUpdate: function() {
		this.createSecureCode();
	}
	,enterSecureCode: function() {
		this.createSecureCode("forEnter");
		this.showSecureFrame(this.lang.secureEnterTitle,"","");
		apix.common.display.ElementExtender.off(this.view.get_bValidSecureFrame());
		apix.common.display.ElementExtender.on(this.view.get_bValidSecureFrame(),"click",$bind(this,this.onValidSecureEnter));
	}
	,onValidSecureEnter: function(e) {
		if(this.currSecureCode != "") this.askVerifySecureCode();
		this.hideSecureFrame();
	}
	,askVerifySecureCode: function() {
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerVerifySecureCode));
		this.server.ask({ req : "verifySecureCode", data : JSON.stringify({ id : this.model.get_currUserId(), fieldRecId : this.recId, formRecId : this.getParent().recId, secureCode : this.currSecureCode})});
	}
	,onAnswerVerifySecureCode: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else if(e.result.msg == "elemDoesntExist") this.g.alert(this.lang.elemDoesntExist); else if(e.result.msg == "invalidSecureCode") {
				var d = this.g.numVal(e.result.jsonData.failureDelay,0);
				var mn = Math.floor(d / 60);
				var fm = this.g.intVal(e.result.jsonData.failureMin);
				var fn = this.g.intVal(e.result.jsonData.failureNumber);
				var b = this.g.boolVal(e.result.jsonData.failureLogoff,false);
				var msg = "";
				if(b) {
					msg += Std.string(this.lang.invalidSecureCodeLogoff) + (mn == null?"null":"" + mn);
					msg += Std.string(this.lang.invalidSecureCodeLogoff2);
					this.g.alert(msg);
				} else {
					msg += Std.string(this.lang.invalidSecureCode + (fm - fn + 1));
					msg += Std.string(this.lang.invalidSecureCode2);
					this.g.alert(msg);
				}
			} else this.g.alert(this.lang.serverReadError + e.result.msg);
		} else if(answ != "secureCodeOk") this.g.alert(this.lang.serverFatalError); else {
			this.setSecure(false);
			this.doSecureChange();
		}
	}
	,__class__: mybox.boxes.Field
});
mybox.boxes.AbstractGuiField = function(m,v) {
	mybox.boxes.Field.call(this,m,v);
};
mybox.boxes.AbstractGuiField.__name__ = ["mybox","boxes","AbstractGuiField"];
mybox.boxes.AbstractGuiField.__super__ = mybox.boxes.Field;
mybox.boxes.AbstractGuiField.prototype = $extend(mybox.boxes.Field.prototype,{
	get_what: function() {
		return "Field";
	}
	,get_selectList: function() {
		return JSON.stringify(this.selectArray);
	}
	,getDisplayValue: function(v) {
		if(v == "") v = "[-1]";
		var arr = JSON.parse(v);
		v = "";
		var coma = "";
		var _g = 0;
		while(_g < arr.length) {
			var i = arr[_g];
			++_g;
			var n = this.g.intVal(i,-1);
			if(n > -1 && n < this.selectArray.length) {
				v += coma + this.selectArray[n];
				coma = ",";
			}
		}
		return v;
	}
	,checkAndRepare: function(v) {
		if(v == "") v = "[-1]";
		var arr;
		try {
			arr = JSON.parse(v);
		} catch( e ) {
			if(HxOverrides.substr(v,v.length - 1,null) == ",") v = HxOverrides.substr(v,0,v.length - 1);
			v = v + "]";
		}
		try {
			arr = JSON.parse(v);
		} catch( e1 ) {
			v = "[-1]";
		}
		return v;
	}
	,getArrayOfString: function(v) {
		var arr = JSON.parse(v);
		var arrOut = [];
		var _g = 0;
		while(_g < arr.length) {
			var i = arr[_g];
			++_g;
			arrOut.push(i == null?"null":"" + i);
		}
		return arrOut;
	}
	,dataToScreen: function() {
		mybox.boxes.Field.prototype.dataToScreen.call(this);
		apix.common.display.ElementExtender.removeChildren(this.view.get_selectListCtnr());
		var el = null;
		var _g = 0;
		var _g1 = this.selectArray;
		while(_g < _g1.length) {
			var sl = _g1[_g];
			++_g;
			el = this.pushLineInSelectList();
			apix.common.display.ElementExtender.value(el,sl);
		}
		this.pushLineInSelectList();
	}
	,__class__: mybox.boxes.AbstractGuiField
});
mybox.boxes.CheckField_ = function(m,v) {
	mybox.boxes.AbstractGuiField.call(this,m,v);
};
mybox.boxes.CheckField_.__name__ = ["mybox","boxes","CheckField_"];
mybox.boxes.CheckField_.__super__ = mybox.boxes.AbstractGuiField;
mybox.boxes.CheckField_.prototype = $extend(mybox.boxes.AbstractGuiField.prototype,{
	getValueToSave: function(e) {
		var v = "[";
		var coma = "";
		var _g = 0;
		var _g1 = apix.common.util.StringExtender.all("input[type='checkbox']",e);
		while(_g < _g1.length) {
			var ec = _g1[_g];
			++_g;
			if(apix.common.display.ElementExtender.selected(ec)) {
				v += coma + apix.common.display.ElementExtender.value(ec);
				coma = ",";
			}
		}
		v += "]";
		return v;
	}
	,initCheckField: function(sl) {
		this.selectArray = JSON.parse(sl);
	}
	,displayInRecordFrame: function(elemsCtnr,placeHolder,valInit) {
		if(valInit == null) valInit = "";
		var el = apix.common.display.ElementExtender.clone(this.view.get_frameCheckFieldDataProto(),true);
		elemsCtnr.appendChild(el);
		apix.common.display.ElementExtender.show(el);
		apix.common.display.ElementExtender.setId(el,"recFrameField_" + this.index);
		var labEl = apix.common.display.ElementExtender.elemByClass(el,"apix_label");
		var valEl = apix.common.display.ElementExtender.elemByClass(el,"apix_checkCtnr");
		if(valInit == "") valInit = "[-1]";
		var i = 0;
		var bEl;
		var lEl;
		var iEl;
		var checkedArr = this.getArrayOfString(valInit);
		var _g = 0;
		var _g1 = this.selectArray;
		while(_g < _g1.length) {
			var sl = _g1[_g];
			++_g;
			bEl = apix.common.display.Common.createElem("div");
			lEl = apix.common.display.Common.createElem("label");
			iEl = apix.common.display.Common.createElem("input");
			apix.common.display.ElementExtender.cssStyle(iEl,"display","inline");
			apix.common.display.ElementExtender.text(lEl,sl);
			apix.common.display.ElementExtender.value(iEl,"" + i);
			apix.common.display.ElementExtender.inputType(iEl,"checkbox");
			bEl.appendChild(iEl);
			bEl.appendChild(lEl);
			valEl.appendChild(bEl);
			i++;
		}
		var _g2 = 0;
		while(_g2 < checkedArr.length) {
			var iChk = checkedArr[_g2];
			++_g2;
			if(iChk != "-1") {
				var v = "#safeBox #" + apix.common.display.ElementExtender.getId(el) + " input[value='" + iChk + "'] ";
				apix.common.display.ElementExtender.selected(apix.common.util.StringExtender.get(v),true);
			}
		}
		apix.common.display.ElementExtender.text(labEl,this.label);
		return { elem : el, labelElem : labEl, valueElem : valEl};
	}
	,screenToData: function() {
		var o = mybox.boxes.AbstractGuiField.prototype.screenToData.call(this);
		var osf = JSON.parse(o.data);
		osf.selectList = this.selectListEntry();
		this.selectArray = JSON.parse(this.selectListEntry());
		o.data = JSON.stringify(osf);
		return o;
	}
	,askUpdateCheckField: function() {
		var o = null;
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerInsertCheckField));
		this.popLineInSelectList();
		apix.common.display.ElementExtender.off(this.view.get_bAddSelectLine());
		o = { req : "updateCheckField", data : JSON.stringify({ id : this.model.get_currUserId(), formRecId : this.getParent().recId, recId : this.recId, selectList : this.get_selectList()})};
		this.server.ask(o);
	}
	,onAnswerInsertCheckField: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else if(e.result.msg == "parentFormDoesntExist") this.g.alert(this.lang.parentFormDoesntExist); else this.g.alert(this.lang.serverReadError + e.result.msg);
		} else if(answ != "updateCheckFieldOk") this.g.alert(this.lang.serverFatalError);
	}
	,__class__: mybox.boxes.CheckField_
});
mybox.boxes.ColorField_ = function(m,v) {
	mybox.boxes.Field.call(this,m,v);
};
mybox.boxes.ColorField_.__name__ = ["mybox","boxes","ColorField_"];
mybox.boxes.ColorField_.__super__ = mybox.boxes.Field;
mybox.boxes.ColorField_.prototype = $extend(mybox.boxes.Field.prototype,{
	get_what: function() {
		return "Field";
	}
	,getDisplayValue: function(v) {
		var red = this.g.hexToDec(HxOverrides.substr(v,1,2));
		var green = this.g.hexToDec(HxOverrides.substr(v,3,2));
		var blue = this.g.hexToDec(HxOverrides.substr(v,5,2));
		return Std.string(this.lang.red) + " : " + red + " / " + Std.string(this.lang.green) + " : " + green + " / " + Std.string(this.lang.blue) + " : " + blue;
	}
	,oppositeColor: function(v) {
		var red = 255 - this.g.hexToDec(HxOverrides.substr(v,1,2));
		var green = 255 - this.g.hexToDec(HxOverrides.substr(v,3,2));
		var blue = 255 - this.g.hexToDec(HxOverrides.substr(v,5,2));
		return "rgb(" + red + "," + green + "," + blue + ")";
	}
	,displayInRecordFrame: function(elemsCtnr,placeHolder,valInit) {
		if(valInit == null) valInit = "#000000";
		apix.common.display.ElementExtender.setId(elemsCtnr,"fieldsCtnr_" + this.index);
		new apix.ui.HLine("#" + apix.common.display.ElementExtender.getId(elemsCtnr));
		var cf = new apix.ui.input.ColorField({ into : "#" + apix.common.display.ElementExtender.getId(elemsCtnr), label : this.label, value : valInit, width : "100px", height : "100px", required : this.required});
		this.uiCompo = cf;
		var el = cf.element;
		var labEl = cf.labelElement;
		var valEl = cf.inputElement;
		return { elem : el, labelElem : labEl, valueElem : valEl};
	}
	,__class__: mybox.boxes.ColorField_
});
mybox.boxes.DateField_ = function(m,v) {
	mybox.boxes.Field.call(this,m,v);
};
mybox.boxes.DateField_.__name__ = ["mybox","boxes","DateField_"];
mybox.boxes.DateField_.__super__ = mybox.boxes.Field;
mybox.boxes.DateField_.prototype = $extend(mybox.boxes.Field.prototype,{
	get_what: function() {
		return "Field";
	}
	,getDisplayValue: function(v) {
		return apix.common.util.StringExtender.toDisplayDate(v);
	}
	,displayInRecordFrame: function(elemsCtnr,placeHolder,valInit) {
		if(valInit == null) valInit = "";
		apix.common.display.ElementExtender.setId(elemsCtnr,"fieldsCtnr_" + this.index);
		new apix.ui.HLine("#" + apix.common.display.ElementExtender.getId(elemsCtnr));
		var df = new apix.ui.input.DateField({ into : "#" + apix.common.display.ElementExtender.getId(elemsCtnr), label : this.label, elementToHide : "#viewBody", value : valInit, required : this.required});
		this.uiCompo = df;
		var el = df.element;
		var labEl = df.labelElement;
		var valEl = df.dataElement;
		return { elem : el, labelElem : labEl, valueElem : valEl};
	}
	,__class__: mybox.boxes.DateField_
});
mybox.boxes.EmailField_ = function(m,v) {
	mybox.boxes.Field.call(this,m,v);
};
mybox.boxes.EmailField_.__name__ = ["mybox","boxes","EmailField_"];
mybox.boxes.EmailField_.__super__ = mybox.boxes.Field;
mybox.boxes.EmailField_.prototype = $extend(mybox.boxes.Field.prototype,{
	get_what: function() {
		return "Field";
	}
	,showValue: function(v) {
		this.emailField.set_value(v);
	}
	,displayInRecordFrame: function(elemsCtnr,placeHolder,valInit) {
		if(valInit == null) valInit = "";
		apix.common.display.ElementExtender.setId(elemsCtnr,"fieldsCtnr_" + this.index);
		new apix.ui.HLine("#" + apix.common.display.ElementExtender.getId(elemsCtnr));
		this.emailField = new apix.ui.input.EmailField({ into : "#" + apix.common.display.ElementExtender.getId(elemsCtnr), label : this.label, value : valInit, placeHolder : placeHolder, required : this.required});
		this.uiCompo = this.emailField;
		var el = this.emailField.element;
		var labEl = this.emailField.labelElement;
		var valEl = this.emailField.inputElement;
		this.emailIdElement = this.emailField.emailIdElement;
		this.domainElement = this.emailField.domainElement;
		return { elem : el, labelElem : labEl, valueElem : valEl};
	}
	,__class__: mybox.boxes.EmailField_
});
mybox.boxes.FieldData = function(m,v) {
	mybox.boxes.AbstractBox.call(this,m,v);
	this.secureFieldRead = new apix.common.event.EventSource();
	this.isUpdated = false;
};
mybox.boxes.FieldData.__name__ = ["mybox","boxes","FieldData"];
mybox.boxes.FieldData.__super__ = mybox.boxes.AbstractBox;
mybox.boxes.FieldData.prototype = $extend(mybox.boxes.AbstractBox.prototype,{
	get_labelElem: function() {
		return apix.common.util.StringExtender.get("#" + this.vId + " .apix_label");
	}
	,get_formParent: function() {
		if(this.getParent().getParent() != this.field.getParent()) haxe.Log.trace("f:: error in FieldData.getFormParent ()",{ fileName : "FieldData.hx", lineNumber : 54, className : "mybox.boxes.FieldData", methodName : "get_formParent"});
		if(this.getParent() != null) return this.getParent().getParent(); else return null;
	}
	,get_valueElem: function() {
		return apix.common.util.StringExtender.get("#" + this.vId + " ." + this.field.get_inputFieldString() + " .apix_value");
	}
	,get_linkInputElem: function() {
		return apix.common.util.StringExtender.get("#" + this.vId + " .apix_linkInput");
	}
	,get_inputElemToHide: function() {
		return apix.common.util.StringExtender.get("#" + this.vId + " ." + this.field.get_inputFieldToHideString());
	}
	,get_showPictoElem: function() {
		return apix.common.util.StringExtender.get("#" + this.vId + " .apix_showPicto");
	}
	,get_copyPictoElem: function() {
		return apix.common.util.StringExtender.get("#" + this.vId + " ." + this.field.get_inputFieldString() + " .apix_copyPicto");
	}
	,get_visible: function() {
		if(this.field.control == "LinkField") return this.field.getDisplayValue(this.value) == apix.common.display.ElementExtender.value(this.get_linkInputElem()); else return this.field.getDisplayValue(this.value) == apix.common.display.ElementExtender.value(this.get_valueElem());
	}
	,getParent: function() {
		if(this.parent != null) return js.Boot.__cast(this.parent , mybox.boxes.Record); else return null;
	}
	,init: function(k,v,fi,idx,par) {
		if(v == null) v = "";
		if(v == null) v = "";
		this.field = fi;
		this.value = this.field.checkAndRepare(v);
		this.key = k;
		this.label = this.g.strVal(fi.label,"");
		this.index = idx;
		this.parent = par;
		if(this.field.control == "LinkField") this.length = (js.Boot.__cast(this.field , mybox.boxes.LinkField_)).getLinkText(this.value).length; else this.length = this.field.getDisplayValue(this.value).length;
		if(this.field.isHidden) this.makeHidden();
		return this;
	}
	,display: function() {
		var fieldDataProto = this.view.get_fieldDataProto();
		var fieldDataEl = apix.common.display.ElementExtender.clone(fieldDataProto,true);
		apix.common.display.ElementExtender.addChild(this.getParent().get_elemsCtnr(),fieldDataEl);
		apix.common.display.ElementExtender.show(fieldDataEl);
		apix.common.display.ElementExtender.setId(fieldDataEl,this.getParent().get_dbTable() + "_rec_" + this.getParent().recId + "_" + this.key);
		this.vId = apix.common.display.ElementExtender.getId(fieldDataEl);
		this.elem = fieldDataEl;
		apix.common.display.ElementExtender.hide(this.get_inputElemToHide());
		this.setup();
	}
	,clear: function() {
		if(this.index != 0) this.removeEvent();
	}
	,setup: function() {
		this.setupView();
		this.setupEvent();
	}
	,makeHidden: function() {
		if(this.field.isSecure) this.value = "";
		if(this.get_valueElem() != null) {
			if(this.field.control == "LinkField") {
				apix.common.display.ElementExtender.inner(this.get_valueElem(),this.hideChars(this.length));
				apix.common.display.ElementExtender.value(this.get_linkInputElem(),this.hideChars(this.length));
			} else apix.common.display.ElementExtender.value(this.get_valueElem(),this.hideChars(this.length));
		}
	}
	,enterSecureCode: function(whatFor) {
		var _g = this;
		this.field.showSecureFrame(this.lang.secureEnterTitle,"","");
		apix.common.display.ElementExtender.off(this.view.get_bValidSecureFrame());
		apix.common.display.ElementExtender.on(this.view.get_bValidSecureFrame(),"click",$bind(this,this.onValidSecureEnter),false,{ whatFor : whatFor});
		apix.common.display.ElementExtender.off(this.view.get_bRubSecureFrame());
		apix.common.display.ElementExtender.on(this.view.get_bRubSecureFrame(),"click",function(e) {
			_g.field.clearSecureCode();
		});
		this.field.clearSecureCode();
		this.field.secureCodes = apix.common.tools.math.MathX.randomExclusiveList(9);
		apix.common.util.StringExtender.each(this.view.get_secureFrameCodePictoString(),($_=this.field,$bind($_,$_.assignSecureCode)));
		apix.common.util.StringExtender.off(this.view.get_secureFrameCodePictoString());
		apix.common.util.StringExtender.on(this.view.get_secureFrameCodePictoString(),"click",$bind(this,this.onClickSecureCode));
	}
	,setupView: function() {
		apix.common.display.ElementExtender.text(this.get_labelElem(),this.label);
		if(this.field.control == "SignField") {
			var p = apix.common.display.ElementExtender.parent(this.get_valueElem());
			apix.common.display.ElementExtender["delete"](this.get_valueElem());
			var el = apix.common.display.Common.createElem("img");
			apix.common.display.ElementExtender.addClass(el,"apix_value");
			apix.common.display.ElementExtender.css(el,"width","35%");
			p.appendChild(el);
			apix.common.display.ElementExtender.attrib(this.get_valueElem(),"src",this.field.getDisplayValue(this.value));
		}
		if(this.field.control == "DateField") apix.common.display.ElementExtender.width(this.get_valueElem(),90);
		if(this.field.control == "ColorField") {
			var p1 = apix.common.display.ElementExtender.parent(this.get_valueElem());
			apix.common.display.ElementExtender["delete"](this.get_valueElem());
			var el1 = apix.common.display.Common.createElem("input");
			apix.common.display.ElementExtender.addClass(el1,"apix_value");
			apix.common.display.ElementExtender.width(el1,300);
			apix.common.display.ElementExtender.height(el1,30);
			apix.common.display.ElementExtender.enable(el1,false);
			p1.appendChild(el1);
			apix.common.display.ElementExtender.cssStyle(el1,"backgroundColor",this.value);
			apix.common.display.ElementExtender.cssStyle(el1,"color",(js.Boot.__cast(this.field , mybox.boxes.ColorField_)).oppositeColor(this.value));
		}
		if(this.field.control == "LinkField") {
			var p2 = apix.common.display.ElementExtender.parent(this.get_valueElem());
			apix.common.display.ElementExtender["delete"](this.get_valueElem());
			if(this.get_linkInputElem() != null) apix.common.display.ElementExtender["delete"](this.get_linkInputElem());
			var el2 = apix.common.display.Common.createElem("div");
			apix.common.display.ElementExtender.addClass(el2,"apix_value");
			p2.appendChild(el2);
			el2 = apix.common.display.Common.createElem("input");
			apix.common.display.ElementExtender.addClass(el2,"apix_linkInput");
			p2.appendChild(el2);
			apix.common.display.ElementExtender.hide(el2);
		}
		if(this.field.control == "PhotoField") {
			var p3 = apix.common.display.ElementExtender.parent(this.get_valueElem());
			apix.common.display.ElementExtender["delete"](this.get_valueElem());
			var el3 = apix.common.display.Common.createElem("img");
			apix.common.display.ElementExtender.addClass(el3,"apix_value");
			apix.common.display.ElementExtender.css(el3,"width","60%");
			p3.appendChild(el3);
			apix.common.display.ElementExtender.attrib(this.get_valueElem(),"src",this.field.getDisplayValue(this.value));
		}
		if(this.field.control == "AreaField") {
			if(this.field.get_inputFieldHeight() > 0) apix.common.display.ElementExtender.height(this.get_valueElem(),this.field.get_inputFieldHeight());
		}
		if(this.field.control == "NumberField" || this.field.control == "Slider") {
			apix.common.display.ElementExtender.css(this.get_valueElem(),"textAlign","right");
			apix.common.display.ElementExtender.width(this.get_valueElem(),this.g.numVal(this.param.numberFieldWidth,100));
		}
		if(this.field.isHidden && this.length > 0) {
			apix.common.display.ElementExtender.visible(this.get_showPictoElem(),true);
			this.makeHidden();
		} else {
			apix.common.display.ElementExtender.visible(this.get_showPictoElem(),false);
			this.makeVisible();
		}
		if(this.field.copyEnable && this.length > 0) apix.common.display.ElementExtender.visible(this.get_copyPictoElem(),true); else apix.common.display.ElementExtender.visible(this.get_copyPictoElem(),false);
	}
	,makeVisible: function() {
		if(this.field.control == "SignField") apix.common.display.ElementExtender.attr(this.get_valueElem(),"src",this.field.getDisplayValue(this.value)); else if(this.field.control == "LinkField") {
			apix.common.display.ElementExtender.inner(this.get_valueElem(),this.field.getDisplayValue(this.value));
			apix.common.display.ElementExtender.value(this.get_linkInputElem(),this.field.getDisplayValue(this.value));
		} else if(this.field.control == "PhotoField") apix.common.display.ElementExtender.attr(this.get_valueElem(),"src",this.field.getDisplayValue(this.value)); else apix.common.display.ElementExtender.value(this.get_valueElem(),this.field.getDisplayValue(this.value));
	}
	,hideChars: function(l) {
		var str = "";
		var _g = 0;
		while(_g < l) {
			var i = _g++;
			str += "*";
		}
		return str;
	}
	,setupEvent: function() {
		if(!apix.common.display.ElementExtender.hasLst(this.get_copyPictoElem(),"click")) apix.common.display.ElementExtender.on(this.get_copyPictoElem(),"click",$bind(this,this.onCopyClick));
		if(!apix.common.display.ElementExtender.hasLst(this.get_showPictoElem(),"click")) apix.common.display.ElementExtender.on(this.get_showPictoElem(),"click",$bind(this,this.onShowClick));
	}
	,removeEvent: function() {
		if(this.get_copyPictoElem() == null) haxe.Log.trace("f:: debug test : label=" + this.label + " index=" + this.index,{ fileName : "FieldData.hx", lineNumber : 233, className : "mybox.boxes.FieldData", methodName : "removeEvent"}); else if(apix.common.display.ElementExtender.hasLst(this.get_copyPictoElem(),"click")) apix.common.display.ElementExtender.off(this.get_copyPictoElem(),"click",$bind(this,this.onCopyClick));
	}
	,onCopyClick: function(e) {
		if(this.field.isSecure && !this.get_visible()) this.enterSecureCode("forCopy"); else this.doCopyToClipBoard();
	}
	,doCopyToClipBoard: function() {
		var visibleBefore = this.get_visible();
		if(this.field.isHidden && !visibleBefore) this.makeVisible();
		if(this.field.control == "LinkField") {
			apix.common.display.ElementExtender.show(this.get_linkInputElem());
			apix.common.display.ElementExtender.pick(this.get_linkInputElem());
		} else apix.common.display.ElementExtender.pick(this.get_valueElem());
		if(!apix.common.display.Common.toClipBoard()) this.g.alert(this.lang.clipBoardCopyError);
		if(this.field.isHidden && !visibleBefore) this.makeHidden();
		if(this.field.control == "LinkField") apix.common.display.ElementExtender.hide(this.get_linkInputElem());
	}
	,onShowClick: function(e) {
		if(!this.get_visible()) {
			if(this.field.isSecure) this.enterSecureCode("forShow"); else this.makeVisible();
		} else this.makeHidden();
	}
	,onValidSecureEnter: function(e,d) {
		if(this.field.currSecureCode != "") this.askReadFieldData(d);
		this.field.hideSecureFrame();
	}
	,onClickSecureCode: function(e) {
		var el;
		el = js.Boot.__cast(e.currentTarget , Element);
		this.field.pushSecureCode(el);
		apix.common.display.ElementExtender.text(this.view.get_secureFrameCode(),"");
	}
	,askReadFieldData: function(d) {
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerReadFieldData),d);
		this.server.ask({ req : "readFieldData", data : JSON.stringify({ id : this.model.get_currUserId(), formRecId : this.get_formParent().recId, recId : this.getParent().recId, fieldRecId : this.field.recId, secureCode : this.field.currSecureCode})});
	}
	,onAnswerReadFieldData: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else if(e.result.msg == "elemDoesntExist") this.g.alert(this.lang.elemDoesntExist); else if(e.result.msg == "invalidSecureCode") {
				var d = this.g.numVal(e.result.jsonData.failureDelay,0);
				var mn = Math.floor(d / 60);
				var fm = this.g.intVal(e.result.jsonData.failureMin);
				var fn = this.g.intVal(e.result.jsonData.failureNumber);
				var b = this.g.boolVal(e.result.jsonData.failureLogoff,false);
				var msg = "";
				if(b) {
					msg += Std.string(this.lang.invalidSecureCodeLogoff) + (mn == null?"null":"" + mn);
					msg += Std.string(this.lang.invalidSecureCodeLogoff2);
					this.g.alert(msg);
				} else {
					msg += Std.string(this.lang.invalidSecureCode + (fm - fn + 1));
					msg += Std.string(this.lang.invalidSecureCode2);
					this.g.alert(msg);
				}
			} else this.g.alert(this.lang.serverReadError + e.result.msg);
		} else if(answ != "readFieldDataOk") this.g.alert(this.lang.serverFatalError); else {
			this.value = e.result.value;
			if(e.data.whatFor == "forShow") this.makeVisible(); else if(e.data.whatFor == "forCopy") this.g.alert(this.lang.secureToClipBoard,$bind(this,this.doCopyToClipBoard),null,this.lang.secureCopyConfirm); else if(e.data.whatFor == "forRecordUpdate") {
				var ev = new apix.common.event.StandardEvent(this);
				ev.value = this.value;
				this.value = "";
				this.secureFieldRead.dispatch(ev);
				this.isUpdated = true;
			} else haxe.Log.trace("f::Fatal error in FieldData.onAnswerReadFieldData()",{ fileName : "FieldData.hx", lineNumber : 313, className : "mybox.boxes.FieldData", methodName : "onAnswerReadFieldData"});
		}
	}
	,__class__: mybox.boxes.FieldData
});
mybox.boxes.Folder = function(m,v) {
	mybox.boxes.AbstractFolderFormField.call(this,m,v);
	this.children = [];
	this.forms = [];
	this.srvTxtMsg = "FormFolder";
	this.insertSrvTxtMsg = "FormFolder";
};
mybox.boxes.Folder.__name__ = ["mybox","boxes","Folder"];
mybox.boxes.Folder.__super__ = mybox.boxes.AbstractFolderFormField;
mybox.boxes.Folder.prototype = $extend(mybox.boxes.AbstractFolderFormField.prototype,{
	get_subCtnr: function() {
		return apix.common.display.ElementExtender.elemByClass(this.elem,"apix_subCtnr");
	}
	,get_color: function() {
		return this.param.folderColor;
	}
	,get_nameHolderTxt: function() {
		return this.lang.fdNameHolder;
	}
	,get_updateTitleTxt: function() {
		return this.lang.fdUpdateTitle;
	}
	,getParent: function() {
		if(this != this.model.root) return js.Boot.__cast(this.parent , mybox.boxes.Folder); else return null;
	}
	,setupFolderTreeRelation: function(o,fd) {
		if(this.recId == o.parent_id) {
			fd.parent = this;
			this.children.push(fd);
			fd.index = this.children.length - 1;
		} else {
			var len = this.children.length;
			var _g = 0;
			while(_g < len) {
				var i = _g++;
				this.children[i].setupFolderTreeRelation(o,fd);
			}
		}
	}
	,setupFormTreeRelation: function(o,f) {
		if(this.recId == o.parent_id) {
			f.parent = this;
			this.forms.push(f);
			f.index = this.forms.length - 1;
		} else {
			var len = this.children.length;
			var _g = 0;
			while(_g < len) {
				var i = _g++;
				this.children[i].setupFormTreeRelation(o,f);
			}
		}
	}
	,display: function(shift) {
		if(shift == null) shift = 0;
		var len = this.children.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var fd = this.children[i];
			this.createOneFolder(fd,shift);
			fd.display(shift + this.shiftVal);
		}
		var len1 = this.forms.length;
		var _g1 = 0;
		while(_g1 < len1) {
			var i1 = _g1++;
			var f = this.forms[i1];
			this.createOneForm(f,shift);
			f.displayFields(shift);
		}
	}
	,insertNewFolder: function() {
		this.insertNewElement("folder");
	}
	,insertNewForm: function() {
		this.insertNewElement("form");
	}
	,setupAdminMode: function() {
		var len = this.children.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var fd = this.children[i];
			fd.setupAdminMode();
		}
		var len1 = this.forms.length;
		var _g1 = 0;
		while(_g1 < len1) {
			var i1 = _g1++;
			var f = this.forms[i1];
			f.setupAdminMode();
		}
		if(this.recId != 0) apix.common.display.ElementExtender.show(this.get_pictoCtnr(),"inline-block");
	}
	,setupUsingMode: function() {
		var len = this.children.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var fd = this.children[i];
			fd.setupUsingMode();
		}
		var len1 = this.forms.length;
		var _g1 = 0;
		while(_g1 < len1) {
			var i1 = _g1++;
			var f = this.forms[i1];
			f.setupUsingMode();
		}
		if(this.recId != 0) apix.common.display.ElementExtender.hide(this.get_pictoCtnr());
	}
	,clear: function() {
		var len = this.children.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var fd = this.children[i];
			fd.clear();
		}
		var len1 = this.forms.length;
		var _g1 = 0;
		while(_g1 < len1) {
			var i1 = _g1++;
			var f = this.forms[i1];
			f.clear();
		}
		this.children = [];
		this.forms = [];
		if(this.recId == 0) apix.common.display.ElementExtender.inner(this.get_elemsCtnr(),""); else this.removeEvent();
	}
	,remove: function() {
		while(this.children.length > 0) this.children[this.children.length - 1].remove();
		while(this.forms.length > 0) this.forms[this.forms.length - 1].remove();
		if(this.recId != 0) {
			this.getParent().selectAndDispatch();
			this.clear();
			if(this.elem == null) haxe.Log.trace("Erreur in Form.remove(). Instance : " + this.g.className(this) + " label=" + this.label + " recId=" + this.recId,{ fileName : "Folder.hx", lineNumber : 146, className : "mybox.boxes.Folder", methodName : "remove"}); else apix.common.display.ElementExtender["delete"](this.elem);
			this.getParent().removeFromList(this);
		}
	}
	,removeFromList: function(c) {
		if(c["is"]("Folder")) {
			this.children.splice(c.index,1);
			var _g1 = c.index;
			var _g = this.children.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.children[i].index = i;
			}
		} else if(c["is"]("Form")) {
			this.forms.splice(c.index,1);
			var _g11 = c.index;
			var _g2 = this.forms.length;
			while(_g11 < _g2) {
				var i1 = _g11++;
				this.forms[i1].index = i1;
			}
		} else haxe.Log.trace("f:: [override] Folder.removeFromList() type error",{ fileName : "Folder.hx", lineNumber : 164, className : "mybox.boxes.Folder", methodName : "removeFromList"});
	}
	,setStateOfAddButtons: function(opacFd,opacFo,opacFi) {
		if(opacFi == null) opacFi = "0";
		if(opacFo == null) opacFo = "1";
		if(opacFd == null) opacFd = "1";
		mybox.boxes.AbstractFolderFormField.prototype.setStateOfAddButtons.call(this,opacFd,opacFo,opacFi);
	}
	,onAnswerInsertElement: function(e) {
		var answ = mybox.boxes.AbstractFolderFormField.prototype.onAnswerInsertElement.call(this,e);
		if(answ == "insert" + this.insertSrvTxtMsg + "Ok") {
			if(e.data.type == "folder") this.createFolderAfterInsert(e.result.recId,this.shift + this.shiftVal); else if(e.data.type == "form") this.createFormAfterInsert(e.result.recId,this.shift + this.shiftVal);
		}
		return answ;
	}
	,createFolderAfterInsert: function(rci,shift) {
		if(shift == null) shift = 0;
		var fd = new mybox.boxes.Folder(this.model,this.view);
		this.insertElementInit(fd,rci);
		this.children.push(fd);
		fd.index = this.children.length - 1;
		this.createOneFolder(fd,shift);
		fd.setupAdminMode();
	}
	,createFormAfterInsert: function(rci,shift) {
		if(shift == null) shift = 0;
		var fo = new mybox.boxes.Form(this.model,this.view);
		this.insertElementInit(fo,rci);
		this.forms.push(fo);
		fo.index = this.forms.length - 1;
		this.createOneForm(fo,shift);
		fo.setupAdminMode();
	}
	,createOneFolder: function(fd,shift) {
		if(shift == null) shift = 0;
		var folderProto = this.view.get_fButtonProto();
		var folderEl = apix.common.display.ElementExtender.clone(folderProto,true);
		apix.common.display.ElementExtender.addChild(this.get_elemsCtnr(),folderEl);
		apix.common.display.ElementExtender.show(folderEl);
		apix.common.display.ElementExtender.setId(folderEl,"fd_" + fd.recId);
		fd.vId = apix.common.display.ElementExtender.getId(folderEl);
		fd.elem = folderEl;
		fd.shift = shift;
		apix.common.display.ElementExtender.posx(fd.get_bElem(),fd.shift);
		fd.setup();
		apix.common.display.ElementExtender["delete"](fd.get_recordsCtnr());
		fd.click.on($bind(this,this.onElemClick));
	}
	,createOneForm: function(fo,shift) {
		if(shift == null) shift = 0;
		var formProto = this.view.get_fButtonProto();
		var formEl = apix.common.display.ElementExtender.clone(formProto,true);
		apix.common.display.ElementExtender.addChild(this.get_elemsCtnr(),formEl);
		apix.common.display.ElementExtender.show(formEl);
		apix.common.display.ElementExtender.setId(formEl,"fo_" + fo.recId);
		fo.vId = apix.common.display.ElementExtender.getId(formEl);
		fo.elem = formEl;
		fo.shift = shift;
		apix.common.display.ElementExtender.posx(fo.get_bElem(),fo.shift);
		fo.setup();
		fo.click.on($bind(this,this.onElemClick));
	}
	,onButtonClick: function(e) {
		if(!this.isClosed) this.close(); else this.open();
		this.selectAndDispatch();
	}
	,__class__: mybox.boxes.Folder
});
mybox.boxes.Form = function(m,v) {
	mybox.boxes.AbstractFormField.call(this,m,v);
	this.fields = [];
	this.records = [];
	this.srvTxtMsg = "FormFolder";
	this.insertSrvTxtMsg = "Field";
};
mybox.boxes.Form.__name__ = ["mybox","boxes","Form"];
mybox.boxes.Form.__super__ = mybox.boxes.AbstractFormField;
mybox.boxes.Form.prototype = $extend(mybox.boxes.AbstractFormField.prototype,{
	getParent: function() {
		return js.Boot.__cast(this.parent , mybox.boxes.Folder);
	}
	,get_dbTable: function() {
		return "tb_" + this.recId;
	}
	,get_recordsAlreadyRead: function() {
		return !apix.common.display.ElementExtender.isEmpty(this.get_recordsCtnr());
	}
	,get_color: function() {
		return this.param.formColor;
	}
	,get_recInsertTitleTxt: function() {
		return this.lang.recInsertTitle;
	}
	,get_primary: function() {
		var len = this.fields.length;
		var v = null;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(this.fields[i].isPrimary) {
				v = this.fields[i];
				break;
			}
		}
		return v;
	}
	,setupFormFields: function(arr) {
		var _g1 = 0;
		var _g = arr.length;
		while(_g1 < _g) {
			var i = _g1++;
			var o = arr[i];
			var fi;
			if(o.control == "SelectField") fi = new mybox.boxes.SelectField_(this.model,this.view); else if(o.control == "CheckField") fi = new mybox.boxes.CheckField_(this.model,this.view); else if(o.control == "RadioField") fi = new mybox.boxes.RadioField_(this.model,this.view); else if(o.control == "NumberField") fi = new mybox.boxes.NumberField_(this.model,this.view); else if(o.control == "GeoField") fi = new mybox.boxes.GeoField_(this.model,this.view); else if(o.control == "SignField") fi = new mybox.boxes.SignField_(this.model,this.view); else if(o.control == "PhotoField") fi = new mybox.boxes.PhotoField_(this.model,this.view); else if(o.control == "Slider") fi = new mybox.boxes.Slider_(this.model,this.view); else if(o.control == "DateField") fi = new mybox.boxes.DateField_(this.model,this.view); else if(o.control == "ColorField") fi = new mybox.boxes.ColorField_(this.model,this.view); else if(o.control == "LinkField") fi = new mybox.boxes.LinkField_(this.model,this.view); else if(o.control == "EmailField") fi = new mybox.boxes.EmailField_(this.model,this.view); else fi = new mybox.boxes.Field(this.model,this.view);
			fi.parent = this;
			fi.initField(o.id,o.label,o.row_number,o.required,o.copy_enable,o.is_hidden,o.is_secure,o.is_primary,o.control);
			this.fields.push(fi);
			fi.index = this.fields.length - 1;
			if(fi.control == "SelectField") fi.initSelectField(o.selectfields.is_multiple,o.selectfields.labels); else if(fi.control == "CheckField") fi.initCheckField(o.checkfields.labels); else if(fi.control == "RadioField") fi.initRadioField(o.radiofields.labels); else if(fi.control == "NumberField") fi.initNumberField(o.numberfields.decimal_number); else if(fi.control == "Slider") fi.initSlider(o.sliders.min_value,o.sliders.max_value,o.sliders.decimal_number);
		}
	}
	,displayFields: function(shift) {
		if(shift == null) shift = 0;
		var len = this.fields.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var fi = this.fields[i];
			this.createOneField(fi,shift);
		}
	}
	,setupAdminMode: function() {
		var len = this.fields.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var fi = this.fields[i];
			fi.setupAdminMode();
		}
		apix.common.display.ElementExtender.hide(this.get_subCtnr());
		if(this.isClosed == false) apix.common.display.ElementExtender.show(this.get_elemsCtnr());
		apix.common.display.ElementExtender.show(this.get_pictoCtnr(),"inline-block");
	}
	,setupUsingMode: function() {
		var len = this.fields.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var fi = this.fields[i];
			fi.setupUsingMode();
		}
		apix.common.display.ElementExtender.hide(this.get_subCtnr());
		apix.common.display.ElementExtender.hide(this.get_pictoCtnr());
	}
	,removeFromList: function(c) {
		if(c["is"]("Field")) {
			this.fields.splice(c.index,1);
			var _g1 = c.index;
			var _g = this.fields.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.fields[i].index = i;
			}
		} else if(c["is"]("Record")) {
			this.records.splice(c.index,1);
			var _g11 = c.index;
			var _g2 = this.records.length;
			while(_g11 < _g2) {
				var i1 = _g11++;
				this.records[i1].index = i1;
			}
		} else haxe.Log.trace("f:: Form.removeFromList() type error : " + c.get_what(),{ fileName : "Form.hx", lineNumber : 146, className : "mybox.boxes.Form", methodName : "removeFromList"});
	}
	,clear: function() {
		var len = this.fields.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var field = this.fields[i];
			field.clear();
		}
		var len1 = this.records.length;
		var _g1 = 0;
		while(_g1 < len1) {
			var i1 = _g1++;
			var record = this.records[i1];
			record.clear();
		}
		this.removeEvent();
		this.fields = [];
		this.records = [];
	}
	,insertNewField: function() {
		this.clearSecureCode();
		this.insertNewElement("field");
	}
	,insertNewRecord: function() {
		if(this.fields.length == 0) this.g.alert(this.lang.emptyFieldDescription); else {
			var sfg = mybox.boxes.SingleFormRecordMng.get(this.model,this.view,this);
			sfg.showRecordFrame(this.get_recInsertTitleTxt());
		}
	}
	,createOneRecord: function(recId,recordFrameFieldElems) {
		var r = new mybox.boxes.Record(this.model,this.view);
		r.init(recId,this,this.records.push(r) - 1,this.shift,apix.common.display.ElementExtender.value(recordFrameFieldElems[0].valueElem));
		r.display();
		var f;
		var _g = 0;
		var _g1 = this.fields;
		while(_g < _g1.length) {
			var f1 = _g1[_g];
			++_g;
			r.push("fd_" + f1.recId,f1.getValueToSave(recordFrameFieldElems[f1.index].valueElem),f1);
		}
	}
	,onButtonClick: function(e) {
		if(!this.isClosed) this.close(); else if(this.get_mode() == "using" && !this.get_recordsAlreadyRead()) this.askReadRecords(); else this.open();
		this.selectAndDispatch();
	}
	,createFieldAfterInsert: function(rci,shift) {
		if(shift == null) shift = 0;
		var fi;
		if(this.selectedControl() == "SelectField") fi = new mybox.boxes.SelectField_(this.model,this.view); else if(this.selectedControl() == "CheckField") fi = new mybox.boxes.CheckField_(this.model,this.view); else if(this.selectedControl() == "RadioField") fi = new mybox.boxes.RadioField_(this.model,this.view); else if(this.selectedControl() == "NumberField") fi = new mybox.boxes.NumberField_(this.model,this.view); else if(this.selectedControl() == "GeoField") fi = new mybox.boxes.GeoField_(this.model,this.view); else if(this.selectedControl() == "SignField") fi = new mybox.boxes.SignField_(this.model,this.view); else if(this.selectedControl() == "PhotoField") fi = new mybox.boxes.PhotoField_(this.model,this.view); else if(this.selectedControl() == "Slider") fi = new mybox.boxes.Slider_(this.model,this.view); else if(this.selectedControl() == "DateField") fi = new mybox.boxes.DateField_(this.model,this.view); else if(this.selectedControl() == "ColorField") fi = new mybox.boxes.ColorField_(this.model,this.view); else if(this.selectedControl() == "LinkField") fi = new mybox.boxes.LinkField_(this.model,this.view); else if(this.selectedControl() == "EmailField") fi = new mybox.boxes.EmailField_(this.model,this.view); else fi = new mybox.boxes.Field(this.model,this.view);
		this.insertElementInit(fi,rci);
		fi.initField(rci,apix.common.display.ElementExtender.value(this.view.get_foName()),this.g.intVal(apix.common.display.ElementExtender.value(this.view.get_rowNumberInput()),1),apix.common.display.ElementExtender.selected(this.view.get_requiredInput()),apix.common.display.ElementExtender.selected(this.view.get_copyEnableInput()),apix.common.display.ElementExtender.selected(this.view.get_isHiddenInput()),apix.common.display.ElementExtender.selected(this.view.get_isSecureInput()),apix.common.display.ElementExtender.selected(this.view.get_isPrimaryInput()),this.selectedControl());
		this.fields.push(fi);
		if(fi.control == "SelectField") {
			var sfi = fi;
			sfi.initSelectField(apix.common.display.ElementExtender.selected(this.view.get_isMultipleInput()),this.selectListEntry());
			sfi.askUpdateSelectField();
		} else if(fi.control == "CheckField") {
			var sfi1 = fi;
			sfi1.initCheckField(this.selectListEntry());
			sfi1.askUpdateCheckField();
		} else if(fi.control == "RadioField") {
			var sfi2 = fi;
			sfi2.initRadioField(this.selectListEntry());
			sfi2.askUpdateRadioField();
		} else if(fi.control == "NumberField") {
			var sfi3 = fi;
			sfi3.initNumberField(this.g.intVal(apix.common.display.ElementExtender.value(this.view.get_decimalNumberInput())));
			sfi3.askUpdateNumberField();
		} else if(fi.control == "Slider") {
			var sfi4 = fi;
			sfi4.initSlider(this.g.numVal(apix.common.display.ElementExtender.value(this.view.get_minValueInput())),this.g.numVal(apix.common.display.ElementExtender.value(this.view.get_maxValueInput())),this.g.intVal(apix.common.display.ElementExtender.value(this.view.get_decimalNumberInput())));
			sfi4.askUpdateSlider();
		}
		fi.index = this.fields.length - 1;
		this.createOneField(fi,shift);
		fi.setupAdminMode();
	}
	,createOneField: function(fi,shift) {
		if(shift == null) shift = 0;
		var fieldProto = this.view.get_fButtonProto();
		var fieldEl = apix.common.display.ElementExtender.clone(fieldProto,true);
		apix.common.display.ElementExtender.addChild(this.get_elemsCtnr(),fieldEl);
		apix.common.display.ElementExtender.show(fieldEl);
		apix.common.display.ElementExtender.setId(fieldEl,"fi_" + fi.recId);
		fi.vId = apix.common.display.ElementExtender.getId(fieldEl);
		fi.elem = fieldEl;
		fi.shift = shift;
		apix.common.display.ElementExtender.posx(fi.get_bElem(),fi.shift);
		fi.setup();
		apix.common.display.ElementExtender["delete"](fi.get_recordsCtnr());
	}
	,askReadRecords: function() {
		if(this.fields.length == 0) this.g.alert(this.lang.emptyFieldDescription); else {
			this.server.serverEvent.off();
			this.server.serverEvent.on($bind(this,this.onAnswerReadRecords));
			this.server.ask({ req : "readRecords", data : JSON.stringify({ id : this.model.get_currUserId(), recId : this.recId})});
		}
	}
	,onAnswerReadRecords: function(e) {
		var o = e.result.jsonData;
		if(e.result.answ == "error") {
			var msg = e.result.msg;
			if(msg == "tableDoesntExist") this.g.alert(this.lang.formTableDontExists); else if(msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else this.g.alert(Std.string(this.lang.serverReadError) + msg);
		} else if(o == null) this.g.alert(this.lang.serverFatalError); else if(e.result.answ == "readRecordsOk") {
			if(o.records != null && o.records.length > 0) {
				this.setupRecordsTree(o.records);
				this.open();
			} else this.g.alert(this.lang.formHaventData);
		}
	}
	,setupRecordsTree: function(arr) {
		var _g1 = 0;
		var _g = arr.length;
		while(_g1 < _g) {
			var i = _g1++;
			var o = new apix.common.util.Object(arr[i]);
			var k = "fd_" + this.fields[0].recId;
			var r = new mybox.boxes.Record(this.model,this.view);
			r.init(this.g.intVal(o.id),this,this.records.push(r) - 1,this.shift,o.get(k));
			r.display();
			var _g2 = 0;
			var _g3 = this.fields;
			while(_g2 < _g3.length) {
				var f = _g3[_g2];
				++_g2;
				k = "fd_" + f.recId;
				if(o.get(k) != null) r.push(k,o.get(k),f); else r.push(k,"",f);
			}
		}
	}
	,__class__: mybox.boxes.Form
});
mybox.boxes.GeoField_ = function(m,v) {
	mybox.boxes.Field.call(this,m,v);
};
mybox.boxes.GeoField_.__name__ = ["mybox","boxes","GeoField_"];
mybox.boxes.GeoField_.__super__ = mybox.boxes.Field;
mybox.boxes.GeoField_.prototype = $extend(mybox.boxes.Field.prototype,{
	get_what: function() {
		return "Field";
	}
	,displayInRecordFrame: function(elemsCtnr,placeHolder,valInit) {
		if(valInit == null) valInit = "";
		apix.common.display.ElementExtender.setId(elemsCtnr,"fieldsCtnr_" + this.index);
		var gf = new apix.ui.input.GeoField({ into : "#" + apix.common.display.ElementExtender.getId(elemsCtnr), value : valInit, label : this.label, shortDisplay : true, required : this.required});
		this.uiCompo = gf;
		var el = gf.element;
		var labEl = gf.labelElement;
		var valEl = gf.get_inputElement();
		return { elem : el, labelElem : labEl, valueElem : valEl};
	}
	,__class__: mybox.boxes.GeoField_
});
mybox.boxes.LinkField_ = function(m,v) {
	mybox.boxes.Field.call(this,m,v);
};
mybox.boxes.LinkField_.__name__ = ["mybox","boxes","LinkField_"];
mybox.boxes.LinkField_.__super__ = mybox.boxes.Field;
mybox.boxes.LinkField_.prototype = $extend(mybox.boxes.Field.prototype,{
	get_what: function() {
		return "Field";
	}
	,getDisplayValue: function(v) {
		return apix.ui.input.LinkField.getLinkFrom(v);
	}
	,getLinkText: function(v) {
		return apix.ui.input.LinkField.getArrayFrom(v)[0];
	}
	,displayInRecordFrame: function(elemsCtnr,placeHolder,valInit) {
		if(valInit == null) valInit = "[\"\"],[\"\"]";
		apix.common.display.ElementExtender.setId(elemsCtnr,"fieldsCtnr_" + this.index);
		new apix.ui.HLine("#" + apix.common.display.ElementExtender.getId(elemsCtnr));
		if(valInit == "") valInit = "[\"\"],[\"\"]";
		var lf = new apix.ui.input.LinkField({ into : "#" + apix.common.display.ElementExtender.getId(elemsCtnr), label : this.label, textPlaceHolder : this.lang.linkTextPlaceHolder, urlPlaceHolder : "http://....", value : valInit, textLabel : this.lang.linkTextLabel, urlLabel : this.lang.linkUrlLabel, required : this.required});
		this.uiCompo = lf;
		var el = lf.element;
		var labEl = lf.labelElement;
		var valEl = lf.inputElement;
		return { elem : el, labelElem : labEl, valueElem : valEl};
	}
	,__class__: mybox.boxes.LinkField_
});
mybox.boxes.NumberField_ = function(m,v) {
	mybox.boxes.Field.call(this,m,v);
};
mybox.boxes.NumberField_.__name__ = ["mybox","boxes","NumberField_"];
mybox.boxes.NumberField_.__super__ = mybox.boxes.Field;
mybox.boxes.NumberField_.prototype = $extend(mybox.boxes.Field.prototype,{
	get_what: function() {
		return "Field";
	}
	,initNumberField: function(dn) {
		this.decimalNumber = dn;
	}
	,displayInRecordFrame: function(elemsCtnr,placeHolder,valInit) {
		if(valInit == null) valInit = "";
		apix.common.display.ElementExtender.setId(elemsCtnr,"fieldsCtnr_" + this.index);
		var ph = "999";
		var dot = ".";
		var _g1 = 0;
		var _g = this.decimalNumber;
		while(_g1 < _g) {
			var i = _g1++;
			ph += dot + "9";
			dot = "";
		}
		if(this.g.numVal(valInit,0) == 0) valInit = "";
		var nif = new apix.ui.input.NumberInputField({ into : "#" + apix.common.display.ElementExtender.getId(elemsCtnr), label : this.label, decimal : this.decimalNumber, placeHolder : ph, value : valInit, required : this.required});
		this.uiCompo = nif;
		var el = nif.element;
		var labEl = nif.labelElement;
		var valEl = nif.inputElement;
		return { elem : el, labelElem : labEl, valueElem : valEl};
	}
	,askUpdateNumberField: function() {
		var o = null;
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerInsertNumberField));
		o = { req : "updateNumberField", data : JSON.stringify({ id : this.model.get_currUserId(), formRecId : this.getParent().recId, recId : this.recId, decimalNumber : this.decimalNumber})};
		this.server.ask(o);
	}
	,dataToScreen: function() {
		mybox.boxes.Field.prototype.dataToScreen.call(this);
		apix.common.display.ElementExtender.value(this.view.get_decimalNumberInput(),"" + this.decimalNumber);
	}
	,screenToData: function() {
		var o = mybox.boxes.Field.prototype.screenToData.call(this);
		var osf = JSON.parse(o.data);
		osf.decimalNumber = this.g.intVal(apix.common.display.ElementExtender.value(this.view.get_decimalNumberInput()),2);
		this.decimalNumber = osf.decimalNumber;
		o.data = JSON.stringify(osf);
		return o;
	}
	,onAnswerInsertNumberField: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else if(e.result.msg == "parentFormDoesntExist") this.g.alert(this.lang.parentFormDoesntExist); else this.g.alert(this.lang.serverReadError + e.result.msg);
		} else if(answ != "updateNumberFieldOk") this.g.alert(this.lang.serverFatalError);
	}
	,__class__: mybox.boxes.NumberField_
});
mybox.boxes.PhotoField_ = function(m,v) {
	mybox.boxes.Field.call(this,m,v);
};
mybox.boxes.PhotoField_.__name__ = ["mybox","boxes","PhotoField_"];
mybox.boxes.PhotoField_.__super__ = mybox.boxes.Field;
mybox.boxes.PhotoField_.prototype = $extend(mybox.boxes.Field.prototype,{
	get_what: function() {
		return "Field";
	}
	,displayInRecordFrame: function(elemsCtnr,placeHolder,valInit) {
		if(valInit == null) valInit = "";
		apix.common.display.ElementExtender.setId(elemsCtnr,"fieldsCtnr_" + this.index);
		var value = null;
		value = JSON.parse(this.checkAndRepare(valInit));
		var pfId = apix.common.display.Common.get_newSingleId();
		this.pfUi = new apix.ui.input.PhotoField({ id : pfId, into : "#" + apix.common.display.ElementExtender.getId(elemsCtnr), value : value, label : this.label, name : pfId, max : 1, skin : "mobile", required : this.required});
		this.uiCompo = this.pfUi;
		var el = this.pfUi.element;
		var labEl = this.pfUi.labelElement;
		var valEl = this.pfUi.photoCtnrElement;
		return { elem : el, labelElem : labEl, valueElem : valEl};
	}
	,getValueToSave: function(e) {
		var v = JSON.stringify(this.pfUi.get_value());
		return v;
	}
	,getDisplayValue: function(v) {
		var arr = JSON.parse(v);
		if(arr.length > 0) {
			var md = arr[0];
			v = apix.ui.UICompo.mediaDataToUrl(md);
		} else v = "";
		return v;
	}
	,checkAndRepare: function(v) {
		if(v == "" || v == null) v = "[]";
		return v;
	}
	,__class__: mybox.boxes.PhotoField_
});
mybox.boxes.RadioField_ = function(m,v) {
	mybox.boxes.AbstractGuiField.call(this,m,v);
};
mybox.boxes.RadioField_.__name__ = ["mybox","boxes","RadioField_"];
mybox.boxes.RadioField_.__super__ = mybox.boxes.AbstractGuiField;
mybox.boxes.RadioField_.prototype = $extend(mybox.boxes.AbstractGuiField.prototype,{
	getDisplayValue: function(v) {
		var n = this.g.intVal(v,-1);
		var res = "";
		if(n > -1 && n < this.selectArray.length) res = this.selectArray[n];
		return res;
	}
	,getValueToSave: function(e) {
		var v = "-1";
		var _g = 0;
		var _g1 = apix.common.util.StringExtender.all("input[type='radio']",e);
		while(_g < _g1.length) {
			var ec = _g1[_g];
			++_g;
			if(apix.common.display.ElementExtender.selected(ec)) v = apix.common.display.ElementExtender.value(ec);
		}
		return v;
	}
	,initRadioField: function(sl) {
		this.selectArray = JSON.parse(sl);
	}
	,checkAndRepare: function(v) {
		return v;
	}
	,displayInRecordFrame: function(elemsCtnr,placeHolder,valInit) {
		if(valInit == null) valInit = "";
		var el = apix.common.display.ElementExtender.clone(this.view.get_frameRadioFieldDataProto(),true);
		elemsCtnr.appendChild(el);
		apix.common.display.ElementExtender.show(el);
		apix.common.display.ElementExtender.setId(el,"recFrameField_" + this.index);
		var labEl = apix.common.display.ElementExtender.elemByClass(el,"apix_label");
		var valEl = apix.common.display.ElementExtender.elemByClass(el,"apix_radioCtnr");
		if(valInit == "") valInit = "-1";
		var i = 0;
		var bEl;
		var lEl;
		var iEl;
		var _g = 0;
		var _g1 = this.selectArray;
		while(_g < _g1.length) {
			var sl = _g1[_g];
			++_g;
			bEl = apix.common.display.Common.createElem("div");
			lEl = apix.common.display.Common.createElem("label");
			iEl = apix.common.display.Common.createElem("input");
			apix.common.display.ElementExtender.cssStyle(iEl,"display","inline");
			apix.common.display.ElementExtender.text(lEl,sl);
			apix.common.display.ElementExtender.value(iEl,"" + i);
			apix.common.display.ElementExtender.inputType(iEl,"radio");
			apix.common.display.ElementExtender.$name(iEl,this.get_dbColName());
			bEl.appendChild(iEl);
			bEl.appendChild(lEl);
			valEl.appendChild(bEl);
			i++;
		}
		if(valInit != "-1") {
			var v = "#safeBox #" + apix.common.display.ElementExtender.getId(el) + " input[value='" + valInit + "'] ";
			var sEl = apix.common.util.StringExtender.get(v);
			if(sEl != null) apix.common.display.ElementExtender.selected(sEl,true);
		}
		apix.common.display.ElementExtender.text(labEl,this.label);
		return { elem : el, labelElem : labEl, valueElem : valEl};
	}
	,screenToData: function() {
		var o = mybox.boxes.AbstractGuiField.prototype.screenToData.call(this);
		var osf = JSON.parse(o.data);
		osf.selectList = this.selectListEntry();
		this.selectArray = JSON.parse(this.selectListEntry());
		o.data = JSON.stringify(osf);
		return o;
	}
	,askUpdateRadioField: function() {
		var o = null;
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerInsertRadioField));
		this.popLineInSelectList();
		apix.common.display.ElementExtender.off(this.view.get_bAddSelectLine());
		o = { req : "updateRadioField", data : JSON.stringify({ id : this.model.get_currUserId(), formRecId : this.getParent().recId, recId : this.recId, selectList : this.get_selectList()})};
		this.server.ask(o);
	}
	,onAnswerInsertRadioField: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else if(e.result.msg == "parentFormDoesntExist") this.g.alert(this.lang.parentFormDoesntExist); else this.g.alert(this.lang.serverReadError + e.result.msg);
		} else if(answ != "updateRadioFieldOk") this.g.alert(this.lang.serverFatalError);
	}
	,__class__: mybox.boxes.RadioField_
});
mybox.boxes.Record = function(m,v) {
	mybox.boxes.AbstractBox.call(this,m,v);
};
mybox.boxes.Record.__name__ = ["mybox","boxes","Record"];
mybox.boxes.Record.__super__ = mybox.boxes.AbstractBox;
mybox.boxes.Record.prototype = $extend(mybox.boxes.AbstractBox.prototype,{
	get_dbTable: function() {
		return this.getParent().get_dbTable();
	}
	,get_elemsCtnr: function() {
		return apix.common.util.StringExtender.get("#" + this.vId + " .apix_subCtnr");
	}
	,get_color: function() {
		return this.param.recordColor;
	}
	,get_recUpdateTitleTxt: function() {
		return this.lang.recUpdateTitle;
	}
	,getParent: function() {
		if(this.parent != null) return js.Boot.__cast(this.parent , mybox.boxes.Form); else return null;
	}
	,clear: function() {
		var len = this.fieldDatas.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.fieldDatas[i].clear();
		}
		this.fieldDatas = [];
		this.removeEvent();
	}
	,init: function(rid,par,idx,sh,l) {
		this.recId = rid;
		this.parent = par;
		this.fields = this.getParent().fields;
		this.index = idx;
		this.fieldDatas = [];
		this.shift = sh;
		this.label = this.g.strVal(l,"");
		return this;
	}
	,display: function() {
		var recordProto = this.view.get_fButtonProto();
		var recordEl = apix.common.display.ElementExtender.clone(recordProto,true);
		apix.common.display.ElementExtender.addChild(this.getParent().get_recordsCtnr(),recordEl);
		apix.common.display.ElementExtender.show(recordEl);
		apix.common.display.ElementExtender.setId(recordEl,this.get_dbTable() + "_rec_" + this.recId);
		this.vId = apix.common.display.ElementExtender.getId(recordEl);
		this.elem = recordEl;
		apix.common.display.ElementExtender.posx(this.get_bElem(),this.shift);
		apix.common.display.ElementExtender.posx(this.get_elemsCtnr(),this.shift);
		apix.common.display.ElementExtender.cssStyle(this.get_elemsCtnr(),"border","1px dotted #999");
		this.setup();
		apix.common.display.ElementExtender["delete"](this.get_recordsCtnr());
	}
	,push: function(k,v,fi) {
		if(v == null) v = "";
		var fd = new mybox.boxes.FieldData(this.model,this.view);
		fd.init(k,v,fi,this.fieldDatas.push(fd) - 1,this);
		if(this.fieldDatas.length > 1) fd.display();
		return this;
	}
	,setup: function() {
		this.setupView();
		this.setupEvent();
	}
	,open: function() {
		var str = this.checkIfprimaryExists();
		if(str != "") this.g.alert(str,null,this.lang.alertTitle);
		apix.common.display.ElementExtender.show(this.get_elemsCtnr());
		apix.common.display.ElementExtender.show(this.get_pictoCtnr());
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"fontSize","1.3rem");
		this.isClosed = false;
	}
	,checkIfprimaryExists: function() {
		var str = "";
		var p = this.fields[0];
		if(p.isSecure || p.isHidden) {
			if(!p.isPrimary) str = this.lang.firstFieldIsSecure; else str = this.lang.primaryFieldIsSecure;
		} else if(!p.isPrimary) str = this.lang.primaryMissing;
		return str;
	}
	,close: function() {
		var _g = 0;
		var _g1 = this.fieldDatas;
		while(_g < _g1.length) {
			var fd = _g1[_g];
			++_g;
			if(fd.field.isHidden && fd.field.isSecure) fd.makeHidden();
		}
		apix.common.display.ElementExtender.hide(this.get_elemsCtnr());
		apix.common.display.ElementExtender.hide(this.get_pictoCtnr());
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"fontSize","1.05rem");
		this.isClosed = true;
	}
	,setupEvent: function() {
		if(!apix.common.display.ElementExtender.hasLst(this.get_bElem(),"click")) {
			apix.common.display.ElementExtender.on(this.get_bElem(),"click",$bind(this,this.onButtonClick));
			apix.common.display.ElementExtender.handCursor(this.get_labelElem(),true);
		}
		if(!apix.common.display.ElementExtender.hasLst(this.get_bUpdate(),"click")) apix.common.display.ElementExtender.on(this.get_bUpdate(),"click",$bind(this,this.onUpdateClick));
		if(!apix.common.display.ElementExtender.hasLst(this.get_bRemove(),"click")) apix.common.display.ElementExtender.on(this.get_bRemove(),"click",$bind(this,this.onRemoveClick));
	}
	,removeEvent: function() {
		if(apix.common.display.ElementExtender.hasLst(this.get_bElem(),"click")) {
			apix.common.display.ElementExtender.off(this.get_bElem(),"click",$bind(this,this.onButtonClick));
			apix.common.display.ElementExtender.handCursor(this.get_labelElem(),false);
		}
		if(apix.common.display.ElementExtender.hasLst(this.get_bUpdate(),"click")) apix.common.display.ElementExtender.off(this.get_bUpdate(),"click",$bind(this,this.onUpdateClick));
		if(apix.common.display.ElementExtender.hasLst(this.get_bRemove(),"click")) apix.common.display.ElementExtender.off(this.get_bRemove(),"click",$bind(this,this.onRemoveClick));
	}
	,setupView: function() {
		apix.common.display.ElementExtender.value(this.get_labelElem(),this.label);
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"backgroundColor",this.get_color());
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"opacity","1");
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"borderColor",this.get_color());
		apix.common.display.ElementExtender.hide(this.get_pictoCtnr());
		apix.common.display.ElementExtender.cssStyle(this.get_elemsCtnr(),"backgroundColor","white");
		apix.common.display.ElementExtender.cssStyle(this.get_elemsCtnr(),"width","" + (98 - this.getParent().get_level()) + "%");
		this.close();
	}
	,onButtonClick: function(e) {
		if(apix.common.display.ElementExtender.isDisplay(this.get_elemsCtnr())) this.close(); else this.open();
		this.getParent().selectAndDispatch();
	}
	,onUpdateClick: function(e) {
		var str = this.checkIfprimaryExists();
		if(str != "" && str != this.lang.primaryMissing) this.g.alert(str,null,this.lang.warningTitle); else {
			var sfg = mybox.boxes.SingleFormRecordMng.get(this.model,this.view,null,this);
			sfg.showRecordFrame(this.get_recUpdateTitleTxt());
		}
	}
	,onRemoveClick: function(e) {
		this.cb.show(Std.string(this.lang.deleteConfirm) + " " + this.get_path() + " ?",$bind(this,this.askDelete));
	}
	,askDelete: function(b,f) {
		if(b) {
			this.server.serverEvent.off();
			this.server.serverEvent.on($bind(this,this.onAnswerDelete));
			this.server.ask({ req : "deleteOneRecord", data : JSON.stringify({ id : this.model.get_currUserId(), recId : this.recId, formRecId : this.getParent().recId})});
		}
	}
	,onAnswerDelete: function(e) {
		this.cb.hide();
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else if(e.result.msg == "parentFormDoesntExist") this.g.alert(this.lang.parentFormDoesntExist); else if(e.result.msg == "elemDoesntExist") this.g.alert(this.lang.elemDoesntExist); else this.g.alert(this.lang.serverReadError + e.result.msg);
		} else if(answ == "deleteRecordOk") {
			this.view.showTipBox(this.lang.deleteOk,apix.common.display.ElementExtender.parent(this.getParent().get_bElem()),apix.common.display.ElementExtender.posx(this.get_bElem()),apix.common.display.ElementExtender.posy(this.get_bElem()),1);
			this.remove();
		} else this.g.alert(this.lang.serverFatalError);
	}
	,remove: function() {
		this.clear();
		if(this.elem == null) haxe.Log.trace("Erreur in Record.remove(). Instance : label=" + this.label + " recId=" + this.recId,{ fileName : "Record.hx", lineNumber : 203, className : "mybox.boxes.Record", methodName : "remove"}); else apix.common.display.ElementExtender["delete"](this.elem);
		this.getParent().removeFromList(this);
	}
	,__class__: mybox.boxes.Record
});
mybox.boxes.SelectField_ = function(m,v) {
	mybox.boxes.AbstractGuiField.call(this,m,v);
};
mybox.boxes.SelectField_.__name__ = ["mybox","boxes","SelectField_"];
mybox.boxes.SelectField_.__super__ = mybox.boxes.AbstractGuiField;
mybox.boxes.SelectField_.prototype = $extend(mybox.boxes.AbstractGuiField.prototype,{
	get_selectFieldDataHolderTxt: function() {
		if(this.isMultiple) return this.lang.selectFieldMulDataHolder; else return this.lang.selectFieldDataHolder;
	}
	,getValueToSave: function(e) {
		var v = "[";
		var coma = "";
		var _g = 0;
		var _g1 = apix.common.display.ElementExtender.getSelectedOptions(e);
		while(_g < _g1.length) {
			var so = _g1[_g];
			++_g;
			v += coma + so.value;
			coma = ",";
		}
		v += "]";
		return v;
	}
	,initSelectField: function(im,sl) {
		this.isMultiple = im;
		this.selectArray = JSON.parse(sl);
	}
	,displayInRecordFrame: function(elemsCtnr,placeHolder,valInit) {
		if(valInit == null) valInit = "";
		var el = apix.common.display.ElementExtender.clone(this.view.get_frameSelectFieldDataProto(),true);
		elemsCtnr.appendChild(el);
		apix.common.display.ElementExtender.show(el);
		apix.common.display.ElementExtender.setId(el,"recFrameField_" + this.index);
		var labEl = apix.common.display.ElementExtender.elemByClass(el,"apix_label");
		var valEl = apix.common.display.ElementExtender.elemByClass(el,"apix_value");
		if(valInit == "") valInit = "[-1]";
		var i = 0;
		var oEl;
		var o1El = null;
		if(valInit == "[-1]") {
			oEl = apix.common.display.ElementExtender.addOption(valEl);
			apix.common.display.ElementExtender.inner(oEl,this.get_selectFieldDataHolderTxt());
			apix.common.display.ElementExtender.value(oEl,"-1");
		}
		var _g = 0;
		var _g1 = this.selectArray;
		while(_g < _g1.length) {
			var sl = _g1[_g];
			++_g;
			oEl = apix.common.display.ElementExtender.addOption(valEl);
			apix.common.display.ElementExtender.value(oEl,"" + i);
			apix.common.display.ElementExtender.inner(oEl,sl);
			i++;
		}
		if(valInit != "[-1]") {
			oEl = apix.common.display.ElementExtender.addOption(valEl);
			apix.common.display.ElementExtender.inner(oEl,this.lang.selectFieldDataNone);
			apix.common.display.ElementExtender.value(oEl,"-1");
		}
		if(this.isMultiple) {
			apix.common.display.ElementExtender.multiple(valEl,true);
			var h = Math.min(this.selectArray.length + 1,5) * 20;
			apix.common.display.ElementExtender.height(valEl,Math.min(this.selectArray.length + 1,5) * 20);
		}
		var _g2 = 0;
		var _g11 = apix.common.display.ElementExtender.getOptions(valEl);
		while(_g2 < _g11.length) {
			var e = _g11[_g2];
			++_g2;
			apix.common.display.ElementExtender.selected(e,false);
		}
		var aov = apix.common.display.ElementExtender.getOptionsByValue(valEl,this.getArrayOfString(valInit));
		var _g3 = 0;
		while(_g3 < aov.length) {
			var ov = aov[_g3];
			++_g3;
			var oi = ov.index;
			apix.common.display.ElementExtender.selected(apix.common.display.ElementExtender.getOption(valEl,oi),true);
		}
		apix.common.display.ElementExtender.text(labEl,this.label);
		apix.common.display.ElementExtender.$name(valEl,this.get_dbColName());
		return { elem : el, labelElem : labEl, valueElem : valEl};
	}
	,dataToScreen: function() {
		mybox.boxes.AbstractGuiField.prototype.dataToScreen.call(this);
		apix.common.display.ElementExtender.selected(this.view.get_isMultipleInput(),this.isMultiple);
	}
	,screenToData: function() {
		var o = mybox.boxes.AbstractGuiField.prototype.screenToData.call(this);
		var osf = JSON.parse(o.data);
		osf.isMultiple = apix.common.display.ElementExtender.selected(this.view.get_isMultipleInput());
		osf.selectList = this.selectListEntry();
		this.selectArray = JSON.parse(this.selectListEntry());
		o.data = JSON.stringify(osf);
		return o;
	}
	,askUpdateSelectField: function() {
		var o = null;
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerInsertSelectField));
		this.popLineInSelectList();
		apix.common.display.ElementExtender.off(this.view.get_bAddSelectLine());
		o = { req : "updateSelectField", data : JSON.stringify({ id : this.model.get_currUserId(), formRecId : this.getParent().recId, recId : this.recId, isMultiple : this.isMultiple, selectList : this.get_selectList()})};
		this.server.ask(o);
	}
	,onAnswerInsertSelectField: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else if(e.result.msg == "parentFormDoesntExist") this.g.alert(this.lang.parentFormDoesntExist); else this.g.alert(this.lang.serverReadError + e.result.msg);
		} else if(answ != "updateSelectFieldOk") this.g.alert(this.lang.serverFatalError);
	}
	,__class__: mybox.boxes.SelectField_
});
mybox.boxes.SignField_ = function(m,v) {
	mybox.boxes.Field.call(this,m,v);
};
mybox.boxes.SignField_.__name__ = ["mybox","boxes","SignField_"];
mybox.boxes.SignField_.__super__ = mybox.boxes.Field;
mybox.boxes.SignField_.prototype = $extend(mybox.boxes.Field.prototype,{
	get_what: function() {
		return "Field";
	}
	,displayInRecordFrame: function(elemsCtnr,placeHolder,valInit) {
		if(valInit == null) valInit = "";
		apix.common.display.ElementExtender.setId(elemsCtnr,"fieldsCtnr_" + this.index);
		var sf = new apix.ui.input.SignField({ into : "#" + apix.common.display.ElementExtender.getId(elemsCtnr), base64UrlValue : valInit, label : this.label, border : true, thickness : 4, color : "#0000ff", width : "290px", height : "200px", required : this.required});
		this.uiCompo = sf;
		var el = sf.element;
		var labEl = sf.labelElement;
		var valEl = sf.get_inputElement();
		return { elem : el, labelElem : labEl, valueElem : valEl};
	}
	,getValueToSave: function(e) {
		var v = apix.common.display.ElementExtender.attrib(e,"src");
		if(HxOverrides.substr(v,0,10) != "data:image") v = "";
		return v;
	}
	,__class__: mybox.boxes.SignField_
});
mybox.boxes.SingleFormRecordMng = function(m,v) {
	mybox.boxes.AbstractBox.call(this,m,v);
};
mybox.boxes.SingleFormRecordMng.__name__ = ["mybox","boxes","SingleFormRecordMng"];
mybox.boxes.SingleFormRecordMng.get = function(m,v,fo,re) {
	if(mybox.boxes.SingleFormRecordMng._instance == null) mybox.boxes.SingleFormRecordMng._instance = new mybox.boxes.SingleFormRecordMng(m,v);
	mybox.boxes.SingleFormRecordMng._instance.form = fo;
	mybox.boxes.SingleFormRecordMng._instance.record = re;
	if(mybox.boxes.SingleFormRecordMng._instance.form != null) {
		mybox.boxes.SingleFormRecordMng._instance.record = null;
		mybox.boxes.SingleFormRecordMng._instance.forWhat = "insert";
		mybox.boxes.SingleFormRecordMng._instance.fields = mybox.boxes.SingleFormRecordMng._instance.form.fields;
		mybox.boxes.SingleFormRecordMng._instance.elem = mybox.boxes.SingleFormRecordMng._instance.form.elem;
	} else if(mybox.boxes.SingleFormRecordMng._instance.record != null) {
		mybox.boxes.SingleFormRecordMng._instance.forWhat = "update";
		mybox.boxes.SingleFormRecordMng._instance.fields = mybox.boxes.SingleFormRecordMng._instance.record.fields;
		mybox.boxes.SingleFormRecordMng._instance.elem = mybox.boxes.SingleFormRecordMng._instance.record.elem;
	} else haxe.Log.trace("f::Fatal error in SingleRecordFrame.get() : form and record are null !",{ fileName : "SingleFormRecordMng.hx", lineNumber : 96, className : "mybox.boxes.SingleFormRecordMng", methodName : "get"});
	return mybox.boxes.SingleFormRecordMng._instance;
};
mybox.boxes.SingleFormRecordMng.__super__ = mybox.boxes.AbstractBox;
mybox.boxes.SingleFormRecordMng.prototype = $extend(mybox.boxes.AbstractBox.prototype,{
	get_fieldDataHolder: function() {
		return this.lang.fieldDataHolder;
	}
	,get_recordFrameTitle: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_recordFrame .apix_title");
	}
	,get_recordFieldCtnr: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_recordFrame .apix_recordFieldCtnr");
	}
	,get_recordFrame: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_recordFrame");
	}
	,get_bValidRecordFrame: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_recordFrame .apix_validPicto");
	}
	,get_bCancelRecordFrame: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_recordFrame .apix_cancelPicto");
	}
	,get_jsonFieldDatas: function() {
		var o = new apix.common.util.Object({ fkList : [], fvList : [], ftList : []});
		if(this.forWhat == "update") {
			var _g = 0;
			var _g1 = this.record.fieldDatas;
			while(_g < _g1.length) {
				var fd = _g1[_g];
				++_g;
				if(fd.field.isSecure && !fd.isUpdated && fd.value == "") continue;
				o.fvList.push(fd.value);
				o.fkList.push(fd.key);
				if(fd.field.control == "SelectField" && fd.field.isMultiple) o.ftList.push(Std.string(fd.field.control) + "_m"); else if(fd.field.control == "NumberField") {
					var nf = fd.field;
					o.ftList.push(Std.string(fd.field.control) + this.g.strVal(nf.decimalNumber,"0"));
				} else o.ftList.push(fd.field.control);
			}
		} else {
			var _g2 = 0;
			var _g11 = this.fields;
			while(_g2 < _g11.length) {
				var fi = _g11[_g2];
				++_g2;
				o.fvList.push(fi.getValueToSave(this.recordFrameFieldElems[fi.index].valueElem));
				o.fkList.push(fi.get_dbColName());
				if(fi.control == "SelectField" && fi.isMultiple) o.ftList.push(Std.string(fi.control) + "_m"); else if(fi.control == "NumberField") {
					var nf1 = fi;
					o.ftList.push(Std.string(fi.control) + this.g.strVal(nf1.decimalNumber,"0"));
				} else o.ftList.push(fi.control);
			}
		}
		return JSON.stringify(o);
	}
	,showRecordFrame: function(frameTitle) {
		if(this.form != null) this.fields = this.form.fields; else if(this.record != null) this.fields = this.record.fields; else haxe.Log.trace("f::Error in SingleFormRecordMng.showRecordFrame()",{ fileName : "SingleFormRecordMng.hx", lineNumber : 102, className : "mybox.boxes.SingleFormRecordMng", methodName : "showRecordFrame"});
		var fdh = "";
		var fdv = "";
		apix.common.display.ElementExtender.text(this.get_recordFrameTitle(),frameTitle);
		apix.common.display.ElementExtender.removeChildren(this.get_recordFieldCtnr());
		this.recordFrameFieldElems = [];
		apix.common.display.ElementExtender.show(this.get_recordFrame());
		var _g = 0;
		var _g1 = this.fields;
		while(_g < _g1.length) {
			var fi = _g1[_g];
			++_g;
			fdh = this.get_fieldDataHolder();
			if(this.forWhat == "update") {
				var fd = this.record.fieldDatas[fi.index];
				if(fi.isSecure) fd.makeHidden();
				if(fi.isSecure && fd.value == "" && fd.length > 0) fdh = this.lang.securefieldDataHolder;
				fdv = fd.value;
			}
			this.recordFrameFieldElems.push(fi.displayInRecordFrame(this.get_recordFieldCtnr(),fdh,fdv));
		}
		apix.common.display.ElementExtender.css(this.get_recordFrame(),"height","" + apix.common.display.Common.get_body().scrollHeight * 2 + "px");
		this.setupRecordFrameEvent();
	}
	,hideRecordFrame: function() {
		apix.common.display.ElementExtender.css(this.get_recordFrame(),"height","100%");
		apix.common.display.ElementExtender.hide(this.get_recordFrame());
	}
	,setupRecordFrameEvent: function() {
		if(this.forWhat == "insert") this.onValidRecordFrame = $bind(this,this.onValidRecordFrameInsert); else this.onValidRecordFrame = $bind(this,this.onValidRecordFrameUpdate);
		apix.common.display.ElementExtender.off(this.get_bCancelRecordFrame(),"click");
		apix.common.display.ElementExtender.off(this.get_bValidRecordFrame(),"click");
		apix.common.display.ElementExtender.on(this.get_bCancelRecordFrame(),"click",$bind(this,this.onCancelRecordFrame));
		apix.common.display.ElementExtender.on(this.get_bValidRecordFrame(),"click",this.onValidRecordFrame);
		apix.common.display.ElementExtender.joinEnterKeyToClick(this.get_bValidRecordFrame(),null,this.recordFrameFieldElems[0].valueElem);
		this.setupFieldsEvent();
	}
	,removeRecordFrameEvent: function() {
		if(apix.common.display.ElementExtender.hasLst(this.get_bCancelRecordFrame(),"click")) apix.common.display.ElementExtender.off(this.get_bCancelRecordFrame(),"click",$bind(this,this.onCancelRecordFrame));
		if(apix.common.display.ElementExtender.hasLst(this.get_bValidRecordFrame(),"click")) apix.common.display.ElementExtender.off(this.get_bValidRecordFrame(),"click",this.onValidRecordFrame);
		apix.common.display.ElementExtender.clearEnterKeyToClick(this.get_bValidRecordFrame());
		this.removeFieldsEvent();
	}
	,setupFieldsEvent: function() {
		var _g = 0;
		var _g1 = this.fields;
		while(_g < _g1.length) {
			var fi = _g1[_g];
			++_g;
			var el = this.recordFrameFieldElems[fi.index].valueElem;
			if(fi.get_isMultiLines()) {
				apix.common.display.ElementExtender.on(el,"focus",$bind(this,this.onTextAreaFocus));
				apix.common.display.ElementExtender.on(el,"blur",$bind(this,this.onTextAreaBlur));
			}
			if(this.forWhat == "update" && fi.isSecure && apix.common.display.ElementExtender.value(el) == "" && this.record.fieldDatas[fi.index].length > 0) {
				if(fi.control == "EmailField") {
					apix.common.display.ElementExtender.on((js.Boot.__cast(fi , mybox.boxes.EmailField_)).emailIdElement,"focus",$bind(this,this.onSecureFieldFocus),false,{ index : fi.index});
					apix.common.display.ElementExtender.on((js.Boot.__cast(fi , mybox.boxes.EmailField_)).domainElement,"focus",$bind(this,this.onSecureFieldFocus),false,{ index : fi.index});
				} else apix.common.display.ElementExtender.on(el,"focus",$bind(this,this.onSecureFieldFocus),false,{ index : fi.index});
			}
		}
	}
	,removeFieldsEvent: function() {
		var _g = 0;
		var _g1 = this.fields;
		while(_g < _g1.length) {
			var fi = _g1[_g];
			++_g;
			var el = this.recordFrameFieldElems[fi.index].valueElem;
			if(fi.get_isMultiLines() || fi.isSecure) {
				if(el != null && apix.common.display.ElementExtender.hasLst(el)) apix.common.display.ElementExtender.off(el);
			}
			if(fi.control == "EmailField") {
				var eie = (js.Boot.__cast(fi , mybox.boxes.EmailField_)).emailIdElement;
				if(apix.common.display.ElementExtender.hasLst(eie)) apix.common.display.ElementExtender.off(eie);
				var de = (js.Boot.__cast(fi , mybox.boxes.EmailField_)).domainElement;
				if(apix.common.display.ElementExtender.hasLst(de)) apix.common.display.ElementExtender.off(de);
			}
			if(fi.uiCompo != null) {
				fi.uiCompo.remove();
				fi.uiCompo = null;
			}
		}
	}
	,onTextAreaFocus: function(e,p) {
		if(this.get_bValidRecordFrame() != null) apix.common.display.ElementExtender.clearEnterKeyToClick(this.get_bValidRecordFrame());
	}
	,onTextAreaBlur: function(e,p) {
		if(this.get_bValidRecordFrame() != null) apix.common.display.ElementExtender.joinEnterKeyToClick(this.get_bValidRecordFrame());
	}
	,onSecureFieldFocus: function(e,d) {
		var fd = this.record.fieldDatas[d.index];
		fd.secureFieldRead.on($bind(this,this.onSecureFieldRead),d);
		fd.enterSecureCode("forRecordUpdate");
	}
	,onSecureFieldRead: function(e) {
		var fd = e.target;
		var fi = fd.field;
		fd.secureFieldRead.off($bind(this,this.onSecureFieldRead));
		var el = this.recordFrameFieldElems[e.data.index].valueElem;
		if(fi.control == "EmailField") {
			apix.common.display.ElementExtender.off((js.Boot.__cast(fi , mybox.boxes.EmailField_)).emailIdElement,"focus",$bind(this,this.onSecureFieldFocus));
			apix.common.display.ElementExtender.off((js.Boot.__cast(fi , mybox.boxes.EmailField_)).domainElement,"focus",$bind(this,this.onSecureFieldFocus));
			(js.Boot.__cast(fi , mybox.boxes.EmailField_)).showValue(e.value);
		} else apix.common.display.ElementExtender.off(el,"focus",$bind(this,this.onSecureFieldFocus));
		apix.common.display.ElementExtender.value(el,e.value);
		apix.common.display.ElementExtender.placeHolder(el,this.get_fieldDataHolder() + " " + fd.field.label);
	}
	,onCancelRecordFrame: function(e) {
		this.removeRecordFrameEvent();
		this.hideRecordFrame();
	}
	,checkEmpties: function() {
		var str = "";
		var coma = "<br/>";
		var _g1 = 0;
		var _g = this.fields.length;
		while(_g1 < _g) {
			var i = _g1++;
			var fi = this.fields[i];
			if(fi.uiCompo == null && fi.required && fi.getDisplayValue(this.g.strVal(fi.getValueToSave(this.recordFrameFieldElems[i].valueElem),"")) == "" && (this.forWhat == "insert" || !fi.isSecure || this.record.fieldDatas[i].isUpdated)) {
				str += coma + fi.label;
				coma = ",<br/>";
			}
		}
		var str2 = apix.ui.UICompo.getEmpties();
		if(str != "" && str2 == "") str = Std.string(apix.ui.UICompoLoader.langObject.emptyError) + str; else {
			str2 += str;
			str = str2;
		}
		return str;
	}
	,onValidRecordFrameInsert: function(e) {
		var str = this.checkEmpties();
		if(str != "") apix.common.util.Global.get().alert(str,null,null); else this.askRecordInsert();
	}
	,onValidRecordFrameUpdate: function(e) {
		var str = this.checkEmpties();
		if(str != "") apix.common.util.Global.get().alert(str,null,null); else {
			var fd;
			var b;
			var _g = 0;
			var _g1 = this.record.fieldDatas;
			while(_g < _g1.length) {
				var fd1 = _g1[_g];
				++_g;
				if(!fd1.field.isSecure) {
					fd1.value = fd1.field.getValueToSave(this.recordFrameFieldElems[fd1.index].valueElem);
					if(fd1.field.control == "LinkField") fd1.length = (js.Boot.__cast(fd1.field , mybox.boxes.LinkField_)).getLinkText(fd1.value).length; else fd1.length = fd1.field.getDisplayValue(fd1.value).length;
				} else if(fd1.isUpdated || apix.common.display.ElementExtender.value(this.recordFrameFieldElems[fd1.index].valueElem) != "") {
					fd1.value = apix.common.display.ElementExtender.value(this.recordFrameFieldElems[fd1.index].valueElem);
					fd1.length = fd1.value.length;
				}
			}
			this.askRecordUpdate();
			var _g2 = 0;
			var _g11 = this.record.fieldDatas;
			while(_g2 < _g11.length) {
				var fd2 = _g11[_g2];
				++_g2;
				b = fd2.field.isPrimary || this.record.checkIfprimaryExists() != "" && fd2.field.index == 0;
				if(b) {
					this.record.label = fd2.value;
					apix.common.display.ElementExtender.value(this.get_labelElem(),this.record.label);
				} else fd2.setup();
			}
		}
	}
	,askRecordInsert: function() {
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerRecordInsert));
		this.server.ask({ req : "insertOneRecord", data : JSON.stringify({ id : this.model.get_currUserId(), formRecId : this.form.recId, fieldsKeyValue : this.get_jsonFieldDatas()})});
	}
	,askRecordUpdate: function() {
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerRecordUpdate));
		this.server.ask({ req : "updateOneRecord", data : JSON.stringify({ id : this.model.get_currUserId(), recId : this.record.recId, formRecId : this.record.getParent().recId, fieldsKeyValue : this.get_jsonFieldDatas()})});
	}
	,onAnswerRecordInsert: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else if(e.result.msg == "parentFormDoesntExist") this.g.alert(this.lang.parentFormDoesntExist); else this.g.alert(this.lang.serverReadError + e.result.msg + e.result.qry);
		} else if(answ == "insertRecordOk") {
			apix.ui.UICompo.removeAllRequired();
			this.removeRecordFrameEvent();
			this.hideRecordFrame();
			this.view.showTipBox(this.lang.insertOk,apix.common.display.ElementExtender.parent(this.get_bElem()),apix.common.display.ElementExtender.posx(this.get_bElem()),apix.common.display.ElementExtender.posy(this.get_bElem()),2);
			this.form.createOneRecord(this.g.intVal(e.result.recId,-1),this.recordFrameFieldElems);
			var el = this.get_bElem();
			this.view.showTipBox(this.lang.createOk,apix.common.display.ElementExtender.parent(el),apix.common.display.ElementExtender.posx(el),apix.common.display.ElementExtender.posy(el),1);
		} else this.g.alert(this.lang.serverFatalError);
	}
	,onAnswerRecordUpdate: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else if(e.result.msg == "parentFormDoesntExist") this.g.alert(this.lang.parentFormDoesntExist); else this.g.alert(this.lang.serverReadError + e.result.msg);
		} else if(answ == "updateRecordOk") {
			apix.ui.UICompo.removeAllRequired();
			this.removeRecordFrameEvent();
			this.hideRecordFrame();
			var _g = 0;
			var _g1 = this.record.fieldDatas;
			while(_g < _g1.length) {
				var fd = _g1[_g];
				++_g;
				if(fd.field.isSecure) {
					fd.makeHidden();
					fd.isUpdated = false;
				}
			}
			this.view.showTipBox(this.lang.updateOk,apix.common.display.ElementExtender.parent(this.get_bElem()),apix.common.display.ElementExtender.posx(this.get_bElem()),apix.common.display.ElementExtender.posy(this.get_bElem()),2);
		} else this.g.alert(this.lang.serverFatalError);
	}
	,__class__: mybox.boxes.SingleFormRecordMng
});
mybox.boxes.Slider_ = function(m,v) {
	mybox.boxes.Field.call(this,m,v);
};
mybox.boxes.Slider_.__name__ = ["mybox","boxes","Slider_"];
mybox.boxes.Slider_.__super__ = mybox.boxes.Field;
mybox.boxes.Slider_.prototype = $extend(mybox.boxes.Field.prototype,{
	get_what: function() {
		return "Field";
	}
	,initSlider: function(minVal,maxVal,dn) {
		this.minValue = minVal;
		this.maxValue = maxVal;
		this.decimalNumber = dn;
	}
	,getDisplayValue: function(v) {
		var arr = JSON.parse(this.checkAndRepare(v));
		if(arr.length > 0) v = this.g.strVal(arr[0]); else v = "";
		return v;
	}
	,getValueToSave: function(e) {
		return "[" + apix.common.display.ElementExtender.value(e) + "]";
	}
	,checkAndRepare: function(v) {
		if(v == "") v = "[]";
		var arr;
		try {
			arr = JSON.parse(v);
		} catch( e ) {
			if(v.length > 1) {
				if(HxOverrides.substr(v,0,null) != "[") v = "[" + v;
				if(HxOverrides.substr(v,v.length - 1,null) != "]") v = v += "]";
			} else v = "[]";
		}
		try {
			arr = JSON.parse(v);
		} catch( e1 ) {
			v = "[]";
		}
		return v;
	}
	,displayInRecordFrame: function(elemsCtnr,placeHolder,valInit) {
		if(valInit == null) valInit = "";
		apix.common.display.ElementExtender.setId(elemsCtnr,"fieldsCtnr_" + this.index);
		new apix.ui.HLine("#" + apix.common.display.ElementExtender.getId(elemsCtnr));
		var sl = new apix.ui.slider.Slider({ into : "#" + apix.common.display.ElementExtender.getId(elemsCtnr), label : this.label, auto : false, start : apix.common.display.ElementExtender.numVal(this,this.minValue), end : this.maxValue, inputValue : valInit, decimal : this.decimalNumber, required : this.required});
		this.uiCompo = sl;
		sl.enable();
		var el = sl.element;
		var labEl = sl.labelElement;
		var valEl = sl.lastSelector.inputElem;
		return { elem : el, labelElem : labEl, valueElem : valEl};
	}
	,askUpdateSlider: function() {
		var o = null;
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerInsertSlider));
		o = { req : "updateSlider", data : JSON.stringify({ id : this.model.get_currUserId(), formRecId : this.getParent().recId, recId : this.recId, minValue : this.minValue, maxValue : this.maxValue, decimalNumber : this.decimalNumber})};
		this.server.ask(o);
	}
	,dataToScreen: function() {
		mybox.boxes.Field.prototype.dataToScreen.call(this);
		apix.common.display.ElementExtender.value(this.view.get_decimalNumberInput(),"" + this.decimalNumber);
		apix.common.display.ElementExtender.value(this.view.get_minValueInput(),this.g.strVal(this.minValue));
		apix.common.display.ElementExtender.value(this.view.get_maxValueInput(),this.g.strVal(this.maxValue));
	}
	,screenToData: function() {
		var o = mybox.boxes.Field.prototype.screenToData.call(this);
		var osf = JSON.parse(o.data);
		osf.minValue = this.g.numVal(apix.common.display.ElementExtender.value(this.view.get_minValueInput()),1);
		this.minValue = osf.minValue;
		osf.maxValue = this.g.numVal(apix.common.display.ElementExtender.value(this.view.get_maxValueInput()),999);
		this.maxValue = osf.maxValue;
		osf.decimalNumber = this.g.intVal(apix.common.display.ElementExtender.value(this.view.get_decimalNumberInput()),2);
		this.decimalNumber = osf.decimalNumber;
		o.data = JSON.stringify(osf);
		return o;
	}
	,onAnswerInsertSlider: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else if(e.result.msg == "parentFormDoesntExist") this.g.alert(this.lang.parentFormDoesntExist); else this.g.alert(this.lang.serverReadError + e.result.msg);
		} else if(answ != "updateSliderOk") this.g.alert(this.lang.serverFatalError);
	}
	,__class__: mybox.boxes.Slider_
});
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.ProcessingInstruction = "processingInstruction";
Xml.Document = "document";
apix.common.display.Common.__nextSingleId = -1;
apix.common.display.ElementExtender.dragArray = [];
apix.common.event.StandardEvent.g = apix.common.util.Global.get();
apix.common.event.StandardEvent.msPointer = window.navigator.msPointerEnabled;
apix.common.event.StandardEvent.MOUSE_DOWN = apix.common.event.StandardEvent.msPointer?"MSPointerDown":apix.common.event.StandardEvent.g.get_isMobile()?"touchstart":"mousedown";
apix.common.event.StandardEvent.MOUSE_MOVE = apix.common.event.StandardEvent.msPointer?"MSPointerMove":apix.common.event.StandardEvent.g.get_isMobile()?"touchmove":"mousemove";
apix.common.event.StandardEvent.MOUSE_OUT = apix.common.event.StandardEvent.msPointer?"MSPointerOut":apix.common.event.StandardEvent.g.get_isMobile()?"touchend":"mouseout";
apix.common.event.StandardEvent.MOUSE_OVER = apix.common.event.StandardEvent.msPointer?"MSPointerOver":apix.common.event.StandardEvent.g.get_isMobile()?"touchstart":"mouseover";
apix.common.event.StandardEvent.MOUSE_UP = apix.common.event.StandardEvent.msPointer?"MSPointerUp":apix.common.event.StandardEvent.g.get_isMobile()?"touchend":"mouseup";
apix.ui.UICompo.inputStk = [];
apix.ui.UICompo.requiredStk = [];
apix.ui.UICompoLoader.baseUrl = "";
apix.ui.UICompoLoader.__stk = new Array();
apix.ui.input.DatePickerLoader.__compoSkinList = new Array();
apix.ui.input.EmailFieldLoader.__compoSkinList = new Array();
apix.ui.input.GeoFieldLoader.__compoSkinList = new Array();
apix.ui.input.InputFieldLoader.__compoSkinList = new Array();
apix.ui.input.LinkFieldLoader.__compoSkinList = new Array();
apix.ui.input.PhotoField.MAX = Math.round(Math.POSITIVE_INFINITY);
apix.ui.input.PhotoFieldLoader.__compoSkinList = new Array();
apix.ui.input.PhotoFieldLoader._nextSingleName = -1;
apix.ui.input.SignFieldLoader.__compoSkinList = new Array();
apix.ui.slider.SliderLoader.__compoSkinList = new Array();
apix.ui.tools.Spinner.TEXT_DEFAULT = "";
haxe.xml.Parser.escapes = (function($this) {
	var $r;
	var h = new haxe.ds.StringMap();
	h.set("lt","<");
	h.set("gt",">");
	h.set("amp","&");
	h.set("quot","\"");
	h.set("apos","'");
	h.set("nbsp",String.fromCharCode(160));
	$r = h;
	return $r;
}(this));
Main.main();
})();
