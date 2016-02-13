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

import com.appsofluna.simpleapps.repository.UserRepository;
import com.appsofluna.simpleapps.util.SecurityUtils;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * The service-layer class that handles user authentication
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@Service
public class LoginService implements UserDetailsService {
    private final String ROLE_ADMIN = "ROLE_ADMIN";
    private final String ROLE_BASIC = "ROLE_BASIC";
    private final String GUEST_USERNAME = "nouser";
    private final String GUEST_PASSWORD = "nopass";
    @Autowired
    private UserRepository userRepo;
    
    //returns user details by username
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.appsofluna.simpleapps.model.User user = userRepo.findByUsername(username);
        if (user==null) {
            if (GUEST_USERNAME.equals(username)) {
                return new User(username, SecurityUtils.encodePassword(GUEST_PASSWORD), SecurityUtils.convertToGACollection(ROLE_BASIC));
            }
            throw new UsernameNotFoundException("Username " + username + " not found");
        }
        return new User(username,  user.getPassword(), getGrantedAuthorities(user));
    }

    //returns granted autherities based on user type
    private Collection<? extends GrantedAuthority> getGrantedAuthorities(com.appsofluna.simpleapps.model.User user) {
        Collection<? extends GrantedAuthority> authorities;
        if (com.appsofluna.simpleapps.model.User.USER_TYPE_ADMIN.equals(user.getType())) {
            authorities = SecurityUtils.convertToGACollection(ROLE_ADMIN,ROLE_BASIC);
        } else {
            authorities = SecurityUtils.convertToGACollection(ROLE_BASIC);
        }
        return authorities;
    }
}
