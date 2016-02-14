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
package com.appsofluna.simpleapps.controller;

import com.appsofluna.simpleapps.service.LoginService;
import com.appsofluna.simpleapps.util.SecurityUtils;
import com.appsofluna.simpleapps.util.StringModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * The controller-layer class that routes pre-login requests
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@RestController
@RequestMapping("/login-api")
public class LoginController {
    @Autowired
    private LoginService loginService;
    
    @RequestMapping(value = "/canLogin",method = RequestMethod.POST)
    public String canLogin(@RequestParam(value = "username")String username,@RequestBody StringModel password) {
        try {
            UserDetails user = loginService.loadUserByUsername(username);
            if (SecurityUtils.matchPassword(password.getString(), user.getPassword())) {
                return "\"CanLogin\"";
            } else {
                return "\"WrongPassword\"";
            }
        } catch (UsernameNotFoundException unf) {
            return "\"NoUser\"";
        }
    }
}
