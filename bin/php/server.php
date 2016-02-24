<?php
	/**************************************************************************************************
	Author : Delettre Jean-Michel
	CoAuthors : 
	Copyright / Droits d'auteur : Delettre Jean-Michel - pixaline.net
	****************************************************************************************************/
	// define classes directory
	define('CLASS_DIR', 'class/net/apixline/'); 
	
	//error_reporting (4) ;
	/*
	header('Expires: '.gmdate('D, d M Y H:i:s', (time()-1)).'GMT');
	header('Cache-Control: no-store, no-cache, must-revalidate');
	header('Cache-Control: post-check=0, pre-check=0', FALSE);
	header('Pragma: no-cache');
	*/
	ini_set('session.gc_maxlifetime', 3*60*60);
	//
	require_once(CLASS_DIR.'common/allPurpose.inc.php');
	require_once(CLASS_DIR.'common/function.php');
	require_once(CLASS_DIR.'io/Sql.php');
	require_once('db_connect.inc.php');
	refresh();
	session_start();
	//
	$adminMail = "info@pixaline.net";
	//
	$isPrimary = "false";
	$copyEnable = "true";
	$isHidden = "false";
	//
	if (count($_GET)>0) {
		if (isset($_GET["req"])) $req=$_GET["req"];
		if (isset($_GET["id"])) $id=$_GET["id"];
		if (isset($_GET["pwd"])) $pwd = $_GET["pwd"];
		if (isset($_GET["recId"])) $recId = $_GET["recId"];
		if (isset($_GET["label"])) $label = $_GET["label"];
		if (isset($_GET["type"])) $type = $_GET["type"];
		if (isset($_GET["rowNumber"])) $rowNumber = $_GET["rowNumber"];
		if (isset($_GET["copyEnable"])) $copyEnable = $_GET["copyEnable"]; else $copyEnable = "true" ;
		if (isset($_GET["isHidden"])) $isHidden = $_GET["isHidden"]; else $isHidden = "false" ;
		if (isset($_GET["isPrimary"])) $isPrimary = $_GET["isPrimary"];	else $isPrimary = "false" ;
		if (isset($_GET["formRecId"])) $formRecId = $_GET["formRecId"];
		if (isset($_GET["fieldKeys"])) $fieldKeys = $_GET["fieldKeys"];
		if (isset($_GET["fieldValues"])) $fieldValues = $_GET["fieldValues"];
		
		
	} else if (count($_POST)>0) {
		if (isset($_POST["req"])) $req=$_POST["req"];
		if (isset($_POST["id"])) $id=$_POST["id"];
		if (isset($_POST["pwd"])) $pwd = $_POST["pwd"];
		if (isset($_POST["recId"])) $recId = $_POST["recId"];
		if (isset($_POST["label"])) $label = $_POST["label"];
		if (isset($_POST["type"])) $type = $_POST["type"];
		if (isset($_POST["rowNumber"])) $rowNumber = $_POST["rowNumber"];
		if (isset($_POST["copyEnable"])) $copyEnable = $_POST["copyEnable"]; else $copyEnable = "true" ;
		if (isset($_POST["isHidden"])) $isHidden = $_POST["isHidden"]; else $isHidden = "false" ;
		if (isset($_POST["isPrimary"])) $isPrimary = $_POST["isPrimary"];	else $isPrimary = "false" ;
		if (isset($_POST["formRecId"])) $formRecId = $_POST["formRecId"];
		if (isset($_POST["fieldKeys"])) $fieldKeys = $_POST["fieldKeys"];
		if (isset($_POST["fieldValues"])) $fieldValues = $_POST["fieldValues"];
	} 
	//
	if ($isPrimary == "true") $isPrimary = 1;
	if ($isPrimary == "false") $isPrimary = 0;
	if ($copyEnable == "true") $copyEnable = 1;
	if ($copyEnable == "false") $copyEnable = 0;
	if ($isHidden == "true") $isHidden = 1;
	if ($isHidden == "false") $isHidden = 0;
	// Sql server connect
	if (!isset($req)) outPutAndExit (sendInvalidReq());	
	$err = doDbConnection ($myHost, $myId, $myPwd, $myDb) ;
	if ($err != "") outPutAndExit ($err);
	//
	////////////////////////////////////////////////////
	// added to be PMA compatible
	mysql_query("SET character_set_client = utf8");
	mysql_query("SET character_set_results = utf8");
	//mysql_query("SET character_set_server = utf8");
	//mysql_query("SET collation_server=utf8_general_ci");
	//mysqli::set_charset ( "utf8" );
	//mysql_query("SHOW VARIABLES LIKE 'character_set%'");	
	// OR
	//mysql_query("SET NAMES UTF8");
	//
	// connect actions	
	     if ($req=="isConnectionOpen") 		outPutAndExit (isConnectionOpen());
	else if ($req=="signIn") 				outPutAndExit (signIn($id,$pwd));
	else if ($req=="logOff") 				outPutAndExit (logOff());
	else if ($req== "signUp") 				outPutAndExit (signUp($id,$pwd));
	else if ($req== "updateFormFolder") 	outPutAndExit (updateFormFolder($id,$recId,$label));
	else if ($req== "insertFormFolder") 	outPutAndExit (insertFormFolder($id,$label,$recId,$type));
	else if ($req== "deleteFormFolder") 	outPutAndExit (deleteFormFolder($id,$recId));
	else if ($req== "updateField") 			outPutAndExit (updateField($id,$recId,$label,$rowNumber,$copyEnable,$isHidden,$isPrimary));
	else if ($req== "deleteField") 			outPutAndExit (deleteField($id,$recId));
	else if ($req== "insertField") 			outPutAndExit (insertField($id,$label,$recId,$rowNumber,$copyEnable,$isHidden,$isPrimary));
	else if ($req == "readRecords") 		outPutAndExit (readRecords($id,$recId));
	else if ($req== "updateOneRecord") 		outPutAndExit (updateOneRecord($id,$recId,$formRecId,$fieldValues,$fieldKeys));
	else if ($req== "deleteOneRecord") 		outPutAndExit (deleteOneRecord($id,$recId,$formRecId));
	else if ($req== "insertOneRecord") 		outPutAndExit (insertOneRecord($id,$formRecId,$fieldValues,$fieldKeys));
	
	
	else 
		outPutAndExit (sendInvalidReq());
	// gets	
	function getPwd() {
		return $_SESSION['pwd'];
	}
	function getId() {
		return $_SESSION['id'] ;
	}	
	function setId($str) {
		$_SESSION['id']=$str ;
	}	
	function setPwd ($str) {
		$_SESSION['pwd']=$str;
	}

	//
	
	function isConnectionOpen() {
		if(!sessionIsOpened ()) {
			$out="answ=connectionIsNotOpen";
		} else {
			$out = "answ=connectionIsOpen&xmlData=".readData(getId())."&id=".getId();			
		}		
		return $out;
	}
	
	function signIn($id,$pwd) {
		if(sessionIsOpened () ) { 
			$out="answ=error&msg=connectionAlreadyOpen";
		} else if (!inputValid($id,$pwd)) {
			$out="answ=error&msg=noValidLogin";		
		} else {
			$sql = new Sql(); $where = " id='$id' AND pwd='".md5($pwd)."' ";			
			if (!$sql->isLineExistWhere ("login", $where)) {
				$out = "answ=error&msg=loginDoesntExist";	
			}
			else {	
				setId($id) ; setPwd($pwd);				
				$out="x=x&answ=signInOk&xmlData=".readData($id)."&id=".$id;
			}					
		}
		return $out;
	}	
	function signUp($id,$pwd) {
		if (!inputValid($id,$pwd)) {
			$out="answ=error&msg=noValidLogin";		
		} else {			
			if(sessionIsOpened()) {
				unset($_SESSION['id']); unset($_SESSION['pwd']); 
			} 			
			$sql = new Sql(); 
			if ($sql->isLineExist ("login", "id", $id)) {
				$out = "answ=error&msg=idAlreadyExist";	
			}
			else {					
				$sql->query("INSERT INTO login ( id , pwd ) VALUES ( '$id' , '".md5($pwd)."') ;") ;
				if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;
				else {
					setId($id) ;
					setPwd($pwd);			
					$out="answ=signUpOk&id=".$id."";
				}
			}			
		}
		return $out;
	}
	function logOff() {		
		if(sessionIsOpened () ) {
			$id=getId() ;
		} else $id="";
		$out="answ=logOffOk&id=".$id."";	
		destroySession(false);
		return $out;
	}
	function updateFormFolder($id,$recId,$label) {		
		//$out = isConnectionValid($id); if ($out=="") {
		$out = isConnectionValid($id); 
		if ($out=="") {
			$sql = new Sql(); 
			$qry = "UPDATE folders SET label =  '".simpleEscape($label)."' WHERE  owner ='".$id."' AND id =".$recId."   ; ";
			$sql->query($qry) ;
			if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;
			else $out="answ=updateFormFolderOk";
		}
		return $out;
	}
	function insertFormFolder($id, $label, $parentId, $type) {	
		if ($type == "form") $isForm = 1;
		else $isForm = 0; 		
		$out = isConnectionValid($id); 
		if ($out=="") {
			$sql = new Sql(); 
			if ($parentId!=0 && !$sql->isLineExist("folders", "id", $parentId)) {
				$out="answ=error&msg=parentFolderDoesntExist";
			}
			else {
				$qry="INSERT INTO folders ( owner,parent_id,label,is_form ) VALUES ( '".$id."' , ".$parentId." , '".simpleEscape($label)."' , ".$isForm." ) ;";
				$sql->lockInsertAndGetId("folders", $qry);
				if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;
				else {
					$sql->selectOneLineWhere  ("folders", "id=LAST_INSERT_ID()");
					$out = "answ=insertFormFolderOk&recId=".$sql->line->id;
				}
			}
		}
		return $out;
	}
	function deleteFormFolder($id,$recId) {	
		$out = isConnectionValid($id); 
		if ($out=="") {
			$sql = new Sql(); 
			$where = " id=$recId AND owner='$id' ";
			if (!$sql->isLineExistWhere("folders", $where)) {			
				$out="answ=error&msg=elemDoesntExist";
			}
			else {
				
				if (!recursiveDelete($id, $recId)) $out = "answ=error&msg=".$sql->errorMsg;
				else {
					$out = "answ=deleteFormFolderOk";
				}
				
				
			}
		}
		return $out;
	}
	function recursiveDelete ( $id, $recId) {
		$sql = new Sql(); 
		$sql->selectWhere("folders", "parent_id='".$recId."' AND owner='".$id."' ") ;
		while ($sql->nextLine()) {
			if (!recursiveDelete ($id, $sql->line->id))  return false ;
		}
		//
		if ($sql->isLineExistWhere("fields", "form_id=$recId")) {
			$qry = "DELETE FROM fields WHERE form_id=$recId ; " ;
			$sql->query($qry) ;
		}
		//
		$table = "tb_".$recId;
		if (tableExists($table)) {
			$qry = "DROP TABLE $table ; " ;
			$sql->query($qry) ;
		}		
		//
		$qry = "DELETE FROM folders WHERE id='".$recId."' AND owner='".$id."' ; " ;
		$sql->query($qry) ;
		return ($sql->success) ;
	}
	function tableExists($table) {
		$qry = "SELECT table_name
				FROM information_schema.tables
				WHERE table_schema = 'safe_db'
				AND table_name = '$table';" ; 
		$buf = mysql_query($qry);
		$b = (mysql_num_rows($buf) > 0 )  ;
		return $b;
	}
	function updateField($id,$recId, $label, $row_number, $copy_enable, $is_hidden, $is_primary) {
		$out = isConnectionValid($id); 
		if ($out=="") {
			$out= isFieldExists($id, $recId);
			if ($out=="") {
				$sql = new Sql(); 
				if ($is_primary) $row_order = 0; else $row_order = 1;
				$qry = "UPDATE fields SET 
						row_order	=  ".$row_order." ,
						label 		=  '".simpleEscape($label)."' ,
						row_number 	=  ".$row_number." ,
						copy_enable =  ".$copy_enable." ,
						is_hidden 	=  ".$is_hidden.",
						is_primary 	=  ".$is_primary." 				
						WHERE id = ".$recId." ; ";
				$sql->query($qry) ;
				if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;
				else $out = "answ=updateFieldOk";
			}
		}
		return $out;
	}
		
	function deleteField($id, $recId) {	
		$out = isConnectionValid($id); 
		if ($out=="") {
			$out = isFieldExists($id, $recId);
			if ($out == "") {
				$sql = new Sql(); 
				$sql->selectOneLine("fields", "id", $recId) ;
				$line = $sql->line ;
				$table="tb_".$line->form_id;
				$qry = "DELETE FROM fields WHERE id=$recId ; " ;
				$sql->query($qry) ;
				if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;
				else {
					if (tableExists($table)) removeColumnIfExists ($table, "fd_".$recId) ;
					$out = "answ=deleteFieldOk";
				}
			}
		}
		return $out;
	}
	function isFieldExists($id, $recId) {
		$out = "";
		$sql = new Sql(); 
		if (!$sql->isLineExist("fields", "id", $recId)) $out="answ=error&msg=elemDoesntExist";
		else {
				$where = " owner='$id' AND id=".$sql->line->form_id." ";
				if (!$sql->isLineExistWhere("folders", $where )) $out = "answ=error&msg=invalidFormOwner";
		}
		return $out;
	}
	
	
	
	function removeColumnIfExists ($table,$col) {
		$qry="SELECT * 
				FROM information_schema.COLUMNS 
				WHERE 
				TABLE_SCHEMA = 'safe_db' 
				AND TABLE_NAME = '$table' 
				AND COLUMN_NAME = '$col' ; " ;
		$buf = mysql_query($qry);
		$exist = (mysql_num_rows($buf) > 0 )  ;
		if ($exist) {
			$qry = "ALTER TABLE  `$table` DROP  `$col` ;" ;
			mysql_query($qry) ;
		}
	}
	
	function insertField($id,$label, $parent_id, $row_number, $copy_enable, $is_hidden, $is_primary) {
		$out = isConnectionValid($id); 
		if ($out=="") {
			$sql = new Sql(); 
			if (!$sql->isLineExistWhere("folders", " owner='$id' AND id = $parent_id AND  is_form = true ")) {
				$out="answ=error&msg=parentFormDoesntExist";
			}
			else {
				if ($is_primary) $row_order = 0; else $row_order = 1;
				$qry = "INSERT INTO fields (form_id,row_order,label,row_number,copy_enable,is_hidden,is_primary) 
				        VALUES ( $parent_id, $row_order, '".simpleEscape($label)."', '$row_number', $copy_enable, $is_hidden, $is_primary  ) ;";
				$sql->lockInsertAndGetId("fields", $qry);
				if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;
				else {
					$sql->selectOneLineWhere  ("fields", "id=LAST_INSERT_ID()");
					$out = "answ=insertFieldOk&recId=".$sql->line->id;
				}
			}
		}
		return $out;
	}
	
	
	function updateOneRecord($id,$recId,$formRecId,$fieldValues,$fieldKeys) {
		$out = isConnectionValid($id); 
		if ($out=="") {
			$sql = new Sql(); 			
			if (!$sql->isLineExistWhere("folders", " owner='$id' AND id=$formRecId AND is_form = true ")) {
				$out="answ=error&msg=parentFormDoesntExist";
			}
			else {
				$table = "tb_" . $formRecId;
				$keys = explode("`~¤",$fieldKeys); 
				$values = explode("`~¤",$fieldValues); 
				if (!$sql->isLineExist($table, "id", $recId)) {
					$out="answ=error&msg=elemDoesntExist";
				}
				else {
					$qry = "UPDATE $table SET "; $pfx = "";
					for ($i = 0 ; $i < count($keys) ; $i++) {
						$qry.= $pfx.$keys[$i]." = '".simpleEscape($values[$i])."' ";
						$pfx = ",";
						addColumnIfNotExists($table,$keys[$i]);
					} 
					$qry.="WHERE id = ".$recId." ; ";
					$sql->query($qry) ;
					if (!$sql->success) {
						$out = "answ=error&msg=".$sql->errorMsg;
					}
					else $out = "answ=updateRecordOk";
				}
			}
		}
		return $out;
	}
	function addColumnIfNotExists ($table,$col) {
		$qry="SELECT * 
				FROM information_schema.COLUMNS 
				WHERE 
				TABLE_SCHEMA = 'db_safe' 
				AND TABLE_NAME = '$table' 
				AND COLUMN_NAME = '$col' ; " ;
		$buf = mysql_query($qry);
		$exist = (mysql_num_rows($buf) > 0 )  ;
		if (!$exist) {
			$qry = "ALTER TABLE  `$table` ADD  `$col` TEXT NOT NULL" ;
			mysql_query($qry) ;
		}
	}
	
	
	function deleteOneRecord($id,$recId, $formRecId) {
		$out = isConnectionValid($id); 
		if ($out=="") {
			$table = "tb_" . $formRecId;
			$sql = new Sql(); 
			if (!$sql->isLineExist($table, "id", $recId)) $out="answ=error&msg=elemDoesntExist";
			else if (!$sql->isLineExistWhere("folders", " owner='$id' AND id=$formRecId AND is_form = true ")) $out="answ=error&msg=parentFormDoesntExist";
			else {				
				$qry = "DELETE FROM $table WHERE id=$recId  ; " ;
				$sql->query($qry) ;
				if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;
				else {
					$out = "answ=deleteRecordOk";
				}
			}
		}
		return $out;
	}
	function insertOneRecord($id,$formRecId,$fieldValues,$fieldKeys) {
		$out = isConnectionValid($id); 
		if ($out=="") {
			$sql = new Sql(); 
			if (!$sql->isLineExistWhere("folders", " owner='$id' AND id=$formRecId AND is_form = true ")) {
				$out="answ=error&msg=parentFormDoesntExist";
			}
			else {			
				$table = "tb_" . $formRecId;
				$keys = explode("`~¤",$fieldKeys); 
				$values = explode("`~¤",$fieldValues); 			
				$qry = "";
				$qry.="CREATE TABLE IF NOT EXISTS `$table` ( `id` bigint(20) NOT NULL AUTO_INCREMENT, ";
				for ($i = 0 ; $i < count($keys) ; $i++) {
					$qry.= "`".$keys[$i]."` text NOT NULL,"  ;
				} 
				$qry.= "PRIMARY KEY (`id`) ) ;";
				$sql->query($qry);		  
				if ($sql->success == false) {
					$out="answ=error&msg=".$sql->errorMsg;
				}
				else {
					$pfx = ""; $qry = "";
					$qry .= "INSERT INTO `$table`  ( "; 
					for ($i = 0 ; $i < count($keys) ; $i++) {
						$qry.= $pfx." `".$keys[$i]."`" ;
						$pfx = ",";
					} 
					$qry.= ") VALUES ( "; $pfx = "";
					for ($i = 0 ; $i < count($values) ; $i++) {
						$qry.= $pfx." '".simpleEscape($values[$i])."'" ;
						$pfx = ",";
					} 				
					$qry.= ") ; ";
					$sql->lockInsertAndGetId($table, $qry);
					if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg."&qry=".$qry;
					else {
						$sql->selectOneLineWhere  ($table, "id=LAST_INSERT_ID()");
						$out = "answ=insertRecordOk&recId=".$sql->line->id;
					}
				}
			}
		}
		return $out;
	}
	
	//	
	//
	//	
	//
	function readData ($id) {
		$out="<?xml version = \"1.0\" encoding=\"UTF-8\" ?> \n";
		$out.="<root>\n";
		$out.=readFoldersFormsAndFields($id);		
		$out.="</root>\n";	
		return $out;	
	}
	function readFoldersFormsAndFields ($id) {
		$out="";
		$out.="<folders>\n";
		$out.=" <item></item>\n";			
		$sql=new Sql(); $qry="SELECT * FROM folders USE INDEX (parent_idx) WHERE owner='$id' ORDER BY owner,parent_id,is_form,label,id"; 
		$sql->query($qry);
		if (!$sql->success) {
			$out=" <error>".$sql->errorMsg."</error>\n";
		} 
		else {
			while ($sql->nextLine()) {
				$o=$sql->line; 
				if ($o->is_form) $b="true"; else $b="false";
				$out.=" <item>\n";
				$out.="   <parent_id>".$o->parent_id."</parent_id>\n";
				$out.="   <is_form>".$b."</is_form>\n";
				$out.="   <label>".$o->label."</label>\n";
				$out.="   <id>".$o->id."</id>\n";
				//
				if ($b=="true") $out.= readFields ($o->id);
				//
				$out.=" </item>\n";
			}
		}
		$out.="</folders>\n";
		return $out;	
	}
	function readFields ($formId) {
		$out="";	
		$out.=" <fields>\n";
		$out.="  	<item></item>\n";	
		$sql=new Sql(); $qry="SELECT * FROM fields USE INDEX (row_order_idx) WHERE form_id='$formId' ORDER BY form_id,row_order"; 
		$sql->query($qry);
		if (!$sql->success) {
			$out.="<error>".$formId.":".$sql->errorMsg."</error>\n";
		} 
		else {
			while ($sql->nextLine()) {
				$o=$sql->line; 
				if ($o->copy_enable) $c="true"; else $c="false";
				if ($o->is_hidden) $h="true"; else $h="false";
				if ($o->is_primary) $p="true"; else $p="false";
				$out.="  	<item>\n";
				//$out.="    <form_id>".$o->form_id."</form_id>\n";
				$out.="    		<id>".$o->id."</id>\n";
				$out.="    		<label>".$o->label."</label>\n";
				$out.="    		<row_number>".$o->row_number."</row_number>\n";
				$out.="    		<copy_enable>".$c."</copy_enable>\n";
				$out.="    		<is_hidden>".$h."</is_hidden>\n";
				$out.="    		<is_primary>".$p."</is_primary>\n";
				$out.=" 	 </item>\n";			
			}
		}
		$out.=" </fields>\n";		
		return $out;	
	}
	function readRecords ($id,$formId) {		
		$out="<?xml version = \"1.0\" encoding=\"UTF-8\" ?> \n";
		$out.="<root>\n";
		$out.="	<records>\n";
		$out.=" 		<item></item>\n";
		$er=getConnectionStatus($id);
		if ($er!="") {
			$out.="			<error>$er</error>\n";
		} 
		else {
			$tb="tb_".$formId;	
			if (mysql_query("DESCRIBE `$tb`")) {
				$primary=getPrimaryField($formId);
				$sql=new Sql();
				$where="true ORDER BY ".$primary ;
				$sql->selectWhere ($tb, $where) ;
				if (!$sql->success) {
					$out.="			<error>".$sql->errorMsg."</error>\n";
				}
				else {
					while ($sql->nextLine()) {
						$o=$sql->line; 
						$out.="  		<item>\n";
						foreach ($o as $key => $elem) $out.="	    		<".$key.">".$elem."</".$key.">\n"; 	
						$out.="  		</item>\n";
					}				
				}
			} 
			else $out.="		<error>tableDoesntExist</error>\n"; 
		}
		$out.="	</records>\n";
		$out.="</root>\n";
		return $out;
    }
	function getPrimaryField ($formId) {
		$sql=new Sql(); $out="";
		$where="is_primary = true AND form_id=$formId";
		$sql->selectOneLineWhere ("fields",$where) ;
		if (!$sql->empty) $out="fd_".$sql->line->id;
		return $out;
	}
	//
	//
	//
	function sendInvalidReq() {
		$out="answ=error&msg=invalidRequest";		
		return $out;
	}	
	function inputValid($id,$pwd) {
		if (!isset($pwd) || !isset($id) ) return false ;
		else if ( $pwd == "" ||  $id == "" ) return false ;
		else if (!valid_email($id) ) return false ;
		else return true ;
	}
	
	function sessionIsOpened () {
		return (isset($_SESSION["id"])) ;
	}
	function isConnectionValid($id=null) {
		$out= getConnectionStatus($id);
		if ($out!="") $out="answ=error&msg=$out" ;
		return $out;
	}
	function getConnectionStatus($id=null) {
		if(!sessionIsOpened ()) return "connectionHasBeenClosed";
		else if ($id!=null && $id!=getId()) return "connectionIsNotValid" ;
		else return "" ;
	}
	function doDbConnection ($host, $id, $pwd, $db) {
		  $s = new Server($host, $id, $pwd);
		  if ($s->connec_host()) {
				if ($s->connec_base($db)) return "";
				else {
					$out="answ=error&msg=invalidDbName";
					return $out;
				}
		  } else {
				$out="answ=error&msg=invalidDbServer";
				return $out;;
		  }
	}
	function outPutAndExit($out) {
		echo $out;
		doExit();
	}	
	function doExit() {
		showAlert();
		exit();
	}	
?>

