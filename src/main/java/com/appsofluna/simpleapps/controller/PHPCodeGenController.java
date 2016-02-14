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
package com.appsofluna.simpleapps.controller;

import com.appsofluna.simpleapps.service.PHPCodeGenService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * The controller-layer class that routes requests to PHP code generator
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@RestController
@RequestMapping("/api/generate/php")
public class PHPCodeGenController {
    @Autowired
    private PHPCodeGenService phpCodeGenService;

    @RequestMapping(value = "/{appId}/files")
    public @ResponseBody Map fileList(@PathVariable(value = "appId") long appId) {
        return phpCodeGenService.getFileListByAppId(appId);
    }

    @RequestMapping(value = "/{appId}/file/{folderName}/{filePath}.php", produces = "text/plain")
    public String processSecondaryFolderPHP(@PathVariable(value = "appId") long appId, @PathVariable(value = "folderName") String folderName, @PathVariable(value = "filePath") String filePath) {
        return processSecondaryFolder(appId, folderName, filePath, "php");
    }

    @RequestMapping(value = "/{appId}/file/{folderName}/{filePath}.sql", produces = "text/plain")
    public String processSecondaryFolderSQL(@PathVariable(value = "appId") long appId, @PathVariable(value = "folderName") String folderName, @PathVariable(value = "filePath") String filePath) {
        return processSecondaryFolder(appId, folderName, filePath, "sql");
    }

    @RequestMapping(value = "/{appId}/file/{folderName}/{filePath}.js", produces = "text/javascript")
    public String processSecondaryFolderJS(@PathVariable(value = "appId") long appId, @PathVariable(value = "folderName") String folderName, @PathVariable(value = "filePath") String filePath) {
        return processSecondaryFolder(appId, folderName, filePath, "js");
    }

    @RequestMapping(value = "/{appId}/file/{folderName}/{filePath}.css", produces = "text/css")
    public String processSecondaryFolderCSS(@PathVariable(value = "appId") long appId, @PathVariable(value = "folderName") String folderName, @PathVariable(value = "filePath") String filePath) {
        return processSecondaryFolder(appId, folderName, filePath, "css");
    }

    @RequestMapping(value = "/{appId}/file/{filePath}.sql", produces = "text/plain")
    public String processFileSQL(@PathVariable(value = "appId") long appId, @PathVariable(value = "filePath") String filePath) {
        return processFile(appId, filePath, "sql");
    }

    @RequestMapping(value = "/{appId}/file/{filePath}.js", produces = "text/javascript")
    public String processFileJS(@PathVariable(value = "appId") long appId, @PathVariable(value = "filePath") String filePath) {
        return processFile(appId, filePath, "js");
    }

    @RequestMapping(value = "/{appId}/file/{filePath}.css", produces = "text/css")
    public String processFileCSS(@PathVariable(value = "appId") long appId, @PathVariable(value = "filePath") String filePath) {
        return processFile(appId, filePath, "css");
    }

    @RequestMapping(value = "/{appId}/file/{filePath}.php")
    public String processFilePHP(@PathVariable(value = "appId") long appId, @PathVariable(value = "filePath") String filePath) {
        return processFile(appId, filePath, "php");
    }

    @RequestMapping(value = "/{appId}/file/{folderName}/{filePath}.{fileSuffix}")
    public String processSecondaryFolder(@PathVariable(value = "appId") long appId, @PathVariable(value = "folderName") String folderName, @PathVariable(value = "filePath") String filePath, @PathVariable(value = "fileSuffix") String fileSuffix) {
        return processFile(appId, folderName + "/" + filePath, fileSuffix);
    }

    @RequestMapping(value = "/{appId}/file/{filePath}.{fileSuffix}")
    public String processFile(@PathVariable(value = "appId") long appId, @PathVariable(value = "filePath") String filePath, @PathVariable(value = "fileSuffix") String fileSuffix) {
        if (filePath == null || filePath.equals("")) {
            return "";
        }
        if (fileSuffix != null && !fileSuffix.equals("")) {
            filePath += "." + fileSuffix;
        }
        return phpCodeGenService.getFileContentByAppIdAndPath(appId, filePath);
    }

    @RequestMapping(value = "/{appId}/zip", produces = "application/zip")
    public byte[] downloadAsZIP(@PathVariable(value = "appId") long appId) {
        return phpCodeGenService.getSourceCodeAsZIP(appId);
    }
}
