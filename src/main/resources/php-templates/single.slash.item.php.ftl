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
/* Generated by AppsoFluna */

/*
 * Copyright (c) Charaka Gunatillake / AppsoFluna. (http://www.appsofluna.com)
 * All rights reserved.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

$relative_path="../";
include($relative_path.'functions.php');
include($relative_path.'login.php');
$is_logged_in = isset($_SESSION['login_user']);

function get${titleCase(item.name)}RecordById($${item.name}_id) {
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return null;
	}
	
	$sql = "SELECT id<#if (item.fields?size>0) >,</#if><#list item.fields as field>${field.name}<#if field.type == 'period'>_from, ${field.name}_to</#if><#if field.type == 'item'>_id</#if><#sep>,</#list> FROM ".$db_prefix."${item.name} WHERE id = $${item.name}_id";
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
		|| !isset($newRecord['${field.name}<#if field.type == 'period'>_from'])
                || !isset($newRecord['${field.name}_to</#if><#if field.type == 'item'>_id</#if>'])
		</#list>
		) {
		return false;
	}
	<#list item.fields as field>
	$value_${field.name}<#if field.type == 'period'>_from = $newRecord['${field.name}_from'];
        $value_${field.name}_to </#if><#if field.type == 'item'>_id</#if> = $newRecord['${field.name}<#if field.type == 'period'>_to</#if><#if field.type == 'item'>_id</#if>'];
	</#list>
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return false;
	}

	$sql = "INSERT INTO ".$db_prefix."${item.name} (<#list item.fields as field>${field.name}<#if field.type == 'period'>_from, ${field.name}_to</#if><#if field.type == 'item'>_id</#if><#sep>,</#list>) VALUES (<#list item.fields as field>'$value_${field.name}<#if field.type == 'period'>_from', '$value_${field.name}_to</#if><#if field.type == 'item'>_id</#if>'<#sep>,</#list>)";
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
		|| !isset($updatedRecord['${field.name}<#if field.type == 'period'>_from'])
                || !isset($updatedRecord['${field.name}_to</#if><#if field.type == 'item'>_id</#if>'])
		</#list>
		) {
		return false;
	}
	$value_id = $updatedRecord['id'];
	<#list item.fields as field>
	$value_${field.name}<#if field.type == 'period'>_from = $updatedRecord['${field.name}_from'];
        $value_${field.name}_to</#if><#if field.type == 'item'>_id</#if> = $updatedRecord['${field.name}<#if field.type == 'period'>_to</#if><#if field.type == 'item'>_id</#if>'];
	</#list>

	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return false;
	}

	$sql = "UPDATE ".$db_prefix."${item.name} SET <#list item.fields as field>${field.name}<#if field.type == 'period'>_from = '$value_${field.name}_from',${field.name}_to</#if><#if field.type == 'item'>_id</#if> = '$value_${field.name}<#if field.type == 'period'>_to</#if><#if field.type == 'item'>_id</#if>'<#sep>,</#list> WHERE id=$value_id";

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
function get${titleCase(field.name)}Labels() {
	global $db_prefix;
	$conn = getConnection();
	if (!$conn) {
		return null;
	}

	$sql = "SELECT id, <#list field.extra.refFields as refField>${refField}<#sep>,</#list> FROM ".$db_prefix."${field.extra.refItem}";
	$result = mysqli_query($conn, $sql);

	$${field.name}_record_map = array();
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
?>

<html>
 <head>
  <?php include($relative_path."preheaders.php"); ?>
  <title><?php echo $sa_appname.' - '.$item_labels['${item.name}']; ?></title>
  <?php include($relative_path."headers.php"); ?>
  <script>
    $(function() {
        <#list item.fields as field>
        <#if field.type == 'period'>
        $( "#${field.name}_from" ).datepicker({
          dateFormat: "yy-mm-dd",
          defaultDate: "+1w",
          changeMonth: true,
          onClose: function( selectedDate ) {
            $( "#${field.name}_to" ).datepicker( "option", "minDate", selectedDate );
          }
        });
        $( "#${field.name}_to" ).datepicker({
          dateFormat: "yy-mm-dd",
          defaultDate: "+1w",
          changeMonth: true,
          onClose: function( selectedDate ) {
            $( "#${field.name}_from" ).datepicker( "option", "maxDate", selectedDate );
          }
        });
        </#if>
        </#list>
  });
  </script>
 </head>
 <body>
<div id="main" class="container" role="main">
<?php
if ($is_logged_in) {
	$loggedInUser = $_SESSION['login_user'];
	$is_primary = isPrimaryByUsername($loggedInUser);
	$rolename = getRoleByUsername($loggedInUser);

	$is_allowed = isItemAllowed('${item.name}',$rolename);
	$is_creatable = isItemCreatable('${item.name}',$rolename);
	$is_editable = isItemEditable('${item.name}',$rolename);
	$is_deletable = isItemDeletable('${item.name}',$rolename);

	$formStatus = "info";

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
                                                $formStatus = "danger";
					} else if (<#list item.fields as field>empty($_POST['${field.name}<#if (field.type == 'selection') && (field.extra.multiple=='true')>']) || !is_array($_POST['${field.name}</#if><#if field.type == 'period'>_from']) || empty($_POST['${field.name}_to</#if><#if field.type == 'item'>_id</#if>'])<#sep> ||</#list>) {
						$formMessage = "Invalid values.";
                                                $formStatus = "danger";
					} else {
						<#list item.fields as field>
						$value_${field.name}<#if field.type == 'period'>_from=$_POST['${field.name}_from'];
                                                $value_${field.name}_to</#if><#if field.type == 'item'>_id</#if>=$_POST['${field.name}<#if field.type == 'period'>_to</#if><#if field.type == 'item'>_id</#if>'];
						</#list>
						
						<#list item.fields as field>
                                                <#if (field.type == 'selection') && (field.extra.multiple=='true')>
                                                foreach ($value_${field.name} as $key=>$value) {
                                                    $value_${field.name}[$key] = stripslashes($value);
                                                }
                                                $value_${field.name} = implode(",",$value_${field.name});
                                                <#else>
						$value_${field.name}<#if field.type == 'period'>_from=stripslashes($value_${field.name}_from);
                                                $value_${field.name}_to</#if><#if field.type == 'item'>_id</#if> = stripslashes($value_${field.name}<#if field.type == 'period'>_to</#if><#if field.type == 'item'>_id</#if>);
                                                </#if>
						</#list>

						$updatedRecord = array();
						$updatedRecord['id'] = $record_id;
                                                <#list item.fields as field>
						$updatedRecord['${field.name}<#if field.type == 'period'>_from'] = $value_${field.name}_from;
                                                $updatedRecord['${field.name}_to</#if><#if field.type == 'item'>_id</#if>'] = $value_${field.name}<#if field.type='period'>_to</#if><#if field.type == 'item'>_id</#if>;
                                                </#list>

						if (update${titleCase(item.name)}($updatedRecord)) {
							$record = get${titleCase(item.name)}RecordById($record_id);
							$formMessage = "The ".$item_labels['${item.name}']." has been updated.";
                                                        $formStatus = "success";
						} else {
							$formMessage = "Unable to update the ".$item_labels['${item.name}'].".";
                                                        $formStatus = "danger";
						}
					}
				}
				if ($page_delete && 'deleteRecord'==$_POST['action']) {
					if (!$is_deletable) {
						$formMessage = "Unauthorized action - Delete";
                                                $formStatus = "danger";
					} else if(delete${titleCase(item.name)}ById($record_id)) {
						$formMessage = "The ".$item_labels['${item.name}']." has been deleted.";
                                                $formStatus = "success";
						header("Location: ../list/${item.name}.php");
					} else {
						$formMessage = "Unable to delete the ${item.name}.";
                                                $formStatus = "danger";
					}			
				}
				if ($page_create && 'createRecord'==$_POST['action']) {
					if (!$is_creatable) {
						$formMessage = "Unauthorized action - Create";
                                                $formStatus = "danger";
					} else if (
						<#list item.fields as field>empty($_POST['${field.name}<#if (field.type == 'selection') && (field.extra.multiple=='true')>']) || !is_array($_POST['${field.name}</#if><#if field.type == 'period'>_from']) || empty($_POST['${field.name}_to</#if><#if field.type == 'item'>_id</#if>'])<#sep> ||</#list>
						) {
						$formMessage = "Invalid values.";
                                                $formStatus = "danger";
					} else {
						<#list item.fields as field>$value_${field.name}<#if field.type == 'period'>_from=$_POST['${field.name}_from'];
                                                $value_${field.name}_to</#if><#if field.type == 'item'>_id</#if>=$_POST['${field.name}<#if field.type == 'period'>_to</#if><#if field.type == 'item'>_id</#if>'];</#list>
						
						<#list item.fields as field>
                                                <#if (field.type == 'selection') && (field.extra.multiple=='true')>
                                                foreach ($value_${field.name} as $key=>$value) {
                                                    $value_${field.name}[$key] = stripslashes($value);
                                                }
                                                $value_${field.name} = implode(",",$value_${field.name});
                                                <#else>
                                                $value_${field.name}<#if field.type == 'period'>_from = stripslashes($value_${field.name}_from);
                                                $value_${field.name}_to</#if><#if field.type == 'item'>_id</#if> = stripslashes($value_${field.name}<#if field.type == 'period'>_to</#if><#if field.type == 'item'>_id</#if>);
                                                </#if>
                                                </#list>

						$newRecord = array();

						<#list item.fields as field>$newRecord['${field.name}<#if field.type == 'period'>_from'] = $value_${field.name}_from;
                                                $newRecord['${field.name}_to</#if><#if field.type == 'item'>_id</#if>'] = $value_${field.name}<#if field.type == 'period'>_to</#if><#if field.type == 'item'>_id</#if>;</#list>

						if (create${titleCase(item.name)}($newRecord)) {
							$formMessage = "The ".$item_labels['${item.name}']." has been created.";
                                                        $formStatus = "success";
							header("Location: ".$relative_path."list/${item.name}.php");
						} else {
							$formMessage = "Unable to create the ${item.name}.";
                                                        $formStatus = "danger";
						}
					}
				}
			} else if ($page_create) {
				$record = array();

				<#list item.fields as field>$record['${field.name}<#if field.type == 'period'>_from'] = '';
                                $record['${field.name}_to</#if><#if field.type == 'item'>_id</#if>'] = '';</#list>
			}
			?>

<nav class="navbar navbar-default">
  <div class="container">
    <div class="navbar-header">
      <a class="navbar-brand" href="<?php echo $relative_path; ?>index.php"><?php echo $sa_appname; ?></a>
    </div>
    <ul class="nav navbar-nav">
        <li><a href="<?php echo $relative_path; ?>list/${item.name}.php"><?php echo $item_labels['${item.name}']; ?> Records</a></li>

<li class="active"><a   href="#"><?php
								if ($record_id) {
									echo $record_id;
								} else {
									echo "Create New";
								} ?></a></li>
    </ul>
    <ul class="nav navbar-nav navbar-right">
      <li><a href="#">Logged as <?php echo $loggedInUser; ?></a></li>
      <li><a href="<?php echo $relative_path; ?>logout.php">Logout</a></li>
      <?php if ($is_primary) { ?><li><a href="<?php echo $relative_path; ?>users.php">Users</a></li><?php } ?>
      <li><a href="<?php echo $relative_path; ?>change-password.php">Change Password</a></li>
      
	<li><a href="#"></a></li>
    </ul>
  </div>
</nav>

<form action="" method="post" role="form">
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

if ($formMessage && strlen($formMessage)>0) {
?>
<div class="alert alert-<?php echo $formStatus; ?>">
  <?php echo $formMessage; ?>
</div>
<?php } ?>

<input id="action" name="action" value="<?php echo $pageAction ?>" type="hidden">

<#list item.fields as field>
<#if field.type == 'item'>
					<div class="form-group">
                                                <label for="${field.name}_id">${field.label}</label>
							<?php	
							$${field.name}_label_map = get${titleCase(field.name)}Labels();

							$value_${field.name}_id = $record['${field.name}_id'];
							if ($page_edit || $page_create) { ?>
								<select id="${field.name}_id" class="form-control" name="${field.name}_id">
								  <option>(select)</option>

								<?php foreach ($${field.name}_label_map as $${field.name}_label_set) { ?>
								  <option value="<?php echo $${field.name}_label_set['id']; ?>" <?php
									if ($${field.name}_label_set['id']==$value_${field.name}_id) echo 'selected="selected"'; ?> ><?php echo $${field.name}_label_set['label']; ?></option>
								<?php } ?>
								</select>
							<?php } else { ?>
                                                                <fieldset id="${field.name}_id">
								<?php if ($value_${field.name}_id) echo $${field.name}_label_map[$value_${field.name}_id]['label']; ?>
                                                                </fieldset>
							<?php } ?>

					</div>
<#else>
					<div class="form-group">
                                                <label for="${field.name}">${field.label}</label>
							<?php
								if ($page_edit || $page_create) { ?>
                                                                <fieldset id="${field.name}">
                                                                <#if field.type == 'period'>
                                                                <div class="form-group form-group-sm col-sm-6">
                                                                <label for="${field.name}_from">From</label><input id="${field.name}_from" class="form-control" type="text" name="${field.name}_from" value="<?php echo $record['${field.name}_from']; ?>" />
                                                                </div>
                                                                <div class="form-group form-group-sm col-sm-6">
                                                                <label for="${field.name}_to">To</label><input id="${field.name}_to" class="form-control" type="text" name="${field.name}_to" value="<?php echo $record['${field.name}_to']; ?>" />
                                                                </div>
                                                                </fieldset>
                                                                <#elseif field.type == 'selection'>
                                                                    <#if field.extra.multiple=='true'>
                                                                        <fieldset id="${field.name}">
                                                                            <?php $val_selection_array_${field.name} = explode(",",$record['${field.name}']); ?>
                                                                            <#list field.extra.options as option>
                                                                            <div class="checkbox"><label><input type="checkbox" value="${option}" <?php if (in_array('${option}',$val_selection_array_${field.name})) echo 'checked="checked"'; ?> name="${field.name}[]" />${option}</label></div>
                                                                            </#list>
                                                                        </fieldset>
                                                                    <#else>
                                                                        <select id="${field.name}" class="form-control" name="${field.name}">
                                                                            <option>(select)</option>
                                                                            <#list field.extra.options as option>
                                                                            <option value="${option}" <?php if ($record['${field.name}']=="${option}") echo 'selected="selected"'; ?> >${option}</option>
                                                                            </#list>
                                                                        </select>
                                                                    </#if>
                                                                <#else>
								<input id="${field.name}" class="form-control" type="${field.type}" name="${field.name}" <#if field.type == 'range'>min='${field.extra.min}' max='${field.extra.max}' </#if>value="<?php echo $record['${field.name}']; ?>" />
                                                                </#if>
							<?php } else { ?>
                                                                <fieldset id="${field.name}">
                                                                <?php<#if field.type == 'period'>
								echo $record['${field.name}_from'].' - '.$record['${field.name}_to'];
                                                                <#else>
								echo $record['${field.name}'];
                                                                </#if>?>
                                                                </fieldset>
							<?php } ?>
					</div>
</#if>
</#list>
<?php if ($formVisible) { ?>
<input name="submit" class="btn btn-default" type="submit" value="<?php echo $submitLabel; ?>">
<?php } ?>
</form>
			<?php
		}
	} else {
		?>
		This page is restricted.
		<?php
	}
} else {
	include($relative_path.'login-form.php');
}
include($relative_path.'footer.php');
?>

</div>
 </body>
</html>
