<?php
/* user-rights.php */
$item_labels = array();
<#list app.items as item>
$item_labels['${item.name}'] = '${item.label}';
</#list>

function getItemLabel($itemName) {
 global $item_labels;
 return $item_labels[$itemName];
}

$allowed_items = array();
<#list app.roles as role>
$allowed_items['${role.name}'] = array(<#list role.allowed_items as allowed_item>'${allowed_item}'<#sep>,</#list>);
</#list>

function getAllowedItemsByRole($roleName) {
 global $allowed_items;
 if (array_key_exists($roleName,$allowed_items)) return $allowed_items[$roleName];
 return null;
}

function isItemAllowed($item,$role) {
 if ($items = getAllowedItemsByRole($role)) return (in_array($item,$items));
 return false;
}

function getAllRoles() {
 global $allowed_items;
 return array_keys($allowed_items);
}

$creatable_items = array();
<#list app.roles as role>
$creatable_items['${role.name}'] = array(<#list role.creatable_items as creatable_item>'${creatable_item}'<#sep>,</#list>);
</#list>

function getCreatableItemsByRole($roleName) {
 global $creatable_items;
 if (array_key_exists($roleName,$creatable_items)) return $creatable_items[$roleName];
 return null;
}

function isItemCreatable($item,$role) {
 if ($items = getCreatableItemsByRole($role)) return (in_array($item,$items));
 return false;
}

$editable_items = array();
<#list app.roles as role>
$editable_items['${role.name}'] = array(<#list role.editable_items as editable_item>'${editable_item}'<#sep>,</#list>);
</#list>

function getEditableItemsByRole($roleName) {
 global $editable_items;
 if (array_key_exists($roleName,$editable_items)) return $editable_items[$roleName];
 return null;
}

function isItemEditable($item,$role) {
 if ($items = getEditableItemsByRole($role)) return (in_array($item,$items));
 return false;
}

$deletable_items = array();
<#list app.roles as role>
$deletable_items['${role.name}'] = array(<#list role.deletable_items as deletable_item>'${deletable_item}'<#sep>,</#list>);
</#list>

function getDeletableItemsByRole($roleName) {
 global $deletable_items;
 if (array_key_exists($roleName,$deletable_items)) return $deletable_items[$roleName];
 return null;
}

function isItemDeletable($item,$role) {
 if ($items = getDeletableItemsByRole($role)) return (in_array($item,$items));
 return false;
}
?>
