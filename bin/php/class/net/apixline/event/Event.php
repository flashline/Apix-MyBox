<?php
/**************************************************************************************************
package : net.flash_line.event
Content : event managers
Author : Delettre Jean-Michel
CoAuthors : 
Copyright / Droits d'auteur : Free-Works.Org
****************************************************************************************************/

require_once(FL_CLASS_DIR.'net/flash_line/common/allPurpose.inc.php');
/**
* create event Object
* net.flash_line.comment.allpurpose.inc.php is required => FL_CLASS_DIR must be set
*/
class Event extends Object {
    public  $get;
	public  $post;
	//
	private $target;
	private $type;
	
	const ON_LOAD = 'onLoad';
	/**
	* @param String type	event typename 
	* @param Object	prop	event dynamic properties 	
	**/
	function __construct($type="",$caller=null) {
		parent::__construct();
		$this->get = $_GET ; 
		$this->post = $_POST ;
		$this->target = get_class($caller);
		$this->type = $type;	
			
    }
	function getType() {
		if ($this->type) return $this->type ;
		else return "none" ;			
    }
	function getTarget() {
		if ($this->target) return $this->target ;
		else return "none" ;			
    }
	
	
}
      
?>