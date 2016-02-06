<?php
/* sa-login-form.php */
?>
<div id="login">
<h2>Login</h2>
<form action="" method="post">
<input id="action" name="action" value="login" type="hidden">
<label>Username :</label>
<input id="username" name="username" placeholder="username" type="text">
<label>Password :</label>
<input id="password" name="password" placeholder="**********" type="password">
<input name="submit" type="submit" value=" Login ">
<span><?php echo $error; ?></span>
</form>
</div>
