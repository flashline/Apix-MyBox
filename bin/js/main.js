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
	apix.common.event.EventTargetExtender.on(window,"load",$bind(this,this.chooseLanguage));
};
Main.__name__ = ["Main"];
Main.main = function() {
	Main.g = apix.common.util.Global.get();
	Main.g.setupTrace();
	new Main();
};
Main.prototype = {
	chooseLanguage: function() {
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
	}
	,readLanguage: function() {
		var ll = new apix.common.io.JsonLoader();
		ll.read.on($bind(this,this.readParam));
		ll.load(cst.BASE_URL + cst.LANGUAGE_PATH + this.lg + cst.LANGUAGE_FILE);
	}
	,readParam: function(e) {
		e.target.read.off($bind(this,this.readParam));
		this.lang = e.tree;
		var ll = new apix.common.io.JsonLoader();
		ll.read.on($bind(this,this.start));
		ll.load(cst.BASE_URL + cst.MODEL_SRC);
	}
	,start: function(e) {
		e.target.read.off($bind(this,this.start));
		this.param = e.tree;
		new safebox.SafeBox(cst.BASE_URL,cst.SERVER_URL,this.lang,this.param,this.firstLaunch);
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
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
};
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
	apix.common.display.ElementExtender.inner(this.titleElem,tTx);
	apix.common.display.ElementExtender.inner(this.validElem,vTx);
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
		if(this.callBack != null) {
			this.callBack();
			this.callBack = null;
		}
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
		if(titleLabel != null) apix.common.display.ElementExtender.inner(this.titleElem,titleLabel);
		if(validLabel != null) apix.common.display.ElementExtender.inner(this.validElem,validLabel);
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
	if(window.document.getElementById(id) != null) haxe.Log.trace("f::Id " + id + " already exists ! ",{ fileName : "Common.hx", lineNumber : 240, className : "apix.common.display.Common", methodName : "get_newSingleId"});
	return id;
};
apix.common.display.Confirm = function(el,txElem,bvElem,bcElem,tEl,tTx,vTx,cTx) {
	if(cTx == null) cTx = "No";
	if(vTx == null) vTx = "Yes";
	if(tTx == null) tTx = "Confirm ?";
	this.cancelElem = bcElem;
	apix.common.display.ElementExtender.inner(this.cancelElem,cTx);
	apix.common.display.Alert.call(this,el,txElem,bvElem,tEl,tTx,vTx);
	apix.common.display.Confirm._instance = this;
};
apix.common.display.Confirm.__name__ = ["apix","common","display","Confirm"];
apix.common.display.Confirm.get = function() {
	if(apix.common.display.Confirm._instance == null) haxe.Log.trace("f:: new Confirm() not executed !",{ fileName : "Confirm.hx", lineNumber : 33, className : "apix.common.display.Confirm", methodName : "get"});
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
		if(titleLabel != null) apix.common.display.ElementExtender.inner(this.titleElem,titleLabel);
		if(validLabel != null) apix.common.display.ElementExtender.inner(this.validElem,validLabel);
		if(cancelLabel != null) apix.common.display.ElementExtender.inner(this.cancelElem,cancelLabel);
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
apix.common.display.ElementExtender.getElemsByClass = function(el,v) {
	return el.getElementsByClassName(v);
};
apix.common.display.ElementExtender.getElemsByTag = function(el,v) {
	return el.getElementsByTagName(v);
};
apix.common.display.ElementExtender.elemByClass = function(el,v) {
	var arr = apix.common.display.ElementExtender.getElemsByClass(el,v);
	if(arr.length == 0) haxe.Log.trace("f:: class '" + v + "' doesn't exist in element with id '" + el.id + "'",{ fileName : "ElementExtender.hx", lineNumber : 200, className : "apix.common.display.ElementExtender", methodName : "elemByClass"});
	return arr[0];
};
apix.common.display.ElementExtender.elemByTag = function(el,v) {
	var arr = apix.common.display.ElementExtender.getElemsByTag(el,v);
	if(arr.length == 0) haxe.Log.trace("f:: tag '" + v + "' doesn't exist in element with id '" + el.id + "'",{ fileName : "ElementExtender.hx", lineNumber : 205, className : "apix.common.display.ElementExtender", methodName : "elemByTag"});
	return arr[0];
};
apix.common.display.ElementExtender.objClsName = function(el) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 240, className : "apix.common.display.ElementExtender", methodName : "objClsName"});
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
apix.common.display.ElementExtender.removeChildren = function(el) {
	if(el.hasChildNodes()) while(el.childNodes.length > 0) el.removeChild(el.firstChild);
};
apix.common.display.ElementExtender["delete"] = function(el) {
	if(el.parentNode != null) {
		el.parentNode.removeChild(el);
		return true;
	} else return false;
};
apix.common.display.ElementExtender.clone = function(el,b) {
	if(b == null) b = true;
	var e = el.cloneNode(b);
	return e;
};
apix.common.display.ElementExtender.handCursor = function(el,v) {
	if(v == null) v = true;
	var str;
	if(v) str = "pointer"; else str = "auto";
	if(el.style != null && el.style.cursor != null) el.style.cursor = str;
};
apix.common.display.ElementExtender.visible = function(el,b) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 391, className : "apix.common.display.ElementExtender", methodName : "visible"});
	if(b == null) {
		if(el.style.visibility == "hidden") b = false; else b = true;
		if(b == null) haxe.Log.trace("f::Element " + el.id + " has not valid visibility !",{ fileName : "ElementExtender.hx", lineNumber : 394, className : "apix.common.display.ElementExtender", methodName : "visible"});
	} else {
		b = apix.common.display.ElementExtender.boolVal(b);
		if(b) el.style.visibility = "visible"; else el.style.visibility = "hidden";
	}
	return b;
};
apix.common.display.ElementExtender.hide = function(el) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 406, className : "apix.common.display.ElementExtender", methodName : "hide"});
	var before = el.style.display;
	if(before != "none" && before != "" && before != null) {
		if (el.style.apix_save_display==null) el.style.apix_save_display=before;
	} else before = null;
	el.style.display = "none";
	return before;
};
apix.common.display.ElementExtender.show = function(el,v) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 416, className : "apix.common.display.ElementExtender", methodName : "show"});
	if(!(!(apix.common.util.Global.get().strVal(el.style.display,"none") == "none"))) {
		if(v == null) {
			v=el.style.apix_save_display;
		}
		if(v == null) v = "block";
		el.style.display = v;
	}
};
apix.common.display.ElementExtender.isDisplay = function(el) {
	return !(apix.common.util.Global.get().strVal(el.style.display,"none") == "none");
};
apix.common.display.ElementExtender.setDisplay = function(el,v) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 431, className : "apix.common.display.ElementExtender", methodName : "setDisplay"});
	el.style.display = v;
};
apix.common.display.ElementExtender.pick = function(el) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 435, className : "apix.common.display.ElementExtender", methodName : "pick"});
	if(!apix.common.display.ElementExtender.isInputField(el)) haxe.Log.trace("f::Element isn't an input field !",{ fileName : "ElementExtender.hx", lineNumber : 436, className : "apix.common.display.ElementExtender", methodName : "pick"});
	el.select();
};
apix.common.display.ElementExtender.isInputField = function(el) {
	return apix.common.display.ElementExtender.objClsName(el) == "HTMLTextAreaElement" || apix.common.display.ElementExtender.objClsName(el) == "HTMLInputElement" || js.Boot.__instanceof(el,HTMLInputElement) || js.Boot.__instanceof(el,HTMLTextAreaElement);
};
apix.common.display.ElementExtender.posx = function(el,v,bounds) {
	var vx = apix.common.display.ElementExtender.numVal(v,null);
	if(vx == null) {
		if(el.offsetLeft != null) vx = el.offsetLeft; else if(el.clientLeft != null) vx = el.clientLeft; else if(el.scrollLeft != null) vx = el.scrollLeft; else vx = apix.common.display.ElementExtender.numVal(Std.parseFloat(el.style.left),null);
		if(vx == null) haxe.Log.trace("f::Element " + el.id + " has not valid left position !",{ fileName : "ElementExtender.hx", lineNumber : 516, className : "apix.common.display.ElementExtender", methodName : "posx"});
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
		if(vy == null) haxe.Log.trace("f::Element " + el.id + " has not valid top position !",{ fileName : "ElementExtender.hx", lineNumber : 537, className : "apix.common.display.ElementExtender", methodName : "posy"});
	} else {
		if(bounds != null) {
			if(vy < bounds.get_y()) vy = bounds.get_y(); else if(vy > bounds.get_y() + bounds.get_height()) vy = bounds.get_y() + bounds.get_height();
		}
		el.style.top = (vy == null?"null":"" + vy) + "px";
	}
	return vy;
};
apix.common.display.ElementExtender.width = function(el,v) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 552, className : "apix.common.display.ElementExtender", methodName : "width"});
	var w = apix.common.display.ElementExtender.numVal(v,null);
	if(w == null) {
		if(el.clientWidth != null) w = el.clientWidth; else w = apix.common.display.ElementExtender.numVal(Std.parseFloat(el.style.width),null);
		if(w == null) {
			if(el.offsetWidth != null) w = el.offsetWidth; else if(el.scrollWidth != null) w = el.scrollWidth;
		}
		if(w == null) haxe.Log.trace("f::Element " + el.id + " has not valid width !",{ fileName : "ElementExtender.hx", lineNumber : 561, className : "apix.common.display.ElementExtender", methodName : "width"});
	} else el.style.width = (w == null?"null":"" + w) + "px";
	return w;
};
apix.common.display.ElementExtender.height = function(el,v,forceCss) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 570, className : "apix.common.display.ElementExtender", methodName : "height"});
	var h = apix.common.display.ElementExtender.numVal(v,null);
	if(h == null) {
		if(el.clientHeight != null && (!forceCss || el.clientHeight != 0)) h = el.clientHeight; else h = apix.common.display.ElementExtender.numVal(Std.parseFloat(el.style.height),null);
		if(h == null) {
			if(el.offsetHeight != null) h = el.offsetHeight; else if(el.scrollHeight != null) h = el.scrollHeight;
		}
		if(h == null) haxe.Log.trace("f::Element " + el.id + " has not valid height !",{ fileName : "ElementExtender.hx", lineNumber : 579, className : "apix.common.display.ElementExtender", methodName : "height"});
	} else el.style.height = (h == null?"null":"" + h) + "px";
	return h;
};
apix.common.display.ElementExtender.parent = function(el) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 588, className : "apix.common.display.ElementExtender", methodName : "parent"});
	return el.parentElement;
};
apix.common.display.ElementExtender.link = function(el,v,verify) {
	if(verify == null) verify = false;
	return apix.common.display.ElementExtender.attr(el,"href",v,verify);
};
apix.common.display.ElementExtender.attr = function(el,k,v,verify) {
	if(verify == null) verify = false;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 601, className : "apix.common.display.ElementExtender", methodName : "attr"});
	if(verify && el.getAttribute(k) == null && el[k]==null) haxe.Log.trace("f::Element " + el.id + " has not '" + k + "' attribute !",{ fileName : "ElementExtender.hx", lineNumber : 602, className : "apix.common.display.ElementExtender", methodName : "attr"});
	if(v == null) v = el.getAttribute(k); else el.setAttribute(k,v);
	return v;
};
apix.common.display.ElementExtender.css = function(el,k,v) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 631, className : "apix.common.display.ElementExtender", methodName : "css"});
	if(el.style[k]==null) haxe.Log.trace("f::Element " + el.id + " hasn't '" + k + "' style property !",{ fileName : "ElementExtender.hx", lineNumber : 632, className : "apix.common.display.ElementExtender", methodName : "css"});
	if(v == null) v = el.style[k]; else {
		el.style[k]=v;
	}
	return v;
};
apix.common.display.ElementExtender.cssStyle = function(el,k,v) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 639, className : "apix.common.display.ElementExtender", methodName : "cssStyle"});
	if(el.style[k]==null) haxe.Log.trace("f::Element " + el.id + " hasn't '" + Std.string(k) + "' style property !",{ fileName : "ElementExtender.hx", lineNumber : 640, className : "apix.common.display.ElementExtender", methodName : "cssStyle"});
	if(v == null) v = el.style[k]; else {
		el.style[k]=v;
	}
	return v;
};
apix.common.display.ElementExtender.enable = function(el,v,useDisabled) {
	if(useDisabled == null) useDisabled = false;
	var e = el;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 648, className : "apix.common.display.ElementExtender", methodName : "enable"});
	if(v == null) {
		if(useDisabled) v = !e.disabled; else v = !e.readOnly;
	} else if(useDisabled) e.disabled = !v; else e.readOnly = !v;
	return v;
};
apix.common.display.ElementExtender.selected = function(e,v) {
	var el = e;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 727, className : "apix.common.display.ElementExtender", methodName : "selected"});
	var prop1 = "selected";
	var prop2 = "checked";
	var prop = "selected or checked";
	if(el[prop1]==null && el[prop2]==null ) haxe.Log.trace("f::Element " + Std.string(el.id) + " has not '" + prop + "' properties !",{ fileName : "ElementExtender.hx", lineNumber : 729, className : "apix.common.display.ElementExtender", methodName : "selected"});
	var b = el[prop1]==null;
	if(v == null) {
		if(b) v = el.checked; else v = el.selected;
	} else if(b) el.checked = v; else el.selected = v;
	return v;
};
apix.common.display.ElementExtender.value = function(e,v) {
	var el = e;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 747, className : "apix.common.display.ElementExtender", methodName : "value"});
	var prop = "value";
	if(el[prop]==null) haxe.Log.trace("f::Element " + Std.string(el.id) + " has not '" + prop + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 748, className : "apix.common.display.ElementExtender", methodName : "value"});
	if(v == null) v = el.value; else el.value = v;
	return v;
};
apix.common.display.ElementExtender.$name = function(e,v) {
	var el = e;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 758, className : "apix.common.display.ElementExtender", methodName : "name"});
	var p = "name";
	if(el[p]==null) haxe.Log.trace("f::Element " + Std.string(el.id) + " hasn't '" + p + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 759, className : "apix.common.display.ElementExtender", methodName : "name"});
	if(v == null) v = el.name; else el.name = v;
	return v;
};
apix.common.display.ElementExtender.tip = function(e,v) {
	return apix.common.display.ElementExtender.attr(e,"title",v);
};
apix.common.display.ElementExtender.inner = function(el,v) {
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 774, className : "apix.common.display.ElementExtender", methodName : "inner"});
	if(v == null) v = el.innerHTML; else el.innerHTML = v;
	return v;
};
apix.common.display.ElementExtender.text = function(e,v) {
	var el = e;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 789, className : "apix.common.display.ElementExtender", methodName : "text"});
	if(v == null) {
		if(el.value != null) v = el.value; else if(el.textContent != null) v = el.textContent; else if(el.text != null) v = el.text; else if(el.nodeValue != null) v = el.nodeValue; else if(el.innerHTML != null) v = el.innerHTML; else haxe.Log.trace("f::Element " + Std.string(el.id) + " has not text, nor inner property !",{ fileName : "ElementExtender.hx", lineNumber : 796, className : "apix.common.display.ElementExtender", methodName : "text"});
	} else if(el.value != null) el.value = v; else if(el.textContent != null) el.textContent = v; else if(el.text != null) el.text = v; else if(el.nodeValue != null) el.nodeValue = v; else if(el.innerHTML != null) el.innerHTML = v; else haxe.Log.trace("f::Element " + Std.string(el.id) + " has not text, nor inner property !",{ fileName : "ElementExtender.hx", lineNumber : 804, className : "apix.common.display.ElementExtender", methodName : "text"});
	return v;
};
apix.common.display.ElementExtender.placeHolder = function(e,v) {
	var el = e;
	if(el == null) haxe.Log.trace("f::Element is null !",{ fileName : "ElementExtender.hx", lineNumber : 841, className : "apix.common.display.ElementExtender", methodName : "placeHolder"});
	var p = "placeholder";
	if(el[p]==null) haxe.Log.trace("f::Element " + Std.string(el.id) + " hasn't '" + p + "' property !",{ fileName : "ElementExtender.hx", lineNumber : 842, className : "apix.common.display.ElementExtender", methodName : "placeHolder"});
	if(v == null) v = el.placeholder; else el.placeholder = v;
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
apix.common.util = {};
apix.common.util.Global = function() {
};
apix.common.util.Global.__name__ = ["apix","common","util","Global"];
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
		if(s == null) return defVal;
		if(s == "") return defVal;
		return Std.string(s);
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
	,get_isTablet: function() {
		return apix.common.display.Common.get_availHeight() >= 800 && this.get_isMobile();
	}
	,get_isMobile: function() {
		return new EReg("iPhone|ipad|iPod|Android|opera mini|blackberry|palm os|palm|hiptop|avantgo|plucker|xiino|blazer|elaine|iris|3g_t|opera mobi|windows phone|iemobile|mobile".toLowerCase(),"i").match(apix.common.display.Common.get_userAgent().toLowerCase());
	}
	,get_isFirefox: function() {
		return new EReg("firefox".toLowerCase(),"i").match(apix.common.display.Common.get_userAgent().toLowerCase());
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
apix.common.event.timing = {};
apix.common.event.timing.Delay = function(f,per) {
	if(per == null) per = 0.04;
	this.listener = f;
	this.timer = haxe.Timer.delay($bind(this,this.clockRun),Math.round(per * 1000));
};
apix.common.event.timing.Delay.__name__ = ["apix","common","event","timing","Delay"];
apix.common.event.timing.Delay.prototype = {
	clockRun: function() {
		this.timer.stop();
		this.listener(this);
	}
	,__class__: apix.common.event.timing.Delay
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
		params.set(decodeURIComponent(name.split("+").join(" ")),StringTools.urlDecode(pl.join("=")));
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
apix.common.tools.math.Vector = function() { };
apix.common.tools.math.Vector.__name__ = ["apix","common","tools","math","Vector"];
apix.common.tools.math.Vector.prototype = {
	get_x: function() {
		return this._x;
	}
	,get_y: function() {
		return this._y;
	}
	,__class__: apix.common.tools.math.Vector
};
apix.common.tools.math.Rectangle = function() { };
apix.common.tools.math.Rectangle.__name__ = ["apix","common","tools","math","Rectangle"];
apix.common.tools.math.Rectangle.__super__ = apix.common.tools.math.Vector;
apix.common.tools.math.Rectangle.prototype = $extend(apix.common.tools.math.Vector.prototype,{
	get_width: function() {
		return this._width;
	}
	,get_height: function() {
		return this._height;
	}
	,__class__: apix.common.tools.math.Rectangle
});
apix.common.util.ArrayExtender = function() { };
apix.common.util.ArrayExtender.__name__ = ["apix","common","util","ArrayExtender"];
apix.common.util.ArrayExtender.forEach = function(array,f,dataParams) {
	var _g = 0;
	while(_g < array.length) {
		var o = array[_g];
		++_g;
		f(o,dataParams);
	}
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
apix.common.util.StringExtender.replace = function(v,from,to) {
	var reg = new RegExp('('+from+')', 'g');;
	v = v.replace(reg,to);;
	return v;
};
apix.common.util.StringExtender.isMail = function(v) {
	var r = new EReg("[A-Z0-9._%-]+@[A-Z0-9.-]+\\.[A-Z][A-Z][A-Z]?","i");
	return r.match(v);
};
apix.common.util.StringExtender.trace = function(s,v) {
	if(v != null) s += "=" + Std.string(v.toString());
	haxe.Log.trace(s,{ fileName : "StringExtender.hx", lineNumber : 172, className : "apix.common.util.StringExtender", methodName : "trace"});
	return "";
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
				if(!this.g.empty(v)) o.set("value",v);
			}
		}
		var $it0 = xml.attributes();
		while( $it0.hasNext() ) {
			var i = $it0.next();
			o.set(i,xml.get(i));
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
apix.ui.UICompo = function() { };
apix.ui.UICompo.__name__ = ["apix","ui","UICompo"];
apix.ui.UICompo.get_orientation = function() {
	if(Math.abs(window.orientation) == 90) return "landscape"; else return "portrait";
};
apix.ui.UICompoLoader = function() { };
apix.ui.UICompoLoader.__name__ = ["apix","ui","UICompoLoader"];
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
apix.ui.tools = {};
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
	this.load();
};
apix.ui.tools.Spinner.__name__ = ["apix","ui","tools","Spinner"];
apix.ui.tools.Spinner.get = function(p) {
	if(apix.ui.tools.Spinner._instance == null) apix.ui.tools.Spinner._instance = new apix.ui.tools.Spinner(p);
	return apix.ui.tools.Spinner._instance;
};
apix.ui.tools.Spinner.prototype = {
	start: function() {
		if(this.spinnerBox != null) {
			apix.common.display.ElementExtender.show(this.element,this.elementBeforeDisplay);
			this.spinnerBox.open();
			if(this.get_callBack() != null) {
				(this.get_callBack())();
				this.setup({ callBack : null});
			}
		} else apix.common.util.StringExtender.trace("f::error : Spinner not initialized",null);
	}
	,stop: function() {
		if(this.spinnerBox != null) {
			apix.common.display.ElementExtender.hide(this.element);
			this.spinnerBox.close();
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
		this.start();
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
var haxe = {};
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
var safebox = {};
safebox.Controler = function(m,v) {
	this.view = v;
	this.model = m;
	this.lang = this.model.lang;
	this.server = this.model.server;
	this.model.version = "v 1.0.3 r 2";
	safebox.Controler.g = apix.common.util.Global.get();
};
safebox.Controler.__name__ = ["safebox","Controler"];
safebox.Controler.prototype = {
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
		safebox.Controler.g.alert(this.lang.warning,$bind(this,this.askConnectInfo),this.lang.warningTitle,this.lang.warningValidText);
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
			this.model.data = new apix.common.util.xml.XmlParser().parse(Xml.parse(e.result.xmlData));
			if(this.model.data.folders == null) {
				safebox.Controler.g.alert(this.lang.serverReadError);
				this.model.data = null;
			} else if(this.model.data.folders.error != null) {
				safebox.Controler.g.alert(this.lang.serverReadError + this.model.data.error.value);
				this.model.data = null;
			} else this.doAfterConnection();
		} else if(answ == "connectionIsNotOpen") this.goSignIn(); else safebox.Controler.g.alert(this.lang.serverFatalError,$bind(this,this.goSignIn));
	}
	,askSignIn: function(id,pwd) {
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerSignIn));
		this.server.ask({ req : "signIn", id : id, pwd : pwd});
		this.model.currUserPwd = pwd;
	}
	,onAnswerSignIn: function(e) {
		this.server.serverEvent.off($bind(this,this.onAnswerSignIn));
		var answ = e.result.answ;
		if(answ == "error") {
			this.model.currUserPwd = null;
			var msg = e.result.msg;
			if(msg == "noValidLogin") safebox.Controler.g.alert(this.lang.noValidLoginError,$bind(this,this.onErrorCallBackSignIn)); else if(msg == "loginDoesntExist") safebox.Controler.g.alert(this.lang.loginDoesntExist,$bind(this,this.onErrorCallBackSignIn)); else if(msg == "connectionAlreadyOpen") safebox.Controler.g.alert(this.lang.connectAlreadyExists,$bind(this,this.onErrorCallBackSignIn)); else safebox.Controler.g.alert(this.lang.serverFatalError,$bind(this,this.onErrorCallBackSignIn));
		} else if(answ == "signInOk") {
			this.model.set_currUserId(e.result.id);
			this.model.data = new apix.common.util.xml.XmlParser().parse(Xml.parse(e.result.xmlData));
			if(this.model.data.error != null) {
				safebox.Controler.g.alert(this.lang.serverReadError + this.model.data.error.value,$bind(this,this.onErrorCallBackSignIn));
				this.model.data = null;
			} else {
				this.model.writeUserCookie();
				this.doAfterConnection();
			}
		} else safebox.Controler.g.alert(this.lang.serverFatalError,$bind(this,this.onErrorCallBackSignIn));
	}
	,onErrorCallBackSignIn: function() {
		this.model.currUserPwd = null;
		this.goSignIn();
	}
	,askSignUp: function(id,pwd) {
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerSignUp));
		this.model.currUserPwd = pwd;
		this.server.ask({ req : "signUp", id : id, pwd : pwd});
	}
	,onAnswerSignUp: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			var msg = e.result.msg;
			if(msg == "idAlreadyExist") safebox.Controler.g.alert(this.lang.alreadyExistError,$bind(this,this.onErrorCallBackSignUp)); else if(msg == "noValidLogin") safebox.Controler.g.alert(this.lang.noValidLoginError,$bind(this,this.onErrorCallBackSignUp)); else safebox.Controler.g.alert(Std.string(this.lang.serverReadError) + msg,$bind(this,this.onErrorCallBackSignUp));
			this.model.currUserPwd = null;
		} else if(answ == "signUpOk") {
			this.model.set_currUserId(e.result.id);
			this.model.writeUserCookie();
			this.goMain();
		} else safebox.Controler.g.alert(this.lang.serverFatalError,$bind(this,this.onErrorCallBackSignUp));
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
		this.view.showLoginView(safebox.Controler.g.strVal(o.id,""),safebox.Controler.g.strVal(o.pwd,""),"signIn");
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
		if(this.model.dataIsEmpty()) safebox.Controler.g.alert(this.lang.alertBeforeFolderCreation,null,this.lang.startAlertTitle); else if(this.model.dataIsFormLess()) safebox.Controler.g.alert(this.lang.alertBeforeFormCreation,null,this.lang.startAlertTitle);
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
		if(str != "") safebox.Controler.g.alert(str); else this.askSignIn(this.view.get_idValue(),this.view.get_pwdValue());
	}
	,onSignUpClick: function(e) {
		apix.common.display.ElementExtender.clearEnterKeyToClick(this.view.get_bConnect());
		var str = this.model.isValidSignUpInput(this.view.get_idValue(),this.view.get_pwdValue(),this.view.get_confirmValue());
		if(str != "") safebox.Controler.g.alert(str); else this.askSignUp(this.view.get_idValue(),this.view.get_pwdValue());
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
		safebox.Controler.g.open(this.lang.menuDocSrc,"_self");
	}
	,onChangeLang: function(e,p) {
		this.model.set_language(p.lg);
		safebox.Controler.g.replace("./index.html");
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
		safebox.Controler.g.alert(this.lang.about,null,this.lang.aboutTitle);
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
				fd = js.Boot.__cast(fo , safebox.models.Folder);
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
		fd = js.Boot.__cast(this.model.selectedFormOrFolder , safebox.models.Folder);
		fd.insertNewFolder();
	}
	,onAddFormClick: function(e) {
		var fd;
		fd = js.Boot.__cast(this.model.selectedFormOrFolder , safebox.models.Folder);
		fd.insertNewForm();
	}
	,onAddFieldClick: function(e) {
		var fo;
		fo = js.Boot.__cast(this.model.selectedFormOrFolder , safebox.models.Form);
		fo.insertNewField();
	}
	,onAddRecordClick: function(e) {
		var fo = this.model.selectedFormOrFolder;
		fo.insertNewRecord();
	}
	,onWindowClick: function(e) {
		apix.common.display.ElementExtender.hide(this.view.get_menu());
	}
	,onResize: function(e) {
		this.view.resize();
	}
	,__class__: safebox.Controler
};
safebox.Model = function(bu,su,l,p) {
	this.baseUrl = bu;
	this.serverUrl = su;
	this.lang = l;
	this.param = p;
	this.server = new safebox.Server(this.baseUrl + this.serverUrl,this);
	this.mode = "using";
	safebox.Model.g = apix.common.util.Global.get();
};
safebox.Model.__name__ = ["safebox","Model"];
safebox.Model.prototype = {
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
		this.root = new safebox.models.Folder(this,this.view);
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
				if(safebox.Model.g.strVal(this.get_currUserId(),"") != "") {
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
				if(safebox.Model.g.strVal(this.get_currUserId(),"") != "") {
					js.Cookie.set("safeboxId",this.get_currUserId(),del);
					this.currCookieId = this.get_currUserId();
					if(safebox.Model.g.strVal(this.currUserPwd,"") != "") {
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
		var arr = this.data.folders.item;
		var _g1 = 1;
		var _g = arr.length;
		while(_g1 < _g) {
			var i = _g1++;
			var o = arr[i];
			o.parent_id = safebox.Model.g.intVal(o.parent_id.value,0);
			o.is_form = safebox.Model.g.boolVal(o.is_form.value,false);
			o.label = safebox.Model.g.strVal(o.label.value,"");
			o.id = safebox.Model.g.intVal(o.id.value,1);
			if(o.is_form && o.fields.item != null) {
				var arrf = o.fields.item;
				var _g3 = 1;
				var _g2 = arrf.length;
				while(_g3 < _g2) {
					var i1 = _g3++;
					var of = arrf[i1];
					of.id = safebox.Model.g.intVal(of.id.value,1);
					of.label = safebox.Model.g.strVal(of.label.value,"");
					of.row_number = safebox.Model.g.intVal(of.row_number.value,1);
					of.copy_enable = safebox.Model.g.boolVal(of.copy_enable.value,true);
					of.is_hidden = safebox.Model.g.boolVal(of.is_hidden.value,false);
					of.is_primary = safebox.Model.g.boolVal(of.is_primary.value,false);
				}
			}
		}
	}
	,dataIsEmpty: function() {
		return !(this.data != null && this.data != { } && this.data.folders != null && ((this.data.folders.item instanceof Array) && this.data.folders.item.__enum__ == null));
	}
	,dataIsFormLess: function() {
		var arr = this.data.folders.item;
		var b = true;
		var len = arr.length;
		var _g = 1;
		while(_g < len) {
			var i = _g++;
			b = !arr[i].is_form;
			if(!b) break;
		}
		return b;
	}
	,setupTree: function() {
		var arr = this.data.folders.item;
		var _g1 = 1;
		var _g = arr.length;
		while(_g1 < _g) {
			var i = _g1++;
			var o = arr[i];
			if(!o.is_form) {
				var fd = new safebox.models.Folder(this,this.view);
				fd.init(o.id,o.label);
				this.root.setupFolderTreeRelation(o,fd);
			} else {
				var f = new safebox.models.Form(this,this.view);
				f.init(o.id,o.label);
				this.root.setupFormTreeRelation(o,f);
				f.setupFormFields(o.fields.item);
			}
		}
	}
	,clear: function() {
		this.root.clear();
		this.data = null;
		this.selectedFormOrFolder = this.root;
	}
	,__class__: safebox.Model
};
safebox.SafeBox = function(bu,su,l,p,fl) {
	if(fl == null) fl = false;
	this.model = new safebox.Model(bu,su,l,p);
	this.view = new safebox.View(this.model);
	this.controler = new safebox.Controler(this.model,this.view);
	this.firstLaunch = fl;
	this.start();
};
safebox.SafeBox.__name__ = ["safebox","SafeBox"];
safebox.SafeBox.prototype = {
	start: function() {
		apix.ui.tools.Spinner.get().stop();
		this.view.initDisplay();
		this.view.initAlert();
		this.view.initConfirm();
		this.model.createRootFolder(this.view);
		this.controler.initEvent();
		this.controler.start(this.firstLaunch);
	}
	,__class__: safebox.SafeBox
};
safebox.Server = function(su,m) {
	this.serverUrl = su;
	this.serverEvent = new apix.common.event.EventSource();
	safebox.Server._instance = this;
	this.spinner = apix.ui.tools.Spinner.get();
	this.model = m;
};
safebox.Server.__name__ = ["safebox","Server"];
safebox.Server.prototype = {
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
		if(HxOverrides.substr(data,0,5) == "<?xml") e.result = new apix.common.util.xml.XmlParser().parse(Xml.parse(data)); else e.result = apix.common.io.HttpExtender.getParameter(this.httpStandardRequest,data);
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
		haxe.Log.trace("f::From server:\n" + msg,{ fileName : "Server.hx", lineNumber : 109, className : "safebox.Server", methodName : "onServerError"});
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
	,__class__: safebox.Server
};
safebox.View = function(m) {
	this.model = m;
	this.lang = m.lang;
	this.param = this.model.param;
	this.g = apix.common.util.Global.get();
	this.tipBoxElem = apix.common.util.StringExtender.get("#safeBox #apix_tipBox");
};
safebox.View.__name__ = ["safebox","View"];
safebox.View.prototype = {
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
		apix.common.util.ArrayExtender.forEach(apix.common.util.StringExtender.all("#safeBox .apix_initHidden"),function(c) {
			apix.common.display.ElementExtender.hide(c);
		});
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
		apix.common.display.ElementExtender.tip(apix.common.util.StringExtender.get("#safeBox .copyPicto"),this.lang.copyPictoTitle);
		apix.common.util.ArrayExtender.forEach(apix.common.util.StringExtender.all("#safeBox .apix_cancelPicto"),function(c1) {
			apix.common.display.ElementExtender.tip(c1,_g.lang.cancelPictoTitle);
		});
		apix.common.util.ArrayExtender.forEach(apix.common.util.StringExtender.all("#safeBox .apix_validPicto"),function(c2) {
			apix.common.display.ElementExtender.tip(c2,_g.lang.validPictoTitle);
		});
		apix.common.display.ElementExtender.text(this.get_linkLang1(),this.lang.langApp1);
		apix.common.display.ElementExtender.text(this.get_linkLang2(),this.lang.langApp2);
		apix.common.display.ElementExtender.link(this.get_linkDoc(),this.lang.menuDocSrc);
		apix.common.display.ElementExtender.text(this.get_linkDoc(),this.lang.menuDoc);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bLang1(),"apix_label"),this.lang.langApp1);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bLang2(),"apix_label"),this.lang.langApp2);
		apix.common.display.ElementExtender.tip(this.get_bAdmin(),this.lang.menuAdminTitle);
		apix.common.display.ElementExtender.tip(this.get_bDoc(),this.lang.menuDocTitle);
		apix.common.display.ElementExtender.tip(this.get_bQuitAdmin(),this.lang.menuQuitAdminTitle);
		apix.common.display.ElementExtender.tip(this.get_bSafeMode(),this.lang.menuSafeModeTitle);
		apix.common.display.ElementExtender.tip(this.get_bLogOff(),this.lang.menuLogOffTitle);
		apix.common.display.ElementExtender.tip(this.get_bAbout(),this.lang.menuAboutTitle);
		apix.common.display.ElementExtender.tip(apix.common.display.ElementExtender.elemByClass(this.get_bAbout(),"apix_version"),this.lang.menuVersionTitle);
		apix.common.display.ElementExtender.tip(apix.common.display.ElementExtender.elemByClass(this.get_bLogOff(),"apix_userId"),this.lang.menuUserIdTitle);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bAdmin(),"apix_label"),this.lang.menuAdmin);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bDoc(),"apix_label"),this.lang.menuDoc);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bQuitAdmin(),"apix_label"),this.lang.menuQuitAdmin);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bLogOff(),"apix_label"),this.lang.menuLogOff);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bAbout(),"apix_label"),this.lang.menuAbout);
		apix.common.display.ElementExtender.text(apix.common.display.ElementExtender.elemByClass(this.get_bAbout(),"apix_version"),this.model.version);
		this.setMenuSafeModeLabel();
		apix.common.display.ElementExtender.tip(this.get_bAddFolder(),this.lang.addFolderTitle);
		apix.common.display.ElementExtender.tip(this.get_bAddForm(),this.lang.addFormTitle);
		apix.common.display.ElementExtender.tip(this.get_bAddField(),this.lang.addFieldTitle);
		apix.common.display.ElementExtender.tip(this.get_bAddRecord(),this.lang.addRecordTitle);
		apix.common.display.ElementExtender.cssStyle(this.get_bAddFolder(),"backgroundColor",this.param.bAddFolderColor);
		apix.common.display.ElementExtender.cssStyle(this.get_bAddForm(),"backgroundColor",this.param.bAddFormColor);
		apix.common.display.ElementExtender.cssStyle(this.get_bAddField(),"backgroundColor",this.param.bAddFieldColor);
		apix.common.display.ElementExtender.cssStyle(this.get_bAddRecord(),"backgroundColor",this.param.bAddRecordColor);
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
		apix.common.util.ArrayExtender.forEach(apix.common.util.StringExtender.all("#safeBox .addPicto"),apix.common.display.ElementExtender.hide);
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
	,__class__: safebox.View
};
safebox.models = {};
safebox.models.SubModel = function(m,v) {
	this.g = apix.common.util.Global.get();
	this.cb = apix.common.display.Confirm.get();
	this.model = m;
	this.view = v;
	this.lang = this.model.lang;
	this.param = this.model.param;
	this.server = this.model.server;
	this.click = new apix.common.event.EventSource();
};
safebox.models.SubModel.__name__ = ["safebox","models","SubModel"];
safebox.models.SubModel.prototype = {
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
	,__class__: safebox.models.SubModel
};
safebox.models.Form = function(m,v) {
	safebox.models.SubModel.call(this,m,v);
	this.fields = [];
	this.records = [];
	this.srvTxtMsg = "FormFolder";
	this.insertSrvTxtMsg = "Field";
	if(apix.common.display.Common.get_windowWidth() > 679) this.shiftVal = 15; else this.shiftVal = 5;
	this.isClosed = true;
};
safebox.models.Form.__name__ = ["safebox","models","Form"];
safebox.models.Form.__super__ = safebox.models.SubModel;
safebox.models.Form.prototype = $extend(safebox.models.SubModel.prototype,{
	get_level: function() {
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
	,get_dbTable: function() {
		return "tb_" + this.recId;
	}
	,get_recordsAlreadyRead: function() {
		return !apix.common.display.ElementExtender.isEmpty(this.get_recordsCtnr());
	}
	,get_color: function() {
		return this.param.formColor;
	}
	,get_mode: function() {
		return this.model.mode;
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
	,get_copyEnableLabel: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_copyEnable .apix_label");
	}
	,get_isHiddenLabel: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_isHidden .apix_label");
	}
	,get_isPrimaryLabel: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame .apix_fieldElemsCtnr .apix_isPrimary .apix_label");
	}
	,get_rowNumberInput: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame input[name='rowNumber']");
	}
	,get_copyEnableInput: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame input[name='copyEnable']");
	}
	,get_isHiddenInput: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame input[name='isHidden']");
	}
	,get_isPrimaryInput: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_nameFrame input[name='isPrimary']");
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
	,get_recInsertTitleTxt: function() {
		return this.lang.recInsertTitle;
	}
	,get_recordFrame: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_recordFrame");
	}
	,get_recordFrameTitle: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_recordFrame .apix_title");
	}
	,get_fieldDataHolder: function() {
		return this.lang.fieldDataHolder;
	}
	,get_recordFieldCtnr: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_recordFrame .apix_recordFieldCtnr");
	}
	,get_bValidRecordInsert: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_recordFrame .apix_validPicto");
	}
	,get_bCancelRecordInsert: function() {
		return apix.common.util.StringExtender.get("#safeBox #apix_recordFrame .apix_cancelPicto");
	}
	,getParent: function() {
		if(this["is"]("Field")) return js.Boot.__cast(this.parent , safebox.models.Form); else if(this != this.model.root) return js.Boot.__cast(this.parent , safebox.models.Folder); else return null;
	}
	,init: function(ri,l) {
		this.recId = ri;
		this.label = l;
	}
	,setupFormFields: function(arr) {
		var _g1 = 1;
		var _g = arr.length;
		while(_g1 < _g) {
			var i = _g1++;
			var o = arr[i];
			var fi = new safebox.models.Field(this.model,this.view);
			fi.parent = this;
			fi.initField(o.id,o.label,o.row_number,o.copy_enable,o.is_hidden,o.is_primary);
			this.fields.push(fi);
			fi.index = this.fields.length - 1;
			fi.fields = this.fields;
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
	,setup: function() {
		this.setupView();
		this.setupEvent();
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
	,remove: function() {
		this.getParent().selectAndDispatch();
		this.clear();
		if(this.elem == null) haxe.Log.trace("Erreur in Form.remove(). Instance : " + this.g.className(this) + " label=" + this.label + " recId=" + this.recId,{ fileName : "Form.hx", lineNumber : 238, className : "safebox.models.Form", methodName : "remove"}); else apix.common.display.ElementExtender["delete"](this.elem);
		this.getParent().removeFromList(this);
	}
	,removeFromList: function(f) {
		if(f["is"]("Field")) this.fields.splice(f.index,1); else if(f["is"]("Folder")) this.children.splice(f.index,1); else if(f["is"]("Form")) this.forms.splice(f.index,1); else haxe.Log.trace("f:: Form.removeFromList() type error",{ fileName : "Form.hx", lineNumber : 246, className : "safebox.models.Form", methodName : "removeFromList"});
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
	,selectAndDispatch: function() {
		var ev = new apix.common.event.StandardEvent(this);
		ev.path = this.get_path();
		this.click.dispatch(ev);
	}
	,insertNewField: function() {
		this.insertNewElement("field");
	}
	,insertNewRecord: function() {
		if(this.fields.length == 0) this.g.alert(this.lang.emptyFieldDescription); else this.showInsertRecordFrame(this.get_recInsertTitleTxt());
	}
	,showInsertRecordFrame: function(frameTitle) {
		apix.common.display.ElementExtender.text(this.get_recordFrameTitle(),frameTitle);
		apix.common.display.ElementExtender.removeChildren(this.get_recordFieldCtnr());
		this.recordFrameFieldElems = [];
		var _g = 0;
		var _g1 = this.fields;
		while(_g < _g1.length) {
			var fi = _g1[_g];
			++_g;
			this.recordFrameFieldElems.push(fi.displayInRecordFrame(this.get_recordFieldCtnr(),this.get_fieldDataHolder()));
		}
		apix.common.display.ElementExtender.show(this.get_recordFrame());
		this.setupInsertRecordEvent();
	}
	,setupInsertRecordEvent: function() {
		if(apix.common.display.ElementExtender.hasLst(this.get_bCancelRecordInsert())) apix.common.display.ElementExtender.off(this.get_bCancelRecordInsert(),"click");
		if(apix.common.display.ElementExtender.hasLst(this.get_bValidRecordInsert())) apix.common.display.ElementExtender.off(this.get_bValidRecordInsert(),"click");
		apix.common.display.ElementExtender.on(this.get_bCancelRecordInsert(),"click",$bind(this,this.onCancelRecordInsert));
		apix.common.display.ElementExtender.on(this.get_bValidRecordInsert(),"click",$bind(this,this.onValidRecordInsert));
		apix.common.display.ElementExtender.joinEnterKeyToClick(this.get_bValidRecordInsert(),null,this.recordFrameFieldElems[0].valueElem);
	}
	,removeInsertRecordEvent: function() {
		if(apix.common.display.ElementExtender.hasLst(this.get_bCancelRecordInsert(),"click")) apix.common.display.ElementExtender.off(this.get_bCancelRecordInsert(),"click",$bind(this,this.onCancelRecordInsert));
		if(apix.common.display.ElementExtender.hasLst(this.get_bValidRecordInsert(),"click")) apix.common.display.ElementExtender.off(this.get_bValidRecordInsert(),"click",$bind(this,this.onValidRecordInsert));
		apix.common.display.ElementExtender.clearEnterKeyToClick(this.get_bValidRecordInsert());
	}
	,onCancelRecordInsert: function(e) {
		this.removeInsertRecordEvent();
		apix.common.display.ElementExtender.hide(this.get_recordFrame());
	}
	,onValidRecordInsert: function(e) {
		var fd;
		var fvList = "";
		var fkList = "";
		var pfx = "";
		var _g = 0;
		var _g1 = this.fields;
		while(_g < _g1.length) {
			var fd1 = _g1[_g];
			++_g;
			var k = fd1.get_dbColName();
			var v = apix.common.display.ElementExtender.value(this.recordFrameFieldElems[fd1.index].valueElem);
			fkList += pfx + k;
			fvList += pfx + v;
			pfx = "`~¤";
		}
		this.askRecordInsert(fkList,fvList);
	}
	,askRecordInsert: function(fkList,fvList) {
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerRecordInsert));
		this.server.ask({ req : "insertOneRecord", id : this.model.get_currUserId(), formRecId : this.recId, fieldKeys : fkList, fieldValues : fvList});
	}
	,onAnswerRecordInsert: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else if(e.result.msg == "parentFormDoesntExist") this.g.alert(this.lang.parentFormDoesntExist); else this.g.alert(this.lang.serverReadError + e.result.msg + e.result.qry);
		} else if(answ == "insertRecordOk") {
			this.removeInsertRecordEvent();
			apix.common.display.ElementExtender.hide(this.get_recordFrame());
			this.view.showTipBox(this.lang.insertOk,apix.common.display.ElementExtender.parent(this.get_bElem()),apix.common.display.ElementExtender.posx(this.get_bElem()),apix.common.display.ElementExtender.posy(this.get_bElem()),2);
			this.createOneRecord(this.g.intVal(e.result.recId,-1));
			var el = this.get_bElem();
			this.view.showTipBox(this.lang.createOk,apix.common.display.ElementExtender.parent(el),apix.common.display.ElementExtender.posx(el),apix.common.display.ElementExtender.posy(el),1);
		} else this.g.alert(this.lang.serverFatalError);
	}
	,createOneRecord: function(recId) {
		var r = new safebox.models.Record(this.model,this.view);
		r.init(recId,this,this.records.push(r) - 1,this.shift,apix.common.display.ElementExtender.value(this.recordFrameFieldElems[0].valueElem));
		r.display();
		var f;
		var _g = 0;
		var _g1 = this.fields;
		while(_g < _g1.length) {
			var f1 = _g1[_g];
			++_g;
			r.push("fd_" + f1.recId,apix.common.display.ElementExtender.value(this.recordFrameFieldElems[f1.index].valueElem),f1);
		}
	}
	,setupView: function() {
		apix.common.display.ElementExtender.value(this.get_labelElem(),this.label);
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"backgroundColor",this.get_color());
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"opacity",".7");
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"borderColor",this.get_color());
		apix.common.display.ElementExtender.hide(this.get_pictoCtnr());
	}
	,onButtonClick: function(e) {
		if(!this.isClosed) this.close(); else if(this["is"]("Form") && this.get_mode() == "using" && !this.get_recordsAlreadyRead()) this.askReadRecords(); else this.open();
		this.selectAndDispatch();
	}
	,showNameFrame: function(tl,n,hld,type) {
		if(hld == null) hld = "$holder";
		if(n == null) n = "$name";
		if(tl == null) tl = "$Title";
		apix.common.display.ElementExtender.text(this.get_nameFrameTitle(),tl);
		apix.common.display.ElementExtender.text(this.get_nameFrameName(),n);
		apix.common.display.ElementExtender.text(this.get_nameFramePath(),this.get_path());
		apix.common.display.ElementExtender.placeHolder(this.get_foName(),hld);
		if(type == "field") {
			apix.common.display.ElementExtender.text(this.get_rowNumberLabel(),this.lang.fiRowNumberLabel);
			apix.common.display.ElementExtender.text(this.get_copyEnableLabel(),this.lang.ficopyEnableLabel);
			apix.common.display.ElementExtender.text(this.get_isHiddenLabel(),this.lang.fiHiddenLabel);
			apix.common.display.ElementExtender.text(this.get_isPrimaryLabel(),this.lang.fiPrimaryLabel);
			apix.common.display.ElementExtender.show(this.get_nameFramefieldsCtnr());
		} else apix.common.display.ElementExtender.hide(this.get_nameFramefieldsCtnr());
		apix.common.display.ElementExtender.show(this.get_nameFrame());
		apix.common.display.ElementExtender.joinEnterKeyToClick(this.get_bNameFrameValid(),null,this.get_foName());
	}
	,createOneFolder: function(fd,shift) {
		if(shift == null) shift = 0;
		var folderProto = this.view.get_fButtonProto();
		var folderEl = apix.common.display.ElementExtender.clone(folderProto,true);
		apix.common.display.ElementExtender.addChild(this.get_elemsCtnr(),folderEl);
		apix.common.display.ElementExtender.show(folderEl);
		folderEl.id = "fd_" + fd.recId;
		fd.vId = folderEl.id;
		fd.elem = folderEl;
		fd.shift = shift;
		apix.common.display.ElementExtender.posx(fd.get_bElem(),fd.shift);
		fd.setup();
		apix.common.display.ElementExtender["delete"](fd.get_recordsCtnr());
		fd.click.on($bind(this,this.onElemClick));
	}
	,createOneForm: function(f,shift) {
		if(shift == null) shift = 0;
		var formProto = this.view.get_fButtonProto();
		var formEl = apix.common.display.ElementExtender.clone(formProto,true);
		apix.common.display.ElementExtender.addChild(this.get_elemsCtnr(),formEl);
		apix.common.display.ElementExtender.show(formEl);
		formEl.id = "fo_" + f.recId;
		f.vId = formEl.id;
		f.elem = formEl;
		f.shift = shift;
		apix.common.display.ElementExtender.posx(f.get_bElem(),f.shift);
		f.setup();
		f.click.on($bind(this,this.onElemClick));
	}
	,createOneField: function(fi,shift) {
		if(shift == null) shift = 0;
		var fieldProto = this.view.get_fButtonProto();
		var fieldEl = apix.common.display.ElementExtender.clone(fieldProto,true);
		apix.common.display.ElementExtender.addChild(this.get_elemsCtnr(),fieldEl);
		apix.common.display.ElementExtender.show(fieldEl);
		fieldEl.id = "fi_" + fi.recId;
		fi.vId = fieldEl.id;
		fi.elem = fieldEl;
		fi.shift = shift;
		apix.common.display.ElementExtender.posx(fi.get_bElem(),fi.shift);
		fi.setup();
		apix.common.display.ElementExtender["delete"](fi.get_recordsCtnr());
	}
	,onElemClick: function(ev) {
		this.click.dispatch(ev);
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
			haxe.Log.trace("f:: Form. insertNewElement() type error",{ fileName : "Form.hx", lineNumber : 439, className : "safebox.models.Form", methodName : "insertNewElement"});
		}
		this.showNameFrame(tl,na,hd,type);
		apix.common.display.ElementExtender.off(this.get_bNameFrameCancel());
		apix.common.display.ElementExtender.on(this.get_bNameFrameCancel(),"click",$bind(this,this.onFrameCancel));
		apix.common.display.ElementExtender.off(this.get_bNameFrameValid());
		apix.common.display.ElementExtender.on(this.get_bNameFrameValid(),"click",$bind(this,this.onInsertElementValid),false,{ type : type});
		apix.common.display.ElementExtender.value(this.get_foName(),"");
		if(type == "field") {
			apix.common.display.ElementExtender.show(this.get_nameFramefieldsCtnr());
			apix.common.display.ElementExtender.value(this.get_rowNumberInput(),"1");
			apix.common.display.ElementExtender.value(this.get_copyEnableInput(),"true");
			apix.common.display.ElementExtender.selected(this.get_copyEnableInput(),true);
			apix.common.display.ElementExtender.value(this.get_isHiddenInput(),"false");
			apix.common.display.ElementExtender.selected(this.get_isHiddenInput(),false);
			this.lockPrimaryInput();
		}
	}
	,lockPrimaryInput: function(fi) {
		if(this.get_primary() != null && this.get_primary() != fi) {
			if(fi == null) apix.common.display.ElementExtender.value(this.get_isPrimaryInput(),"false");
			if(fi == null) apix.common.display.ElementExtender.selected(this.get_isPrimaryInput(),false);
			apix.common.display.ElementExtender.enable(this.get_isPrimaryInput(),false,true);
		} else {
			if(fi == null) apix.common.display.ElementExtender.value(this.get_isPrimaryInput(),"true");
			if(fi == null) apix.common.display.ElementExtender.selected(this.get_isPrimaryInput(),true);
			apix.common.display.ElementExtender.enable(this.get_isPrimaryInput(),true,true);
		}
	}
	,onInsertElementValid: function(e,d) {
		var o = null;
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerInsertElement),{ type : d.type});
		if(d.type == "field") o = { req : "insert" + this.insertSrvTxtMsg, id : this.model.get_currUserId(), recId : this.recId, label : apix.common.display.ElementExtender.value(this.get_foName()), rowNumber : apix.common.display.ElementExtender.value(this.get_rowNumberInput()), copyEnable : apix.common.display.ElementExtender.selected(this.get_copyEnableInput()), isHidden : apix.common.display.ElementExtender.selected(this.get_isHiddenInput()), isPrimary : apix.common.display.ElementExtender.selected(this.get_isPrimaryInput())}; else o = { req : "insert" + this.insertSrvTxtMsg, id : this.model.get_currUserId(), label : apix.common.display.ElementExtender.value(this.get_foName()), recId : this.recId, type : d.type};
		this.server.ask(o);
	}
	,onAnswerInsertElement: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else if(e.result.msg == "parentFormDoesntExist") this.g.alert(this.lang.parentFormDoesntExist); else this.g.alert(this.lang.serverReadError + e.result.msg);
		} else if(answ == "insert" + this.insertSrvTxtMsg + "Ok") {
			var ff = null;
			var el;
			if(this == this.model.root) el = this.get_elemsCtnr(); else el = this.get_bElem();
			this.view.showTipBox(this.lang.createOk,apix.common.display.ElementExtender.parent(el),apix.common.display.ElementExtender.posx(el),apix.common.display.ElementExtender.posy(el),1);
			if(e.data.type == "folder") {
				ff = new safebox.models.Folder(this.model,this.view);
				this.insertElementInit(ff,e);
				this.children.push(js.Boot.__cast(ff , safebox.models.Folder));
				ff.index = this.children.length - 1;
				this.createOneFolder(js.Boot.__cast(ff , safebox.models.Folder),this.shift + this.shiftVal);
			} else if(e.data.type == "form") {
				ff = new safebox.models.Form(this.model,this.view);
				this.insertElementInit(ff,e);
				this.forms.push(ff);
				ff.index = this.forms.length - 1;
				this.createOneForm(ff,this.shift + this.shiftVal);
			} else {
				ff = new safebox.models.Field(this.model,this.view);
				this.insertElementInit(ff,e);
				(js.Boot.__cast(ff , safebox.models.Field)).initField(e.result.recId,apix.common.display.ElementExtender.value(this.get_foName()),this.g.intVal(apix.common.display.ElementExtender.value(this.get_rowNumberInput()),1),apix.common.display.ElementExtender.selected(this.get_copyEnableInput()),apix.common.display.ElementExtender.selected(this.get_isHiddenInput()),apix.common.display.ElementExtender.selected(this.get_isPrimaryInput()));
				this.fields.push(js.Boot.__cast(ff , safebox.models.Field));
				ff.index = this.fields.length - 1;
				this.createOneField(js.Boot.__cast(ff , safebox.models.Field),this.shift);
			}
			ff.setupAdminMode();
			apix.common.display.ElementExtender.hide(this.get_nameFrame());
		} else this.g.alert(this.lang.serverFatalError);
	}
	,insertElementInit: function(ff,e) {
		ff.init(e.result.recId,apix.common.display.ElementExtender.value(this.get_foName()));
		ff.parent = this;
	}
	,onUpdateClick: function(e) {
		this.showNameFrame(this.get_updateTitleTxt(),this.get_nameTxt(),this.get_nameHolderTxt());
		apix.common.display.ElementExtender.off(this.get_bNameFrameCancel());
		apix.common.display.ElementExtender.on(this.get_bNameFrameCancel(),"click",$bind(this,this.onFrameCancel));
		apix.common.display.ElementExtender.off(this.get_bNameFrameValid());
		apix.common.display.ElementExtender.on(this.get_bNameFrameValid(),"click",$bind(this,this.onFrameValid));
		apix.common.display.ElementExtender.value(this.get_foName(),this.label);
		this.selectAndDispatch();
	}
	,onFrameCancel: function(e) {
		apix.common.display.ElementExtender.hide(this.get_nameFrame());
	}
	,onFrameValid: function(e) {
		this.label = apix.common.display.ElementExtender.value(this.get_foName());
		apix.common.display.ElementExtender.value(this.get_labelElem(),this.label);
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerUpdate));
		this.server.ask({ req : "updateFormFolder", id : this.model.get_currUserId(), recId : this.recId, label : this.label});
	}
	,onAnswerUpdate: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else this.g.alert(this.lang.serverReadError + e.result.msg);
		} else if(answ == "update" + this.srvTxtMsg + "Ok") {
			apix.common.display.ElementExtender.hide(this.get_nameFrame());
			this.view.showTipBox(this.lang.updateOk,apix.common.display.ElementExtender.parent(this.get_bElem()),apix.common.display.ElementExtender.posx(this.get_bElem()),apix.common.display.ElementExtender.posy(this.get_bElem()),2);
		} else this.g.alert(this.lang.serverFatalError);
	}
	,onRemoveClick: function(e) {
		this.selectAndDispatch();
		this.cb.show(Std.string(this.lang.deleteConfirm) + " " + this.get_path() + " ?",$bind(this,this.askDelete));
	}
	,askDelete: function(b,f) {
		if(b) {
			this.server.serverEvent.off();
			this.server.serverEvent.on($bind(this,this.onAnswerDelete));
			this.server.ask({ req : "delete" + this.srvTxtMsg, id : this.model.get_currUserId(), recId : this.recId});
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
	,askReadRecords: function() {
		if(this.fields.length == 0) this.g.alert(this.lang.emptyFieldDescription); else {
			this.server.serverEvent.off();
			this.server.serverEvent.on($bind(this,this.onAnswerReadRecords));
			this.server.ask({ req : "readRecords", id : this.model.get_currUserId(), recId : this.recId});
		}
	}
	,onAnswerReadRecords: function(e) {
		var o = e.result.records;
		if(e.result.answ == "error") this.g.alert(this.lang.serverReadError + e.result.msg); else if(o == null || e.result.answ == "error") this.g.alert(this.lang.serverFatalError); else if(o.error != null) {
			if(o.error.value == "tableDoesntExist") this.g.alert(this.lang.formTableDontExists); else if(o.error.value == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(o.error.value == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else this.g.alert(this.lang.serverReadError + o.error.value);
		} else if(o.item != null && ((o.item instanceof Array) && o.item.__enum__ == null)) {
			this.setupRecordsTree(o.item);
			this.open();
		} else this.g.alert(this.lang.formHaventData);
	}
	,setupRecordsTree: function(arr) {
		var _g1 = 1;
		var _g = arr.length;
		while(_g1 < _g) {
			var i = _g1++;
			var o = arr[i];
			var k = "fd_" + this.fields[0].recId;
			var r = new safebox.models.Record(this.model,this.view);
			r.init(this.g.intVal(o.id.value),this,this.records.push(r) - 1,this.shift,o.get(k).value);
			r.display();
			var _g2 = 0;
			var _g3 = this.fields;
			while(_g2 < _g3.length) {
				var f = _g3[_g2];
				++_g2;
				k = "fd_" + f.recId;
				if(o.get(k) != null) r.push(k,o.get(k).value,f); else r.push(k,"",f);
			}
		}
	}
	,__class__: safebox.models.Form
});
safebox.models.Folder = function(m,v) {
	safebox.models.Form.call(this,m,v);
	this.children = [];
	this.forms = [];
	this.srvTxtMsg = "FormFolder";
	this.insertSrvTxtMsg = "FormFolder";
};
safebox.models.Folder.__name__ = ["safebox","models","Folder"];
safebox.models.Folder.__super__ = safebox.models.Form;
safebox.models.Folder.prototype = $extend(safebox.models.Form.prototype,{
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
		var arr = this.children;
		var len = arr.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(arr[i] == null) {
				apix.common.util.StringExtender.trace("WARNING JM LOOK THAT : ",null);
				apix.common.util.StringExtender.trace("recId",this.recId);
				apix.common.util.StringExtender.trace("label",this.label);
				apix.common.util.StringExtender.trace("len",len);
				apix.common.util.StringExtender.trace("i",i);
			} else arr[i].remove();
		}
		var arr1 = this.forms;
		var len1 = arr1.length;
		var _g1 = 0;
		while(_g1 < len1) {
			var i1 = _g1++;
			arr1[i1].remove();
		}
		if(this.recId != 0) safebox.models.Form.prototype.remove.call(this);
	}
	,setStateOfAddButtons: function(opacFd,opacFo,opacFi) {
		if(opacFi == null) opacFi = "0";
		if(opacFo == null) opacFo = "1";
		if(opacFd == null) opacFd = "1";
		safebox.models.Form.prototype.setStateOfAddButtons.call(this,opacFd,opacFo,opacFi);
	}
	,__class__: safebox.models.Folder
});
safebox.models.Field = function(m,v) {
	safebox.models.Folder.call(this,m,v);
	this.srvTxtMsg = "Field";
};
safebox.models.Field.__name__ = ["safebox","models","Field"];
safebox.models.Field.__super__ = safebox.models.Folder;
safebox.models.Field.prototype = $extend(safebox.models.Folder.prototype,{
	get_dbColName: function() {
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
	,get_inputFieldString: function() {
		if(this.rowNumber > 1) return "apix_textArea"; else return "apix_textInput";
	}
	,get_inputFieldToHideString: function() {
		if(this.rowNumber > 1) return "apix_textInput"; else return "apix_textArea";
	}
	,get_inputFieldHeight: function() {
		if(this.rowNumber > 1) return this.rowNumber * 22; else return -1;
	}
	,initField: function(ri,l,rn,ce,ih,ip) {
		this.recId = ri;
		this.label = l;
		this.rowNumber = rn;
		this.copyEnable = ce;
		this.isHidden = ih;
		this.isPrimary = ip;
	}
	,clear: function() {
		this.removeEvent();
	}
	,setupEvent: function() {
		safebox.models.Folder.prototype.setupEvent.call(this);
		apix.common.display.ElementExtender.off(this.get_bElem(),"click",$bind(this,this.onButtonClick));
		apix.common.display.ElementExtender.on(this.get_bElem(),"click",$bind(this,this.onUpdateClick));
	}
	,removeEvent: function() {
		if(apix.common.display.ElementExtender.hasLst(this.get_bElem(),"click")) apix.common.display.ElementExtender.off(this.get_bElem(),"click",$bind(this,this.onUpdateClick));
		safebox.models.Folder.prototype.removeEvent.call(this);
	}
	,open: function() {
		haxe.Log.trace("f:: not possible to use Field.open() !!",{ fileName : "Field.hx", lineNumber : 96, className : "safebox.models.Field", methodName : "open"});
	}
	,close: function() {
		haxe.Log.trace("f:: not possible to use Field.close() !!",{ fileName : "Field.hx", lineNumber : 100, className : "safebox.models.Field", methodName : "close"});
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
		el.id = "recFrameField_" + this.index;
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
		safebox.models.Folder.prototype.onUpdateClick.call(this,e);
		this.showNameFrame(this.get_updateTitleTxt(),this.get_nameTxt(),this.get_nameHolderTxt(),"field");
		apix.common.display.ElementExtender.value(this.get_foName(),this.label);
		apix.common.display.ElementExtender.value(this.get_rowNumberInput(),"" + this.rowNumber);
		apix.common.display.ElementExtender.value(this.get_copyEnableInput(),this.copyEnable?"true":"false");
		apix.common.display.ElementExtender.selected(this.get_copyEnableInput(),this.copyEnable);
		apix.common.display.ElementExtender.value(this.get_isHiddenInput(),this.isHidden?"true":"false");
		apix.common.display.ElementExtender.selected(this.get_isHiddenInput(),this.isHidden);
		apix.common.display.ElementExtender.value(this.get_isPrimaryInput(),this.isPrimary?"true":"false");
		apix.common.display.ElementExtender.selected(this.get_isPrimaryInput(),this.isPrimary);
		this.lockPrimaryInput(this);
	}
	,onFrameValid: function(e) {
		this.rowNumber = this.g.intVal(apix.common.display.ElementExtender.value(this.get_rowNumberInput()),1);
		this.copyEnable = this.g.boolVal(apix.common.display.ElementExtender.selected(this.get_copyEnableInput()),true);
		this.isHidden = this.g.boolVal(apix.common.display.ElementExtender.selected(this.get_isHiddenInput()),true);
		this.isPrimary = this.g.boolVal(apix.common.display.ElementExtender.selected(this.get_isPrimaryInput()),true);
		this.label = apix.common.display.ElementExtender.value(this.get_foName());
		apix.common.display.ElementExtender.value(this.get_labelElem(),this.label);
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerUpdate));
		this.server.ask({ req : "updateField", id : this.model.get_currUserId(), recId : this.recId, label : this.label, rowNumber : this.rowNumber, copyEnable : this.copyEnable, isHidden : this.isHidden, isPrimary : this.isPrimary});
	}
	,__class__: safebox.models.Field
});
safebox.models.FieldData = function(m,v) {
	safebox.models.SubModel.call(this,m,v);
};
safebox.models.FieldData.__name__ = ["safebox","models","FieldData"];
safebox.models.FieldData.__super__ = safebox.models.SubModel;
safebox.models.FieldData.prototype = $extend(safebox.models.SubModel.prototype,{
	get_labelElem: function() {
		return apix.common.util.StringExtender.get("#" + this.vId + " .apix_label");
	}
	,get_valueElem: function() {
		return apix.common.util.StringExtender.get("#" + this.vId + " ." + this.field.get_inputFieldString() + " .apix_value");
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
		return this.value == apix.common.display.ElementExtender.value(this.get_valueElem());
	}
	,getParent: function() {
		if(this.parent != null) return js.Boot.__cast(this.parent , safebox.models.Record); else return null;
	}
	,init: function(k,v,fi,idx,par) {
		if(v == null) v = "";
		if(v == null) v = "";
		this.field = fi;
		this.value = v;
		this.key = k;
		this.label = this.g.strVal(fi.label,"");
		this.index = idx;
		this.parent = par;
		return this;
	}
	,display: function() {
		var fieldDataProto = this.view.get_fieldDataProto();
		var fieldDataEl = apix.common.display.ElementExtender.clone(fieldDataProto,true);
		apix.common.display.ElementExtender.addChild(this.getParent().get_elemsCtnr(),fieldDataEl);
		apix.common.display.ElementExtender.show(fieldDataEl);
		fieldDataEl.id = this.getParent().get_dbTable() + "_rec_" + this.getParent().recId + "_" + this.key;
		this.vId = fieldDataEl.id;
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
	,setupView: function() {
		apix.common.display.ElementExtender.text(this.get_labelElem(),this.label);
		apix.common.display.ElementExtender.value(this.get_valueElem(),this.value);
		if(this.field.get_inputFieldHeight() > 0) apix.common.display.ElementExtender.height(this.get_valueElem(),this.field.get_inputFieldHeight());
		if(this.field.isHidden) {
			apix.common.display.ElementExtender.visible(this.get_showPictoElem(),true);
			this.makeHidden();
		} else {
			apix.common.display.ElementExtender.visible(this.get_showPictoElem(),false);
			this.makeVisible();
		}
		if(this.field.copyEnable) apix.common.display.ElementExtender.visible(this.get_copyPictoElem(),true); else apix.common.display.ElementExtender.visible(this.get_copyPictoElem(),false);
	}
	,makeVisible: function() {
		apix.common.display.ElementExtender.value(this.get_valueElem(),this.value);
	}
	,makeHidden: function() {
		var l = this.value.length;
		apix.common.display.ElementExtender.value(this.get_valueElem(),this.hideChars(l));
	}
	,hideChars: function(l) {
		var str = "";
		var _g1 = 0;
		var _g = l - 1;
		while(_g1 < _g) {
			var i = _g1++;
			str += "*";
		}
		return str;
	}
	,setupEvent: function() {
		if(!apix.common.display.ElementExtender.hasLst(this.get_copyPictoElem(),"click")) apix.common.display.ElementExtender.on(this.get_copyPictoElem(),"click",$bind(this,this.onCopyClick));
		if(!apix.common.display.ElementExtender.hasLst(this.get_showPictoElem(),"click")) apix.common.display.ElementExtender.on(this.get_showPictoElem(),"click",$bind(this,this.onShowClick));
	}
	,removeEvent: function() {
		if(this.get_copyPictoElem() == null) haxe.Log.trace("f:: debug test : label=" + this.label + " index=" + this.index,{ fileName : "FieldData.hx", lineNumber : 121, className : "safebox.models.FieldData", methodName : "removeEvent"}); else if(apix.common.display.ElementExtender.hasLst(this.get_copyPictoElem(),"click")) apix.common.display.ElementExtender.off(this.get_copyPictoElem(),"click",$bind(this,this.onCopyClick));
	}
	,onCopyClick: function(e) {
		var visibleBefore = this.get_visible();
		if(this.field.isHidden && !visibleBefore) this.makeVisible();
		apix.common.display.ElementExtender.pick(this.get_valueElem());
		if(!apix.common.display.Common.toClipBoard()) this.g.alert(this.lang.clipBoardCopyError);
		if(this.field.isHidden && !visibleBefore) this.makeHidden();
	}
	,onShowClick: function(e) {
		if(!this.get_visible()) this.makeVisible(); else this.makeHidden();
	}
	,__class__: safebox.models.FieldData
});
safebox.models.Record = function(m,v) {
	safebox.models.SubModel.call(this,m,v);
};
safebox.models.Record.__name__ = ["safebox","models","Record"];
safebox.models.Record.__super__ = safebox.models.SubModel;
safebox.models.Record.prototype = $extend(safebox.models.SubModel.prototype,{
	get_dbTable: function() {
		return this.getParent().get_dbTable();
	}
	,get_elemsCtnr: function() {
		return apix.common.util.StringExtender.get("#" + this.vId + " .apix_subCtnr");
	}
	,get_color: function() {
		return this.param.recordColor;
	}
	,get_recordFrame: function() {
		return this.getParent().get_recordFrame();
	}
	,get_recordFrameTitle: function() {
		return this.getParent().get_recordFrameTitle();
	}
	,get_fieldDataHolder: function() {
		return this.getParent().get_fieldDataHolder();
	}
	,get_recUpdateTitleTxt: function() {
		return this.lang.recUpdateTitle;
	}
	,get_bFrameValid: function() {
		return this.getParent().get_bValidRecordInsert();
	}
	,get_bFrameCancel: function() {
		return this.getParent().get_bCancelRecordInsert();
	}
	,get_recordFieldCtnr: function() {
		return this.getParent().get_recordFieldCtnr();
	}
	,getParent: function() {
		if(this.parent != null) return js.Boot.__cast(this.parent , safebox.models.Form); else return null;
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
		recordEl.id = this.get_dbTable() + "_rec_" + this.recId;
		this.vId = recordEl.id;
		this.elem = recordEl;
		apix.common.display.ElementExtender.posx(this.get_bElem(),this.shift);
		apix.common.display.ElementExtender.posx(this.get_elemsCtnr(),this.shift);
		apix.common.display.ElementExtender.cssStyle(this.get_elemsCtnr(),"border","1px dotted #999");
		this.setup();
		apix.common.display.ElementExtender["delete"](this.get_recordsCtnr());
	}
	,push: function(k,v,fi) {
		if(v == null) v = "";
		var fd = new safebox.models.FieldData(this.model,this.view);
		fd.init(k,v,fi,this.fieldDatas.push(fd) - 1,this);
		if(this.fieldDatas.length > 1) fd.display();
		return this;
	}
	,setup: function() {
		this.setupView();
		this.setupEvent();
	}
	,open: function() {
		apix.common.display.ElementExtender.show(this.get_elemsCtnr());
		apix.common.display.ElementExtender.show(this.get_pictoCtnr());
		apix.common.display.ElementExtender.cssStyle(this.get_labelElem(),"fontSize","1.3rem");
		this.isClosed = false;
	}
	,close: function() {
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
	}
	,onUpdateClick: function(e) {
		this.showUpdateRecordFrame(this.get_recUpdateTitleTxt());
		this.setupUpdateFrameEvent();
	}
	,setupUpdateFrameEvent: function() {
		apix.common.display.ElementExtender.off(this.get_bFrameCancel(),"click");
		apix.common.display.ElementExtender.off(this.get_bFrameValid(),"click");
		apix.common.display.ElementExtender.on(this.get_bFrameCancel(),"click",$bind(this,this.onFrameCancel));
		apix.common.display.ElementExtender.on(this.get_bFrameValid(),"click",$bind(this,this.onFrameValidUpdate));
		apix.common.display.ElementExtender.joinEnterKeyToClick(this.get_bFrameValid(),null,this.frameFieldElems[0].valueElem);
	}
	,removeUpdateFrameEvent: function() {
		if(apix.common.display.ElementExtender.hasLst(this.get_bFrameCancel(),"click")) apix.common.display.ElementExtender.off(this.get_bFrameCancel(),"click",$bind(this,this.onFrameCancel));
		if(apix.common.display.ElementExtender.hasLst(this.get_bFrameValid(),"click")) apix.common.display.ElementExtender.off(this.get_bFrameValid(),"click",$bind(this,this.onFrameValidUpdate));
		apix.common.display.ElementExtender.clearEnterKeyToClick(this.get_bFrameValid());
	}
	,onFrameCancel: function(e) {
		this.removeUpdateFrameEvent();
		apix.common.display.ElementExtender.hide(this.get_recordFrame());
	}
	,onFrameValidUpdate: function(e) {
		var fd;
		var _g = 0;
		var _g1 = this.fieldDatas;
		while(_g < _g1.length) {
			var fd1 = _g1[_g];
			++_g;
			fd1.value = apix.common.display.ElementExtender.value(this.frameFieldElems[fd1.index].valueElem);
			if(fd1.field.isPrimary) {
				this.label = fd1.value;
				apix.common.display.ElementExtender.value(this.get_labelElem(),this.label);
			} else fd1.setup();
		}
		this.askUpdate();
	}
	,askUpdate: function() {
		this.server.serverEvent.off();
		this.server.serverEvent.on($bind(this,this.onAnswerUpdate));
		var fvList = "";
		var fkList = "";
		var pfx = "";
		var _g = 0;
		var _g1 = this.fieldDatas;
		while(_g < _g1.length) {
			var fd = _g1[_g];
			++_g;
			fvList += pfx + fd.value;
			fkList += pfx + fd.key;
			pfx = "`~¤";
		}
		this.server.ask({ req : "updateOneRecord", id : this.model.get_currUserId(), recId : this.recId, formRecId : this.getParent().recId, fieldValues : fvList, fieldKeys : fkList});
	}
	,onAnswerUpdate: function(e) {
		var answ = e.result.answ;
		if(answ == "error") {
			if(e.result.msg == "connectionHasBeenClosed") this.g.alert(this.lang.connectionHasBeenClosed); else if(e.result.msg == "connectionIsNotValid") this.g.alert(this.lang.connectionIsNotValid); else if(e.result.msg == "parentFormDoesntExist") this.g.alert(this.lang.parentFormDoesntExist); else this.g.alert(this.lang.serverReadError + e.result.msg);
		} else if(answ == "updateRecordOk") {
			this.removeUpdateFrameEvent();
			apix.common.display.ElementExtender.hide(this.get_recordFrame());
			this.view.showTipBox(this.lang.updateOk,apix.common.display.ElementExtender.parent(this.get_bElem()),apix.common.display.ElementExtender.posx(this.get_bElem()),apix.common.display.ElementExtender.posy(this.get_bElem()),2);
		} else this.g.alert(this.lang.serverFatalError);
	}
	,onRemoveClick: function(e) {
		this.cb.show(Std.string(this.lang.deleteConfirm) + " " + this.get_path() + " ?",$bind(this,this.askDelete));
	}
	,askDelete: function(b,f) {
		if(b) {
			this.server.serverEvent.off();
			this.server.serverEvent.on($bind(this,this.onAnswerDelete));
			this.server.ask({ req : "deleteOneRecord", id : this.model.get_currUserId(), recId : this.recId, formRecId : this.getParent().recId});
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
		if(this.elem == null) haxe.Log.trace("Erreur in Record.remove(). Instance : label=" + this.label + " recId=" + this.recId,{ fileName : "Record.hx", lineNumber : 256, className : "safebox.models.Record", methodName : "remove"}); else apix.common.display.ElementExtender["delete"](this.elem);
		this.getParent().records.splice(this.index,1);
	}
	,showUpdateRecordFrame: function(frameTitle) {
		apix.common.display.ElementExtender.text(this.get_recordFrameTitle(),frameTitle);
		apix.common.display.ElementExtender.removeChildren(this.get_recordFieldCtnr());
		this.frameFieldElems = [];
		var _g = 0;
		var _g1 = this.fieldDatas;
		while(_g < _g1.length) {
			var fd = _g1[_g];
			++_g;
			this.frameFieldElems.push(fd.field.displayInRecordFrame(this.get_recordFieldCtnr(),this.get_fieldDataHolder(),fd.value));
		}
		apix.common.display.ElementExtender.show(this.get_recordFrame());
	}
	,__class__: safebox.models.Record
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
apix.common.event.StandardEvent.g = apix.common.util.Global.get();
apix.common.event.StandardEvent.msPointer = window.navigator.msPointerEnabled;
apix.common.event.StandardEvent.MOUSE_DOWN = apix.common.event.StandardEvent.msPointer?"MSPointerDown":apix.common.event.StandardEvent.g.get_isMobile()?"touchstart":"mousedown";
apix.common.event.StandardEvent.MOUSE_OVER = apix.common.event.StandardEvent.msPointer?"MSPointerOver":apix.common.event.StandardEvent.g.get_isMobile()?"touchstart":"mouseover";
apix.ui.UICompoLoader.baseUrl = "";
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
