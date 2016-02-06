<?php
/* sa-login.php */
session_start();
$error='';
if (isset($_POST['submit']) && 'login'==$_POST['action']) {
	if (empty($_POST['username']) || empty($_POST['password'])) {
  		$error = "Invalid username or password";
	} else {
		$username=$_POST['username'];
		$password=$_POST['password'];
		$username = stripslashes($username);
		$password = stripslashes($password);

		if (isLoginValid($username,$password)) {
			$_SESSION['login_user']=$username;
		} else {
			$error = "Invalid username or password";
		}
	}
}
