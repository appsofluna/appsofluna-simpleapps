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

import com.appsofluna.simpleapps.model.User;
import com.appsofluna.simpleapps.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * The service-layer class that performs user related functions
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;
    
    /**
     * Creates a new user
     * @param username the username of the new user
     * @param password the password of the new user
     * @param admin whether the new user have administrative rights
     * @return the newly created user
     */
    public User createUser(String username, String password, boolean admin) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(encodePassword(password));
        user.setType(admin ? User.USER_TYPE_ADMIN : User.USER_TYPE_BASIC);
        return userRepo.save(user);
    }
    
    /**
     * Changes the password for a given user id
     * @param userId the id of the user record
     * @param password the new password
     * @return the saved user record
     */
    public User changePassword(long userId, String password) {
        User user = userRepo.findOne(userId);
        user.setPassword(encodePassword(password));
        return userRepo.save(user);
    }
    
    //encodes the password into an encrypted hash
    private String encodePassword(String password) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(password);
    }
}
