/*
 * Copyright (c) 2015 AppsoFluna.
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
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.apache.tomcat.util.http.fileupload.IOUtils;
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
    @Autowired
    private AppService appService;
    
    @RequestMapping(value = "/{appId}/files")
    public @ResponseBody Map fileList(@PathVariable(value="appId") long appId) {
        Map map = new HashMap();
        List files = new ArrayList();
        map.put("files", files);
        files.add("sa-functions.php");
        files.add("sa-login-form.php");
        files.add("sa-login.php");
        files.add("sa-logout.php");
        files.add("change-password.php");
        files.add("config.php");
        files.add("data.sql");
        files.add("index.php");
        files.add("settings.php");
        files.add("user-rights.php");
        files.add("user.php");
        files.add("css/jquery-ui.css");
        files.add("css/style.css");
        files.add("js/jquery.js");
        files.add("js/jquery-ui.js");
        Map root = appService.getAppForCodeGeneration(appId);
        List<Map> itemSetList = (List<Map>)((Map)root.get("app")).get("items");
        for (Map itemMap: itemSetList) {
            String itemName = (String)itemMap.get("name");
            files.add("list/"+itemName+".php");
            files.add("single/"+itemName+".php");
        }
        return map;
    }
    
    @RequestMapping(value = "/{appId}/zip", produces="application/zip")
    public byte[] downloadAsZIP(@PathVariable(value="appId") long appId) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(byteArrayOutputStream);
        ZipOutputStream zipOutputStream = new ZipOutputStream(bufferedOutputStream);
        
        putContentToPath(zipOutputStream, "sa-functions.php", saDashFunctionsDotPHP());
        putContentToPath(zipOutputStream, "sa-login-form.php", saDashLoginDashFormDotPHP());
        putContentToPath(zipOutputStream, "sa-login.php", saDashLoginDotPHP());
        putContentToPath(zipOutputStream, "sa-logout.php", saDashLogoutDotPHP());
        putContentToPath(zipOutputStream, "change-password.php", changeDashPasswordDotPHP(appId));
        putContentToPath(zipOutputStream, "config.php", configDotPHP(appId));
        putContentToPath(zipOutputStream, "data.sql", dataDotSQL(appId));
        putContentToPath(zipOutputStream, "index.php", indexDotPHP(appId));
        putContentToPath(zipOutputStream, "settings.php", settingsDotPHP(appId));
        putContentToPath(zipOutputStream, "user-rights.php", userDashRightsDotPHP(appId));
        putContentToPath(zipOutputStream, "user.php", userDotPHP(appId));
        putContentToPath(zipOutputStream, "/css/style.css", cssSlashStyleDotCSS(appId));
        putContentToPath(zipOutputStream, "/css/jquery-ui.css", cssSlashJqueryDashUiDotCSS(appId));
        putContentToPath(zipOutputStream, "/js/jquery.js", jsSlashJqueryDotJS(appId));
        putContentToPath(zipOutputStream, "/js/jquery-ui.js", jsSlashJqueryDashUiDotJS(appId));
        
        Map root = appService.getAppForCodeGeneration(appId);
        List<Map> itemSetList = (List<Map>)((Map)root.get("app")).get("items");
        for (Map itemMap: itemSetList) {
            String name = (String)itemMap.get("name");
            putContentToPath(zipOutputStream, "/list/"+name+".php", listSlashItemDotPHP(appId, name));
            putContentToPath(zipOutputStream, "/single/"+name+".php", singleSlashItemDotPHP(appId, name));
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
    
    @RequestMapping(value = "/{appId}/css/jquery-ui.css", produces="text/css")
    public String cssSlashJqueryDashUiDotCSS(@PathVariable(value="appId") long appId) {
        return templateToString("css.slash.jquery.dash.ui.css.ftl");
    }
    
    @RequestMapping(value = "/{appId}/js/jquery.js", produces="text/js")
    public String jsSlashJqueryDotJS(@PathVariable(value="appId") long appId) {
        return templateToString("js.slash.jquery.js.ftl");
    }
    
    @RequestMapping(value = "/{appId}/js/jquery-ui.js", produces="text/js")
    public String jsSlashJqueryDashUiDotJS(@PathVariable(value="appId") long appId) {
        return templateToString("js.slash.jquery.dash.ui.js.ftl");
    }
    
    @RequestMapping(value = "/{appId}/change-password.php", produces="text/plain")
    public String changeDashPasswordDotPHP(@PathVariable(value="appId") long appId) {
        Map root = appService.getAppForCodeGeneration(appId);
        return templateToString("change.dash.password.php.ftl",root);
    }
    
    @RequestMapping(value = "/{appId}/config.php", produces="text/plain")
    public String configDotPHP(@PathVariable(value="appId") long appId) {
        Map root = appService.getAppForCodeGeneration(appId);
        return templateToString("config.php.ftl",root);
    }
    
    @RequestMapping(value = "/{appId}/css/style.css", produces="text/css")
    public String cssSlashStyleDotCSS(@PathVariable(value="appId") long appId) {
        return templateToString("css.slash.style.css.ftl");
    }
    
    @RequestMapping(value = "/{appId}/data.sql", produces="text/css")
    public String dataDotSQL(@PathVariable(value="appId") long appId) {
        Map root = appService.getAppForCodeGeneration(appId);
        return templateToString("data.sql.ftl",root);
    }
    
    @RequestMapping(value = "/{appId}/index.php", produces="text/plain")
    public String indexDotPHP(@PathVariable(value="appId") long appId) {
        Map root = appService.getAppForCodeGeneration(appId);
        return templateToString("index.php.ftl",root);
    }
            
    @RequestMapping(value = "/{appId}/list/{itemName}.php", produces="text/plain")
    public String listSlashItemDotPHP(@PathVariable(value="appId") long appId,@PathVariable(value="itemName") String itemName) {
        Map root = appService.getAppForCodeGeneration(appId);
        selectItem(root, itemName);
        return templateToString("list.slash.item.php.ftl",root);
    }
    
    @RequestMapping(value = "/{appId}/sa-functions.php", produces="text/plain")
    public String saDashFunctionsDotPHP() {
        return templateToString("sa.dash.functions.php.ftl");
    }
    
    @RequestMapping(value = "/{appId}/sa-login-form.php", produces="text/plain")
    public String saDashLoginDashFormDotPHP() {
        return templateToString("sa.dash.login.dash.form.php.ftl");
    }
    
    @RequestMapping(value = "/{appId}/sa-login.php", produces="text/plain")
    public String saDashLoginDotPHP() {
        return templateToString("sa.dash.login.php.ftl");
    }
    
    @RequestMapping(value = "/{appId}/sa-logout.php", produces="text/plain")
    public String saDashLogoutDotPHP() {
        return templateToString("sa.dash.logout.php.ftl");
    }

    @RequestMapping(value = "/{appId}/settings.php", produces="text/plain")
    public String settingsDotPHP(@PathVariable(value="appId") long appId) {
        Map root = appService.getAppForCodeGeneration(appId);
        return templateToString("settings.php.ftl",root);
    }
    
    @RequestMapping(value = "/{appId}/single/{itemName}.php", produces="text/plain")
    public String singleSlashItemDotPHP(@PathVariable(value="appId") long appId,@PathVariable(value="itemName") String itemName) {
        Map root = appService.getAppForCodeGeneration(appId);
        selectItem(root, itemName);
        return templateToString("single.slash.item.php.ftl",root);
    }
    
    @RequestMapping(value = "/{appId}/user-rights.php", produces="text/plain")
    public String userDashRightsDotPHP(@PathVariable(value="appId") long appId) {
        Map root = appService.getAppForCodeGeneration(appId);
        return templateToString("user.dash.rights.php.ftl",root);
    }
    
    @RequestMapping(value = "/{appId}/user.php", produces="text/plain")
    public String userDotPHP(@PathVariable(value="appId") long appId) {
        Map root = appService.getAppForCodeGeneration(appId);
        return templateToString("user.php.ftl",root);
    }
    
    private void selectItem(Map root, String itemName) {
        List<Map> itemSetList = (List<Map>)((Map)root.get("app")).get("items");
        for (Map itemMap: itemSetList) {
            String name = (String)itemMap.get("name");
            if (name.equals(itemName)) {
                root.put("item", itemMap);
                break;
            }
        }
    }
    
    private String templateToString(String template, Map model) {
        try {
            Configuration cfg = new Configuration(Configuration.VERSION_2_3_22);
            cfg.setDirectoryForTemplateLoading(new File("src/code-templates/php"));
            cfg.setDefaultEncoding("UTF-8");
            cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
            Template temp = cfg.getTemplate(template);
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Writer out = new OutputStreamWriter(baos);
            temp.process(model, out);
            return baos.toString();
        } catch (IOException | TemplateException ex) {
            Logger.getLogger(PHPCodeGenerator.class.getName()).log(Level.SEVERE, null, ex);
        }
        return "";
    }

    private String templateToString(String template) {
        return templateToString(template,new HashMap());
    }
}
