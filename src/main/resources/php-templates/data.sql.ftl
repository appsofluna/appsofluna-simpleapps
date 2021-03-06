<#function nameCase text>
  <#return text?lower_case?replace(" ","_")>
</#function>
# data.sql
# Generated by AppsoFluna
#
# Copyright (c) Charaka Gunatillake / AppsoFluna. (http://www.appsofluna.com)
# All rights reserved.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

CREATE DATABASE ${nameCase(app.name)};
CREATE USER '${nameCase(app.name)}'@'localhost' IDENTIFIED BY 'changethis';
GRANT ALL PRIVILEGES ON ${nameCase(app.name)}.* TO '${nameCase(app.name)}'@'localhost';
USE ${nameCase(app.name)};

CREATE TABLE ${nameCase(app.name)}_user
(id int NOT NULL AUTO_INCREMENT,
username varchar(255) NOT NULL UNIQUE,
`password` varchar(32) NOT NULL,
rolename varchar(255) NOT NULL,
`primary` varchar(255) NOT NULL,
CONSTRAINT pk_${nameCase(app.name)}_user_id PRIMARY KEY(id)
);

INSERT INTO ${nameCase(app.name)}_user (username,`password`,rolename,`primary`) VALUES ('admin',MD5('changethis'),'Administrator','yes');

<#list app.items as item>
CREATE TABLE ${nameCase(app.name)}_${item.name}
(id int NOT NULL AUTO_INCREMENT,
<#list item.fields as field>
`${field.name}<#if field.type == 'period'>_from</#if><#if field.type == 'item'>_id</#if>` <#if field.type == 'text'>varchar(255)</#if><#if field.type == 'number'>int</#if><#if field.type == 'range'>int</#if><#if field.type == 'date'>DATE</#if><#if field.type == 'period'> DATE NOT NULL, `${field.name}_to` DATE</#if><#if field.type == 'selection'>varchar(255)</#if><#if field.type == 'item'>int</#if> NOT NULL,
</#list>
CONSTRAINT pk_${nameCase(app.name)}_${item.name}_id PRIMARY KEY(id)
);
</#list>

<#list app.items as item>
<#list item.fields as field>
<#if field.type == 'item'>
ALTER TABLE ${nameCase(app.name)}_${item.name} ADD CONSTRAINT fk_${nameCase(app.name)}_${item.name}_${field.name}_id FOREIGN KEY (${field.name}_id) REFERENCES ${nameCase(app.name)}_${field.extra.refItem}(id);
</#if>
</#list>
</#list>

