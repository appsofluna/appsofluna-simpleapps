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
package com.appsofluna.simpleapps;

import com.appsofluna.simpleapps.repository.UserRepository;
import java.util.ArrayList;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@Service
public class SimpleUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.appsofluna.simpleapps.model.User user = userRepo.findByUsername(username);
        if (user==null) {
            if ("nouser".equals(username)) {
                return new User(username,  "nopass", ga("ROLE_BASIC"));
            }
            throw new UsernameNotFoundException("Username " + username + " not found");
        }
        return new User(username,  user.getPassword(), getGrantedAuthorities(user));
    }

    private Collection<? extends GrantedAuthority> getGrantedAuthorities(com.appsofluna.simpleapps.model.User user) {
        Collection<? extends GrantedAuthority> authorities;
        if ("ADMIN".equals(user.getType())) {
            authorities = ga("ROLE_ADMIN","ROLE_BASIC");
        } else {
            authorities = ga("ROLE_BASIC");
        }
        return authorities;
    }
    
    public static Collection<? extends GrantedAuthority> ga(final String... gaStringArray) {
        Collection<GrantedAuthority> authorities = new ArrayList();
        for (final String gaString: gaStringArray) {
            authorities.add(new GrantedAuthority() {

                @Override
                public String getAuthority() {
                    return gaString;
                }
            });
        }
        return authorities;
    }
}
