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

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
public class JsonUtil {
    public static Map<String,Object> stringToMap(String json) {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> map = new HashMap<>();

        try {
            // convert JSON string to Map
            map = mapper.readValue(json, new TypeReference<Map<String, String>>(){});
        } catch (IOException ex) {
            Logger.getLogger(JsonUtil.class.getName()).log(Level.SEVERE, null, ex);
        }
        return map;
    }
}
