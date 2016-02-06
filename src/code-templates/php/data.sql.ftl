# data.sql

CREATE DATABASE ${app.name?lower_case?replace(" ","_")};
CREATE USER '${app.name?lower_case?replace(" ","_")}'@'localhost' IDENTIFIED BY 'changethis';
GRANT ALL PRIVILEGES ON ${app.name?lower_case?replace(" ","_")}.* TO '${app.name?lower_case?replace(" ","_")}'@'localhost';

CREATE TABLE ${app.name?lower_case?replace(" ","_")}.${app.name?lower_case?replace(" ","_")}_user
(id int NOT NULL AUTO_INCREMENT,
username varchar(255) NOT NULL UNIQUE,
`password` varchar(32) NOT NULL,
rolename varchar(255) NOT NULL,
`primary` varchar(255) NOT NULL,
CONSTRAINT pk_${app.name?lower_case?replace(" ","_")}_user_id PRIMARY KEY(id)
);

INSERT INTO ${app.name?lower_case?replace(" ","_")}.${app.name?lower_case?replace(" ","_")}_user (username,`password`,rolename,`primary`) VALUES ('admin',MD5('changethis'),'admin','yes');

<#list app.items as item>
CREATE TABLE ${app.name?lower_case?replace(" ","_")}.${app.name?lower_case?replace(" ","_")}_${item.name}
(id int NOT NULL AUTO_INCREMENT,
<#list item.fields as field>
${field.name}<#if field.type == 'item'>_id</#if> <#if field.type == 'text'>varchar(255)</#if><#if field.type == 'item'>int</#if><#if field.type == 'date'>DATE</#if> NOT NULL,
</#list>
CONSTRAINT pk_${app.name?lower_case?replace(" ","_")}_${item.name}_id PRIMARY KEY(id)
);
</#list>

<#list app.items as item>
<#list item.fields as field>
<#if field.type == 'item'>
ALTER TABLE ${app.name?lower_case?replace(" ","_")}.${app.name?lower_case?replace(" ","_")}_${item.name} ADD CONSTRAINT fk_${app.name?lower_case?replace(" ","_")}_${item.name}_${field.name}_id FOREIGN KEY (${field.name}_id) REFERENCES ${app.name?lower_case?replace(" ","_")}_${field.extra.refItem}(id);
</#if>
</#list>
</#list>

