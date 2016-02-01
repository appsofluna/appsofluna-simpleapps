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
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Validation methods
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
public class ValidationUtils {
    private static final Logger logger = LoggerFactory.getLogger(ValidationUtils.class);
    
    //the maximum lenth allowed for an item template
    public static final int MAX_ITEM_TEMPLATE_LENGTH = 100;
    
    /**
     * Validate item templates
     * @param itemTemplate the template string
     * @return the result
     */
    public static boolean isValidItemTemplate(String itemTemplate) {
        logger.info("validating item template");
        
        //check if template is empty or not
        if (itemTemplate==null || itemTemplate.equals("")) {
            logger.info("template should not be empty or null");
            return false;
        }
        
        //check length is less than max 
        if (itemTemplate.length()>MAX_ITEM_TEMPLATE_LENGTH) {
            logger.info("template should be less than or equal to {}",MAX_ITEM_TEMPLATE_LENGTH);
            return false;
        }
        
        //check curly brackets
        boolean unclosedBracket = false;
        for (int i=0; i<itemTemplate.length(); i++) {
            char c = itemTemplate.charAt(i);
            if (c=='{') {
                if (unclosedBracket)
                    break;
                else
                    unclosedBracket = true;
            } else if (c=='}') {
                if (unclosedBracket) {
                    unclosedBracket = false;
                } else {
                    unclosedBracket = true;
                    break;
                }
            }
        }
        if(unclosedBracket) {
            logger.info("template can not have unclosed curly brackets");
            return false;
        }
        
        //item template is valid
        logger.info("item template is valid: {}", itemTemplate);
        return true;
    }
    
    /**
     * Validate item fields against a set of values
     * @param itemFields the list of fields
     * @param template the template string
     * @return the result
     */
    public static boolean validateFields(List<Field> itemFields, String template) {
        logger.info("validating item template agaist fields");
        
        //check if item fields are empty
        if (itemFields==null) {
            logger.info("item fields should not be null");
            return false;
        }
        
        //check if template format is valid
        if (!ValidationUtils.isValidItemTemplate(template)) {
            logger.info("invalid item template: {}",template);
            return false;
        }
        
        //check against field list
        List<String> itemFieldNames = new ArrayList<>();
        for (Field field: itemFields) {
            itemFieldNames.add(field.getName());
        }
        Pattern pattern = Pattern.compile("\\{([^}]*)\\}");
        Matcher matcher = pattern.matcher(template);
        List<String> invalidFieldNames = new ArrayList<>();
        while(matcher.find()) {
            String fieldName = matcher.group(1);
            if (!itemFieldNames.contains(fieldName))
                invalidFieldNames.add(fieldName);
        }
        if (!invalidFieldNames.isEmpty()) {
            String invalidFieldNamesAsString = StringUtils.join(invalidFieldNames,",");
            logger.info("item field(s) are invalid: {}",invalidFieldNamesAsString);
            return false;
        }
        
        //item template is valid
        logger.info("item template ({}) is valid agaist the given fields: {}", template, itemFieldNames);
        return true;
    }
}
