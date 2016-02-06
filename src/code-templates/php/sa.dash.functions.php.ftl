<?php
/* sa-functions.php */
include('config.php');

function isLoginValid($username,$password) {
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return false;
	}

	$sql = "SELECT id FROM ".$db_prefix."user WHERE username='$username' AND password=MD5('$password')";
	$result = mysqli_query($conn, $sql);
	$valid = false;
	if ($result && mysqli_num_rows($result) > 0) {
		if(mysqli_fetch_assoc($result)) {
			$valid = true;
		}
	}
	mysqli_close($conn);

	return $valid;
}

function getRoleByUsername($username) {
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return null;
	}

	$sql = "SELECT rolename FROM ".$db_prefix."user WHERE username='$username'";
	$result = mysqli_query($conn, $sql);
	$rolename = null;
	if ($result && mysqli_num_rows($result) > 0) {
		if($row = mysqli_fetch_assoc($result)) {
			$rolename = $row["rolename"];
		}
	}
	mysqli_close($conn);

	return $rolename;
}

function isPrimaryByUsername($username) {
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return false;
	}

	$sql = "SELECT `primary` FROM ".$db_prefix."user WHERE username='$username'";
	$result = mysqli_query($conn, $sql);
	$primary = false;
	if ($result && mysqli_num_rows($result) > 0) {
		if($row = mysqli_fetch_assoc($result)) {
			$primary = $row["primary"];
		}
	}
	mysqli_close($conn);

	return ("yes"==$primary);
}

function updatePassword($username, $password) {
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return false;
	}

	$sql = "UPDATE ".$db_prefix."user SET password = MD5('$password') WHERE username='$username'";
	$done = false;
	if (mysqli_query($conn, $sql)) {
		$done = true;
	}
	mysqli_close($conn);

	return $done;
}

function updateUser($user_id, $rolename,$primary) {
	if (!$user_id) {
		return false;
	}
	if (!in_array($rolename,getAllRoles())) {
		return false;
	}
	if ($primary!='yes' && $primary!='no') {
		return false;
	}
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return false;
	}
	$sql = "UPDATE ".$db_prefix."user SET rolename = '$rolename', `primary`='$primary' WHERE id=$user_id";
		
	$done = false;
	if (mysqli_query($conn, $sql)) {
		$done = true;
	}
	mysqli_close($conn);
	return $done;
}

function createUser($username, $password, $rolename,$primary) {
	if (!$username || !$password) {
		return false;
	}
	if (!in_array($rolename,getAllRoles())) {
		return false;
	}
	if ($primary!='yes' && $primary!='no') {
		return false;
	}
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return false;
	}
	$sql = "INSERT INTO ".$db_prefix."user (username,`password`,rolename,`primary`) VALUES ('$username',MD5('$password'),'$rolename','$primary')";
	$done = false;
	if (mysqli_query($conn, $sql)) {
		$done = true;
	}
	mysqli_close($conn);
	return $done;
}


function deleteUserById($user_id) {
	if ($user_id==null) {
		return false;
	}
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return false;
	}
	$sql = "DELETE FROM ".$db_prefix."user WHERE id=$user_id";

	$done = false;
	if (mysqli_query($conn, $sql)) {
		$done = true;
	}
	mysqli_close($conn);

	return $done;
}

function getAllUsers() {
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return null;
	}

	$sql = "SELECT id, username, rolename, `primary` FROM ".$db_prefix."user";
	$result = mysqli_query($conn, $sql);

	$all_users = array();
	if ($result && mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$all_users[] = $row;
		}
	}
	mysqli_close($conn);

	return $all_users;
}

function getUserById($user_id) {
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return null;
	}

	$sql = "SELECT id, username, rolename, `primary` FROM ".$db_prefix."user WHERE id = $user_id";
	$result = mysqli_query($conn, $sql);

	$user = null;
	if ($result && mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$user = $row;
		}
	}
	mysqli_close($conn);

	return $user;
}


?>

