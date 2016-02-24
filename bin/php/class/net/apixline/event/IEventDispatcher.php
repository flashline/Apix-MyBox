<?php
/**************************************************************************************************
package : net.flash_line.event
Content : event managers
Author : Delettre Jean-Michel
CoAuthors : 
Copyright / Droits d'auteur : Free-Works.Org
****************************************************************************************************/


/**
* interface to implement for events dispatchers
*/
interface IEventDispatcher  {
	/**
	 * add an instance->method()'s listener
	 * @param	String 	$t		type of event
	 * @param	*		$l		listener instance 
	 * @param	String	$f		callback function name
	 * @param	Object	$p		an optionnel Object with listener parameters
	 * @return 	String			a unique string to identify listener -used to remove it 
	 */
	public function addEventListener ($t, $l, $f, $p = null) ;
	/**
	 * remove an instance->method()'s listener
	 * @param	String 	$t		type of event
	 * @param	String	$inst	a unique string to identify listener
	 * @param	String	$f		callback function name 
	 */
	public function removeEventListener ($t, $inst, $f) ;
	/**
	 * remove an instance->method()'s listener
	 * @param	String 	$t		type of event
	 * @param	String	$inst	a unique string to identify listener
	 * @param	String	$f		callback function name 
	 * @return	Boolean			true if listener exist for $this
	 */
	public function hasEventListener ($t, $inst, $f) ;
	/**
	 * dispatch event to all listeners
	 * @param	$e
	 */
	public function dispatchEvent ($e) ;
	
}
      
?>