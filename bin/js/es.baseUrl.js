var cst = {
	SERVER_URL:"php/server.php",
	BASE_URL:"",		
	MODEL_SRC:"custom/default/model.json",		
	LANGUAGE_SRC:"custom/default/es.language.json",	
	cssUrl:"css/"
};
var cssStr='<link href="'+cst.cssUrl+'custom.normalize.css" rel="stylesheet" />'; 	
	cssStr+='<link href="'+cst.cssUrl+'custom.foundation.css" rel="stylesheet"/>';
document.getElementsByTagName("head")[0].innerHTML+=cssStr;	
