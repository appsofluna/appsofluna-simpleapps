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

import com.appsofluna.simpleapps.model.Permission;
import com.appsofluna.simpleapps.model.Role;
import com.appsofluna.simpleapps.repository.PermissionRepository;
import com.appsofluna.simpleapps.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The service-layer class that performs role related functions
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepo;
    @Autowired
    private PermissionRepository permissionRepo;
    
    /**
     * Enables or disables all items for a given role.
     * If it's enabled, all the special permissions will be deleted.
     * @param roleId the id of the role
     * @param enabled whether enabled or not
     */
    @Transactional
    public void allowAllItems(long roleId, boolean enabled) {
        Role role = roleRepo.findOne(roleId);
        role.setAllItemsAllowed(enabled);
        roleRepo.save(role);
        if (enabled)
            permissionRepo.deleteAllPermissionsFor(role.getId());
    }
}
