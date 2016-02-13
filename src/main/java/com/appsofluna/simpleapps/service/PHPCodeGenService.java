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

package com.appsofluna.simpleapps.service;

import com.appsofluna.simpleapps.model.App;
import com.appsofluna.simpleapps.model.Field;
import com.appsofluna.simpleapps.model.Item;
import com.appsofluna.simpleapps.model.Permission;
import com.appsofluna.simpleapps.model.Role;
import com.appsofluna.simpleapps.repository.AppRepository;
import com.appsofluna.simpleapps.repository.FieldRepository;
import com.appsofluna.simpleapps.repository.ItemRepository;
import com.appsofluna.simpleapps.repository.PermissionRepository;
import com.appsofluna.simpleapps.repository.RoleRepository;
import com.appsofluna.simpleapps.util.CommonUtils;
import com.appsofluna.simpleapps.util.SAConstraints;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * The service-layer class that.
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@Service
public class PHPCodeGenService {
    private static final Logger logger = LoggerFactory.getLogger(PHPCodeGenService.class);
    private static final String TEMPLATE_PATH = "/php-templates";
    private static final String FILE_NAME_CONFIG_DOT_PHP = "config.php";
    private static final String FILE_NAME_DATA_DOT_SQL = "data.sql";
    private static final String FOLDER_PREFIX_LIST = "list/";
    private static final String FOLDER_PREFIX_SINGLE = "single/";
    private static final String FOLDER_NAME_COMMON = "common";
    private static final String PHP_FILE_SUFFIX = ".php";
    private static final String[] VISIBLE_FILE_TYPES = {".php", ".js", ".css", ".sql"};
    
    @Autowired
    private AppRepository appRepo;
    @Autowired
    private ItemRepository itemRepo;
    @Autowired
    private FieldRepository fieldRepo;
    @Autowired
    private RoleRepository roleRepo;
    @Autowired
    private PermissionRepository permissionRepo;
    
    /**
     * Returns available/visible files for a given application
     * @param appId the application id
     * @return a map the key "files" which points to the list of file
     */
    public Map getFileListByAppId(long appId) {
        Map map = new HashMap();
        List<String> files = new ArrayList();
        String commonFile = this.getClass().getResource(TEMPLATE_PATH + "/" + FOLDER_NAME_COMMON).getFile();
        File commonFolder = new File(commonFile);
        CommonUtils.listFilesForFolder(commonFolder, "", files);
        files.add(FILE_NAME_CONFIG_DOT_PHP);
        files.add(FILE_NAME_DATA_DOT_SQL);
        Map root = getAppForCodeGeneration(appId);
        List<Map> itemSetList = (List<Map>) ((Map) root.get("app")).get("items");
        for (Map itemMap : itemSetList) {
            String itemName = (String) itemMap.get("name");
            files.add(FOLDER_PREFIX_LIST + itemName + PHP_FILE_SUFFIX);
            files.add(FOLDER_PREFIX_SINGLE + itemName + PHP_FILE_SUFFIX);
        }
        List filteredFiles = new ArrayList();
        for (String file : files) {
            for (String type : VISIBLE_FILE_TYPES) {
                if (file.toLowerCase().endsWith(type)) {
                    filteredFiles.add(file);
                }
            }
        }
        map.put("files", filteredFiles);
        return map;
    }
    
    /**
     * Returns the content of a source code file by application id and path
     * @param appId the application id
     * @param filePath the path relative to the source code root
     * @return the content of the file
     */
    public String getFileContentByAppIdAndPath(long appId, String filePath) {
        if (FILE_NAME_CONFIG_DOT_PHP.equals(filePath)) {
            return configDotPHP(appId);
        } else if (FILE_NAME_DATA_DOT_SQL.equals(filePath)) {
            return dataDotSQL(appId);
        } else {
            List<String> commonFiles = new ArrayList();
            String file = this.getClass().getResource(TEMPLATE_PATH + "/" + FOLDER_NAME_COMMON).getFile();
            File commonFolder = new File(file);
            CommonUtils.listFilesForFolder(commonFolder, "", commonFiles);
            if (commonFiles.contains(filePath)) {
                return CommonUtils.fileToString(TEMPLATE_PATH + "/" + FOLDER_NAME_COMMON + "/" + filePath);
            } else if (filePath.endsWith(PHP_FILE_SUFFIX)) {
                String itemName = filePath.substring(0, filePath.length() - PHP_FILE_SUFFIX.length());
                if (filePath.startsWith(FOLDER_PREFIX_LIST)) {
                    itemName = itemName.substring(FOLDER_PREFIX_LIST.length(), itemName.length());
                    return listSlashItemDotPHP(appId, itemName);
                } else if (filePath.startsWith(FOLDER_PREFIX_SINGLE)) {
                    itemName = itemName.substring(FOLDER_PREFIX_SINGLE.length(), itemName.length());
                    return singleSlashItemDotPHP(appId, itemName);
                }
            }
        }
        return "";
    }
    
    /**
     * Returns a byte array for the zip file that contains all the source code files
     * @param appId the application id
     * @return the byte array that represents the application content
     */
    public byte[] getSourceCodeAsZIP(long appId) {
        try {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(byteArrayOutputStream);
            ZipOutputStream zipOutputStream = new ZipOutputStream(bufferedOutputStream);
            
            putContentToPath(zipOutputStream, FILE_NAME_CONFIG_DOT_PHP, configDotPHP(appId));
            putContentToPath(zipOutputStream, FILE_NAME_DATA_DOT_SQL, dataDotSQL(appId));
            List<String> commonFiles = new ArrayList();
            String commonFolderFile = this.getClass().getResource(TEMPLATE_PATH + "/" + FOLDER_NAME_COMMON).getFile();
            File commonFolder = new File(commonFolderFile);
            CommonUtils.listFilesForFolder(commonFolder, "", commonFiles);
            for (String filePath : commonFiles) {
                putContentToPath(zipOutputStream, "/" + filePath, CommonUtils.fileToString(TEMPLATE_PATH + "/" + FOLDER_NAME_COMMON + "/" + filePath));
            }
            Map root = getAppForCodeGeneration(appId);
            List<Map> itemSetList = (List<Map>) ((Map) root.get("app")).get("items");
            for (Map itemMap : itemSetList) {
                String name = (String) itemMap.get("name");
                putContentToPath(zipOutputStream, "/" + FOLDER_PREFIX_LIST + name + ".php", listSlashItemDotPHP(appId, name));
                putContentToPath(zipOutputStream, "/" + FOLDER_PREFIX_SINGLE + name + ".php", singleSlashItemDotPHP(appId, name));
            }
            
            zipOutputStream.finish();
            zipOutputStream.flush();
            IOUtils.closeQuietly(zipOutputStream);
            
            IOUtils.closeQuietly(bufferedOutputStream);
            IOUtils.closeQuietly(byteArrayOutputStream);
            return byteArrayOutputStream.toByteArray();
        } catch (IOException ex) {
            logger.error(ex.toString(), ex);
        }
        return null;
    }

    //writes string content into a particular path under zip outputstream
    private void putContentToPath(ZipOutputStream zipOutputStream, String path, String content) throws IOException {
        zipOutputStream.putNextEntry(new ZipEntry(path));
        try (ByteArrayInputStream bais = new ByteArrayInputStream(content.getBytes())) {
            IOUtils.copy(bais, zipOutputStream);
        }
        zipOutputStream.closeEntry();
    }

    //generates the code for config.php
    private String configDotPHP(long appId) {
        Map root = getAppForCodeGeneration(appId);
        return templateToString("config.php.ftl", root);
    }

    //generates code for data.sql
    private String dataDotSQL(long appId) {
        Map root = getAppForCodeGeneration(appId);
        return templateToString("data.sql.ftl", root);
    }

    //generates code for an list/{item}.php
    private String listSlashItemDotPHP(long appId, String itemName) {
        logger.info("item name: {}", itemName);
        Map root = getAppForCodeGeneration(appId);
        if (selectItem(root, itemName)) {
            return templateToString("list.slash.item.php.ftl", root);
        } else {
            return "";
        }
    }

    //generates code for an single/{item}.php
    private String singleSlashItemDotPHP(long appId, String itemName) {
        Map root = getAppForCodeGeneration(appId);
        if (selectItem(root, itemName)) {
            return templateToString("single.slash.item.php.ftl", root);
        } else {
            return "";
        }
    }

    //selects a given item in an application map
    private boolean selectItem(Map root, String itemName) {
        List<Map> itemSetList = (List<Map>) ((Map) root.get("app")).get("items");
        logger.info("selecting item: {}", itemName);
        for (Map itemMap : itemSetList) {
            String name = (String) itemMap.get("name");
            logger.info("current item: {}", name);
            if (name.equals(itemName)) {
                root.put("item", itemMap);
                return true;
            }
        }
        logger.warn("no item found: {}", itemName);
        return false;
    }
    
    //generate a map of application info for an app
    private Map getAppForCodeGeneration(long id) {
        Map map = new HashMap();
        App app = appRepo.findOne(id);
        Map appMap = new HashMap();
        appMap.put("name", app.getName());
        appMap.put("id", app.getId());
        
        List itemsSetList = new ArrayList();
        List<Item> itemList = itemRepo.findByApp(id);
        for (Item item: itemList) {
            Map itemMap = new HashMap();
            Long itemId = item.getId();
            itemMap.put("label", item.getLabel());
            itemMap.put("name", clearName(item.getName()));
            itemMap.put("id", itemId);
            List fieldSetList = new ArrayList();
            List<Field> fieldList = fieldRepo.findByItem(itemId);
            for (Field field: fieldList) {
                Map fieldMap = new HashMap();
                Long fieldId = field.getId();
                fieldMap.put("label",field.getLabel());
                fieldMap.put("name",clearName(field.getName()));
                fieldMap.put("type",field.getType());
                fieldMap.put("id",fieldId);
                fieldMap.put("extra",getFieldExtra(field));
                fieldSetList.add(fieldMap);
            }
            itemMap.put("fields",fieldSetList);
            itemsSetList.add(itemMap);
        }
        appMap.put("items", itemsSetList);
        
        List roleSetList = new ArrayList();
        List<Role> roleList = roleRepo.findByApp(id);
        boolean administratorFound = false;
        for (Role role: roleList) {
            Map roleMap = new HashMap();
            Long roleId = role.getId();
            String roleName = role.getName();
            if (SAConstraints.DEFAULT_ROLENAME.equals(roleName)) administratorFound = true;
            roleMap.put("name", roleName);
            roleMap.put("id", roleId);
            boolean addAll = role.isAllItemsAllowed();
            List<String> allowedItems = new ArrayList();
            List<String> creatableItems = new ArrayList();
            List<String> editableItems = new ArrayList();
            List<String> deletableItems = new ArrayList();
            for (Item item: itemList) {
                String name = item.getName().toLowerCase();
                if (addAll) {
                    allowedItems.add(name);
                    creatableItems.add(name);
                    editableItems.add(name);
                    deletableItems.add(name);
                } else {
                    Permission permission = permissionRepo.findByRoleAndItem(roleId, item.getId());
                    if (permission!=null) {
                        if (permission.isAccessAllowed()) allowedItems.add(name);
                        if (permission.isCreateAllowed()) creatableItems.add(name);
                        if (permission.isEditAllowed()) editableItems.add(name);
                        if (permission.isDeleteAllowed()) deletableItems.add(name);
                    }
                }
            }
            roleMap.put("allowed_items", allowedItems);
            roleMap.put("creatable_items", creatableItems);
            roleMap.put("editable_items", editableItems);
            roleMap.put("deletable_items", deletableItems);
            roleSetList.add(roleMap);
        }
        if (!administratorFound) {
            Map roleMap = new HashMap();
            roleMap.put("name", SAConstraints.DEFAULT_ROLENAME);
            roleMap.put("id", -1);
            List<String> allowedItems = new ArrayList();
            List<String> creatableItems = new ArrayList();
            List<String> editableItems = new ArrayList();
            List<String> deletableItems = new ArrayList();
            for (Item item: itemList) {
                String name = item.getName().toLowerCase();
                allowedItems.add(name);
                creatableItems.add(name);
                editableItems.add(name);
                deletableItems.add(name);
            }
            roleMap.put("allowed_items", allowedItems);
            roleMap.put("creatable_items", creatableItems);
            roleMap.put("editable_items", editableItems);
            roleMap.put("deletable_items", deletableItems);
            roleSetList.add(roleMap);
        }
        appMap.put("roles", roleSetList);
        
        map.put("app",appMap);
        return map;
    }
    
    //clears and formats name into template format
    private String clearName(String name) {
        return (name == null) ? "" : name.toLowerCase().replaceAll(" ", "_");
    }

    //returns map of extra information of a field
    private Map getFieldExtra(Field field) {
        Map map = new HashMap();
        String fieldType = field.getType();
        String format = field.getFormat();
        Map<String, Object> formatMap = null;
        if (format!=null && !format.trim().isEmpty()) {
            formatMap = CommonUtils.stringToMap(format);
        }
        if (SAConstraints.FIELD_TYPE_RANGE.equals(fieldType)) {
            Object rangeMinParmObj = formatMap.get(SAConstraints.FIELD_TYPE_RANGE_PARM_MIN);
            Integer rangeMinParm;
            if (rangeMinParmObj instanceof Integer) {
                rangeMinParm = (Integer) rangeMinParmObj;
            } else if (rangeMinParmObj instanceof String) {
                rangeMinParm = Integer.parseInt((String)rangeMinParmObj);
            } else {
                logger.error("unable to format range min parm");
                return null;
            }
            map.put("min", rangeMinParm);
            Object rangeMaxParmObj = formatMap.get(SAConstraints.FIELD_TYPE_RANGE_PARM_MAX);
            Integer rangeMaxParm;
            if (rangeMaxParmObj instanceof Integer) {
                rangeMaxParm = (Integer) rangeMaxParmObj;
            } else if (rangeMinParmObj instanceof String) {
                rangeMaxParm = Integer.parseInt((String)rangeMaxParmObj);
            } else {
                logger.error("unable to format range max parm");
                return null;
            }
            map.put("max", rangeMaxParm);
        } if (SAConstraints.FIELD_TYPE_SELECTION.equals(fieldType)) {
            Object selectionOptionsParmObj = formatMap.get(SAConstraints.FIELD_TYPE_SELECTION_PARM_OPTIONS);
            String selectionOptionsParm = "";
            if (selectionOptionsParmObj instanceof String) {
                selectionOptionsParm = ((String)selectionOptionsParmObj).trim();
            }
            List<String> options = new ArrayList();
            if (!selectionOptionsParm.isEmpty()) {
                String[] selectionOptions = selectionOptionsParm.split(",");
                for (String option: selectionOptions) {
                    options.add(option.trim());
                }
            }
            map.put("options", options);
            Object selectionMultipleParmObj = formatMap.get(SAConstraints.FIELD_TYPE_SELECTION_PARM_MULTIPLE);
            String selectionMultipleParm = null;
            if (selectionMultipleParmObj instanceof String) {
                selectionMultipleParm = (String)selectionMultipleParmObj;
            }
            map.put("multiple", "true".equals(selectionMultipleParm) ? "true" : "false");
        } else if (SAConstraints.FIELD_TYPE_ITEM.equals(field.getType())) {
            Object refItemIdObj = formatMap.get(SAConstraints.FIELD_TYPE_ITEM_PARM_REFER);
            Long refItemId;
            if (refItemIdObj instanceof Long) {
                refItemId = (Long) refItemIdObj;
            } else if (refItemIdObj instanceof String) {
                refItemId = Long.parseLong((String)refItemIdObj);
            } else {
                logger.error("unable to format item because of ref id");
                return null;
            }
            Item refItem = itemRepo.findOne(refItemId);
            map.put("refItem", clearName(refItem.getName()));
            logger.info("refItem: {}",clearName(refItem.getName()));
            List<String> refFieldList = new ArrayList();
            Object templateObj = formatMap.get(SAConstraints.FIELD_TYPE_ITEM_PARM_TEMPLATE);
            String template = null;
            if (templateObj instanceof String) {
                template = (String)templateObj;
                logger.info("uses field template: {}",template);
            }
            if (template==null || template.trim().equals("")) {
                template = refItem.getTemplate();
                logger.info("uses item template: {}",template);
            }
            if (template!=null && !template.trim().equals("")) {
                logger.info("template works");
                List<Field> refItemFields = fieldRepo.findByItem(refItemId);
                Map<String,Field> refItemFieldMap = new HashMap<>();
                for (Field refField: refItemFields) {
                    refItemFieldMap.put(refField.getName(),refField);
                }
                Pattern pattern = Pattern.compile("\\{([^}]*)\\}");
                Matcher matcher = pattern.matcher(template);
                while(matcher.find()) {
                    String fieldName = matcher.group(1);
                    if (refItemFieldMap.containsKey(fieldName)) {
                        Field refField = refItemFieldMap.get(fieldName);
                        if (SAConstraints.FIELD_TYPE_ITEM.equalsIgnoreCase(refField.getType())) {
                            refFieldList.add(clearName(fieldName)+"_id");
                        } else {
                            refFieldList.add(clearName(fieldName));
                        }
                    }
                }
            }
            if (refFieldList.isEmpty()) {
                logger.info("item template hadn't work");
                refFieldList.add("id");
            }
            map.put("refFields", refFieldList);
        }
        return map;
    }
    
    //generate content with a template and model
    private String templateToString(String template, Map model) {
        try {
            Configuration cfg = new Configuration(Configuration.VERSION_2_3_22);
            cfg.setClassForTemplateLoading(this.getClass(), TEMPLATE_PATH);
            cfg.setDefaultEncoding("UTF-8");
            cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
            Template temp = cfg.getTemplate(template);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Writer out = new OutputStreamWriter(baos);
            temp.process(model, out);
            return baos.toString();
        } catch (IOException | TemplateException ex) {
            logger.error(ex.toString(), ex);
        }
        return "";
    }
}