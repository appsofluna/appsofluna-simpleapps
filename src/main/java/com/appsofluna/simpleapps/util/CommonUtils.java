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

package com.appsofluna.simpleapps.util;

import com.appsofluna.simpleapps.service.PHPCodeGenService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * The utility class for common functions
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
public class CommonUtils {
    private static final Logger logger = LoggerFactory.getLogger(PHPCodeGenService.class);
    
    /**
     * Parses a json text into a map
     * @param json the string in JSON format
     * @return the map with content
     */
    public static Map<String,Object> stringToMap(String json) {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> map = new HashMap<>();

        try {
            // convert JSON string to Map
            map = mapper.readValue(json, new TypeReference<Map<String, String>>(){});
        } catch (IOException ex) {
            logger.error(ex.toString(), ex);
        }
        return map;
    }
    

    /**
     * Populate a given list with the paths of files in a directory
     * @param folder the file object of the folder
     * @param directoryName the name/path of the current directory
     * @param fileNameList the list to be populated
     */
    public static void listFilesForFolder(final File folder, String directoryName, List<String> fileNameList) {
        for (final File fileEntry : folder.listFiles()) {
            String fileEntryName = fileEntry.getName();
            if (!fileEntryName.endsWith("~")) {
                if (fileEntry.isDirectory()) {
                    listFilesForFolder(fileEntry, directoryName + fileEntryName + "/", fileNameList);
                } else {
                    fileNameList.add(directoryName + fileEntry.getName());
                }
            }
        }
    }

    /**
     * Reads the content of a file from resource path into a string
     * @param file the file path relative to the resource path
     * @return the content of the file
     */
    public static String fileToString(String file) {
        try {
            String path = CommonUtils.class.getResource(file).getFile();
            return FileUtils.readFileToString(new File(path));
        } catch (IOException ex) {
            logger.error(ex.toString(), ex);
        }
        return "";
    }
}
