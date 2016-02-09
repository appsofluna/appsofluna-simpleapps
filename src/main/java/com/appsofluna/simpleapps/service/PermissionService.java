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
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@Service
public class PermissionService {
    @Autowired
    private PermissionRepository permissionRepo;
    
    @Transactional
    public Permission savePermission(Permission permission) {
        Permission existingPermission = permissionRepo.findByRoleAndItem(permission.getRole().getId(), permission.getItem().getId());
        if (existingPermission!=null) {
            existingPermission.setAccessAllowed(permission.isAccessAllowed());
            existingPermission.setCreateAllowed(permission.isCreateAllowed());
            existingPermission.setEditAllowed(permission.isEditAllowed());
            existingPermission.setDeleteAllowed(permission.isDeleteAllowed());
            permission = existingPermission;
        }
        return permissionRepo.save(permission);
    }
}
