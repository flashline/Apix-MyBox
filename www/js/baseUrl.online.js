var cst = {
	SERVER_URL:"php/server.php",
	BASE_URL:"",		
	MODEL_SRC:"custom/default/model.json",		
	LANGUAGE_PATH:"custom/default/",	
	LANGUAGE_FILE:".language.json",	
	cssUrl:"css/"
};
var apixCst = {
				BASE_URL:''
			};
var cssStr='<link href="'+cst.cssUrl+'custom.normalize.css" rel="stylesheet" />'; 	
	cssStr+='<link href="'+cst.cssUrl+'custom.foundation.css" rel="stylesheet"/>';
	cssStr+='<link href="'+cst.BASE_URL+cst.cssUrl+'style.css" rel="stylesheet"/>';
document.getElementsByTagName("head")[0].innerHTML+=cssStr;
