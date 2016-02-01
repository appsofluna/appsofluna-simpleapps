/*
 * Copyright (c) 2015 Charaka Gunatillake.
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

import com.appsofluna.simpleapps.model.AppUser;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@RepositoryRestResource(collectionResourceRel = "app_user", path = "app_user")
public interface AppUserRepository extends PagingAndSortingRepository<AppUser,Long> {
    //AppUserRepository
    
    @Query("SELECT o FROM AppUser o WHERE o.app.id = :appId AND o.user.id = :userId")
    public AppUser findByAppAndUser(@Param("appId") long appId, @Param("userId") long userId);
}
