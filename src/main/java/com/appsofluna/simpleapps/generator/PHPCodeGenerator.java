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

package com.appsofluna.simpleapps.generator;

import com.appsofluna.simpleapps.service.AppService;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;
import org.apache.commons.io.FileUtils;
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
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@RestController
@RequestMapping("/api/generate/php")
public class PHPCodeGenerator {
    private static final Logger logger = LoggerFactory.getLogger(PHPCodeGenerator.class);
    private static final String TEMPLATE_PATH = "/php-templates";
    private static final String FILE_NAME_CONFIG_DOT_PHP = "config.php";
    private static final String FILE_NAME_DATA_DOT_SQL = "data.sql";
    private static final String FOLDER_PREFIX_LIST = "list/";
    private static final String FOLDER_PREFIX_SINGLE = "single/";
    private static final String FOLDER_NAME_COMMON = "common";
    private static final String PHP_FILE_SUFFIX = ".php";
    private static final String[] VISIBLE_FILE_TYPES = {".php",".js",".css",".sql"};
    
    @Autowired
    private AppService appService;
    
    @RequestMapping(value = "/{appId}/files")
    public @ResponseBody Map fileList(@PathVariable(value="appId") long appId) {
        Map map = new HashMap();
        List<String> files = new ArrayList();
        String commonFile = this.getClass().getResource(TEMPLATE_PATH+"/"+FOLDER_NAME_COMMON).getFile();
        File commonFolder = new File(commonFile);
        listFilesForFolder(commonFolder,"",files);
        files.add(FILE_NAME_CONFIG_DOT_PHP);
        files.add(FILE_NAME_DATA_DOT_SQL);
        Map root = appService.getAppForCodeGeneration(appId);
        List<Map> itemSetList = (List<Map>)((Map)root.get("app")).get("items");
        for (Map itemMap: itemSetList) {
            String itemName = (String)itemMap.get("name");
            files.add(FOLDER_PREFIX_LIST+itemName+PHP_FILE_SUFFIX);
            files.add(FOLDER_PREFIX_SINGLE+itemName+PHP_FILE_SUFFIX);
        }
        List filteredFiles = new ArrayList();
        for (String file: files) {
            for (String type : VISIBLE_FILE_TYPES) {
                if (file.toLowerCase().endsWith(type))
                    filteredFiles.add(file);
            }
        }
        map.put("files", filteredFiles);
        return map;
    }
    
    @RequestMapping(value = "/{appId}/file/{folderName}/{filePath}.php",produces = "text/plain")
    public String processSecondaryFolderPHP(@PathVariable(value="appId") long appId,@PathVariable(value="folderName") String folderName,@PathVariable(value="filePath") String filePath) {
        return processSecondaryFolder(appId, folderName, filePath, "php");
    }
    
    @RequestMapping(value = "/{appId}/file/{folderName}/{filePath}.sql",produces = "text/plain")
    public String processSecondaryFolderSQL(@PathVariable(value="appId") long appId,@PathVariable(value="folderName") String folderName,@PathVariable(value="filePath") String filePath) {
        return processSecondaryFolder(appId, folderName, filePath, "sql");
    }
    
    @RequestMapping(value = "/{appId}/file/{folderName}/{filePath}.js",produces = "text/javascript")
    public String processSecondaryFolderJS(@PathVariable(value="appId") long appId,@PathVariable(value="folderName") String folderName,@PathVariable(value="filePath") String filePath) {
        return processSecondaryFolder(appId, folderName, filePath, "js");
    }
    
    @RequestMapping(value = "/{appId}/file/{folderName}/{filePath}.css",produces = "text/css")
    public String processSecondaryFolderCSS(@PathVariable(value="appId") long appId,@PathVariable(value="folderName") String folderName,@PathVariable(value="filePath") String filePath) {
        return processSecondaryFolder(appId, folderName, filePath, "css");
    }
    
    
    @RequestMapping(value = "/{appId}/file/{filePath}.sql",produces = "text/plain")
    public String processFileSQL(@PathVariable(value="appId") long appId,@PathVariable(value="filePath") String filePath) {
        return processFile(appId, filePath, "sql");
    }
    
    @RequestMapping(value = "/{appId}/file/{filePath}.js",produces = "text/javascript")
    public String processFileJS(@PathVariable(value="appId") long appId,@PathVariable(value="filePath") String filePath) {
        return processFile(appId, filePath, "js");
    }
    
    @RequestMapping(value = "/{appId}/file/{filePath}.css",produces = "text/css")
    public String processFileCSS(@PathVariable(value="appId") long appId,@PathVariable(value="filePath") String filePath) {
        return processFile(appId, filePath, "css");
    }
    
    @RequestMapping(value = "/{appId}/file/{filePath}.php")
    public String processFilePHP(@PathVariable(value="appId") long appId,@PathVariable(value="filePath") String filePath) {
        return processFile(appId, filePath, "php");
    }
    
    @RequestMapping(value = "/{appId}/file/{folderName}/{filePath}.{fileSuffix}")
    public String processSecondaryFolder(@PathVariable(value="appId") long appId,@PathVariable(value="folderName") String folderName,@PathVariable(value="filePath") String filePath,@PathVariable(value="fileSuffix") String fileSuffix) {
        return processFile(appId, folderName +"/"+filePath, fileSuffix);
    }
    @RequestMapping(value = "/{appId}/file/{filePath}.{fileSuffix}")
    public String processFile(@PathVariable(value="appId") long appId,@PathVariable(value="filePath") String filePath,@PathVariable(value="fileSuffix") String fileSuffix) {
        if (filePath==null || filePath.equals("")) return "";
        if (fileSuffix!=null && !fileSuffix.equals("")) {
            filePath += "."+ fileSuffix;
        }
        if (FILE_NAME_CONFIG_DOT_PHP.equals(filePath)) {
            return configDotPHP(appId);
        } else if (FILE_NAME_DATA_DOT_SQL.equals(filePath)) {
            return dataDotSQL(appId);
        } else {
            List<String> commonFiles = new ArrayList();
            String file = this.getClass().getResource(TEMPLATE_PATH+"/"+FOLDER_NAME_COMMON).getFile();
            File commonFolder = new File(file);
            listFilesForFolder(commonFolder,"",commonFiles);
            if (commonFiles.contains(filePath)) {
                return fileToString(TEMPLATE_PATH+"/"+FOLDER_NAME_COMMON+"/"+filePath);
            } else if (filePath.endsWith(PHP_FILE_SUFFIX)) {
                String itemName = filePath.substring(0, filePath.length()-PHP_FILE_SUFFIX.length());
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
    
    @RequestMapping(value = "/{appId}/zip", produces="application/zip")
    public byte[] downloadAsZIP(@PathVariable(value="appId") long appId) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(byteArrayOutputStream);
        ZipOutputStream zipOutputStream = new ZipOutputStream(bufferedOutputStream);
        
        putContentToPath(zipOutputStream, FILE_NAME_CONFIG_DOT_PHP, configDotPHP(appId));
        putContentToPath(zipOutputStream, FILE_NAME_DATA_DOT_SQL, dataDotSQL(appId));
        List<String> commonFiles = new ArrayList();
        String commonFolderFile = this.getClass().getResource(TEMPLATE_PATH+"/"+FOLDER_NAME_COMMON).getFile();
        File commonFolder = new File(commonFolderFile);
        listFilesForFolder(commonFolder,"",commonFiles);
        for (String filePath: commonFiles) {
            putContentToPath(zipOutputStream, "/"+filePath,fileToString(TEMPLATE_PATH+"/"+FOLDER_NAME_COMMON+"/"+filePath));
        }
        Map root = appService.getAppForCodeGeneration(appId);
        List<Map> itemSetList = (List<Map>)((Map)root.get("app")).get("items");
        for (Map itemMap: itemSetList) {
            String name = (String)itemMap.get("name");
            putContentToPath(zipOutputStream, "/"+FOLDER_PREFIX_LIST+name+".php", listSlashItemDotPHP(appId, name));
            putContentToPath(zipOutputStream, "/"+FOLDER_PREFIX_SINGLE+name+".php", singleSlashItemDotPHP(appId, name));
        }
        
        zipOutputStream.finish();
        zipOutputStream.flush();
        IOUtils.closeQuietly(zipOutputStream);
            
        IOUtils.closeQuietly(bufferedOutputStream);
        IOUtils.closeQuietly(byteArrayOutputStream);
        return byteArrayOutputStream.toByteArray();
    }

    private void putContentToPath(ZipOutputStream zipOutputStream, String path, String content) throws IOException {
        zipOutputStream.putNextEntry(new ZipEntry(path));
        try (ByteArrayInputStream bais = new ByteArrayInputStream(content.getBytes())) {
            IOUtils.copy(bais, zipOutputStream);
        }
        zipOutputStream.closeEntry();
    }
    
    public String configDotPHP(@PathVariable(value="appId") long appId) {
        Map root = appService.getAppForCodeGeneration(appId);
        return templateToString("config.php.ftl",root);
    }
    
    public String dataDotSQL(@PathVariable(value="appId") long appId) {
        Map root = appService.getAppForCodeGeneration(appId);
        return templateToString("data.sql.ftl",root);
    }
    
    public String listSlashItemDotPHP(@PathVariable(value="appId") long appId,@PathVariable(value="itemName") String itemName) {
        logger.info("item name: {}",itemName);
        Map root = appService.getAppForCodeGeneration(appId);
        if (selectItem(root, itemName))
            return templateToString("list.slash.item.php.ftl",root);
        else
            return "";
    }
    
    public String singleSlashItemDotPHP(@PathVariable(value="appId") long appId,@PathVariable(value="itemName") String itemName) {
        Map root = appService.getAppForCodeGeneration(appId);
        if (selectItem(root, itemName))
            return templateToString("single.slash.item.php.ftl",root);
        else
            return "";
    }
    
    private boolean selectItem(Map root, String itemName) {
        List<Map> itemSetList = (List<Map>)((Map)root.get("app")).get("items");
        logger.info("selecting item: {}",itemName);
        for (Map itemMap: itemSetList) {
            String name = (String)itemMap.get("name");
            logger.info("current item: {}",name);
            if (name.equals(itemName)) {
                root.put("item", itemMap);
                return true;
            }
        }
        logger.warn("no item found: {}",itemName);
        return false;
    }
    
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
            ex.printStackTrace();
            logger.error(ex.toString(), ex);
        }
        return "";
    }
    
    public void listFilesForFolder(final File folder,String directoryName,List<String> fileNameList) {
        for (final File fileEntry : folder.listFiles()) {
            String fileEntryName = fileEntry.getName();
            if (!fileEntryName.endsWith("~")) {
                if (fileEntry.isDirectory()) {
                    listFilesForFolder(fileEntry,directoryName+fileEntryName+"/",fileNameList);
                } else {
                    fileNameList.add(directoryName+fileEntry.getName());
                }
            }
    }
}
    private String fileToString(String file) {
        try {
            String path = this.getClass().getResource(file).getFile();
            return FileUtils.readFileToString(new File(path));
        } catch (IOException ex) {
            logger.error(ex.toString(), ex);
        }
        return "";
    }
}
