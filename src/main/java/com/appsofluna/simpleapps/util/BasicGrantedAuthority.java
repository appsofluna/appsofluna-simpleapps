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

import java.util.Objects;
import org.springframework.security.core.GrantedAuthority;

/**
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
public class BasicGrantedAuthority implements GrantedAuthority {
    private final String gaString;
    
    public BasicGrantedAuthority(String gaString) {
        this.gaString = gaString;
    }
    
    @Override
    public String getAuthority() {
        return gaString;
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 29 * hash + Objects.hashCode(this.gaString);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final BasicGrantedAuthority other = (BasicGrantedAuthority) obj;
        if (!Objects.equals(this.gaString, other.gaString)) {
            return false;
        }
        return true;
    }
    
    
}
