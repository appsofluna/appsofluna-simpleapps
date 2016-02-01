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
import com.appsofluna.simpleapps.model.Record;
import com.appsofluna.simpleapps.model.Value;
import com.appsofluna.simpleapps.repository.FieldRepository;
import com.appsofluna.simpleapps.repository.RecordRepository;
import com.appsofluna.simpleapps.repository.ValueRepository;
import com.appsofluna.simpleapps.util.ValidationUtils;
import java.util.List;
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
    
    /**
     * This method returns a label by formatting record values based on a given
     * template.
     * @param recordId the id of the record
     * @param template the template string
     * @return the formatted label
     */
    public String formatRecord(long recordId, String template) {
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
            Value fieldValue = valueRepository.findByRecordAndField(recordId, field.getId());
            String fieldContent = fieldValue.getContent();
            label = label.replaceAll(fieldTemplate, fieldContent);
        }
        
        logger.info("returns formatted label for record (id:{}) with label: {}", recordId,label);
        
        //return formatted label
        return label;
    }
}
