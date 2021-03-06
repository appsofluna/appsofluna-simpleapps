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

package com.appsofluna.simpleapps.model;

import java.io.Serializable;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

/**
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@Entity
@Table(name="simpleapps_role",uniqueConstraints = {
  @UniqueConstraint(columnNames = {"app_id","name"})  
})
public class Role extends AbstractEntity implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "app_id")
    private App app;
    
    @Column(name = "name",nullable = false)
    private String name;
    
    @Column(name = "is_all_items_allowed")
    private boolean allItemsAllowed;
    
    @OneToMany(mappedBy = "role", orphanRemoval = true,cascade = CascadeType.REMOVE,fetch = FetchType.LAZY)
    private List<Permission> permissionList; //used only to casecade removal
    
    @OneToMany(mappedBy = "role", orphanRemoval = true,cascade = CascadeType.REMOVE,fetch = FetchType.LAZY)
    private List<AppUser> appUserList; //used only to casecade removal

    public App getApp() {
        return app;
    }

    public void setApp(App app) {
        this.app = app;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isAllItemsAllowed() {
        return allItemsAllowed;
    }

    public void setAllItemsAllowed(boolean allItemsAllowed) {
        this.allItemsAllowed = allItemsAllowed;
    }
}
