<?php
	// basic classes include
	require_once "allpurpose.inc.php" ; 			// external classes
	require_once "function.php";
	
	
	
	
	//
	if (LLS::browserIs('chrome')) {
		echo "is chrome :  ".LLS::getBrowserString ()."<br/>" ;
	} else if (LLS::browserIs('firefox')) {
		echo "is firefox :  ".LLS::getBrowserString ()."<br/>" ;
	} else if (LLS::browserIs('safari')) {
		echo "is safari :  ".LLS::getBrowserString ()."<br/>" ;
	} else if (LLS::browserIs('msie')) {
		echo "is msie :  ".LLS::getBrowserString ()."<br/>" ;
	}
	else echo "unknow browsername !"."<br/>" ;
	
	
	
	
 ?>	
		