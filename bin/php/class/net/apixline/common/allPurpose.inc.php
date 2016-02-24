<?php
/**************************************************************************************************
SoftWare : all
File : allpurpose.inc.php
Description : Classes for all php programs
Content : Basic and general classes
Author : Delettre Jean-Michel
CoAuthors : 
Copyright / Droits d'auteur : Free-Works.Org
****************************************************************************************************/

class Import {
	 var $path ;
	 
	 static function setup($p) {
	 	global $path;
		$path = $p;	 					
	 }
	 static function load($f) {
		global $path;
	 	require_once $path.$f	 ;					
	 }
	 
	 	 
}
// language for Php
class Language {
	 var $language ;
	 
	 // Constructor
	 function Language($language) {
	 		  $this->language = $language ;
				if ($language<>"") {
					require  $language ;
				}						
	 }
	 	 
}

// server and databases connexion
class Server 
{
	
	var $connec_host_ok;
	var $host;
	var $login;
	var $pass;
	var $connec_base_ok;
	var $base;
	var $err;
	
	
	// Constructeur
    function __construct ($host,$login,$pass) {
		 $this->host   = $host ;
		 $this->login  = $login ;
		 $this->pass   = $pass ;
		 $this->err = "";
	}
	function connec_host()	{		   
		   $this->connec_host_ok =  mysql_connect($this->host,$this->login,$this->pass); 
		   if (! $this->connec_host_ok) {
				$this->err = mysql_error();
		   }
		   return   $this->connec_host_ok ;
	}
	
	function connec_base($db) {    
		   $this->connec_base_ok = mysql_select_db($db);	
		   if (! $this->connec_base_ok) {
				$this->err = mysql_error();
		   } else {
				$this->base = $db ;  
				return   $this->connec_base_ok ;
		   }
	}
	
	
	function info()
	{
		   echo "Nom du serveur : $this->host<br>";
		   echo "Login          : $this->login<br>";
		   echo "Mot de passe   : $this->pass<br>"; 
		    
	}	
	
}
class Object
{    	
	function __construct($t = array()) {   
		if ($t!=null) {
			foreach ($t as $key => $elem) {    			
				$this->$key = $elem ;    			
			} 
		}
	}
	function setProp($name, $val) {
		$this->$name = $val ;
	}
	function toString($k="") {
		$str = "";			
		foreach ($this as $key => $elem) { 			
			if ($key == $k || $k == "") {
				if ($elem==null)	$str.= "this->".$key."=<br/>"; 
				else if (is_object ($elem) )	$str.="this->".$key."= {...} <br/>";   
				else $str.= "this->".$key."=".$elem."<br/>"; 
			}
		} 
		return $str;
	}
	function toXmlString ($b = false,$t=1) {
		$str = "";		
		foreach ($this as $key => $elem) {   
			for ($i = 0; $i < $t; $i++ ) { $str.= "\t";  }
			if ($b) $elem = "[CDATA[".$elem."]]" ;
			$str.= "<".$key.">".$elem."</".$key.">\n";			
		} 
		return $str;
	}
	function length () {
		return count($this);
	}
	function convertLesserAndGreaterThan() {		
		foreach ($this as $key => $elem) {     
			if (!is_numeric($elem)) {
				$this->$key=str_replace('<', '&lt;',  str_replace('>', '&gt;',  $this->$key)); 
			}
		}
	}
}

/**
* LowLevelServ  A class with basics static methods
*/
class LLS { 
	
	const NONE = 0 ;
	
	/////////////////////////////////////////////////////////////////////////////////
	// Public method :
	// genDynPwd()
	//		Input 	: <nothing>
	// 		return  : an object
	//				<object>->genPwd  : a password genered by time()
	//				<object>->genTime : The time() 
	/////////////////////////////////////////////////////////////////////////////////////
	static function genCryptId ($id) {
		$t = array( "cryptId" =>(substr(md5(time()),0,20).substr(md5($id),0,20)),"realTime"=>time()  ); 
		$o = new Object($t) ;
		return $o ;
	}
	/////////////////////////////////////////////////////////////////////////////////
    	// Public method :
    	// getNSnumber()
    	//		Input 	: 
    	//			nothing
    	// 		return  : 
    	//			a new NoSpam number of 4 digits
    	/////////////////////////////////////////////////////////////////////////////////////
    static function getNSnumber() {			
		$n=mt_rand();
		$n2=floor($n/9999)*9999;
		$m=$n-$n2;
		if($m<1000) $m*=10;
		if($m<100) $m*=100;
		return $m;
	}
	/////////////////////////////////////////////////////////////////////////////////
	// Public method :
	// htmlLinkOf()
	//		Input 	: 
	//			str $url <= link content
	//			str $txt <= what is displayed
	// 		return  : 
	//			str the <A> balise
	/////////////////////////////////////////////////////////////////////////////////////
	static function htmLinkOf ($url,$txt) {
		if ( ($txt=="") || (!isset($txt))) $txt=$url ;
		return "<a href=\"".$url."\">".$txt."</a>" ;
		}    	
		/////////////////////////////////////////////////////////////////////////////////
	// Public method :
	// browserIs()
	//		Input 	: 
	//			str $str <= a string with 'msie' , 'safari' , 'gecko' , 'mozilla/4' , etc
	// 		return  : 
	//			false or a string 
	/////////////////////////////////////////////////////////////////////////////////////
	static function browserIs ($str) {
		 $agent = ( isset( $_SERVER['HTTP_USER_AGENT'] ) ) ? strtolower( $_SERVER['HTTP_USER_AGENT'] ) : '';
			 return (stristr($agent,$str)) ; 	
		}    
	static function getBrowserString () {
		 $agent = ( isset( $_SERVER['HTTP_USER_AGENT'] ) ) ? strtolower( $_SERVER['HTTP_USER_AGENT'] ) : '';
			 return $agent ; 	
		} 
		/////////////////////////////////////////////////////////////////////////////////
	// Public method :
	// checkMail()
	//		Input 	: 
	//			str $str <= a string with an email
	// 		return  : 
	//			"" if okay or a string with an err code.
	/////////////////////////////////////////////////////////////////////////////////////
	static function checkMail ($str) {
			$char = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9,_,@,-,.";
			$arr = explode(",",$char);	
			for($i=0 ;$i<strlen($str);$i++) {
				$ok=false;
				foreach ($arr as $elem) {	
				  if (substr($str,$i,1)==$elem) {
						$ok=true;		
						break;
					}
				}
				if(!$ok) break ;
			}
			if(!$ok) return "invalidChar";  
			$p = strpos($str,"@",0); 
			if ( ($p < 1 )  || ($p == strlen($str)-1 )  ) return "invalidMail" ;
			else return "";
		} 
		
	/**
	* @return The formated current date and time
	*/
	
	static function currentDate () {		
		 return date("l d M Y / H : i ",time());
	}
	/**
	* @return The current set of  error types constants
	*/
	static function getErrorType() 
	{ 
		$type = ini_get('error_reporting');
		$return =""; 
		if($type & E_ERROR) // 1 // 
			$return.='& E_ERROR '; 
		if($type & E_WARNING) // 2 // 
			$return.='& E_WARNING '; 
		if($type & E_PARSE) // 4 // 
			$return.='& E_PARSE '; 
		if($type & E_NOTICE) // 8 // 
			$return.='& E_NOTICE '; 
		if($type & E_CORE_ERROR) // 16 // 
			$return.='& E_CORE_ERROR '; 
		if($type & E_CORE_WARNING) // 32 // 
			$return.='& E_CORE_WARNING '; 
		if($type & E_CORE_ERROR) // 64 // 
			$return.='& E_COMPILE_ERROR '; 
		if($type & E_CORE_WARNING) // 128 // 
			$return.='& E_COMPILE_WARNING '; 
		if($type & E_USER_ERROR) // 256 // 
			$return.='& E_USER_ERROR '; 
		if($type & E_USER_WARNING) // 512 // 
			$return.='& E_USER_WARNING '; 
		if($type & E_USER_NOTICE) // 1024 // 
			$return.='& E_USER_NOTICE '; 
		if($type & E_STRICT) // 2048 // 
			$return.='& E_STRICT '; 
		if($type & E_RECOVERABLE_ERROR) // 4096 // 
			$return.='& E_RECOVERABLE_ERROR '; 
		if($type & E_DEPRECATED) // 8192 // 
			$return.='& E_DEPRECATED '; 
		if($type & E_USER_DEPRECATED) // 16384 // 
			$return.= '& E_USER_DEPRECATED '; 
		$return = substr($return, 2);
		//alert("php error types= ".$return."<br>"); 
		return $return; 
	} 
	/**
	* set error_reporting
	* @param $mode A pre-defined "dev","debug" or "prod" setting
	* 
	*/
	static function setErrorType($mode) {
		 switch(strtolower ( $mode)) 
		{ 
			case "dev":
				error_reporting(E_ALL | E_STRICT) ;     
				break;
			case "debug": 
				 error_reporting( E_ERROR | E_WARNING | E_PARSE | E_NOTICE | E_USER_ERROR | E_USER_WARNING ) ; 
				 break;
			case "prod": 
				error_reporting(0) ;
				break;
			default:
				error_reporting(0) ;
				break;
		}
	}
	
}

	
?>