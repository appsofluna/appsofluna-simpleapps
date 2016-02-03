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
package com.appsofluna.simpleapps.model;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

/**
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@Entity
@Table(name="simpleapps_permission",uniqueConstraints = {
  @UniqueConstraint(columnNames = {"role_id","item_id"})  
})
public class Permission extends AbstractEntity implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Column(name = "is_access_allowed")
    private boolean accessAllowed;
    @Column(name = "is_create_allowed")
    private boolean createAllowed;
    @Column(name = "is_edit_allowed")
    private boolean editAllowed;
    @Column(name = "is_delete_allowed")
    private boolean deleteAllowed;
    
    @ManyToOne(optional = false)
    @JoinColumn(name="role_id")
    private Role role;
    
    @ManyToOne(optional = false)
    @JoinColumn(name="item_id")
    private Item item;

    public boolean isAccessAllowed() {
        return accessAllowed;
    }

    public void setAccessAllowed(boolean accessAllowed) {
        this.accessAllowed = accessAllowed;
    }

    public boolean isCreateAllowed() {
        return createAllowed;
    }

    public void setCreateAllowed(boolean createAllowed) {
        this.createAllowed = createAllowed;
    }

    public boolean isEditAllowed() {
        return editAllowed;
    }

    public void setEditAllowed(boolean editAllowed) {
        this.editAllowed = editAllowed;
    }

    public boolean isDeleteAllowed() {
        return deleteAllowed;
    }

    public void setDeleteAllowed(boolean deleteAllowed) {
        this.deleteAllowed = deleteAllowed;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }
    
    
}
