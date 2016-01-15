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
package com.appsofluna.simpleapps.service;

import com.appsofluna.simpleapps.model.Field;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.commons.lang3.StringUtils;
import com.appsofluna.simpleapps.model.Item;
import com.appsofluna.simpleapps.repository.FieldRepository;
import com.appsofluna.simpleapps.repository.ItemRepository;
import com.appsofluna.simpleapps.util.ValidationUtils;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * The service-layer class that performs item related functions
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@Service
public class ItemService {
    private static final Logger logger = LoggerFactory.getLogger(ItemService.class);
    
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private FieldRepository fieldRepository;
    
    /**
     * Updates the template of item
     * 
     * Template should describe how a record of 
     * that item should be displayed using its fields.
     * 
     * Field names should be enclosed by curly brackets.
     * e.g. "{first_name} {last_name}" 
     * 
     * @param itemId the id of item
     * @param template the template in text
     * @return the updated item
     */
    public Item updateItemTemplate(long itemId, String template) {
        logger.info("updating item template");
        
        //check if itemId format is valid
        if (itemId<0) {
            logger.error("invalid item id: {}", itemId);
            return null;
        }
        
        //check if template is empty
        if (template==null || template.equals("")) {
            logger.error("template is null or empty");
            return null;
        }
        
        //check if template format is valid
        if (!ValidationUtils.isValidItemTemplate(template)) {
            logger.error("invalid item template: {}",template);
            return null;
        }
        
        //check if item exists
        Item item = itemRepository.findOne(itemId);
        if (item==null) {
            logger.error("item does not exist");
            return null;
        }
        
        //check if whether the field names exists
        List<Field> fieldsByItem = fieldRepository.findByItem(itemId);
        List<String> itemFieldNames = new ArrayList<>();
        for (Field field: fieldsByItem) {
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
            logger.error("item field(s) does not exist: {}",invalidFieldNamesAsString);
            return null;
        }
        
        //do the update
        item.setTemplate(template);
        item = itemRepository.save(item);
        logger.info("succefully updated item (id:{}) with template: {}", itemId,template);
        
        //returns item
        return item;
    }
}
