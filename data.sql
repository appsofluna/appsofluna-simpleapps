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


# Database Creation
# =================
# username = simpleapps
# password = guess
# hostname = localhost
# database = simpleapps
CREATE DATABASE simpleapps;
CREATE USER 'simpleapps'@'localhost' IDENTIFIED BY 'guess';
GRANT ALL PRIVILEGES ON simpleapps.* TO 'simpleapps'@'localhost';
USE simpleapps;


# Table Creation
# ==============
CREATE TABLE `simpleapps_app` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `creator_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_cakowrv04ybumugcyalmdj0h3` (`name`),
  KEY `FK_rb08snxverhc1yyel7f26n7xw` (`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
CREATE TABLE `simpleapps_app_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ix2d7vg0fwnwu70hup73pxfs4` (`app_id`,`user_id`),
  KEY `FK_237pw11tg5lfb4e94dacyvk1` (`role_id`),
  KEY `FK_2r3f2x7ovp88wmupdvykcxgaw` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
CREATE TABLE `simpleapps_field` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `format` varchar(255) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `item_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_1mt5lvpijwn4o60a32kmgxhhg` (`item_id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
CREATE TABLE `simpleapps_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `template` varchar(255) DEFAULT NULL,
  `app_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_dyp4toser84daxerasr2ujxit` (`app_id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
CREATE TABLE `simpleapps_permission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `is_access_allowed` bit(1) DEFAULT NULL,
  `is_create_allowed` bit(1) DEFAULT NULL,
  `is_delete_allowed` bit(1) DEFAULT NULL,
  `is_edit_allowed` bit(1) DEFAULT NULL,
  `item_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_lwbclxvv279lant4vs24gdvnf` (`role_id`,`item_id`),
  KEY `FK_dco3hgpq5wsx79cvbkgnwcxhb` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
CREATE TABLE `simpleapps_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `status_no` int(11) DEFAULT NULL,
  `app_user_id` bigint(20) DEFAULT NULL,
  `item_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_5nbsq9vjq3jadlh7g60kye5sn` (`app_user_id`),
  KEY `FK_7qftx331ol63vmp1jvehpxn2c` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
CREATE TABLE `simpleapps_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `is_all_items_allowed` bit(1) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `app_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_mkkxeklxi4mtbl0a5gq5k3mwb` (`app_id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
CREATE TABLE `simpleapps_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `password` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_8r5s2sd0em9fpyjefsduqpdns` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
CREATE TABLE `simpleapps_value` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `field_id` bigint(20) NOT NULL,
  `record_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_8a0d7q6c0hnt6xp2ss4i1c6a0` (`record_id`,`field_id`),
  KEY `FK_pphgt91qea5ud329hvqrgmxju` (`field_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

# Foreign Key Creation
# ====================
ALTER TABLE `simpleapps_app` ADD CONSTRAINT `FK_rb08snxverhc1yyel7f26n7xw` FOREIGN KEY (`creator_id`) REFERENCES `simpleapps_user` (`id`);
ALTER TABLE `simpleapps_app_user` ADD CONSTRAINT `FK_2r3f2x7ovp88wmupdvykcxgaw` FOREIGN KEY (`user_id`) REFERENCES `simpleapps_user` (`id`);
ALTER TABLE `simpleapps_app_user` ADD CONSTRAINT `FK_237pw11tg5lfb4e94dacyvk1` FOREIGN KEY (`role_id`) REFERENCES `simpleapps_role` (`id`);
ALTER TABLE `simpleapps_app_user` ADD CONSTRAINT `FK_cubwlnxtsb5r6d9gwo2cb4rbx` FOREIGN KEY (`app_id`) REFERENCES `simpleapps_app` (`id`);
ALTER TABLE `simpleapps_field` ADD CONSTRAINT `FK_qdd104fre736106ww7u6u4bv9` FOREIGN KEY (`item_id`) REFERENCES `simpleapps_item` (`id`);
ALTER TABLE `simpleapps_item` ADD CONSTRAINT `FK_nby8lpn5fvi4stppdk4bppl3x` FOREIGN KEY (`app_id`) REFERENCES `simpleapps_app` (`id`);
ALTER TABLE `simpleapps_permission` ADD CONSTRAINT `FK_eaj5ebeq1ae8w0v40oy6ox294` FOREIGN KEY (`role_id`) REFERENCES `simpleapps_role` (`id`);
ALTER TABLE `simpleapps_permission` ADD CONSTRAINT `FK_dco3hgpq5wsx79cvbkgnwcxhb` FOREIGN KEY (`item_id`) REFERENCES `simpleapps_item` (`id`);
ALTER TABLE `simpleapps_record` ADD CONSTRAINT `FK_7qftx331ol63vmp1jvehpxn2c` FOREIGN KEY (`item_id`) REFERENCES `simpleapps_item` (`id`);
ALTER TABLE `simpleapps_record` ADD CONSTRAINT `FK_5nbsq9vjq3jadlh7g60kye5sn` FOREIGN KEY (`app_user_id`) REFERENCES `simpleapps_app_user` (`id`);
ALTER TABLE `simpleapps_role` ADD CONSTRAINT `FK_b1k5wg9q4gq6vgeej1o2jndvx` FOREIGN KEY (`app_id`) REFERENCES `simpleapps_app` (`id`);
ALTER TABLE `simpleapps_value` ADD CONSTRAINT `FK_40l6am7k1hq2l4cdwyjbnpadn` FOREIGN KEY (`record_id`) REFERENCES `simpleapps_record` (`id`);
ALTER TABLE `simpleapps_value` ADD CONSTRAINT `FK_pphgt91qea5ud329hvqrgmxju` FOREIGN KEY (`field_id`) REFERENCES `simpleapps_field` (`id`);


# Admin User Creation
# ===================
# username = admin
# password = guess
INSERT INTO `simpleapps_user` VALUES (1,'$2a$10$8Kseiw4fbCZpDV8OgcaBe.LAq0EoLIJDmWXXCSIkpdX1UpW5Xkl2m','ADMIN','admin');


# Sample Application Creation
# ===========================
INSERT INTO `simpleapps_app` VALUES (1,'Sample application for educational institutes','School',NULL);
INSERT INTO `simpleapps_item` VALUES (1,'Course','course',NULL,1),(2,'Student','student',NULL,1),(3,'Registration','registration',NULL,1);
INSERT INTO `simpleapps_field` VALUES (1,'{\"min\":0,\"max\":10}','Course Name','course_name','text',1),(2,'{\"min\":0,\"max\":10}','First Name','first_name','text',2),(3,'{\"min\":0,\"max\":10}','Last Name','last_name','text',2),(4,'{\"min\":0,\"max\":10}','Address','address','text',2),(5,'{\"min\":0,\"max\":10,\"refer\":2,\"field\":2,\"template\":\"{first_name} {last_name}\",\"field2\":3}','Student','student','item',3),(6,'{\"min\":0,\"max\":10,\"refer\":1,\"field\":1,\"template\":\"{course_name}\"}','Course','course','item',3);
INSERT INTO `simpleapps_role` VALUES (1,'','Administrator',1),(2,'\0','Officer',1);
INSERT INTO `simpleapps_permission` VALUES (1,'','','','',2,2),(2,'','','','',3,2),(3,'','\0','\0','\0',1,2);

# Sample Application Role Assignment
# ==================================
INSERT INTO `simpleapps_app_user` VALUES (1,1,1,1);

# Sample Record Creation
# ======================
INSERT INTO `simpleapps_record` VALUES (1,1,NULL,1),(2,1,NULL,1),(3,1,NULL,1),(4,1,NULL,2),(5,1,NULL,3);
INSERT INTO `simpleapps_value` VALUES (1,'Maths',1,1),(2,'Chemistry',1,2),(3,'Physics',1,3),(4,'AppsoFluna',4,4),(5,'Gunatillake',3,4),(6,'Charaka',2,4),(7,'2016-02-09T18:30:00.000Z',7,5),(8,'1',6,5),(9,'4',5,5);
