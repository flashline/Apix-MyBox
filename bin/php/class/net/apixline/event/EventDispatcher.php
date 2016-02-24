<?php
/**************************************************************************************************
package : net.flash_line.event
Content : event managers
Author : Delettre Jean-Michel
CoAuthors : 
Copyright / Droits d'auteur : Free-Works.Org
****************************************************************************************************/

require_once(FL_CLASS_DIR.'net/flash_line/common/allPurpose.inc.php');
require_once(FL_CLASS_DIR.'net/flash_line/event/IEventDispatcher.php');
/**
* super class for events dispatchers
* net.flash_line.comment.allpurpose.inc.php is required => FL_CLASS_DIR must be set
*/
class EventDispatcher implements IEventDispatcher {
    //
	private $listeners;     

	/**
	* constructor	
	**/
	public function __construct() {
		 $this->listeners = array();
    }
	/**
	 * add an instance->method()'s listener
	 * @param	String 	$t		type of event
	 * @param	*		$l		listener instance 
	 * @param	String	$f		callback function name
	 * @param	Object	$p		an optionnel Object with listener parameters
	 * @return 	String			a unique string to identify listener -used to remove it 
	 */
	public function addEventListener ($t,$l,$f, $p= null) {
		$o = new Object();
		$o->type = $t;
		$o->listener = $l;
		$o->func = $f;
		$o->paramArray = $p;
		$o->instance = crypt(md5(time())) ;
		$this->listeners[] = $o;
		return  $o->instance ;
			
	}
	/**
	 * remove an instance->method()'s listener
	 * @param	String 	$t		type of event
	 * @param	String	$inst	a unique string to identify listener
	 * @param	String	$f		callback function name 
	 */
	public function removeEventListener ($t,$inst,$f) {
		foreach($this->listeners as $i => $o) {
			if ($t == $o->type) {
				if ($inst == $o->instance) {
					if ($f == $o->func) {
						unset($this->listeners[$i]);
					}
				}
			}					
		}
		$this->listeners = array_values($this->listeners);			
	}
	/**
	 * remove an instance->method()'s listener
	 * @param	String 	$t		type of event
	 * @param	String	$inst	a unique string to identify listener
	 * @param	String	$f		callback function name 
	 * @return	Boolean			true if listener exist for $this
	 */
	public function hasEventListener ($t,$inst,$f) {
		$bool = 0;
		foreach($this->listeners as $i => $o) {
			if ($t == $o->type) {
				if ($inst == $o->instance) {
					if ($f == $o->func) {
						$bool = 1 ;
						break;
					}
				}
			}					
		}	
		return $bool;
	}
	/**
	 * dispatch event to all listeners
	 * @param	$e
	 */
	public function dispatchEvent ($e) {
		foreach ($this->listeners as $o) {
			if ($e->getType() == $o->type) {
				call_user_func(array($o->listener, $o->func),$e,$o->paramArray);
			}
		}
		
	}
	
}
      
?>