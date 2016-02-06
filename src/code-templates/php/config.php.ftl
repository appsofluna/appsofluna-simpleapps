<?php
/* config.php */
$db_servername = 'localhost';
$db_username = '${app.name?lower_case?replace(" ","_")}';
$db_password = 'changethis';
$db_name = '${app.name?lower_case?replace(" ","_")}';
$db_prefix = '${app.name?lower_case?replace(" ","_")}_';

function getConnection() {
	global $db_servername, $db_username, $db_password, $db_name;
	$conn = mysqli_connect($db_servername, $db_username, $db_password, $db_name);

	// Check connection
	if (!$conn) {
	    die("Connection failed: " . mysqli_connect_error());
	}

	return $conn;
}

?>
