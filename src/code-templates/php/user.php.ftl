<?php
/* user.php */
$error = "";
include('user-rights.php');
include('sa-functions.php');
include('sa-login.php');
$is_logged_in = isset($_SESSION['login_user']);
?>

<html>
 <head>
  <title>
	${app.name} - User
  </title>
  <link rel="stylesheet" type="text/css" href="css/style.css">
 </head>
 <body>
<h1>
	${app.name} - User
</h1>
<?php
if ($is_logged_in) {
	$loggedInUser = $_SESSION['login_user'];
	$is_primary = isPrimaryByUsername($loggedInUser);

	if ($is_primary) {
		$page = "view";
		$user_id = null;
		$user = null;
		$page_edit = false;
		$page_delete = false;
		$page_create = false;
		$formMessage = '';

		if (isset($_GET['page'])) {
			$page = $_GET['page'];
			if ($page=="create") {
				$page_create = true;
			}
		}

		if (isset($_GET['id'])) {
			if ($page_create) {
				$page_create=false;
			} else {
				$user_id = $_GET['id'];
				if ($user = getUserById($user_id)) {

					if ($page=="edit") {
						$page_edit = true;
					} else if ($page=="delete") {
						$page_delete = true;
					} 
				}
			}
		}

		if ($page_edit || $page_delete || $page_create) {
			$roles = getAllRoles();
			if (isset($_POST['submit'])) {
				if ($page_edit && 'editUser'==$_POST['action']) {
					if (empty($_POST['rolename']) || empty($_POST['primary'])) {
						$formMessage = "Invalid values.";
					} else {
						$rolename=$_POST['rolename'];
						$primary=$_POST['primary'];
						$rolename = stripslashes($rolename);
						$primary = stripslashes($primary);
                                                if ($primary=="no" && $user['username']==$loggedInUser) {
                                                    $formMessage = "Unable to update. The active user has to be a primary user.";
                                                } else if (updateUser($user_id,$rolename,$primary)) {
							$user = getUserById($user_id);
							$formMessage = "The user has been updated.";
						} else {
							$formMessage = "Unable to update the user.";
						}
					}
				}
				if ($page_delete && 'deleteUser'==$_POST['action']) {
					if ($user['username']==$loggedInUser) {
						$formMessage = "The active user cannot be removed.";
					} else if(deleteUserById($user_id)) {
						$formMessage = "The user has been deleted.";
						header("Location: settings.php");
					} else {
						$formMessage = "Unable to delete the user.";
					}			
				}
				if ($page_create && 'createUser'==$_POST['action']) {
					if (empty($_POST['username']) || empty($_POST['rolename']) || empty($_POST['primary'])) {
						$formMessage = "Invalid values.";
					} else {
						$username=$_POST['username'];
						$password=$_POST['password'];
						$rolename=$_POST['rolename'];
						$primary=$_POST['primary'];
						$username = stripslashes($username);
						$password = stripslashes($password);
						$rolename = stripslashes($rolename);
						$primary = stripslashes($primary);
						if (createUser($username,$password,$rolename,$primary)) {
							$formMessage = "The user has been created.";
							header("Location: settings.php");
						} else {
							$formMessage = "Unable to create the user.";
						}
					}		
				}
			} else if ($page_create) {
				$user = array();
				$user['username'] = '';
				$user['password'] = '';
				$user['rolename'] = '';
				$user['primary'] = 'no';
			}
			?>

			<div id="items">
			Logged as <?php echo $loggedInUser; ?>, <a href="sa-logout.php">Logout</a>
			<?php if ($is_primary) { ?> | <a href="settings.php">Settings</a> <?php } ?>
			| <a href="change-password.php">Change Password</a>

			<h2><a href="index.php">Home</a> > User: <?php
								if ($user_id) {
									echo $user['username'];
								} else {
									echo "(new)";
								} ?></h2>
			<div>

<form action="" method="post">
<?php
$pageAction = "";
$formVisible = false;
if ($page_edit) {
	$formVisible = true;
	$submitLabel = "Update";
	$pageAction = "editUser";
} else if ($page_delete) {
	$formVisible = true;
	$submitLabel = "Delete";
	$pageAction = "deleteUser";
} else if ($page_create) {
	$formVisible = true;
	$submitLabel = "Create";
	$pageAction = "createUser";
}
?>
<input id="action" name="action" value="<?php echo $pageAction ?>" type="hidden">
				<table>
					<tr>
						<td>Username</td>
						<td>
							<?php if ($page_create) { ?>
								<input id="username" type="text" name="username" value="<?php echo $user['username']; ?>" />
							<?php } else {
								echo $user['username'];
							} ?>
						</td>
					</tr>
					<tr>
						<td>Password</td>
						<td>
							<?php if ($page_create) { ?>
								<input id="password" name="password" placeholder="**********" type="password" value="<?php echo $user['password']; ?>">
							<?php } else { ?>
							********** <?php
							} ?>
						</td>
					</tr>
					<tr>
						<td>Rolename</td>
						<td>
							<?php if ($page_edit || $page_create) { ?>
								<select id="rolename" name="rolename" >
								<?php 
									foreach ($roles as $role) {
									?>
									  <option <?php if ($user['rolename']==$role) echo 'selected="selected"'; ?>
										value="<?php echo $role; ?>">
										<?php echo $role; ?>
									  </option>
									<?php
									}
								?>
								</select>
							<?php } else {
								echo $user['rolename'];
							} ?>
						</td>
					</tr>
					<tr>
						<td>Primary</td>
						<td>
							<?php if ($page_edit || $page_create) { ?>
								<select id="primary" name="primary">
									<option <?php if ($user['primary']=='yes') echo 'selected="selected"'; ?>
										value="yes">
										Yes
									</option>
									<option <?php if ($user['primary']=='no') echo 'selected="selected"'; ?>
										value="no">
										No
									</option>
								</select>
							<?php } else {
								echo $user['primary'];
							} ?>
						</td>
					</tr>
				</table>
<span><?php echo $formMessage; ?></span><br/>
<?php if ($formVisible) { ?>
<input name="submit" type="submit" value=" <?php echo $submitLabel; ?> ">
<?php } ?>
</form>

			</div>

			</div>
			<?php
		}
	} else {
		?>
		This page is restricted.
		<?php
	}
} else {
	include('sa-login-form.php');
}
?>
<div id="footer">
Generated by AppsoFluna
</div>
 </body>
</html>
