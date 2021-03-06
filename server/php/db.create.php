<?php
	/**************************************************************************************************
	Author : Delettre Jean-Michel
	Co Authors : 
	Copyright / Droits d'auteur : Delettre Jean-Michel - pixaline.net
	****************************************************************************************************/
	// define classes directory
	define('CLASS_DIR', 'class/net/apixline/'); 
	//
	require_once(CLASS_DIR.'common/allPurpose.inc.php');
	require_once(CLASS_DIR.'common/function.php');
	require_once(CLASS_DIR.'io/Sql.php');
	require_once('db_connect.inc.php');	
	// 
	mysql_query("SET character_set_client = utf8");
	mysql_query("SET character_set_results = utf8");
	//
	$s=doServerConnection ($myHost, $myId, $myPwd) ;
	//
	$qry = "create database $myDb ;" ;
	$res = mysql_query($qry);	
	if (!$res) { 
		if	( @mysql_errno() != 1007) {
			if	( @mysql_errno() == 1044) 	outPutAndExit("You don't have the right to create a database on this server !") ;
			else 							outPutAndExit("Error : ".mySql_error()." # ".@mysql_errno()." !") ;
		}
	}
	doDbConnection($s, $myDb);
	//fields
	$sql = new Sql();
	$qry = "DROP TABLE IF EXISTS fields ;"; execQry ($sql, $qry);
	$qry = "
		CREATE TABLE fields ( 
		id bigint(20) NOT NULL AUTO_INCREMENT , 
		form_id bigint(20) NOT NULL , 
		row_order smallint(6) DEFAULT  '2'  NOT NULL , 
		label varchar(255) NOT NULL , 		
		control enum('InputField','NumberField','AreaField','SelectField','CheckField','RadioField','GeoField','SignField','PhotoField','Slider','DateField','EmailField','ColorField','LinkField') DEFAULT  'InputField'  NOT NULL , 
		row_number tinyint(4) DEFAULT  '1'  NOT NULL , 
		required tinyint(4)  NOT NULL , 
		copy_enable tinyint(4) DEFAULT  '1'  NOT NULL , 
		is_hidden tinyint(4) NOT NULL , 
		is_secure tinyint(4) NOT NULL , 
		secure_code VARCHAR(32) NOT NULL , 		
		failure_number tinyint(4) NOT NULL , 
		is_unique tinyint(4) NOT NULL , 
		is_primary tinyint(4) NOT NULL , 
		PRIMARY KEY ( id) , 
		KEY row_order_idx ( form_id , row_order)
		)  ; 
	";
	execQry ($sql, $qry);	
	//	
	//selectfield
	$qry = "DROP TABLE IF EXISTS selectfields ;"; execQry ($sql, $qry);
	$qry = "
		CREATE TABLE selectfields ( 
		id bigint(20) NOT NULL , 
		is_multiple tinyint(4) NOT NULL , 
		labels text NOT NULL , 
		PRIMARY KEY ( id)
		)  ;
	";	
	execQry ($sql, $qry);	
	//
	//checkfields
	$qry = "DROP TABLE IF EXISTS checkfields ;"; execQry ($sql, $qry);
	$qry = "		
		CREATE TABLE checkfields ( 
		id bigint(20) NOT NULL , 
		labels text NOT NULL , 
		PRIMARY KEY ( id)
		)  ;  
	";
	execQry ($sql, $qry);	
	//radiofields
	$qry = "DROP TABLE IF EXISTS radiofields ;"; execQry ($sql, $qry);
	$qry = "		
		CREATE TABLE radiofields ( 
		id bigint(20) NOT NULL , 
		labels text NOT NULL , 
		PRIMARY KEY ( id)
		)  ;  
	";
	execQry ($sql, $qry);	
	//numberfields
	$qry = "DROP TABLE IF EXISTS numberfields ;"; execQry ($sql, $qry);
	$qry = "		
		CREATE TABLE numberfields ( 
		id bigint(20) NOT NULL , 
		decimal_number  tinyint(4) default 0 NOT NULL , 
		PRIMARY KEY ( id)
		)  ;  
	";
	execQry ($sql, $qry);	
	//sliders
	$qry = "DROP TABLE IF EXISTS sliders ;"; execQry ($sql, $qry);
	$qry = "		
		CREATE TABLE sliders ( 
		id bigint(20) NOT NULL ,
		min_value float NOT NULL , 
		max_value float NOT NULL , 
		decimal_number  tinyint(4) default 0 NOT NULL , 
		PRIMARY KEY ( id)
		)  ;  
	";
	execQry ($sql, $qry);	
	//folders
	$qry = "DROP TABLE IF EXISTS folders ;"; execQry ($sql, $qry);
	$qry = "
		CREATE TABLE folders ( 
		owner varchar(255) NOT NULL , 
		id bigint(20) NOT NULL AUTO_INCREMENT , 
		parent_id bigint(20) NOT NULL , 
		label varchar(255) NOT NULL , 
		is_form tinyint(4) NOT NULL , 
		PRIMARY KEY ( id) , 
		UNIQUE KEY parent_idx ( owner , parent_id , is_form , label(12) , id)
		)  ; 
	";
	execQry ($sql, $qry);
	//
	//login
	$qry = "DROP TABLE IF EXISTS login ;"; execQry ($sql, $qry);
	$qry = "
		CREATE TABLE login ( 
		id varchar(255) NOT NULL , 
		pwd varchar(32) NOT NULL , 		 
		failure_number tinyint(4) NOT NULL , 
		failure_time bigint(20) NOT NULL , 
		failure_mail_sent tinyint(4) NOT NULL , 
		PRIMARY KEY ( id)
		)  ; 
	";
	execQry ($sql, $qry);
	
	outPutAndExit("<h1>Installation completed :-)</h1>");
	//
	//
	function execQry ($sql,$qry) {
		  $sql->query($qry);
		  if (!$sql->success) {
				outPutAndExit("Error in <br/> $qry : <br/><br/>".$sql->errorMsg);				
		  }
	}
	function doServerConnection ($host, $id, $pwd) {
		  $s = new Server($host, $id, $pwd); $out="";
		  if (!$s->connec_host()) {
				outPutAndExit("MySql connection arguments in db_connect.inc.php aren't valid or server doesn't answer !");				
		  }
		  return $s;
	}
	function doDbConnection ($s,$db) {
		if (!$s->connec_base($db)) {
			outPutAndExit("Error :<br/>".$s->err);
		}
	}
	function outPutAndExit($out) {
		if ($out!="") alert($out);
		showAlert();
		exit();
	}	
		
?>

