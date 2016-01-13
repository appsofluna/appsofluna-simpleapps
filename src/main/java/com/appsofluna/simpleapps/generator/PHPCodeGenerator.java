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
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
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
        Set files = new HashSet();
        map.put("files", files);
        files.add("css/style.css");
        files.add("index.php");
        files.add("login.php");
        files.add("login_form.php");
        files.add("logout.php");
        files.add("settings.php");
        files.add("user_rights_functions.php");
        files.add("data.sql");
        Map root = appService.getAppForCodeGeneration(appId);
        Set<Map> itemSet = (Set<Map>)((Map)root.get("app")).get("items");
        for (Map itemMap: itemSet) {
            Long itemId = (Long)itemMap.get("id");
            String itemIdStr = Long.toString(itemId);
            files.add(itemIdStr+"_edit.php");
            files.add(itemIdStr+"_list.php");
        }
        return map;
    }
    
    @RequestMapping(value = "/{appId}/zip", produces="application/zip")
    public byte[] downloadAsZIP(@PathVariable(value="appId") long appId) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(byteArrayOutputStream);
        ZipOutputStream zipOutputStream = new ZipOutputStream(bufferedOutputStream);
        
        zipOutputStream.putNextEntry(new ZipEntry("index.php"));
        ByteArrayInputStream bais = new ByteArrayInputStream(indexDotPHP(appId).getBytes());
        IOUtils.copy(bais, zipOutputStream);
        bais.close();
        zipOutputStream.closeEntry();
        
        zipOutputStream.putNextEntry(new ZipEntry("/css/style.css"));
        bais = new ByteArrayInputStream(cssSlashStyleDotCSS(appId).getBytes());
        IOUtils.copy(bais, zipOutputStream);
        bais.close();
        
        zipOutputStream.finish();
        zipOutputStream.flush();
        IOUtils.closeQuietly(zipOutputStream);
            
        IOUtils.closeQuietly(bufferedOutputStream);
        IOUtils.closeQuietly(byteArrayOutputStream);
        return byteArrayOutputStream.toByteArray();
    }
    
    @RequestMapping(value = "/{appId}/index.php", produces="text/plain")
    public String indexDotPHP(@PathVariable(value="appId") long appId) {
        try {
            //return "<?php echo 'hello'; ?>";
            /* ------------------------------------------------------------------------ */
            /* You should do this ONLY ONCE in the whole application life-cycle:        */
            
            /* Create and adjust the configuration singleton */
            
            Configuration cfg = new Configuration(Configuration.VERSION_2_3_22);
            cfg.setDirectoryForTemplateLoading(new File("src/code-templates/php"));
            cfg.setDefaultEncoding("UTF-8");
            cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
            
            /* ------------------------------------------------------------------------ */
            /* You usually do these for MULTIPLE TIMES in the application life-cycle:   */
            
            /* Create a data-model */
            Map root = appService.getAppForCodeGeneration(appId);
            
            /* Get the template (uses cache internally) */
            Template temp = cfg.getTemplate("index.php.ftl");
            
            /* Merge data-model with template */
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Writer out = new OutputStreamWriter(baos);
            temp.process(root, out);
            // Note: Depending on what `out` is, you may need to call `out.close()`.
            // This is usually the case for file output, but not for servlet output.
            return baos.toString();
        } catch (IOException | TemplateException ex) {
            Logger.getLogger(PHPCodeGenerator.class.getName()).log(Level.SEVERE, null, ex);
        }
        return "";
    }
    
    @RequestMapping(value = "/{appId}/css/style.css", produces="text/css")
    public String cssSlashStyleDotCSS(@PathVariable(value="appId") long appId) {
        try {
            //return "<?php echo 'hello'; ?>";
            /* ------------------------------------------------------------------------ */
            /* You should do this ONLY ONCE in the whole application life-cycle:        */
            
            /* Create and adjust the configuration singleton */
            
            Configuration cfg = new Configuration(Configuration.VERSION_2_3_22);
            cfg.setDirectoryForTemplateLoading(new File("src/code-templates/php"));
            cfg.setDefaultEncoding("UTF-8");
            cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
            
            /* ------------------------------------------------------------------------ */
            /* You usually do these for MULTIPLE TIMES in the application life-cycle:   */
            
            /* Create a data-model */
            Map root = appService.getAppForCodeGeneration(appId);
            
            /* Get the template (uses cache internally) */
            Template temp = cfg.getTemplate("css.slash.style.css.ftl");
            
            /* Merge data-model with template */
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Writer out = new OutputStreamWriter(baos);
            temp.process(root, out);
            // Note: Depending on what `out` is, you may need to call `out.close()`.
            // This is usually the case for file output, but not for servlet output.
            return baos.toString();
        } catch (IOException | TemplateException ex) {
            Logger.getLogger(PHPCodeGenerator.class.getName()).log(Level.SEVERE, null, ex);
        }
        return "";
    }
            
    @RequestMapping(value = "/{appId}/{itemId}_list.php", produces="text/plain")
    public String itemDashListDotPHP(@PathVariable(value="appId") long appId,@PathVariable(value="itemId") long itemId) {
        try {
            //return "<?php echo 'hello'; ?>";
            /* ------------------------------------------------------------------------ */
            /* You should do this ONLY ONCE in the whole application life-cycle:        */
            
            /* Create and adjust the configuration singleton */
            
            Configuration cfg = new Configuration(Configuration.VERSION_2_3_22);
            cfg.setDirectoryForTemplateLoading(new File("src/code-templates/php"));
            cfg.setDefaultEncoding("UTF-8");
            cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
            
            /* ------------------------------------------------------------------------ */
            /* You usually do these for MULTIPLE TIMES in the application life-cycle:   */
            
            /* Create a data-model */
            Map root = appService.getAppForCodeGeneration(appId);
            Set<Map> itemSet = (Set<Map>)((Map)root.get("app")).get("items");
            for (Map itemMap: itemSet) {
                Long noItemId = (Long)itemMap.get("id");
                if (itemId==noItemId) {
                    root.put("item", itemMap);
                    break;
                }
            }
            
            /* Get the template (uses cache internally) */
            Template temp = cfg.getTemplate("ITEM_list.php.ftl");
            
            /* Merge data-model with template */
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Writer out = new OutputStreamWriter(baos);
            temp.process(root, out);
            // Note: Depending on what `out` is, you may need to call `out.close()`.
            // This is usually the case for file output, but not for servlet output.
            return baos.toString();
        } catch (IOException | TemplateException ex) {
            Logger.getLogger(PHPCodeGenerator.class.getName()).log(Level.SEVERE, null, ex);
        }
        return "";
    }
}
