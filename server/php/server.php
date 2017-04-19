<?php
	/**************************************************************************************************
	Author : Delettre Jean-Michel
	Co Authors : 
	Copyright / Droits d'auteur : Delettre Jean-Michel - pixaline.net
	****************************************************************************************************/
	// define classes directory
	define('CLASS_DIR', 'class/net/apixline/'); 
	define('FAILURE_DELAY_UNIT', 60*5); // 5mn
	define('FAILURE_MIN', 2); // FAILURE_MIN errors without reaction
	define('FAILURE_MAX', 8); // (FAILURE_MAX-FAILURE_MIN)*FAILURE_DELAY_UNIT = max freeze duration in sec.
	define('ADMIN_MAIL', 'info@pixaline.net'); // MyBox admin mail
	
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
	$dtArr = array (
    "InputField"  	=> "TINYTEXT",
    "AreaField" 	=> "TEXT",
	"SelectField" 	=> "VARCHAR (5) DEFAULT '[-1]'" ,
	"SelectField_m"	=> "VARCHAR (255) DEFAULT '[-1]'" ,
	"CheckField"	=> "VARCHAR (255) DEFAULT '[-1]'" ,
	"RadioField"	=> "TINYINT (2) DEFAULT '-1'" ,
	"NumberField0"	=> "DECIMAL (12,0) " ,
	"NumberField1"	=> "DECIMAL (12,1) " ,
	"NumberField2"	=> "DECIMAL (12,2) " ,
	"NumberField3"	=> "DECIMAL (12,3) " ,
	"NumberField4"	=> "DECIMAL (12,4) " ,
	"NumberField5"	=> "DECIMAL (12,5) " ,
	"GeoField"		=> "VARCHAR (40) " ,
	"SignField"		=> "TEXT" , 		// normally a base64 sign drawing is < 30kb
	"PhotoField"	=> "MEDIUMTEXT" , 	// if many photos then total size may be greater than 64kb
	"Slider"		=> "VARCHAR (20) DEFAULT '[]'" , 	
	"DateField"		=> "DATE" , 	
	"ColorField"	=> "VARCHAR (7) DEFAULT '#000000'", 	
	"LinkField"		=> "TINYTEXT", 	
	"EmailField"	=> "TINYTEXT", 	
	"" 				=> ""
	)
	;
	$data = "";
	//
	if (count($_GET)>0) {
		if (isset($_GET["req"])) $req = $_GET["req"];
		if (isset($_GET["data"])) $data = $_GET["data"];  
		
	} 
	else if (count($_POST)>0) {
		if (isset($_POST["req"])) $req=$_POST["req"];		
		if (isset($_POST["data"])) $data = $_POST["data"]; 				
	} 
	if ( $data != "") $o = json_decode($data); else $o =  Null;
	// Sql server connect
	if (!isset($req)) outPutAndExit (sendInvalidReq());	
	$err = doDbConnection ($myHost, $myId, $myPwd, $myDb) ;
	if ($err != "") outPutAndExit ($err);
	//
	////////////////////////////////////////////////////
	// added to be PMA compatible
	mysql_query("SET character_set_client = utf8");
	mysql_query("SET character_set_results = utf8");
	//
	// connect actions	
		 if ($req=="isConnectionOpen") 		outPutAndExit (isConnectionOpen());
	else if ($req=="signIn") 				outPutAndExit (signIn($o));
	else if ($req=="logOff") 				outPutAndExit (logOff());
	else if ($req== "signUp") 				outPutAndExit (signUp($o));
	else if ($req== "updateFormFolder") 	outPutAndExit (updateFormFolder($o));
	else if ($req== "insertFormFolder") 	outPutAndExit (insertFormFolder($o));
	else if ($req== "deleteFormFolder") 	outPutAndExit (deleteFormFolder($o));
	else if ($req== "updateField") 			outPutAndExit (updateField($o));
	else if ($req== "insertField") 			outPutAndExit (insertField($o));
	else if ($req== "deleteField") 			outPutAndExit (deleteField($o));
	//
	else if ($req== "updateSelectField") 	outPutAndExit (updateSelectField($o));
	else if ($req== "updateCheckField") 	outPutAndExit (updateCheckField($o));
	else if ($req== "updateRadioField") 	outPutAndExit (updateRadioField($o));
	else if ($req== "updateNumberField") 	outPutAndExit (updateNumberField($o));
	else if ($req== "updateSlider") 		outPutAndExit (updateSlider($o));
	//
	else if ($req== "readRecords") 			outPutAndExit (readRecords($o));
	else if ($req== "updateOneRecord") 		outPutAndExit (updateOneRecord($o));
	else if ($req== "insertOneRecord") 		outPutAndExit (insertOneRecord($o));
	else if ($req== "deleteOneRecord") 		outPutAndExit (deleteOneRecord($o));
	else if ($req== "readFieldData") 		outPutAndExit (readFieldData($o));
	else if ($req== "verifySecureCode") 	outPutAndExit (verifySecureCode($o));
	else if ($req== "initialize") 			outPutAndExit (initialize($o));
	
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
	//	
	// public service functions
	//
	// connection
	function isConnectionOpen() {
		if(!sessionIsOpened ()) {
			$out="answ=connectionIsNotOpen";
		} else {
			$out = readData(getId());
			if (substr($out, 0, 1) != "{") $out="answ=error&msg=$out";
			else $out = "answ=connectionIsOpen&data=".convertAmp($out)."&id=".getId();			
		}		
		return $out;
	}		
	function signIn($o) {
		$id =""; $pwd = "";
		if ($o != Null) { $id = $o->id ; $pwd = $o->pwd ; }
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
				$d = loginIsFrosen($id);
				if ($d) $out = "answ=error&msg=loginFrozen&delay=".$d."&id=".$id ;
				else {
					setId($id) ; setPwd($pwd);
					$out = readData($id);
					if (substr($out, 0, 1) != "{") $out="answ=error&msg=$out";
					else $out = "answ=signInOk&data=".convertAmp($out)."&id=".$id;
				}
			}					
		}
		return $out;
	}	
	function signUp($o) {
		$id =""; $pwd = "";
		if ($o != Null) { $id = $o->id ; $pwd = $o->pwd ; }
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
	// forms folders
	function updateFormFolder($o) {	
		$id = ""; $recId = 0 ; $label="";
		if ($o != Null) { $id = $o->id ; $recId = $o->recId ; $label=$o->label ; }
		$out = isConnectionValid($id,$recId);		
		if ($out=="") {
			$sql = new Sql(); 
			$qry = "UPDATE folders SET label =  '".simpleEscape($label)."' WHERE  owner ='".$id."' AND id =".$recId."   ; ";
			$sql->query($qry) ;
			if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;
			else $out="answ=updateFormFolderOk";
		}
		return $out;
	}
	function insertFormFolder($o) { 
		$id = ""; $label = ""; $parentRecId = 0 ; $type = "";
		if ($o != Null) { $id = $o->id ; $label = $o->label ; $parentRecId = $o->parentRecId ; $type = $o->type ; }		
		if ($type == "form") $isForm = 1;
		else $isForm = 0; 		
		$out = isConnectionValid($id); 
		if ($out=="") {
			$sql = new Sql(); 
			if ($parentRecId!=0 && !$sql->isLineExist("folders", "id", $parentRecId)) {
				$out="answ=error&msg=parentFolderDoesntExist";
			}
			else {
				$qry="INSERT INTO folders ( owner,parent_id,label,is_form ) VALUES ( '".$id."' , ".$parentRecId." , '".simpleEscape($label)."' , ".$isForm." ) ;";
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
	function deleteFormFolder($o) {	
		$id = ""; $recId = 0 ;
		if ($o != Null) { $id = $o->id ; $recId = $o->recId ; }		
		$out = isConnectionValid($id,$recId); 
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
	// fields
	function updateField($o) {
		$id = ""; $formRecId = 0 ; $recId = 0 ; $label = ""; $rowNumber = 1; $required = 0; $copyEnable = 0; $isHidden = 0; $isSecure = 0; $secureCode = ""; $isPrimary = 0; $control = ""; 
		if ($o != Null) { 
			$id = $o->id ;  $formRecId = $o->formRecId ; $recId = $o->recId ; $label = $o->label ;  
			$rowNumber = $o->rowNumber ; $copyEnable = boolOf($o->copyEnable) ; $required = boolOf($o->required) ; $isHidden = boolOf($o->isHidden) ; $isSecure = boolOf($o->isSecure) ; 
			$secureCode = $o->secureCode ; $isPrimary = boolOf($o->isPrimary) ; $control = $o->control ; 
		}		
		$out = isConnectionValid($id,$formRecId); 
		if ($out=="") {
			$out= isFieldExists($id, $recId);
			if ($out=="") {
				$sql = new Sql(); 
				if ($isSecure == 1) $isHidden = 1;
				if ($isPrimary) $row_order = 0; else $row_order = 1;
				//
				//
				$qry = "UPDATE fields SET 
						row_order	=  ".$row_order." ,
						label 		=  '".simpleEscape($label)."' ,
						row_number 	=  ".$rowNumber." ,
						required 	=  ".$required." ,
						copy_enable =  ".$copyEnable." ,
						is_hidden 	=  ".$isHidden.",
						is_secure 	=  ".$isSecure.",
						is_primary 	=  ".$isPrimary.",
						control		=  '".simpleEscape($control)."' ";
						
				//
				if 			($isSecure!=1) 		$sc = "";
				else if 	($secureCode != "") 	$sc = md5($secureCode) ;
				if (isset($sc)) {	
					$qry.=	", ";
					$qry.=	"secure_code =	'".$sc."' ";
				}		
				$qry.=	" WHERE id = ".$recId." ; ";
				$sql->query($qry) ;
				if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg." et qry=".$qry;
				else {	
					if ($control == "SelectField") updateSelectField($o) ;
					else if ($control == "CheckField") updateCheckField($o) ;
					else if ($control == "RadioField") updateRadioField($o) ;
					else if ($control == "NumberField") updateNumberField($o) ;
					else if ($control == "Slider") updateSlider($o) ;					
					/*
					else {
						alterColumnIfExists ("tb_".$formRecId, "fd_".$recId, $control ) ;
					}
					*/
					$out = "answ=updateFieldOk"; 
				}
			}
		}
		return $out;
	}
	function updateSelectField($o) {
		$id = ""; $formRecId = 0 ; $recId = 0 ; $isMultiple = 0 ; $selectList = "" ;
		if ($o != Null) { 
			$id = $o->id ;  $formRecId = $o->formRecId ; $recId = $o->recId ; $isMultiple = boolOf($o->isMultiple) ; $selectList = $o->selectList ;
		}		
		$out = isConnectionValid($id,$formRecId); 
		if ($out == "") {			
			$sql = new Sql();
			if ($sql->isLineExist("selectfields", "id", $recId)) {
				$qry = "UPDATE selectfields SET is_multiple = $isMultiple , labels = '".simpleEscape($selectList)."' WHERE  id =".$recId."   ; ";
			} 
			else {
				$qry = "INSERT INTO selectfields (id,is_multiple,labels) VALUES ($recId , $isMultiple  , '".simpleEscape ($selectList)."' ) ; " ; 
			}
			$sql->query($qry) ;
			if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;						
			else {
				$ctrl = "SelectField"; if ($isMultiple != 0) $ctrl.= "_m" ;
				alterColumnIfExists ("tb_".$formRecId, "fd_".$recId, $ctrl ) ;
				$out = "answ=updateSelectFieldOk" ;
			}
		}
		return $out;
	}	
	function updateCheckField($o) {
		$id = ""; $formRecId = 0 ; $recId = 0 ; $selectList = "" ;
		if ($o != Null) { 
			$id = $o->id ;  $formRecId = $o->formRecId ; $recId = $o->recId ;  $selectList = $o->selectList ;
		}		
		$out = isConnectionValid($id,$formRecId); 
		if ($out == "") {			
			$sql = new Sql();
			if ($sql->isLineExist("checkfields", "id", $recId)) {
				$qry = "UPDATE checkfields SET labels = '".simpleEscape($selectList)."' WHERE  id =".$recId."   ; ";
			} 
			else {
				$qry = "INSERT INTO checkfields (id,labels) VALUES ($recId , '".simpleEscape ($selectList)."' ) ; " ; 
			}
			$sql->query($qry) ;
			if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;						
			else $out = "answ=updateCheckFieldOk" ;
		}
		return $out;
	}	
	function updateRadioField($o) {
		$id = ""; $formRecId = 0 ; $recId = 0 ; $selectList = "" ;
		if ($o != Null) { 
			$id = $o->id ;  $formRecId = $o->formRecId ; $recId = $o->recId ;  $selectList = $o->selectList ;
		}		
		$out = isConnectionValid($id,$formRecId); 
		if ($out == "") {			
			$sql = new Sql();
			if ($sql->isLineExist("radiofields", "id", $recId)) {
				$qry = "UPDATE radiofields SET labels = '".simpleEscape($selectList)."' WHERE  id =".$recId."   ; ";
			} 
			else {
				$qry = "INSERT INTO radiofields (id,labels) VALUES ($recId , '".simpleEscape ($selectList)."' ) ; " ; 
			}
			$sql->query($qry) ;
			if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;						
			else $out = "answ=updateRadioFieldOk" ;
		}
		return $out;
	}	
	function updateNumberField($o) {
		$id = ""; $formRecId = 0 ; $recId = 0 ; $decimalNumber = 0 ;
		if ($o != Null) { 
			$id = $o->id ;  $formRecId = $o->formRecId ; $recId = $o->recId ;  $decimalNumber = $o->decimalNumber ;
		}		
		$out = isConnectionValid($id,$formRecId); 
		if ($out == "") {			
			$sql = new Sql();
			if ($sql->isLineExist("numberfields", "id", $recId)) {
				$qry = "UPDATE numberfields SET decimal_number = ".$decimalNumber." WHERE  id =".$recId."   ; ";
			} 
			else {
				$qry = "INSERT INTO numberfields (id,decimal_number) VALUES ($recId , ".$decimalNumber." ) ; " ; 
			}
			$sql->query($qry) ;
			if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;						
			else {
				$ctrl = "NumberField".$decimalNumber ;
				alterColumnIfExists ("tb_".$formRecId, "fd_".$recId, $ctrl ) ;
				$out = "answ=updateNumberFieldOk" ;
			} 
		}
		return $out;
	}	
	function updateSlider($o) {
		$id = ""; $formRecId = 0 ; $recId = 0 ; $decimalNumber = 0 ; $minValue = 1 ; $maxValue = 999 ;
		if ($o != Null) { 
			$id = $o->id ;  $formRecId = $o->formRecId ; $recId = $o->recId ;  $decimalNumber = $o->decimalNumber ;
			$minValue = $o->minValue ; $maxValue = $o->maxValue ;
		}		
		$out = isConnectionValid($id,$formRecId); 
		if ($out == "") {			
			$sql = new Sql();
			if ($sql->isLineExist("sliders", "id", $recId)) {
				$qry = "UPDATE sliders SET 		min_value 		= ".$minValue." ,
												max_value 		= ".$maxValue." ,
												decimal_number 	= ".$decimalNumber." WHERE  id =".$recId."   ; ";
			} 
			else {
				$qry = "INSERT INTO sliders (id,min_value,max_value,decimal_number) VALUES ($recId,$minValue,$maxValue,$decimalNumber) ; " ; 
			}
			$sql->query($qry) ;
			if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;						
			else $out = "answ=updateSliderOk" ;
		}
		return $out;
	}	
	function insertField($o) {
		$id = ""; $formRecId = 0 ; $label = ""; $rowNumber = 1; $copyEnable = 0; $required = 0; $isHidden = 0; $isSecure = 0; $secureCode = ""; $isPrimary = 0; $control = ""; 
		if ($o != Null) { 
			$id = $o->id ;  $formRecId = $o->formRecId ; $label = $o->label ;  
			$rowNumber = $o->rowNumber ; $copyEnable = boolOf($o->copyEnable) ; $required = boolOf($o->required) ; $isHidden = boolOf($o->isHidden) ; $isSecure = boolOf($o->isSecure) ; 
			$secureCode = $o->secureCode ; $isPrimary = boolOf($o->isPrimary) ; $control = $o->control ; 
		}	
		$out = isConnectionValid($id,$formRecId); 
		if ($out == "") {
			if ($secureCode == "") $isSecure = 0;
			if ($isSecure) $secureCode = md5($secureCode) ;
			else $secureCode = "";
			
			$sql = new Sql(); 
			if (!$sql->isLineExistWhere("folders", " owner='$id' AND id = $formRecId AND  is_form = true ")) {
				$out="answ=error&msg=parentFormDoesntExist";
			}
			else {
				if ($isPrimary) $row_order = 0; else $row_order = 1;
				$qry = "INSERT INTO fields (form_id,row_order,label,row_number,required,copy_enable,is_hidden,is_secure,secure_code,is_primary,control) 
				        VALUES ( $formRecId, $row_order, '".simpleEscape($label)."', '$rowNumber', $required, $copyEnable,  $isHidden,$isSecure,'$secureCode', $isPrimary , '$control'  ) ;";
				$sql->lockInsertAndGetId("fields", $qry);
				if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;
				else {
					$sql->selectOneLineWhere  ("fields", "id=LAST_INSERT_ID()");
					$recId=$sql->line->id;								
					if ($out == "") $out = "answ=insertFieldOk&recId=".$recId ;
				}
			}
		}
		return $out;
	}
	function deleteField($o) {	
		$id = ""; $formRecId = 0 ; $recId = 0 ;
		if ($o != Null) { $id = $o->id ;  $formRecId = $o->formRecId ; $recId = $o->recId ; }		
		$out = isConnectionValid($id,$formRecId); 
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
					if (tableExists($table))  $x = removeColumnIfExists ($table, "fd_".$recId) ;
					//
					if ($sql->isLineExist("selectfields", "id", $recId)) {
						$qry = "DELETE FROM selectfields WHERE id=$recId ; " ;
						$sql->query($qry) ;
						if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;
					}
					else if ($sql->isLineExist("checkfields", "id", $recId)) {
						$qry = "DELETE FROM checkfields WHERE id=$recId ; " ;
						$sql->query($qry) ;
						if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;
					}
					else if ($sql->isLineExist("radiofields", "id", $recId)) {
						$qry = "DELETE FROM radiofields WHERE id=$recId ; " ;
						$sql->query($qry) ;
						if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;
					}
					else if ($sql->isLineExist("numberfields", "id", $recId)) {
						$qry = "DELETE FROM numberfields WHERE id=$recId ; " ;
						$sql->query($qry) ;
						if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;
					}
					else if ($sql->isLineExist("sliders", "id", $recId)) {
						$qry = "DELETE FROM sliders WHERE id=$recId ; " ;
						$sql->query($qry) ;
						if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;
					}
					//
					if ($out=="") $out = "answ=deleteFieldOk&msg=$x";
				}
			}
		}
		return $out;
	}
	// records
	function readRecords($o) {
		$id = ""; $recId = 0 ;
		if ($o != Null) { $id = $o->id ; $recId = $o->recId ; }		
		$out = readRecordsTable($id,$recId);
		if (substr($out, 0, 1) != "{") $out="answ=error&msg=$out";
		else $out = "answ=readRecordsOk&data=".convertAmp($out);
		return $out;
	}		
	function updateOneRecord($o) { 	
		$id = ""; $recId = 0 ;  $formRecId = 0 ; $fieldsKeyValue = "";
		if ($o != Null) { $id = $o->id ; $recId = $o->recId ;  $formRecId = $o->formRecId ; $fieldsKeyValue =  $o->fieldsKeyValue ;  }		
		$out = isConnectionValid($id,$formRecId); 
		if ($out=="") {
			$sql = new Sql(); 			
			if (!$sql->isLineExistWhere("folders", " owner='$id' AND id=$formRecId AND is_form = true ")) {
				$out="answ=error&msg=parentFormDoesntExist";
			}
			else {
				$table = "tb_" . $formRecId;
				$o=json_decode($fieldsKeyValue);
				$values=$o->fvList;
				$keys = $o->fkList;
				$types = $o->ftList;
				$x = "";
				if (!$sql->isLineExist($table, "id", $recId)) {
					$out="answ=error&msg=elemDoesntExist";
				}
				else {
					$qry = "UPDATE $table SET "; $pfx = "";
					for ($i = 0 ; $i < count($keys) ; $i++) {
						$qry.= $pfx.$keys[$i]." = '".simpleEscape($values[$i])."' ";
						$pfx = ",";
						addColumnIfNotExists($table, $keys[$i], $types[$i]) ;						
					} 
					$qry.="WHERE id = ".$recId." ; ";
					$sql->query($qry) ;
					if (!$sql->success) {
						$out = "answ=error&msg=".$sql->errorMsg; 
					}
					else $out = "answ=updateRecordOk&msg=$x";
				}
				
			}
		}
		return $out;
	}
	function insertOneRecord($o) { 
		$id = ""; $formRecId = 0 ; $fieldsKeyValue = "";
		if ($o != Null) { $id = $o->id ;  $formRecId = $o->formRecId ; $fieldsKeyValue =  $o->fieldsKeyValue ;  }			
		$out = isConnectionValid($id,$formRecId); 
		if ($out=="") {
			$sql = new Sql(); 
			if (!$sql->isLineExistWhere("folders", " owner='$id' AND id=$formRecId AND is_form = true ")) {
				$out="answ=error&msg=parentFormDoesntExist";
			}
			else {			
				$table = "tb_" . $formRecId;
				$o = json_decode($fieldsKeyValue);					
				$values=$o->fvList;
				$keys = $o->fkList;
				$types = $o->ftList;
				
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
						addColumnIfNotExists($table,$keys[$i],$types[$i]);
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
	function deleteOneRecord($o) {
		$id = ""; $recId = 0 ;  $formRecId = 0 ; 
		if ($o != Null) { $id = $o->id ; $recId = $o->recId ;  $formRecId = $o->formRecId ; }		
		$out = isConnectionValid($id,$formRecId); 
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
	function readFieldData($o) {
		$id = ""; $recId = 0 ;  $formRecId = 0 ; $fieldRecId = 0 ; $secureCode = ""; $out = "";
		if ($o != Null) { $id = $o->id ; $recId = $o->recId ;  $formRecId = $o->formRecId ; $fieldRecId = $o->fieldRecId ; $secureCode = $o->secureCode ; }		
		//
		$o = checkSecureCode($id,$formRecId,$fieldRecId, $secureCode); $out = $o->out;	
		$oo = new Object(); 
		if ($o->failureSecure) {
			foreach ($o as $key => $val) { 	
				if($key!="out") $oo->$key = $val ;
			}
			$out = "answ=error&msg=invalidSecureCode&data=".convertAmp(json_encode($oo));
		} 
		else if ($o->out!="") $out = $o->out;
		//
		if ($out=="") {
			$table = "tb_".$formRecId;
			$sql = new Sql(); $sql->selectOneLine($table,"id",$recId) ;
			if (!$sql->success)  {
				$out = "answ=error&msg=elemDoesntExist";
			}
			else {
				$fd = "fd_".$fieldRecId;
				if (isset($sql->line->$fd)) $val = $sql->line->$fd; 
				else $val = "";
				$out = "answ=readFieldDataOk&value=".$val;
			}
		}		
		return $out;
	}
	function verifySecureCode($o) {
		$id = ""; $formRecId = 0 ; $fieldRecId = 0 ; $secureCode = "";
		if ($o != Null) { $id = $o->id ; $formRecId = $o->formRecId ; $fieldRecId = $o->fieldRecId ; $secureCode = $o->secureCode ; }		
		$o = checkSecureCode($id, $formRecId, $fieldRecId, $secureCode); 
		$oo = new Object(); 
		if ($o->failureSecure) {
			foreach ($o as $key => $val) { 	
				if($key!="out") $oo->$key = $val ;
			}
			$out = "answ=error&msg=invalidSecureCode&data=".convertAmp(json_encode($oo));
		} 
		else if ($o->out!="") $out = $o->out;
		else {	
			$out = "answ=secureCodeOk";
			if ($o->codeNotSaved) $out.= "&msg=secureCodeIsntYetSaved";
		}
		return $out;
	}
	/**
	* inputs : 
	* $o->id
	* $o->folderLabel 
	* $o->loginLabel 
	* 	$o->loginSiteLabel
	* 	$o->loginUrlLabel
	* 	$o->loginIdLabel
	* 	$o->loginPwdLabel
	* 	$o->loginNoteLabel
	* $o->adressLabel 
	* 	$o->adressNameLabel 
	* 	$o->adressTelLabel 
	*	$o->adressEmailLabel 
	* 	$o->adressPhotoLabel 
	* 	$o->adressGeoLabel 
	* 	$o->adressNoteLabel 
	
	
	
	
	
	
	*/
	function initialize($o) { 
		if ($o == Null) return $out = "answ=error";
		//			
		$out = isConnectionValid($o->id); 			
		if ($out != "") return $out;
		$oo = new Object();
		//folder
		$oo->id = $o->id ;
		$oo->label = $o->folderLabel ;
		$oo->parentRecId = 0 ;
		$oo->type = "folder" ;				
		$out = insertFormFolder($oo) ;				
		if (substr($out, 0, 23) != "answ=insertFormFolderOk") return $out;				
		$folderRecId = intval(substr($out,30));
		// form login
		$oo->label = $o->loginLabel ;
		$oo->parentRecId = $folderRecId ;
		$oo->type = "form" ;
		$out=insertFormFolder($oo) ;
		if (substr($out, 0, 23) != "answ=insertFormFolderOk") return $out;		
		$loginRecId=intval(substr($out, 30));
		// form adress
		$oo->label = $o->adressLabel ;
		$oo->parentRecId = $folderRecId ;
		$oo->type = "form" ;
		$out=insertFormFolder($oo) ;
		if (substr($out, 0, 23) != "answ=insertFormFolderOk") return $out;		
		$adressRecId = intval(substr($out, 30));
		// fields of login 
		$oo->formRecId = $loginRecId;
		$oo->label = $o->loginSiteLabel;
		$oo->rowNumber = 1 ; 
		$oo->copyEnable = true; 
		$oo->required = false ; 
		$oo->isHidden = false ; 
		$oo->isSecure = false ; 
		$oo->secureCode = "" ;
		$oo->isPrimary = true ;
		$oo->control = "InputField"; 
		$out=insertField($oo) ;
		if (substr($out, 0, 18) != "answ=insertFieldOk") return $out;
		///
		$oo->formRecId = $loginRecId;
		$oo->label = $o->loginUrlLabel;
		$oo->isPrimary = false ; 
		$out=insertField($oo) ;
		if (substr($out, 0, 18) != "answ=insertFieldOk") return $out;
		///
		$oo->formRecId = $loginRecId;
		$oo->label = $o->loginUrlLabel;
		$oo->isPrimary = false ; 
		$out=insertField($oo) ;
		if (substr($out, 0, 18) != "answ=insertFieldOk") return $out;
		///
		$oo->formRecId = $loginRecId;
		$oo->label = $o->loginIdLabel;
		$out=insertField($oo) ;
		if (substr($out, 0, 18) != "answ=insertFieldOk") return $out;
		///
		$oo->formRecId = $loginRecId;
		$oo->label = $o->loginPwdLabel;
		$oo->isHidden = true ;  
		$out=insertField($oo) ;
		if (substr($out, 0, 18) != "answ=insertFieldOk") return $out;
		///
		$oo->formRecId = $loginRecId;
		$oo->label = $o->loginNoteLabel;
		$oo->isHidden = false ;  
		$oo->rowNumber = 5 ;
		$oo->control = "AreaField"; 
		$out=insertField($oo) ;
		if (substr($out, 0, 18) != "answ=insertFieldOk") return $out;
		///
		// fields of adress
		$oo->formRecId = $adressRecId;
		$oo->label = $o->adressNameLabel;
		$oo->rowNumber = 1 ; 
		$oo->isPrimary = true ;
		$oo->control = "InputField"; 
		$out=insertField($oo) ;
		if (substr($out, 0, 18) != "answ=insertFieldOk") return $out;
		///
		$oo->formRecId = $adressRecId;
		$oo->label = $o->adressTelLabel;
		$oo->isPrimary = false ; 
		$out=insertField($oo) ;
		if (substr($out, 0, 18) != "answ=insertFieldOk") return $out;
		///
		$oo->formRecId = $adressRecId;
		$oo->label = $o->adressEmailLabel;
		$oo->control = "EmailField"; 
		$out=insertField($oo) ;
		if (substr($out, 0, 18) != "answ=insertFieldOk") return $out;
		///
		$oo->formRecId = $adressRecId;
		$oo->label = $o->adressPhotoLabel;
		$oo->control = "PhotoField"; 
		$out=insertField($oo) ;
		if (substr($out, 0, 18) != "answ=insertFieldOk") return $out;
		///
		$oo->formRecId = $adressRecId;
		$oo->label = $o->adressGeoLabel;
		$oo->control = "GeoField"; 
		$out=insertField($oo) ;
		if (substr($out, 0, 18) != "answ=insertFieldOk") return $out;
		///
		$oo->formRecId = $adressRecId;
		$oo->label = $o->adressNoteLabel;
		$oo->control = "AreaField"; 
		$oo->rowNumber = 5 ;
		$out=insertField($oo) ;
		if (substr($out, 0, 18) != "answ=insertFieldOk") return $out;
		///
		$out = "answ=autoCreationOk";
		return $out;		
	}
	
		
		
	
		
	/*
		
		$id = ""; $label = ""; $parentRecId = 0 ; $type = "";
		if ($o != Null) { $id = $o->id ; $label = $o->label ; $parentRecId = $o->parentRecId ; $type = $o->type ; }		
		if ($type == "form") $isForm = 1;
		else $isForm = 0; 		
		$out = isConnectionValid($id); 
		if ($out=="") {
			$sql = new Sql(); 
			if ($parentRecId!=0 && !$sql->isLineExist("folders", "id", $parentRecId)) {
				$out="answ=error&msg=parentFolderDoesntExist";
			}
			else {
				$qry="INSERT INTO folders ( owner,parent_id,label,is_form ) VALUES ( '".$id."' , ".$parentRecId." , '".simpleEscape($label)."' , ".$isForm." ) ;";
				$sql->lockInsertAndGetId("folders", $qry);
				if (!$sql->success) $out = "answ=error&msg=".$sql->errorMsg;
				else {
					$sql->selectOneLineWhere  ("folders", "id=LAST_INSERT_ID()");
					$out = "answ=insertFormFolderOk&recId=".$sql->line->id;
				}
			}
		}
		return $out;
	*/
	//
	//	
	//	
	// private inner functions
	//	
	//
	//
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
	function getPrimaryField ($formRecId) {
		$sql=new Sql(); $out="";
		$where="is_primary = true AND form_id=$formRecId";
		$sql->selectOneLineWhere ("fields",$where) ;
		if (!$sql->empty) $out="fd_".$sql->line->id;
		return $out;
	}
	function addColumnIfNotExists ($table, $col, $type = "InputField") {	
		GLOBAL $dtArr;
		$dt = $dtArr[$type];
		$qry="SELECT * 
				FROM information_schema.COLUMNS 
				WHERE 
				TABLE_SCHEMA = 'safe_db' 
				AND TABLE_NAME = '$table' 
				AND COLUMN_NAME = '$col' ; " ;
		$buf = mysql_query($qry);
		$exist = (mysql_num_rows($buf) > 0 )  ;
		$x = "exist=$exist";
		if ($exist!=1) {		
			$qry = "ALTER TABLE  `$table` ADD  `$col` $dt NOT NULL" ;
			mysql_query($qry) ;
			//$fieldsRecId = intval(substr($col, 3));
			//mysql_query("UPDATE fields" );
		}
		return $x." err=".mysql_error();
	}
	function alterColumnIfExists ($table, $col, $type = "InputField") {	
		GLOBAL $dtArr;
		$dt = $dtArr[$type];
		$qry="SELECT * 
				FROM information_schema.COLUMNS 
				WHERE 
				TABLE_SCHEMA = 'safe_db' 
				AND TABLE_NAME = '$table' 
				AND COLUMN_NAME = '$col' ; " ;
		$buf = mysql_query($qry);
		$exist = (mysql_num_rows($buf) > 0 )  ;
		if ($exist==1) {	
			$qry = "ALTER TABLE  `$table` MODIFY  `$col` $dt NOT NULL" ;
			mysql_query($qry) ;
		}
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
		$x = "exist=$exist";
		if ($exist) {
			$qry = "ALTER TABLE  `$table` DROP  `$col` ;" ;
			mysql_query($qry) ;
		}
		return $x." err=".mysql_error();
	}	
	//
	function checkControlChangeAndDataExist ($formRecId,$recId, $control, $isMultiple) {
		/*
		$sql = new Sql(); 
		$sql->selectOneLine("fields", "id", $recId) ;
		$prev = $sql->line->control;
		if ($control == "InputField") {
			if ($prev == $control) return;
			
			if ($prev == "AreaField") {
			
			}
		}
		if ($control == $sql->line->control && $control) return;
		if (
		*/
	}
	function checkSecureCode($id,$formRecId,$fieldRecId,$secureCode) {
		$out = isConnectionValid($id,$formRecId); $o = new Object();  $codeNotSaved = false; 
		$o->failureSecure = false; $o->failureNumber = 0; $o->failureLogoff = false; 
		// $o->failureDelayUnit = 0 ; $o->failureMax = 0;
		$o->failureDelay = 0;
		if ($out=="") {
			$out= isFieldExists($id,$fieldRecId);
			if ($out == "") {				
				$sql = new Sql(); 
				$sql->selectOneLine("fields","id",$fieldRecId) ;
				if (!$sql->success)  {
					$out = "answ=error&msg=elemDoesntExist";
				}
				else if ($sql->line-> secure_code == "" ) $codeNotSaved = true;
				else {
					if (!($sql->line->secure_code == md5($secureCode)) && $sql->line-> secure_code != "" ) {					
						$out = "answ=error&msg=invalidSecureCode";
					}
					$of = manageFailure($id, $fieldRecId, ($out == ""), $sql->line);
					foreach ($of as $key => $val) { 	
						$o->$key = $val ;
					}					
				}
			}
		}
		$o->codeNotSaved = $codeNotSaved;
		$o->out = $out;
		return $o;
	}
	function manageFailure($id,$fieldRecId,$ok,$fieldLine) {
		$sql = new Sql(); $qry = ""; $out = "";  $o = new Object();
		if ($ok) {
			$nf = $fieldLine->failure_number;
			$sql->selectOneLine("login", "id", $id) ;				
			if ($nf > 0) {
				if ($sql->success) {
					$nl = max($sql->line->failure_number-$nf,0); 				
					if ($nl != $sql->line-> failure_number) {
						$qry = "UPDATE login SET failure_number=".$nl." , failure_time=0, failure_mail_sent=FALSE WHERE id='$id' ;";						
					}
				}				
			} 
			if ($sql->success) $b = ($sql->line->failure_time != 0); else $b = true;
			if ($qry=="" && $b ) {
				$qry = "UPDATE login SET failure_time=0 , failure_mail_sent=FALSE WHERE id='$id' ;";
			}
			if ($qry!="") $sql->query($qry);
			//
			if ($nf != 0) {
				$qry = "UPDATE fields SET failure_number=0 WHERE id=$fieldRecId ;";
				$sql->query($qry);
			}
			$o->failureSecure = false;
		}
		else {
			$nf = max($fieldLine->failure_number + 1, 1);
			$qry = "UPDATE fields SET failure_number=$nf WHERE id=$fieldRecId ;";
			$sql->query($qry);
			//
			$sql->selectOneLine("login", "id", $id) ;
			$nl = 1; 
			if ($sql->success) $nl = max($sql->line->failure_number + 1, 1);				
			$qry = "UPDATE login SET failure_number=$nl ";
			$o->failureNumber = $nl;
			$o->failureSecure = true;
			//$o->failureDelayUnit = FAILURE_DELAY_UNIT;
			$o->failureMin = FAILURE_MIN;
			//$o->failureMax = FAILURE_MAX;			
			if ($nl > FAILURE_MIN) {
				$ft = time() + FAILURE_DELAY_UNIT * min(($nl - FAILURE_MIN), FAILURE_MAX) ;
				$o->failureDelay = $ft - time();
				$qry.=" , failure_time = ".$ft;					
				$o->failureLogoff = true;				
			}
			else {				
				$o->failureLogoff = false;				
			}			
			$qry.= " WHERE id = '$id' ; ";
			$sql->query($qry);
			if ($o->failureLogoff) logOff();
		}
		return $o;
	}
	function loginIsFrosen ($id) {
		$sql = new Sql(); $d = 0;
		$sql->selectOneLine("login", "id", $id) ;
		if ($sql->success) {
			if (time() < $sql->line->failure_time) {
				$d = $sql->line->failure_time-time();
				if (sendFailureMail($id, $d, $sql->line) != "") 
					$sql->query("UPDATE login SET failure_mail_sent=TRUE WHERE id = '$id' ; ");
			}		
		}
		return $d;
	}
	function sendFailureMail ($userMail, $time,$loginRec=null) {	
		$sql = new Sql(); $out = "";
		if ($loginRec!=null && !$loginRec->failure_mail_sent) {
			$mn = floor($time / 60);
			$sec=$time % 60;
			$adminMail = ADMIN_MAIL;
			$subject = "MyBox: account $userMail frozen during $mn mn $sec sec." ;			
			$header = "";
			$header .= "MIME-Version: 1.0"."\r\n";				
			$header .= "Content-type: text; charset=iso-8859-1"."\r\n";
			$header .= "From: ".$userMail."\r\n";
			$header	.= "Reply-To: ".$userMail."\r\n";
			$header	.= "X-Mailer: PHP/".phpversion()."\r\n";
			$msg = $subject."\n\n";
			if (mail($adminMail, $subject, $msg, $header)) $out = "answ=userMailSentOk";	
			else $out="answ=error&msg=sendUserMailError";
		}		
		return $out;
	}
	function securityCheck($id, $recId) {
		$sql = new Sql(); 
		$b = $sql->isLineExistWhere("folders", "owner ='".$id."' AND id =".$recId." ");
		if ($b != 1) $b = 0;
		return $b;		
	}
	function hideIfSecure ($fieldId,$val) {
		$sql=new Sql();
		$sql->selectOneLine("fields", "id", $fieldId) ;
		if ($sql->success && !$sql->empty) {
			$fi=$sql->line; $l=strlen($val);
			if ($fi->is_secure==1 && $l>0) $val=hideChars($l);
		}
		return $val;
	}
	function hideChars ($l) {
		$val = ""; 
		for ($i=0;$i<$l;$i++) $val .= "#" ;
		return $val;
	}
	//
	function readData ($id) {
		$out=""; 	$o = new Object();	
		$o = readFoldersFormsAndFields($id, $o);
		if (isset($o->error)) $out.= $o->error;
		else $out.=json_encode($o);
		return $out;	
	}
	function readFoldersFormsAndFields ($id,$o) {			
		$sql=new Sql(); $qry="SELECT * FROM folders USE INDEX (parent_idx) WHERE owner='$id' ORDER BY owner,parent_id,is_form,label,id"; 
		$sql->query($qry);
		if (!$sql->success) {
			$o->error=$sql->errorMsg;
		} 
		else {
			$o->folders = array();
			while ($sql->nextLine()) {
				$l=$sql->line; 								
				$lo = new Object();
				$lo->parent_id = $l->parent_id;
				$lo->is_form = $l->is_form;
				$lo->label = $l->label;
				$lo->id = $l->id;
				if ($l->is_form) $lo= readFields ($l->id,$lo);
				array_push($o->folders, $lo);
				if (isset($lo->error)) {
					$o->error = $lo->error;
					break;
				}
			}
		}		
		return $o;	
	}
	function readFields ($formRecId,$o) {
		$sql=new Sql(); $qry="SELECT * FROM fields USE INDEX (row_order_idx) WHERE form_id='$formRecId' ORDER BY form_id,row_order"; 
		$sql->query($qry);
		if (!$sql->success) {
			$o->error=$sql->errorMsg." for form ".$formRecId;			
		} 
		else {
			$o->fields = array();
			while ($sql->nextLine()) {
				$l=$sql->line; $lo=new Object();
				$lo->required=$l->required; 
				$lo->copy_enable=$l->copy_enable; 
				$lo->is_hidden = $l->is_hidden;
				$lo->is_primary = $l->is_primary;
				$lo->is_secure = $l->is_secure;					
				$lo->id = $l->id;
				$lo->label = $l->label;
				$lo->row_number = $l->row_number;
				$lo->control = $l->control;
						if ($l->control=="SelectField") $lo = readSelectFields($l->id,$lo);
				else 	if ($l->control=="CheckField")  $lo = readCheckFields($l->id,$lo);
				else 	if ($l->control=="RadioField")  $lo = readRadioFields($l->id,$lo);
				else 	if ($l->control=="NumberField") $lo = readNumberFields($l->id,$lo);
				else 	if ($l->control=="Slider")  	$lo = readSliders($l->id,$lo);
				array_push($o->fields, $lo);						
			}
		}
		return $o;	
	}
	function readSelectFields ($recId, $o) {
		$sql=new Sql();
		$sql->selectOneLine("selectfields","id",$recId);
		if (!$sql->success) {
			$o->error=$sql->errorMsg." for selectfields ".$recId;			
		} 
		else {
			$o->selectfields = new Object();
			if (!$sql->empty) {
				$l=$sql->line;
				$o->selectfields->is_multiple=$l->is_multiple; 
				$o->selectfields->labels = $l->labels;	
			}
			else {
				$o->selectfields->is_multiple=0; 
				$o->selectfields->labels = "[]";	
			}
		}
		return $o;
	}
	function readCheckFields ($recId, $o) {
		$sql=new Sql();
		$sql->selectOneLine("checkfields","id",$recId);
		if (!$sql->success) {
			$o->error=$sql->errorMsg." for checkfields ".$recId;			
		} 
		else {
			$o->checkfields = new Object();
			if (!$sql->empty) {
				$l=$sql->line;
				$o->checkfields->labels = $l->labels;	
			}
			else {
				$o->checkfields->labels = "[]";	
			}
		}
		return $o;
	}
	function readRadioFields ($recId, $o) {
		$sql=new Sql();
		$sql->selectOneLine("radiofields","id",$recId);
		if (!$sql->success) {
			$o->error=$sql->errorMsg." for radiofields ".$recId;			
		} 
		else {
			$o->radiofields = new Object();
			if (!$sql->empty) {
				$l=$sql->line;
				$o->radiofields->labels = $l->labels;	
			}
			else {
				$o->radiofields->labels = "[]";	
			}
		}
		return $o;
	}
	function readNumberFields ($recId, $o) {
		$sql=new Sql();
		$sql->selectOneLine("numberfields","id",$recId);
		if (!$sql->success) {
			$o->error=$sql->errorMsg." for numberfields ".$recId;			
		} 
		else {
			$o->numberfields = new Object();
			if (!$sql->empty) {
				$l=$sql->line;
				$o->numberfields->decimal_number = $l->decimal_number;	
			}
			else {
				$o->numberfields->decimal_number = 0;	
			}
		}
		return $o;
	}
	function readSliders ($recId, $o) {
		$sql=new Sql();
		$sql->selectOneLine("sliders","id",$recId);
		if (!$sql->success) {
			$o->error=$sql->errorMsg." for sliders ".$recId;			
		} 
		else {
			$o->sliders = new Object();
			if (!$sql->empty) {
				$l=$sql->line;
				$o->sliders->min_value = $l->min_value;
				$o->sliders->max_value = $l->max_value;
				$o->sliders->decimal_number = $l->decimal_number;	
			}
			else {
				$o->sliders->decimal_number = 0;	
				$o->sliders->min_value = 1;
				$o->sliders->max_value = 999;
			}
		}
		return $o;
	}	
	function readRecordsTable ($id,$formRecId) {		
		$out="";
		$er=getConnectionStatus($id,$formRecId);
		if ($er!="") $out.=$er;
		else {
			$tb="tb_".$formRecId;	
			if (mysql_query("DESCRIBE `$tb`")) {
				$primary=getPrimaryField($formRecId);
				$sql=new Sql();
				if ($primary == "") $where = "TRUE"; 
				else {
					addColumnIfNotExists($tb,$primary);				
					$where = "TRUE ORDER BY ".$primary ;
				}
				$sql->selectWhere ($tb, $where) ;
				if (!$sql->success) {
					$out.=$sql->errorMsg."\n qry :".$sql->qry;
				}
				else {
					$o = new Object();
					$o->records = array();
					while ($sql->nextLine()) {
						$l=$sql->line;
						foreach ($l as $key => $val) {
							$val=hideIfSecure(substr($key,3),$val);
							$l->$key = $val;	
						}
						array_push($o->records, $l);	
					}
					$out.=json_encode($o);
				}
			} 
			else $out.="tableDoesntExist"; 
		}
		return $out;
    }
	//
	function boolOf($b) {
		if ($b == "true" || $b == true) $b = 1;
		else if ($b == "false" || $b == false) $b = 0;
		else $b = 0;
		return $b ;
	}	
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
	function isConnectionValid($id=null,$formRecId=null) {
		$out= getConnectionStatus($id,$formRecId);
		if ($out!="") $out="answ=error&msg=$out" ;
		return $out;
	}
	function getConnectionStatus($id=null,$formRecId=null) {
		if(!sessionIsOpened ()) return "connectionHasBeenClosed";
		else if ($id != null && $id != getId()) return "connectionIsNotValid" ;	
		else if ($id != null && $formRecId!=null && !securityCheck($id, $formRecId)) return "connectionIsNotValid" ; // hack attempt error
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

