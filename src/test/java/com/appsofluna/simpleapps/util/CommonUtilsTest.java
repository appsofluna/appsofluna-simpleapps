/*
 * Copyright (c) 2016 AppsoFluna.
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

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
public class CommonUtilsTest {
    
    /**
     * Test of stringToMap method, of class CommonUtils.
     */
    @Test
    public void testStringToMap() {
        System.out.println("stringToMap");
        String keyName = "name";
        String valueName = "Sample name";
        String keyAddress = "address";
        String valueAddress = "Sample address";
        String json = "{\""+keyName+"\": \""+valueName+"\", \""+keyAddress+"\": \""+valueAddress+"\"}";
        Map<String, Object> expResult = new HashMap();
        expResult.put(keyName, valueName);
        expResult.put(keyAddress, valueAddress);
        Map<String, Object> result = CommonUtils.stringToMap(json);
        assertEquals(expResult, result);
    }

    /**
     * Test of listFilesForFolder method, of class CommonUtils.
     */
    @Test
    public void testListFilesForFolder() {
        System.out.println("listFilesForFolder");
        String folderName = "test";
        String fileName = "test.txt";
        String folderFilePath = this.getClass().getResource("/"+folderName).getFile();
        File folderFile = new File(folderFilePath);
        String directoryName = folderName + "/";
        List<String> fileNameList = new ArrayList();
        CommonUtils.listFilesForFolder(folderFile, directoryName, fileNameList);
        List<String> expectedFileNameList = new ArrayList();
        expectedFileNameList.add(directoryName + fileName);
        assertEquals(expectedFileNameList, fileNameList);
    }

    /**
     * Test of fileToString method, of class CommonUtils.
     */
    @Test
    public void testFileToString() {
        System.out.println("fileToString");
        //There must be a test.txt in test folder with "Test File Content" as
        //content. The test can be improved by refactoring the method to
        //decouple it from file system for better testablitity.
        String file = "/test/test.txt";
        String expResult = "Test File Content";
        String result = CommonUtils.fileToString(file);
        assertEquals(expResult, result);
    }
    
}
