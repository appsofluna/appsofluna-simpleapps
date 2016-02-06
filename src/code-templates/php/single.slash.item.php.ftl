<#function titleCase text>
  <#local len = text?length />
  <#if (len>1)>
    <#return text[0]?upper_case + text[1..]> 
  <#else>
    <#return text?upper_case>
  </#if>
</#function>
<?php
/* single/${item.name}.php */
$error = "";
include('../user-rights.php');
include('../sa-functions.php');
include('../sa-login.php');
$is_logged_in = isset($_SESSION['login_user']);

function get${titleCase(item.name)}RecordById($${item.name}_id) {
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return null;
	}
	
	$sql = "SELECT id<#if (item.fields?size>0) >,</#if><#list item.fields as field>${field.name}<#if field.type == 'item'>_id</#if><#sep>,</#list> FROM ".$db_prefix."${item.name} WHERE id = $${item.name}_id";
	$result = mysqli_query($conn, $sql);

	$${item.name}_record = null;
	if ($result && mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {

			<#list item.fields as field>
			<#if field.type == 'item'>

			$ref_${field.name}_id = $row['${field.name}_id'];

			if ($ref_${field.name}_id) {
				$ref_${field.name}_sql = "SELECT <#list field.extra.refFields as refField>${refField}<#sep>,</#list> FROM ".$db_prefix."${field.extra.refItem} WHERE id = $ref_${field.name}_id";
				$ref_${field.name}_result = mysqli_query($conn,$ref_${field.name}_sql);
				if ($ref_${field.name}_result && mysqli_num_rows($ref_${field.name}_result) > 0 && $ref_${field.name}_row = mysqli_fetch_assoc($ref_${field.name}_result)) {
					$${field.name}_label = <#list field.extra.refFields as refField>$ref_${field.name}_row['${refField}']<#sep>.' '.</#list>;
					$row['${field.name}_label'] = $${field.name}_label;
				} else {
					$row['${field.name}_label'] = '';
				}
			} else {
				$row['${field.name}_label'] = '';
			}

			</#if>
			</#list>

			$${item.name}_record = $row;
		}
	}
	mysqli_close($conn);

	return $${item.name}_record;
}

function create${titleCase(item.name)}($newRecord) {
	if (!$newRecord
		<#list item.fields as field>
		|| !isset($newRecord['${field.name}<#if field.type == 'item'>_id</#if>'])
		</#list>
		) {
		return false;
	}
	<#list item.fields as field>
	$value_${field.name}_id = $newRecord['${field.name}<#if field.type == 'item'>_id</#if>'];
	</#list>
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return false;
	}

	$sql = "INSERT INTO ".$db_prefix."${item.name} (<#list item.fields as field>${field.name}<#if field.type == 'item'>_id</#if><#sep>,</#list>) VALUES (<#list item.fields as field>'$value_${field.name}<#if field.type == 'item'>_id</#if>'<#sep>,</#list>)";
	$done = false;
	if (mysqli_query($conn, $sql)) {
		$done = true;
	}
	mysqli_close($conn);
	return $done;
}

function update${titleCase(item.name)}($updatedRecord) {
	if (!$updatedRecord || !isset($updatedRecord['id'])
		<#list item.fields as field>
		|| !isset($updatedRecord['${field.name}<#if field.type == 'item'>_id</#if>'])
		</#list>
		) {
		return false;
	}
	$value_id = $updatedRecord['id'];
	<#list item.fields as field>
	$value_${field.name}_id = $updatedRecord['${field.name}<#if field.type == 'item'>_id</#if>'];
	</#list>

	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return false;
	}

	$sql = "UPDATE ".$db_prefix."${item.name} SET <#list item.fields as field>${field.name}<#if field.type == 'item'>_id</#if> = '$value_${field.name}<#if field.type == 'item'>_id</#if>'<#sep>,</#list> WHERE id=$value_id";

	$done = false;
	if (mysqli_query($conn, $sql)) {
		$done = true;
	}
	mysqli_close($conn);
	return $done;
}

function delete${titleCase(item.name)}ById($${item.name}_id) {
	if ($${item.name}_id==null) {
		return false;
	}
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return false;
	}

	$sql = "DELETE FROM ".$db_prefix."${item.name} WHERE id=$${item.name}_id";

	$done = false;
	if (mysqli_query($conn, $sql)) {
		$done = true;
	}
	mysqli_close($conn);

	return $done;
}

<#list item.fields as field>
<#if field.type == 'item'>
/* GENERATED FOR EACH item.field where type is item [

GENERATED function get{titleCase(field.name)}Labels() { */
function get${titleCase(field.name)}Labels() {
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return null;
	}

	$sql = "SELECT id, <#list field.extra.refFields as refField>${refField}<#sep>,</#list> FROM ".$db_prefix."${field.extra.refItem}";
	$result = mysqli_query($conn, $sql);

	$${field.name}student_record_map = array();
	if ($result && mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$${field.name}_record_set = array();
			$${field.name}_record_set['id'] = $row['id'];

			$${field.name}_record_set['label'] = <#list field.extra.refFields as refField>$row['${refField}']<#sep>.' '.</#list>;
			$${field.name}_record_map[$row['id']] = $${field.name}_record_set;
		}
	}
	mysqli_close($conn);

	return $${field.name}_record_map;
}

</#if>
</#list>

<html>
 <head>
  <title>${app.name} - ${titleCase(item.label)}</title>
 </head>
 <body>
<h1>${app.name} - ${titleCase(item.label)}</h1>
<?php
if ($is_logged_in) {
	$loggedInUser = $_SESSION['login_user'];
	$is_primary = isPrimaryByUsername($loggedInUser);
	$rolename = getRoleByUsername($loggedInUser);

	$is_allowed = isItemAllowed('${item.name}',$rolename);
	$is_creatable = isItemCreatable('${item.name}',$rolename);
	$is_editable = isItemEditable('${item.name}',$rolename);
	$is_deletable = isItemDeletable('${item.name}',$rolename);

	if ($is_allowed) {
		$page = "view";
		$record_id = null;
		$record = null;
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
				$record_id = $_GET['id'];
				if ($record = get${titleCase(item.name)}RecordById($record_id)) {

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
				if ($page_edit && 'editRecord'==$_POST['action']) {
					if (!$is_editable) {
						$formMessage = "Unauthorized action - Edit";
					} else if (<#list item.fields as field>empty($_POST['${field.name}<#if field.type == 'item'>_id</#if>'])<#sep> ||</#list>) {
						$formMessage = "Invalid values.";
					} else {
						<#list item.fields as field>
						$value_${field.name}<#if field.type == 'item'>_id</#if>=$_POST['${field.name}<#if field.type == 'item'>_id</#if>'];
						</#list>
						
						<#list item.fields as field>
						$value_${field.name}<#if field.type == 'item'>_id</#if> = stripslashes($value_${field.name}<#if field.type == 'item'>_id</#if>);
						</#list>

						$updatedRecord = array();
						$updatedRecord['id'] = $record_id;
                                                <#list item.fields as field>
						$updatedRecord['${field.name}<#if field.type == 'item'>_id</#if>'] = $value_${field.name}<#if field.type == 'item'>_id</#if>;
                                                </#list>

						if (update${titleCase(item.name)}($updatedRecord)) {
							$record = get${titleCase(item.name)}RecordById($record_id);
							$formMessage = "The ${item.label} has been updated.";
						} else {
							$formMessage = "Unable to update the ${item.label}.";
						}
					}
				}
				if ($page_delete && 'deleteRecord'==$_POST['action']) {
					if (!$is_deletable) {
						$formMessage = "Unauthorized action - Delete";
					} else if(delete${titleCase(item.name)}ById($record_id)) {
						$formMessage = "The ${item.label} has been deleted.";
						header("Location: ../list/${item.name}.php");
					} else {
						$formMessage = "Unable to delete the ${item.name}.";
					}			
				}
				if ($page_create && 'createRecord'==$_POST['action']) {
					if (!$is_creatable) {
						$formMessage = "Unauthorized action - Create";
					} else if (
						<#list item.fields as field>empty($_POST['${field.name}<#if field.type == 'item'>_id</#if>'])<#sep> ||</#list>
						) {
						$formMessage = "Invalid values.";
					} else {
						<#list item.fields as field>$value_${field.name}<#if field.type == 'item'>_id</#if>=$_POST['${field.name}<#if field.type == 'item'>_id</#if>'];</#list>
						
						<#list item.fields as field>$value_${field.name}<#if field.type == 'item'>_id</#if> = stripslashes($value_${field.name}<#if field.type == 'item'>_id</#if>);</#list>

						$newRecord = array();

						<#list item.fields as field>$newRecord['${field.name}<#if field.type == 'item'>_id</#if>'] = $value_${field.name}<#if field.type == 'item'>_id</#if>;</#list>

						if (create${titleCase(item.name)}($newRecord)) {
							$formMessage = "The ${item.label} has been created.";
							header("Location: ../list/${item.name}.php");
						} else {
							$formMessage = "Unable to create the ${item.name}.";
						}
					}
				}
			} else if ($page_create) {
				$record = array();
				/* GENERATED FOR EACH item.field
					$record['{field.name (if ref add('_id')}'] = ''; */

				<#list item.fields as field>$record['${field.name}<#if field.type == 'item'>_id</#if>'] = '';</#list>
			}
			?>

			<div id="items">
			Logged as <?php echo $loggedInUser; ?>, <a href="../sa-logout.php">Logout</a>
			<?php if ($is_primary) { ?> | <a href="../settings.php">Settings</a> <?php } ?>
			| <a href="../change-password.php">Change Password</a>

			<h2><a href="../index.php">Home</a> > ${titleCase(item.label)}: <?php
								if ($record_id) {
									echo $record_id;
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
	$pageAction = "editRecord";
} else if ($page_delete) {
	$formVisible = true;
	$submitLabel = "Delete";
	$pageAction = "deleteRecord";
} else if ($page_create) {
	$formVisible = true;
	$submitLabel = "Create";
	$pageAction = "createRecord";
}
?>
<input id="action" name="action" value="<?php echo $pageAction ?>" type="hidden">
				<table>
<#list item.fields as field>
<#if field.type == 'item'>
					<tr>
						<td>
							${field.label}
						</td>
						<td>
							<?php	
							$${field.name}_label_map = get${titleCase(field.name)}Labels();

							$value_${field.name}_id = $record['${field.name}_id'];
							if ($page_edit || $page_create) { ?>
								<select id="${field.name}_id" name="${field.name}_id">
								  <option></option>

								<?php foreach ($${field.name}_label_map as $${field.name}_label_set) { 
								/?>
								  <option value="<?php echo $${field.name}_label_set['id']; ?>" <?php
									if ($${field.name}_label_set['id']==$value_${field.name}_id) echo 'selected="selected"'; ?> ><?php echo $${field.name}_label_set['label']; ?></option>
								<?php } ?>
								</select>
							<?php } else {
								if ($value_${field.name}_id) echo $${field.name}_label_map[$value_${field.name}_id]['label'];
							} ?>

						</td>
					</tr>
<#else>
					<tr>
						<td>
							${field.label}
						</td>
						<td>
							<?php
								if ($page_edit || $page_create) { ?>
								<input id="${field.name}" type="${field.type}" name="${field.name}" value="<?php echo $record['${field.name}']; ?>" />
							<?php } else {
								echo $record['${field.name}'];
							} ?>
						</td>
					</tr>
</#if>
</#list>
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
	include('../sa-login-form.php');
}
?>
<div id="footer">
Generated by AppsoFluna
</div>
 </body>
</html>
