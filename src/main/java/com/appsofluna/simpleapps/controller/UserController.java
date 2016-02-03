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
package com.appsofluna.simpleapps.controller;

import com.appsofluna.simpleapps.model.AppUser;
import com.appsofluna.simpleapps.model.User;
import com.appsofluna.simpleapps.service.UserService;
import com.appsofluna.simpleapps.util.SAConstraints;
import com.appsofluna.simpleapps.util.StringModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * The controller class for user related functions
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @RequestMapping(value = "/getDefaultUsername",method = RequestMethod.GET)
    public String getDefaultUsername() {
        return "\""+SAConstraints.DEFAULT_USERNAME+"\"";
    }
    
    @RequestMapping(value = "/save",method = RequestMethod.POST)
    public String createUser(@RequestBody User user) {
        user = userService.createUser(user.getUsername(), user.getPassword(), User.USER_TYPE_ADMIN.equals(user.getType()));
        return Long.toString(user.getId());
    }
    
    @RequestMapping(value = "/changePassword",method = RequestMethod.POST)
    public String changePassword(@RequestParam(value = "userId")long userId,@RequestBody StringModel password) {
        User user = userService.changePassword(userId, (password==null) ? null : password.getString());
        return Long.toString(user.getId());
    }
    
    @RequestMapping(value = "/removeUser",method = RequestMethod.POST)
    public String removeUser(@RequestParam(value = "userId")long userId) {
        Long removedUserId = userService.removeUser(userId);
        return (removedUserId ==null) ? null : Long.toString(removedUserId);
    }
    
    @RequestMapping(value = "/findAppUser")
    public @ResponseBody AppUser getAppUser(@RequestParam(value = "appId")long appId,@RequestParam(value = "userId") long userId) {
        AppUser appUser = userService.getAppUser(appId,userId);
        return appUser;
    }
    
    @RequestMapping(value = "/saveAppUser",method = RequestMethod.POST)
    public @ResponseBody AppUser saveAppUser(@RequestParam(value = "appId")long appId, @RequestParam(value = "userId")long userId, @RequestParam(value = "roleId")long roleId) {
        AppUser result = userService.saveAppUser(appId, userId, roleId);
        return result;
    }
    
    @RequestMapping(value = "/removeAppUser",method = RequestMethod.POST)
    public String removeAppUser(@RequestParam(value = "appId")long appId, @RequestParam(value = "userId")long userId) {
        Long appUserId = userService.removeAppUser(appId, userId);
        return (appUserId ==null) ? null : Long.toString(appUserId);
    }
}
