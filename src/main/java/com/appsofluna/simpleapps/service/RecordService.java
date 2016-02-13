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
import com.appsofluna.simpleapps.model.Item;
import com.appsofluna.simpleapps.model.Record;
import com.appsofluna.simpleapps.model.Value;
import com.appsofluna.simpleapps.repository.FieldRepository;
import com.appsofluna.simpleapps.repository.ItemRepository;
import com.appsofluna.simpleapps.repository.RecordRepository;
import com.appsofluna.simpleapps.repository.ValueRepository;
import com.appsofluna.simpleapps.util.CommonUtils;
import com.appsofluna.simpleapps.util.SAConstraints;
import com.appsofluna.simpleapps.util.ValidationUtils;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * The service-layer class that performs record related functions
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@Service
public class RecordService {
    private static final Logger logger = LoggerFactory.getLogger(RecordService.class);
    
    @Autowired
    private FieldRepository fieldRepository;
    
    @Autowired
    private RecordRepository recordRepository;
    
    @Autowired
    private ValueRepository valueRepository;
    
    @Autowired
    private ItemRepository itemRepository;
    
    /**
     * This method returns a label by formatting record values based on a given
     * template.
     * @param recordId the id of the record
     * @param template the template string
     * @return the formatted label
     */
    public String formatRecord(long recordId, String template) {
        return formatRecord(recordId,template,true);
    }
    
    /**
     * This method returns a label by formatting record values based on a given
     * template.
     * @param recordId the id of the record
     * @param template the template string
     * @param forward whether it should forward item to the formatter;
     * @return the formatted label
     */
    private String formatRecord(long recordId, String template, boolean forward) {
        logger.info("formatting record");
        //1.check if recordId format is valid
        //2.check if template is empty
        //3.clear template
        //4.check if template format is valid
        //5.check if record exists
        //6.check if whether the field names exists
        //7.format label based on fields
        //8.return formatted label
        
        //check if recordId format is valid
        if (recordId<0) {
            logger.error("invalid record id: {}", recordId);
            return null;
        }
        
        //check if template is empty
        if (template==null || template.equals("")) {
            logger.error("template is null or empty");
            return null;
        }
        
        
        //clear template
        template = template.replaceAll("\\\\\\{", "{").replaceAll("\\\\\\}", "}");
        template = template.replaceAll("NECB", "{").replaceAll("NECE", "}");
        
        //check if template format is valid
        if (!ValidationUtils.isValidItemTemplate(template)) {
            logger.error("invalid item template: {}",template);
            return null;
        }
        
        //check if record exists
        Record record = recordRepository.findOne(recordId);
        if (record==null) {
            logger.error("record does not exist");
            return null;
        }
        
        //check if whether the field names exists
        long itemId = record.getItem().getId();
        List<Field> fieldsByItem = fieldRepository.findByItem(itemId);
        if (!ValidationUtils.validateFields(fieldsByItem, template)) {
            logger.error("the fields in the template are invalid.");
            return null;
        }
        
        //format label based on fields
        String label = template;
        for(Field field: fieldsByItem) {
            String fieldTemplate = "\\{" + field.getName() + "\\}";
            long fieldId = field.getId();
            String fieldContent = "";
            Value fieldValue = valueRepository.findByRecordAndField(recordId, fieldId);
            if (fieldValue!=null) {
                fieldContent = fieldValue.getContent();
                String type = field.getType();
                if (forward && SAConstraints.FIELD_TYPE_ITEM.equals(type)) {
                    try {
                        long refRecordId = Long.parseLong(fieldContent);
                        Map<String, Object> formatMap = CommonUtils.stringToMap(field.getFormat());
                        Object refItemIdObj = formatMap.get(SAConstraints.FIELD_TYPE_ITEM_PARM_REFER);
                        Long refItemId = null;
                        if (refItemIdObj instanceof Long) {
                            refItemId = (Long) refItemIdObj;
                        } else if (refItemIdObj instanceof String) {
                            refItemId = Long.parseLong((String)refItemIdObj);
                        } else {
                            logger.error("unable to format item because of ref id");
                            return null;
                        }
                        Item refItem = itemRepository.findOne(refItemId);
                        String refTemplate = refItem.getTemplate();
                        if (refTemplate!=null && !refTemplate.trim().equals("")) {
                            fieldContent = formatRecord(refRecordId, refItem.getTemplate(),false);
                        }
                    } catch (NumberFormatException nfe) {
                        logger.error("unable to format item because of number formatting [fieldId={},valueId={},fieldContent={}]",fieldId,fieldValue.getId(),fieldContent);
                        return null;
                    }
                }
            } else {
                logger.warn("unable to retrive field value for field id: {} and record id: {}",fieldId,recordId);
            }
            label = label.replaceAll(fieldTemplate, fieldContent);
        }
        
        logger.info("returns formatted label for record (id:{}) with label: {}", recordId,label);
        
        //return formatted label
        return label;
    }
}
