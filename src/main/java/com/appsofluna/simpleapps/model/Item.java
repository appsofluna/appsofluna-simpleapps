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

/**
 *
 * @author Charaka Gunatillake <charakajg[at]gmail[dot]com>
 */
@Entity
@Table(name="simpleapps_item")
public class Item extends AbstractEntity implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @ManyToOne
    @JoinColumn(name = "app_id")
    private App app;
    @Column(name = "name", unique = true)
    private String name;
    @Column(name = "label")
    private String label;
    @Column(name = "template")
    private String template;
    
    @OneToMany(mappedBy = "item", orphanRemoval = true,cascade = CascadeType.REMOVE,fetch = FetchType.LAZY)
    private List<Permission> permissionList; //used only to casecade removal
    
    @OneToMany(mappedBy = "item", orphanRemoval = true,cascade = CascadeType.REMOVE,fetch = FetchType.LAZY)
    private List<Record> recordList; //used only to casecade removal
    
    @OneToMany(mappedBy = "item", orphanRemoval = true,cascade = CascadeType.REMOVE,fetch = FetchType.LAZY)
    private List<Field> fieldList; //used only to casecade removal

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

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }
    
    
}
