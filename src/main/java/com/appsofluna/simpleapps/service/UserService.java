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
import com.appsofluna.simpleapps.model.AppUser;
import com.appsofluna.simpleapps.model.Role;
import com.appsofluna.simpleapps.model.User;
import com.appsofluna.simpleapps.repository.AppRepository;
import com.appsofluna.simpleapps.repository.AppUserRepository;
import com.appsofluna.simpleapps.repository.RoleRepository;
import com.appsofluna.simpleapps.repository.UserRepository;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The service-layer class that performs user related functions
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    @Autowired
    private AppRepository appRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private AppUserRepository appUserRepository;
    
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
        return userRepository.save(user);
    }
    
    /**
     * Changes the password for a given user id
     * @param userId the id of the user record
     * @param password the new password
     * @return the saved user record
     */
    public User changePassword(long userId, String password) {
        User user = userRepository.findOne(userId);
        user.setPassword(encodePassword(password));
        return userRepository.save(user);
    }
    
    //encodes the password into an encrypted hash
    private String encodePassword(String password) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(password);
    }

    /**
     * Returns the AppUser record identified by the app and the user IDs provided.
     * @param appId app id
     * @param userId user id
     * @return the relevant AppUser record if available, otherwise null
     */
    public AppUser getAppUser(long appId, long userId) {
        logger.info("getting app user");
        if (appId<0) {
            logger.error("invalid appId: {}", appId);
            return null;
        }
        if (userId<0) {
            logger.error("invalid userId: {}", userId);
            return null;
        }
        
        App app = appRepository.findOne(appId);
        if (app==null) {
            logger.error("app does not exist: {}", appId);
            return null;
        }
        
        User user = userRepository.findOne(userId);
        if (user==null) {
            logger.error("user does not exist: {}", userId);
            return null;
        }
        
        AppUser appUser = appUserRepository.findByAppAndUser(appId, userId);
        if (appUser==null) {
            logger.info("no AppUser available yet for appId: {}, userId: {}",appId,userId);
            return null;
        }
        
        logger.info("returning AppUser for appId: {}, userId: {}",appId,userId);
        return appUser;
    }
    
    /**
     * Saves a given AppUser record.
     * If an AppUser with the same app and user exist, the same
     * record will be updated
     * @param appUser the record being saved.
     * @return saved AppUser record
     */
    @Transactional
    public AppUser saveAppUser(AppUser appUser) {
        AppUser existingAppUser = appUserRepository.findByAppAndUser(appUser.getApp().getId(), appUser.getUser().getId());
        if (existingAppUser!=null) {
            logger.info("no changes made");
            appUser = existingAppUser;
        }
        return appUserRepository.save(appUser);
    }
    
    /**
     * Saves/Updates AppUser record identified by appId and userId
     * to the role given by roleId.
     * The role must belong to the relevant app.
     * @param appId app id
     * @param userId user id
     * @param roleId role id
     * @return the saved AppUserRecord
     */
    @Transactional
    public AppUser saveAppUser(long appId, long userId, long roleId) {
        logger.info("saving appuser");
        
        //check if app id is valid
        if (appId<0) {
            logger.error("invalid app id: {}",appId);
            return null;
        }
        
        //check if user id is valid
        if (userId<0) {
            logger.error("invalid user id: {}",userId);
            return null;
        }
        
        //check if role id is valid
        if (roleId<0) {
            logger.error("invalid role id: {}",roleId);
            return null;
        }
        
        //check if app exist
        App app = appRepository.findOne(appId);
        if (app==null) {
            logger.error("app does not exist: {}",appId);
            return null;
        }
        
        //check if user exist
        User user = userRepository.findOne(userId);
        if (user==null) {
            logger.error("user does not exist: {}",userId);
            return null;
        }
        
        //check if role exist
        Role role = roleRepository.findOne(roleId);
        if (role==null) {
            logger.error("role does not exist: {}",roleId);
            return null;
        }
        
        logger.info("app id: {}",app.getId());
        logger.info("role app id: {}",role.getApp().getId());
        //check if the role belongs to the app
        if (!Objects.equals(role.getApp().getId(), app.getId())) {
            logger.error("role does not belong to the app");
            return null;
        }
        
        //retriving appUser if exist
        AppUser appUser = appUserRepository.findByAppAndUser(appId, userId);
        if (appUser == null) {
            //create new app user
            appUser = new AppUser();
            appUser.setApp(app);
            appUser.setUser(user);
        }
        
        //updates role
        appUser.setRole(role);
        appUser = appUserRepository.save(appUser);
        logger.info("returning saved appuser");
        return appUser;
    }
    
    /**
     * Removes AppUser information of a given user assigned for a given app.
     * @param appId app id
     * @param userId user id
     * @return the id of the removed AppUser
     */
    public Long removeAppUser(long appId, long userId) {
        logger.info("removing app user");
        
        //retreving appUser
        AppUser appUser = appUserRepository.findByAppAndUser(appId, userId);
        if (appUser ==null) {
            logger.error("record does not exist.");
            return null;
        } else {
            Long appUserId = appUser.getId();
            appUserRepository.delete(appUser);
            logger.info("appuser record deleted");
            return appUserId;
        }
    }
}
