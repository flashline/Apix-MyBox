<?php
	function refresh () {
		header("Cache-Control: no-store, no-cache, must-revalidate"); // HTTP/1.1
		header("Cache-Control: post-check=0, pre-check=0", false);
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
		header("Pragma: no-cache"); // HTTP/1.0
		header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
		/*
		alternative if not okay in all browsers :
			call "program.php?x=".mt_rand(0, 9999999)) ;
		*/
	}
	function zeroPad ($v, $n = 2 ) {
		return str_pad($v, $n, "0", STR_PAD_LEFT);
	}
	// return a GETed or POSTed field
	function getEntry ($k) {
		$allField=(strtolower($k) == "all_fields");
		// get/post	
		if (!empty($_GET)) {
			if ($allField) $v = $_GET;
			else  {
				if (!isset($_GET[$k])) $_GET[$k] = "";	
				$v = $_GET[$k];
			}			
		} else if (!empty($_POST)) {
			if ($allField) $v = $_POST;
			else {
				if (!isset($_POST[$k])) $_POST[$k] = "";	
				$v = $_POST[$k];
			}
		} else {
			if ($allField) $v = array();
			else $v = "";
		}
		return $v;
	}
	function escapeArray ($arr) {
		foreach ($arr as $key => $val) {
			$arr[$key] = simpleEscape($val);
		}
		return $arr;
	}
	function myEscapeArray ($arr) {
		foreach ($arr as $key => $val) {
			$arr[$key] = myEscape($val);
		}
		return $arr;
	}
	function myEscape ($value )	{
		// Stripslashes
		if (get_magic_quotes_gpc())  $value = stripslashes($value);
		// if not a number
		if (!is_numeric($value))  {
			$value =  "'".mysql_real_escape_string($value)."'";
		}
		return $value;
	}
	function simpleEscape ($value )	{
		// Stripslashes
		if (get_magic_quotes_gpc())  $value = stripslashes($value);
		// if not a number
		if (!is_numeric($value))  {
			$value =  mysql_real_escape_string($value) ;
		}
		return $value;
	}
	function convertLesserAndGreaterThan($v) {		
		$v = str_replace('<', '&lt;',  str_replace('>', '&gt;',  $v)); 
		return $v;
	}
	// Check input
	function checkInput($fld) {  
		if (!isset($fld) || ($fld == ''))      return false;
		 else return true ;
	}
	//
	function isEmpty ( $v )  {
		if ($v == null) return true;
		if (strlen($v) == 0) return true ;
		return false;
	}
	function sVal ( $v )  {
		if (isEmpty ( $v )) return "";	else return $v;
	}
	
	//******************************************
	function valid_email($address)
	{
	  // check an email address is possibly valid
	  $ret=preg_match ("^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$^",$address) ;
	  if ($ret==1) return true;
	  else return false;
	}	
	function convertAmp($str) {
		$str=str_replace("&","~#e",$str) ;
		return $str;
	}
	function encodeXmlReserved ($str) {
		// Dont replace by &amp; etc... 
		$str=str_replace("&","~#e",$str) ;
		$str=str_replace("<","~#{",$str) ;
		$str=str_replace(">","~#}",$str) ;
		$str=str_replace('"',"~#`",$str) ;
		return $str;
	}	
	function supprimer_les_encodages($valeur){
	  //si magic quotes est actif, retourner
	  // la valeur après suppression de l'encodage
	  //=>appel à stripslashes, sinon retourner
	  //la valeur
	  return(get_magic_quotes_gpc())?stripslashes($valeur):$valeur;
	}
	
	function valeur_saisie($valeur){
	   return supprimer_les_encodages(trim($valeur));
	}
	
	function traiter_saisie($valeur){
	  //encoder tous les caractères  HTML spéciaux
	  // EN_QUOTES (" et ')
	  return htmlentities($valeur, ENT_QUOTES);
	}
	
	function affichage_dans_page($valeur){
	   //affichage dans la page du navigateur
	  //I. encoder tous les caractères  HTML spéciaux
	  // EN_QUOTES (" et ')
	  //
	  //II. transformer les saut de lignes en <BR>
	  return nl2br(htmlentities($valeur, ENT_QUOTES));
	}
	
	//mise à jour des données dans la base
	function vers_base($valeur){
		//le seul caractère qui pose vraiment problème est l'apostrophe (')
		//c'est donc le seul qui est échappé par cette fonction
		//une solution valable pour toutes les bases
		//consiste à l'échapper par lui même => remplacement de ' par ''
		return str_replace("'", "''",$valeur);
		}
		
	// Return an error message into an Xml markup
	// Retourne un message d'erreur dans une balise Xml
	function returnErrorInXml ($errMsg) { 
		$error ="<?xml version = \"1.0\"?>\n" ;	
		$error .="<RETURN_ERROR>\n" ;	
		$error .= "<ERROR>".$errMsg."</ERROR>\n";
		$error .= "</RETURN_ERROR>\n" ;		
		return $error ;    		
	}
	//GLOBAL vars
	$msg="";
	// debug alert 
	function showAlert() {  
		GLOBAL  $msg ;
		if  (!isset($msg) || $msg=="") return ;
		$str="";
		
		 $str.='<div style="text-align:center;width:500px;border: 1px #000000 solid;background-color:#eeeeee;color:#000000; ">';
		 
		 $str.='ALERT MESSAGE  ';
		 $str.=' <div style="text-align:left;padding-left:5px;width:495px;border: 1px #000000 solid;background-color:#ffffff;color:#000000; "> ';
		 $str.=$msg;
		 $str.='</div>';
		  $str.='</div>';
		 echo $str;
	}
	function alert($txt) {  
		GLOBAL $msg ;
		$msg.=$txt."<br/>";
		
	}
	// return dd/mm/yy from mySql date
	function sqlToDisplayDate($v) {  
		return substr($v, 8, 2)."/".substr($v, 5,2)."/".substr($v, 2,2);		
	}
	// session ans login
	function sessionIsCreated($id,$pwd) {
	   return (isset($_SESSION[$id]) && isset($_SESSION[$pwd])) ;	
	}
	function createLoginSession($id,$idVal,$pwd,$pwdVal) {
	   $_SESSION[$id]=$idVal ;
	   $_SESSION[$pwd]=$pwdVal ;
	}
	function getLoginSession($id,$pwd) {
		$o=new Object();
		$o->$id=$_SESSION[$id] ;
		$o->$pwd=$_SESSION[$pwd] ;
		return $o;
	}
	
	function destroySession($b=true) {		
		if ($b) session_start();
		$_SESSION = array();
		if (ini_get("session.use_cookies")) {
			$params = session_get_cookie_params();
			setcookie(session_name(), '', time() - 42000,
				$params["path"], $params["domain"],
				$params["secure"], $params["httponly"]
			);
		}
		session_destroy();
	}
	//
	function deadlyDie($str) {		
		echo "<h1 style='color:red; '>".$str."</h1>" ;
		die("<h2 style='color:red; '>"."Program is dead !!"."</h2>");
	}
	function getUploadError($n) {
		switch($n) 
		{ 
			case UPLOAD_ERR_INI_SIZE :
				$ret = "UPLOAD_ERR_INI_SIZE";  
				break;
			case UPLOAD_ERR_NO_FILE : 
				 $ret = "UPLOAD_ERR_NO_FILE";  
				 break;
			case UPLOAD_ERR_FORM_SIZE : 
				 $ret = "UPLOAD_ERR_FORM_SIZE";  
				break;
			case UPLOAD_ERR_PARTIAL : 
				 $ret = "UPLOAD_ERR_PARTIAL";  
				break;
			default:
				$ret="" ;
				break;
		}
		return $ret;
	}
?>