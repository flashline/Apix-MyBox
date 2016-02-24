<?php
$sql->setRel("custom", "", "id = '$id'");
$sql->setRel("order of custom", "cust_id=id");
$sql->setRel("lineOrder of order", "ord_id=id");
//
$sql->find ("custom 'toto'");
$sql->find ("order of custom"); // traduction : SELECT * FROM order Where cust_id = $custom->id ;
while ($sql->nextLine("order")) {
	$sql->find ("lineOrder of order");
	while ($sql->nextLine("lineOrder")) {	
		// code here
	}
}
// ou mieux
// begin of prog
$sql->setRel("custom",SQL::GIVEN, "id=");
$sql->setRel("order OF custom", "cust_id=id");
$sql->setRel("lineOrder OF order", "ord_id=id");
//
// ... other code
//
$sql->find ("custom '$custId'");
while ($sql->each("order OF custom")) {
	while ($sql->each("lineOrder OF order")) {	
		// code here
	}
}

// ou encore mieux
$sql->setRel("custom",SQL::GIVEN, "id=");
$sql->setRel("order OF custom", "cust_id=id");
$sql->setRel("lineOrder OF order", "ord_id=id");
while ($sql->get("find custom 'robert' , each order OF custom , each lineOrder OF order") ) {
	//code here
)
?>