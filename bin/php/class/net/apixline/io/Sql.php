<?php
 /**
 * Copyright : delettre jm
 * CoAuthors :  
 * licence 	 : GPL
 */
 /**
 * package net.flash_line.io
 * data i/o
 */
/**
 * manage Sql's queries and basic functions
 */
class Sql {
	/**
	* an Sql line
	*/
	public 	$line		;		
	/**
	* full message if query is not succesfull 
	*/
	public 	$errorMsg	;	
	/**
	* Object if query is not succesfull : {number:<mysql error>,label:<msg error>}
	*/
	public 	$err		;		
	/**
	* true if query is succesfull ; else false
	*/
	public 	$success	;	
	/**
	* sent query String
	*/
	public 	$qry		; 	
	/**
	* true if last select is empty; else false
	*/
	public 	$empty		; 	
	/**
	* Last used sql buffer
	*/
	public 	$buffer     ;	
	/**
	* Last  created auto-increment id
	*/
	
	/**
	* @private
	*/	
	private $arr		;	// tmp Array
	private $lineArr		;	// tmp Array
	private $o			;	// tmp Object
	
	// Constructor
	public function __construct () {	
	
	}	
	/**
	* display the detail of line Object of read buffer
	* @param String:$k if $k != "" then column you want to display only
	* @return String result
	*/
	function toString($k="") {
		$str = "";	
		if ($this->success && !$this->empty && ( mysql_errno() == 0 ) ) {
			while ($this->nextLine()) {
				$o = new Object($this->line);
				$str.=$o->toString($k);
			}
		} else {
			$str = "Sql->toString() : error or empty !";
		}
		$this->query ($this->qry);
		return $str;
	}
	
	/**
	* @return current line from buffer -and increment it
	*/
	public function getNextFromBuffer () {		
		return mysql_fetch_object($this->buffer) ;			
	}
	/**
	* @return this->buffer content as Array[lineNumber][column] -usefull for Smarty API;
	*/
	public function getBufferAsArray () {
		$arr = array();
		if ($this->success && !$this->empty && ( mysql_errno() == 0 ) ) {
			while ( $this->nextLine()  ) {	
				$arrLine = array();
				foreach ($this->line as $key => $val) {  
					$arrLine[$key] = $val;
				} 
				array_push ($arr,$arrLine) ;
			}
		}  
		return $arr;
	}
	/**
	* @return this->buffer same method than getBufferAsArray () but not to be used with Smarty
	*/
	public function getBufferAsArrayOfObject () {
		$arr = array();
		if ($this->success && !$this->empty && ( mysql_errno() == 0 ) ) {
			while ( $this->nextLine()  ) {	
				$o = new Object($this->line);
				array_push ($arr,$o) ;
			}
		}  		
		return $arr;
	}
	/**
	* Set err Object and return it
	*/			
	public function getErr() { 
		$this->err = new Object(array( "number" => mysql_errno() , "label" => mysql_error()  )) ;
		return $this->err ;
	}	

	/**
	* Exec sql query and set true/false : $this->success, $this->errorMsg, $this->empty and $this->buffer.
	* @param String:qry sql query
	*/
	public function query ($qry) { 
		$this->errorMsg ;
		$this->qry = $qry ; 
		$this->success = true ; 
		$this->empty=false;		
		$this->buffer = mysql_query($qry);
		if ( mysql_errno() != 0 ) {
			$this->success = false ;
			$this->createErrorMsg ("query");
		} else {
			if (!$this->buffer ) {    			
				$this->success = false ;
				$this->createErrorMsg ("query");
			} else {
				if (strtolower(substr($qry, 0, 6))=="select") {
					if (mysql_num_rows($this->buffer)<1) $this->empty=true ;
				}
			} 			 
		}
								
	}	
	function lockInsertAndGetId ($table,$qry) {
		mysql_query("LOCK TABLES $table WRITE");  
		mysql_query("SET AUTOCOMMIT = 0");  
		$this->query ($qry) ;  		
		mysql_query("COMMIT");  
		mysql_query("UNLOCK TABLES"); 
		return mysql_query("SELECT LAST_INSERT_ID()"); 
	}
	
	/**
	* Simple select 
	* @paral String:table FROM tablename
	* @param String:column column name
	* @param String:val column value
	*/
	public function select ($table,$column,$val) {    	
		$qry = "SELECT * FROM $table WHERE $column = '$val'" ; 
		$this->query ($qry) ;									
	}
	/**
	* Simple WHERE select 
	* @param String:table FROM table
	* @param String:where WHERE clause
	*/
	public function selectWhere ($table, $where) {    	
		$qry = "SELECT * FROM $table WHERE $where ;" ;		
		$this->query ($qry) ;									
	}
	/**
	* Put the current buffer line into $this->line and set $this->success, $this->errorMsg
	*/
	public function nextLine () {    
		$this->errorMsg = "";
		if ( (!$this->success) || $this->empty ) {
			$this->getErr() ;
			return false;
		} else if ($this->line = $this->getNextFromBuffer () ) { // mysql_fetch_object($this->buffer))  {
			$this->success=true;			
			return true ;
		} else {
			$this->getErr() ;
			$this->success = false ;	
			return false;
		}
								
	}
	/**
	* Return true if line exist in table ; else false
	* @paral String:table FROM tablename
	* @param String:column column name
	* @param String:val column value
	*/
	public function isLineExist ($table,$column,$val) {
		$qry = "SELECT *  FROM $table WHERE $column = '$val'" ; 
		$this->query ($qry) ;
		if ($this->success) {
			if (mysql_num_rows($this->buffer)<1) return false;
			$this->line = mysql_fetch_object($this->buffer) ;
			if ($this->line->$column == $val ) 	return true  ; 
			else return false ;	 			
		} else {
			return false ;
		}	
	}	
	/**
	* Return true if line exist in table ; else false
	* @param String:table FROM table
	* @param String:where WHERE clause
	*/
	public function isLineExistWhere ($table,$where) {
		$qry = "SELECT *  FROM $table WHERE $where ;" ;     
		$this->query ($qry) ;
		if ($this->success) {
			if (mysql_num_rows($this->buffer)<1) return false;
			else return true ;			
		} else {
			return false ;
		}	
	}	
	/**
	* Read just one line
	* @paral String:table FROM tablename
	* @param String:column column name
	* @param String:val column value
	*/
	public function selectOneLine  ($table,$column,$val) {	
		$qry = "SELECT *  FROM $table WHERE $column = '$val' LIMIT 1" ;
		$this->query ($qry) ;
		if ($this->success) {
			$this->line = mysql_fetch_object($this->buffer) ;
			if (mysql_num_rows($this->buffer) < 1) {
				$this->empty = true ;
				return false ;
			}
			if ($this->line->$column == $val ) 	return true  ; 
			else return false ;	 
		} else {
			$this->createErrorMsg ("selectOneLine");
			return false ;
		}
	}	
	/**
	* Read just one line
	* @param String:table FROM table
	* @param String:where WHERE clause
	*/
	public function selectOneLineWhere  ($table,$where) {		
		$qry = "SELECT *  FROM $table WHERE $where LIMIT 1 ; " ;   
		$this->query ($qry) ;
		if ($this->success) {
			$this->line = mysql_fetch_object($this->buffer) ;
			if (mysql_num_rows($this->buffer)<1) $this->empty=true ;
			return true ;	 
		} else {
			$this->createErrorMsg ("selectOneLine");
			$this->empty=true ;
			return false ;
		}
	}	
	/**
	*@private
	*/
	public function createErrorMsg($method) {
		$this->getErr();
		$this->errorMsg = "Sql.".$method."() : # ".$this->err->number." ".$this->err->label ;
		//if ($this->err->number!=0) alert($this->errorMsg."\n");
	}
	
}


	
?>

