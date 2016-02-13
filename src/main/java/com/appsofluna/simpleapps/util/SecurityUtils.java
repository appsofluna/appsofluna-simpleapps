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

import java.util.ArrayList;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * The utility class for security functions
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
public class SecurityUtils {
    
    /**
     * Encodes the password into an encrypted hash
     * @param password the password
     * @return the encoded value
     */
    public static String encodePassword(String password) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(password);
    }
    
    /**
     * Converts list of strings to a collection of granted authorities
     * @param gaStringArray the array of strings with authority names
     * @return the collection of granted authorities
     */
    public static Collection<? extends GrantedAuthority> convertToGACollection(final String... gaStringArray) {
        Collection<GrantedAuthority> authorities = new ArrayList();
        for (final String gaString: gaStringArray) {
            authorities.add(new BasicGrantedAuthority(gaString));
        }
        return authorities;
    }
}
