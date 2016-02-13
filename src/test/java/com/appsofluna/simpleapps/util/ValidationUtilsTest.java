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

import com.appsofluna.simpleapps.model.Field;
import java.util.ArrayList;
import java.util.List;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
public class ValidationUtilsTest {
    /**
     * Test of isValidItemTemplate method, of class ValidationUtils.
     */
    @Test
    public void testIsValidItemTemplate() {
        System.out.println("isValidItemTemplate");
        String itemTemplate1 = "{name} {address}";
        String itemTemplate2 = "{name {address}";
        String itemTemplate3 = "{first_name} {address}";
        boolean result1 = ValidationUtils.isValidItemTemplate(itemTemplate1);
        boolean result2 = ValidationUtils.isValidItemTemplate(itemTemplate2);
        boolean result3 = ValidationUtils.isValidItemTemplate(itemTemplate3);
        assertEquals(true, result1);
        assertEquals(false, result2);
        assertEquals(true, result3);
    }

    /**
     * Test of validateFields method, of class ValidationUtils.
     */
    @Test
    public void testValidateFields() {
        System.out.println("validateFields");
        List<Field> itemFields = new ArrayList<>();
        Field field1 = new Field();
        field1.setName("name");
        itemFields.add(field1);
        Field field2 = new Field();
        field2.setName("address");
        itemFields.add(field2);
        String template1 = "{name} {address}";
        String template2 = "{first_name} {address}";
        boolean result1 = ValidationUtils.validateFields(itemFields, template1);
        boolean result2 = ValidationUtils.validateFields(itemFields, template2);
        assertEquals(true, result1);
        assertEquals(false, result2);
    }
    
}
