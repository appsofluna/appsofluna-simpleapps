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
 </head>
 <body>
<h1>
  ${item.label}
</h1>
<?php
if ($is_logged_in) {
$loggedInUser = $_SESSION['login_user'];
?>
<div id="items">
Logged as <?php echo $loggedInUser; ?>, <a href="logout.php">Logout</a> | <a href="settings.php">Settings</a>
<h2><a href="index.php">Home</a> > ${item.label} </h2>
<a href="${item.name}_edit.php?new=1">Create New</a>
<table>

<thead>
<#list item.fields>
<tr>
<#items as field>
<td>${field.name}</td>
</#items>
<td></td>
</tr>
</#list>
</thead>

<tbody>
<!-- GENERATED for each rec -->
<tr>
  <!-- GENERATED for each field -->
  <td><!-- GENERATED field.value -->1<!-- GENERATED field.value --></td>
  <!-- /GENERATED for each field -->
  <!-- GENERATED for each field -->
  <td><!-- GENERATED field.value -->2<!-- GENERATED field.value --></td>
  <!-- /GENERATED for each field -->
  <!-- GENERATED for each field -->
  <td><!-- GENERATED field.value -->3<!-- GENERATED field.value --></td>
  <!-- /GENERATED for each field -->
  <td>
    <a href="<!-- GENERATED item.name -->ITEM<!-- /GENERATED item.name -->_edit.php?id=<!-- GENERATED rec.id -->1<!-- /GENERATED rec.id -->">edit</a> |
    <a href="<!-- GENERATED item.name -->ITEM<!-- /GENERATED item.name -->_delete.php?id=<!-- GENERATED rec.id -->1<!-- /GENERATED rec.id -->">delete</a>
  </td>
</tr>
<!-- /GENERATED for each rec -->
<!-- GENERATED for each rec -->
<tr>
  <!-- GENERATED for each field -->
  <td><!-- GENERATED field.value -->4<!-- GENERATED field.value --></td>
  <!-- /GENERATED for each field -->
  <!-- GENERATED for each field -->
  <td><!-- GENERATED field.value -->5<!-- GENERATED field.value --></td>
  <!-- /GENERATED for each field -->
  <!-- GENERATED for each field -->
  <td><!-- GENERATED field.value -->6<!-- GENERATED field.value --></td>
  <!-- /GENERATED for each field -->
  <td>
    <a href="<!-- GENERATED item.name -->ITEM<!-- /GENERATED item.name -->_edit.php?id=<!-- GENERATED rec.id -->2<!-- /GENERATED rec.id -->">edit</a> |
    <a href="<!-- GENERATED item.name -->ITEM<!-- /GENERATED item.name -->_delete.php?id=<!-- GENERATED rec.id -->2<!-- /GENERATED rec.id -->">delete</a>
  </td>
</tr>
<!-- /GENERATED for each rec -->
<!-- GENERATED for each rec -->
<tr>
  <!-- GENERATED for each field -->
  <td><!-- GENERATED field.value -->7<!-- GENERATED field.value --></td>
  <!-- /GENERATED for each field -->
  <!-- GENERATED for each field -->
  <td><!-- GENERATED field.value -->8<!-- GENERATED field.value --></td>
  <!-- /GENERATED for each field -->
  <!-- GENERATED for each field -->
  <td><!-- GENERATED field.value -->9<!-- GENERATED field.value --></td>
  <!-- /GENERATED for each field -->
  <td>
    <a href="<!-- GENERATED item.name -->ITEM<!-- /GENERATED item.name -->_edit.php?id=<!-- GENERATED rec.id -->3<!-- /GENERATED rec.id -->">edit</a> |
    <a href="<!-- GENERATED item.name -->ITEM<!-- /GENERATED item.name -->_delete.php?id=<!-- GENERATED rec.id -->3<!-- /GENERATED rec.id -->">delete</a>
  </td>
</tr>
<!-- /GENERATED for each rec -->
<tbody>
</table>
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