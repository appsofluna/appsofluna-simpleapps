/*
 * Copyright (c) 2015 AppsoFluna.
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

import com.appsofluna.simpleapps.model.App;
import com.appsofluna.simpleapps.model.Field;
import com.appsofluna.simpleapps.model.Item;
import com.appsofluna.simpleapps.repository.AppRepository;
import com.appsofluna.simpleapps.repository.FieldRepository;
import com.appsofluna.simpleapps.repository.ItemRepository;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@Service
public class AppService {
    @Autowired
    private AppRepository appRepo;
    @Autowired
    private ItemRepository itemRepo;
    @Autowired
    private FieldRepository fieldRepo;
    
    public Map getAppForCodeGeneration(long id) {
        Map map = new HashMap();
        App app = appRepo.findOne(id);
        Map appMap = new HashMap();
        appMap.put("name", app.getName());
        appMap.put("id", app.getId());
        Set itemsSet = new HashSet();
        List<Item> itemList = itemRepo.findByApp(id);
        for (Item item: itemList) {
            Map itemMap = new HashMap();
            Long itemId = item.getId();
            itemMap.put("label", item.getLabel());
            itemMap.put("name", item.getName());
            itemMap.put("id", itemId);
            Set fieldSet = new HashSet();
            List<Field> fieldList = fieldRepo.findByItem(itemId);
            for (Field field: fieldList) {
                Map fieldMap = new HashMap();
                Long fieldId = field.getId();
                fieldMap.put("label",field.getLabel());
                fieldMap.put("name",field.getName());
                fieldMap.put("type",field.getType());
                fieldMap.put("id",fieldId);
                fieldSet.add(fieldMap);
            }
            itemMap.put("fields",fieldSet);
            itemsSet.add(itemMap);
        }
        appMap.put("items", itemsSet);
        map.put("app",appMap);
        return map;
    }
}
