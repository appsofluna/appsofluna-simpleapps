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
import org.junit.Test;
import static org.junit.Assert.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
public class SecurityUtilsTest {
    
    /**
     * Test of encodePassword method, of class SecurityUtils.
     */
    @Test
    public void testEncodePassword() {
        System.out.println("encodePassword");
        String password = "test password";
        String result = SecurityUtils.encodePassword(password);
        assertTrue(new BCryptPasswordEncoder().matches(password, result));
    }

    /**
     * Test of convertToGACollection method, of class SecurityUtils.
     */
    @Test
    public void testConvertToGACollection() {
        System.out.println("convertToGACollection");
        final String gaStringOne = "GA_ONE";
        final String gaStringTwo = "GA_TWO";
        String[] gaStringArray = {gaStringOne,gaStringTwo};
        ArrayList<GrantedAuthority> testArrayList = new ArrayList<>();
        testArrayList.add(new BasicGrantedAuthority(gaStringOne));
        testArrayList.add(new BasicGrantedAuthority(gaStringTwo));
        Collection<? extends GrantedAuthority> expResult = testArrayList;
        Collection<? extends GrantedAuthority> result = SecurityUtils.convertToGACollection(gaStringArray);
        assertEquals(expResult, result);
    }
    
}
