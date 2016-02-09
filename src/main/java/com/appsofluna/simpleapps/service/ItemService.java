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

import com.appsofluna.simpleapps.model.Field;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.appsofluna.simpleapps.model.Item;
import com.appsofluna.simpleapps.repository.FieldRepository;
import com.appsofluna.simpleapps.repository.ItemRepository;
import com.appsofluna.simpleapps.util.ValidationUtils;
import java.util.ArrayList;
import java.util.List;
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
     * 1.Field names should be enclosed by curly brackets.
     * e.g. "{first_name} {last_name}" 
     * 
     * 2.Item template cannot refer to field names with references to other items.
     * 3.If template has not been set, it will display record id as the default label.
     * 
     * @param itemId the id of item
     * @param template the template in text
     * @return the updated item
     */
    public Item updateTemplate(long itemId, String template) {
        logger.info("updating template");
        
        //checking if the item id valid
        if (itemId<0) {
            logger.error("invalid item id: {}",itemId);
            return null;
        }
        
        //checking if the item exist
        Item item = itemRepository.findOne(itemId);
        if (item==null) {
            logger.error("item does not exist");
            return null;
        }
        
        //formatting template
        if (template==null) template = "";
        template = template.trim();
        
        if (!template.isEmpty()) {
            //validating the template
            List<Field> fields = fieldRepository.findByItem(itemId);
            List<Field> nonReferenceFields = new ArrayList<>();
            for (Field field: fields) {
                if (!"item".equalsIgnoreCase(field.getType()))
                    nonReferenceFields.add(field);
            }
            if(!ValidationUtils.validateFields(nonReferenceFields, template)) {
                logger.error("template is not valid");
                return null;
            }
        }
        
        item.setTemplate(template);
        
        item = itemRepository.save(item);
        logger.info("succefully updated item (id:{}) with template: {}", itemId,template);
        
        //returns item
        return item;
    }

    
}
