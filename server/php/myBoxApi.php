<?php
	/**************************************************************************************************
	Author : Delettre Jean-Michel
	CoAuthors : 
	Copyright / Droits d'auteur : Delettre Jean-Michel - pixaline.net
	****************************************************************************************************/
	// define classes directory
	define('CLASS_DIR', 'class/net/apixline/'); 
	
	//error_reporting (4) ;
	//
	/*require_once(CLASS_DIR.'common/allPurpose.inc.php');
	
	require_once(CLASS_DIR.'io/Sql.php');
	require_once('db_connect.inc.php');*/
	require_once(CLASS_DIR.'common/function.php');
	class MyBoxApi 	{    	
		public 	$t		;	//array
		public 	$ta		;	//string
		public 	$f		;	//array
		public 	$fi		;	//object
		
		
		public function __construct($id) {   
			$this->t = [];
			$this->t["Logins"] = "tb_259";
			$this->t["Adresses"] = "tb_128";			
		}
		
		public function s ($str) {
			$this->f = [];
			if ($str == "Logins") {
				$this->ta = "tb_259";
				$this->f["Url"] = "fd_18";
				$this->f["Website"] = "fd_20";
			}
			else {
				$this->ta = "tb_128";
				$this->f["Name"] = "fd_42";
				$this->f["Phone"] = "fd_43";
			
			}
			$this->fi=$this->arrayToObject($this->f);
			return $this->ta;
		}
		public function gaf ($str) {
			$this->f = [];
			if ($str == "Logins") {
				$this->f["Url"] = "fd_18";
				$this->f["Website"] = "fd_20";
			}
			else {
				$this->f["Name"] = "fd_42";
				$this->f["Phone"] = "fd_43";
			
			}
			return $this->f;
		}
		
		public function got () {
			return  $this->arrayToObject($this->t);
		}
		
		//private
		
		private function arrayToObject ($arr) {	
			if (!is_array($arr)) return $arr;
			$object = new stdClass();
			if (is_array($arr) && count($arr) > 0) {
				foreach ($arr as $name => $val) {    			
					$name = strtolower(trim($name));
					if (!empty($name)) {
						$object->$name = $this->arrayToObject($val);
					}
					
				}
				return $object;
			}
			else return false ;
			
		}
		
	}

	/*
	$o=new MyBoxApi($id) ; //id is generally email signin, so the owner of forms
	$o->t; // return an array of all tables
		$o->t["<form name>"] ; // contains physical sql tablename of <form name>
	$o->f("<form name>") ; // return an array of all fields of <form name>
		$o->f("<form name>")[<field label>] // contains physical column name of <field label> 
	OR BETTER TODO
		$o = new MyBoxApi($id) ; //id is generally email signin, so the owner of forms
		$o->s(<form name>);
		$o->ta // a String that contains physical sql tablename of <form name> 
		$o->fi // an array or object that contains all fields of <form name> 
				$o->fi->field_label or $o->fi[<field label>] //physical column name of <field label> 
		
		i.e.:			
		$api=new MyBoxApi("info@foo.fr") ;
		//...
		$logins=$api->s("Logins");  $col=$api->fi;
		$query="SELECT * FROM ".$logins." WHERE ".$col->url."<>'' ORDER BY ".$col->website ;
	
	*/		
	// at begin
	$api = new MyBoxApi("info@foo.fr") ; //id is generally email signin, so the owner of forms
	//...
	//before each query
	$table = $api->s("Logins"); // physical tablename -also in $api->ta
	$col = $api->fi;
	$query = "SELECT * FROM ".$table." WHERE ".$col->url."<>'' ORDER BY ".$col->website ;
	alert("With api->s(formname) then api->fi->fieldname");
	alert($query);
	//or
	alert("OR with tables=api->got() then api->fi->fieldname");	
	$tables = $api->got();
	$query = "SELECT * FROM ".$tables->logins." WHERE ".$col->url."<>'' ORDER BY ".$col->website ;
	
	alert($query);
	alert("api->ta=".$api->ta);
	alert("col->url=".$col->url);
	alert("col->website=".$col->website);
	alert("api->t['Logins']=".$api->t["Logins"]);
	$tables=$api->got();
	alert("tables->logins=".$tables->logins);
	$fiArr=$api->gaf('Logins'); // 
	alert("fiArr['Url']=".$fiArr['Url']);
	alert("fiArr['Website']=".$fiArr['Website']);
	
	
	
	
	
	/* 
			
	$o=new MyBoxApi("info@foo.fr") ;
	// ...
	$t = $o->t; 
	$f = $o->gaf("Logins") ;
	$query="SELECT * FROM ".$t["Logins"]." WHERE ".$f["Url"]."<>'' ORDER BY ".$f["Website"]; 
	alert($query);
	$ot = $o->gt();
	alert("ot->logins=".$ot->logins);
	//...
	
	
	
	
	//triesf
	$arr = [];
	$arr["p1"] = "p1p1";
	alert($GLOBALS["arr"]["p1"]);
	$oVal = (object) [];
	$k = "key1";
	//$oVal->$k = (object) [];
	$oVal->$k =  new stdClass();
	$oVal->key1->var1 = "something";
	$oVal->key1->var2 = "something else";
	alert($oVal->key1->var2);
	*/
	showAlert();
?>

