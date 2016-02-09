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
import com.appsofluna.simpleapps.repository.FieldRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@Service
public class ValueService {
    private static final Logger logger = LoggerFactory.getLogger(ValueService.class);
    
    @Autowired
    private FieldRepository fieldRepository;
    
    /**
     * This method retrieves the list of possible values for a given field with "item" type.
     * @param fieldId the id of the field
     * @return a Map object with (record_id->value)
     */
    public Map getReferenceFieldValues(long fieldId) {
        //1.get the field
        //2.get list of records
        //3.get value field for each record
        
        Field field = fieldRepository.findOne(fieldId);
        if ("item".equalsIgnoreCase(field.getType())) {
            //field refers to an item
            String fieldFormat = field.getFormat();
            
            ObjectMapper oMapper = new ObjectMapper();
            try {
                Map fieldFormatMap = oMapper.readValue(fieldFormat, Map.class);
                System.out.println(fieldFormatMap);
            } catch (IOException ex) {
                logger.error("fails to get field format", ex);
            }
        }
        return null;
    }
}
