<?php
$error = "";
include('login.php');
include('user_rights_functions.php');
$is_logged_in = isset($_SESSION['login_user']);
?>

<html>
 <head>
  <title>
    ${app.name}
  </title>
  <link rel="stylesheet" type="text/css" href="css/style.css">
 </head>
 <body>

 <h1>
   ${app.name}
 </h1>
<?php
if ($is_logged_in) {
$loggedInUser = $_SESSION['login_user'];
?>
<div id="items">
Logged as <?php echo $loggedInUser; ?>, <a href="logout.php">Logout</a> | <a href="settings.php">Settings</a>
<h2>Menu</h2>
<ul>

<?php
$var_items = getItemsByRole('admin');
foreach ($var_items as $item) {
?>
<li><a href="<?php echo $item; ?>_list.php"><?php echo getItemLabel($item); ?></a></li>
<?php
}
?>
</ul>
</div>
<?php
} else {
 include('login_form.php');
}
?>
<div id="footer">
Generated by AppsoFluna
</div>
 </body>
</html>