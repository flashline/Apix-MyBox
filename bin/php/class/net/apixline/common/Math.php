<?php 
	 /**
	 * Copyright : delettre jm
	 * CoAuthors :  
	 * licence 	 : GPL
	 */
	 /**
	 * package net.flash_line.common
	 * common classes
	 */
	/**
	 * math functions
	 */
	class Math  { 
			static function floatToString ($n) {	
				if (!is_numeric($n)) $n= 0.0 ;
				$str=100 + round($n * 100) % 100;
				return floor($n).".".substr($str, 1, 2);
			}
			
	}
?>