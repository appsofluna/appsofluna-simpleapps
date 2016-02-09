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

package com.appsofluna.simpleapps.repository;

import com.appsofluna.simpleapps.model.Permission;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@RepositoryRestResource(collectionResourceRel = "permission", path = "permission")
public interface PermissionRepository extends PagingAndSortingRepository<Permission,Long> {
    //PermissionRepository
    
    @Modifying
    @Query("DELETE Permission o WHERE o.role.id = :roleId")
    public int deleteAllPermissionsFor(@Param("roleId") long roleId);
    
    @Query("SELECT o FROM Permission o WHERE o.role.id = :roleId AND o.item.id = :itemId")
    public Permission findByRoleAndItem(@Param("roleId") long roleId, @Param("itemId") long itemId);
}
