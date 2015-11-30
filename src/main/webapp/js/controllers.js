/*
 * Copyright (c) 2015 Charaka Gunatillake / AppsoFluna. (http://www.appsofluna.com)
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

angular.module('appsoluna.simpleapps.controllers', ['appsoluna.simpleapps.services'])
        .controller('AppCtrl', function ($scope,$rootScope, $ionicModal, $ionicPopup, $timeout, SAApps, SAUsers,SALogin) {
            // Form data for the login modal
            $scope.loginData = {};

            // Create the login modal that we will use later
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            // Triggered in the login modal to close it
            $scope.closeLogin = function () {
                $scope.modal.hide();
            };

            // Open the login modal
            $scope.login = function () {
                $scope.modal.show();
            };
            
            $scope.logout = function () {
                SALogin.logout(function () {
                    $rootScope.authenticated = SALogin.isLoggedIn();
                });
            };
            
            $rootScope.authenticated = SALogin.isLoggedIn();
            $rootScope.username = SALogin.getUsername();

            // Perform the login action when the user submits the login form
            $scope.doLogin = function () {
                console.log('Doing login', $scope.loginData);
                
                SALogin.login($scope.loginData.username,$scope.loginData.password,function(res_auth) {
                    $rootScope.authenticated = res_auth;
                    $rootScope.username =  $scope.loginData.username;
                    load();
                    $scope.closeLogin();
                });
                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                
                $timeout(function () {
                    $scope.closeLogin();
                }, 1000);
            };

            //$scope.authenticated = false;
            
            //loading the apps
            var load = function() {
                if ($rootScope.authenticated) {
                    SAApps.query(function (recs) {
                        $scope.sa_apps = recs;
                    });
                }
            };
            
            
            load();

            // Form data for the app modal
            $scope.appData = {};

            // Create the app modal that we will use later
            $ionicModal.fromTemplateUrl('templates/save_app.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.appModal = modal;
            });

            // Triggered in the app modal to close it
            $scope.closeSaveApp = function () {
                $scope.appModal.hide();
            };

            // Open the add app dialog
            $scope.showAddApp = function () {
                console.log('Clicked!');
                $scope.appData = {};
                $scope.appModal.show();
            };

            // Open the edit app dialog
            $scope.showEditApp = function (field) {
                $scope.appData = field;
                $scope.appModal.show();
            };

            // Open the confirm delete app dialog
            $scope.showConfirmDeleteApp = function (app) {
                $scope.appData = app;
                var confirmDeleteAppPopup = $ionicPopup.confirm({
                    title: 'Delete App',
                    template: 'Are you sure you want to delete the record: ' + app.id + '?'
                });
                confirmDeleteAppPopup.then(function (res) {
                    if (res) {
                        console.log('You are sure');
                        SAApps.delete($scope.appData, function () {
                            load();
                        });
                    } else {
                        console.log('You are not sure');
                    }
                });
            };

            // Perform the save action when the user submits the app form
            $scope.saveApp = function () {
                $scope.closeSaveApp();
                var app = $scope.appData;
                console.log('Saving app', app);
                SAApps.save(app, function (data) {
                    console.log('res-start');
                    console.log(data);
                    load();
                    console.log('res-end');
                });
            };
        })
        .controller('SettingsCtrl', function ($scope, $ionicModal, SAUsers) {
            //loading the users
            SAUsers.query(function (recs) {
                $scope.sa_users = recs;
            });
            
            // Form data for the user modal
            $scope.userData = {};

            // Create the user modal
            $ionicModal.fromTemplateUrl('templates/save_user.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.userModal = modal;
            });

            // Triggered in the user modal to close it
            $scope.closeSaveUser = function () {
                $scope.userModal.hide();
            };

            // Open the add user dialog
            $scope.showAddUser = function () {
                console.log('Clicked!');
                $scope.userData = {};
                $scope.userModal.show();
            };
            
            // Perform the save action when the user submits the user form
            $scope.saveUser = function () {
                $scope.closeSaveUser();
                var user = $scope.userData;
                console.log('Saving user', user);
                SAUsers.save(user, function (data) {
                    console.log('res-start');
                    console.log(data);
                    SAUsers.query(function (recs) {
                        $scope.sa_users = recs;
                    });
                    console.log('res-end');
                });
            };
        })
        .controller('SAUsersCtrl', function ($scope, SAUsers) {
            console.log('getting users');
            SAUsers.query(function (recs) {
                $scope.sa_users = recs;
            });
        })
        .controller('SAUsersCtrl', function ($scope, $stateParams, SAUsers) {
            if (typeof $stateParams.userId === 'undefined') {
                console.log('getting no id ');
                $scope.sa_users = SAUsers.query();
            } else {
                console.log('getting user');
                SAUsers.get($stateParams.userId, function (rec) {
                    $scope.sa_user = rec;
                });
            }
        })
        .controller('SAItemsCtrl', function ($scope, $ionicModal, $ionicPopup, $timeout, $stateParams, SAItems, SAFields, SARecords, SAValues) {
            SAItems.query(function (recs) {
                $scope.sa_items = recs;
            });
            if (typeof $stateParams.itemId === 'undefined') {
                console.log('getting no id ');
            } else {
                console.log('getting item');
                
                var loadItem = function() {
                    SAItems.get($stateParams.itemId, function (rec) {
                        $scope.sa_item = rec;
                    });
                };
                var loadRecords = function() {
                    SAFields.findByItem($stateParams.itemId, function (recs) {
                        $scope.sa_item_fields = recs;
                        SARecords.findByItem($stateParams.itemId, function (recs) {
                            $scope.sa_item_records = recs;
                            $scope.recordIds = {}
                            for (var sa_record_no in $scope.sa_item_records) {
                                var sa_record = $scope.sa_item_records[sa_record_no];
                                $scope.recordIds[sa_record.id] = sa_record;
                            }
                            for (var sa_record_id in $scope.recordIds) {
                                var sa_record = $scope.recordIds[sa_record_id];
                                sa_record.fieldValues = {};
                                for (var sa_field_no in $scope.sa_item_fields) {
                                    var sa_field = $scope.sa_item_fields[sa_field_no];
                                    sa_record.fieldValues[sa_field.id] = {
                                        content: ""
                                    };
                                    SAValues.findByRecordAndField(sa_record.id,sa_field.id,function(sa_value,record_id,field_id) {
                                        if (sa_value) {
                                            $scope.recordIds[record_id].fieldValues[field_id] =sa_value[0];
                                        }
                                    });
                                };
                            };
                        });
                    });
                };
                var load = function () {
                    loadItem();
                    loadRecords();
                };

                load();
                
                // Form data for the field modal
                $scope.fieldData = {};
                $scope.fieldTypePage = "";
                $scope.fieldTypeCheck = function () {
                    if ($scope.fieldData.type === 'item') {
                        $scope.fieldTypePage = 'templates/field_types/item.html';
                    } else {
                        $scope.fieldTypePage = '';
                    }
                };
                $scope.fieldTypeCheck();

                // Create the field modal that we will use later
                $ionicModal.fromTemplateUrl('templates/save_field.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.fieldModal = modal;
                });

                // Triggered in the field modal to close it
                $scope.closeSaveField = function () {
                    $scope.fieldModal.hide();
                };

                // Open the add field dialog
                $scope.showAddFiled = function () {
                    $scope.fieldData = {};
                    $scope.fieldModal.show();
                };

                // Open the edit field dialog
                $scope.showEditFiled = function (field) {
                    $scope.fieldData = field;
                    $scope.fieldTypeCheck();
                    $scope.fieldModal.show();
                };

                // Open the confirm delete field dialog
                $scope.showConfirmDeleteFiled = function (field) {
                    $scope.fieldData = field;
                    var confirmDeleteFieldPopup = $ionicPopup.confirm({
                        title: 'Delete Field',
                        template: 'Are you sure you want to delete the field: ' + field.name + '?'
                    });
                    confirmDeleteFieldPopup.then(function (res) {
                        if (res) {
                            console.log('You are sure');
                            SAFields.delete($scope.fieldData, function () {
                                SAFields.findByItem($stateParams.itemId, function (recs) {
                                    $scope.sa_item_fields = recs;
                                });
                            });
                        } else {
                            console.log('You are not sure');
                        }
                    });
                };

                // Perform the save action when the user submits the field form
                $scope.saveField = function () {
                    $scope.closeSaveField();
                    var field = $scope.fieldData;
                    field.item = $scope.sa_item._links.self.href;
                    SAFields.save(field, function () {
                        SAFields.findByItem($stateParams.itemId, function (recs) {
                            $scope.sa_item_fields = recs;
                        });
                    });

                    console.log('Added field', field);
                };


                // Form data for the record modal
                $scope.recordData = {};
                $scope.recordData.fieldValues = {};

                // Create the record modal that we will use later
                $ionicModal.fromTemplateUrl('templates/save_record.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.recordModal = modal;
                });

                // Triggered in the record modal to close it
                $scope.closeSaveRecord = function () {
                    $scope.recordModal.hide();
                };

                // Open the add record dialog
                $scope.showAddRecord = function () {
                    $scope.recordData = {};
                    $scope.recordModal.show();
                };

                // Open the edit record dialog
                $scope.showEditRecord = function (record) {
                    $scope.recordData = record;
                    $scope.recordModal.show();
                };

                // Open the confirm delete record dialog
                $scope.showConfirmDeleteRecord = function (record) {
                    $scope.recordData = record;
                    var confirmDeleteRecordPopup = $ionicPopup.confirm({
                        title: 'Delete Record',
                        template: 'Are you sure you want to delete the record: ' + record.id + '?'
                    });
                    confirmDeleteRecordPopup.then(function (res) {
                        if (res) {
                            console.log('You are sure');
                            SARecords.delete($scope.recordData, function () {
                                loadRecords();
                            });
                        } else {
                            console.log('You are not sure');
                        }
                    });
                };

                // Perform the save action when the user submits the record form
                $scope.saveRecord = function () {
                    $scope.closeSaveRecord();
                    var record = $scope.recordData;
                    console.log('Saving record', record);
                    record.item = $scope.sa_item._links.self.href;
                    record.statusNo = -1;
                    SARecords.save(record, function (saved) {
                        var record_href;
                        if (record.id) {
                            record_href = record._links.self.href;
                        } else {
                            record_href = saved.headers('Location');
                        }
                        var lastCallback = {};
                        
                        lastCallback.record_href = record_href;
                        lastCallback.func = function (rec) {
                            SARecords.byUrl(this.record_href, function(saved_rec) {
                               saved_rec.statusNo = 1;
                               console.log('Saved record', saved_rec);
                               SARecords.save(saved_rec, function (final_rec) {
                                   console.log('Final record', final_rec);
                                   loadRecords();
                               }); 
                            });
                        };
                        for (var sa_field_sec in $scope.sa_item_fields) {
                            var sa_field_rec = $scope.sa_item_fields[sa_field_sec];
                            var sa_record_val = {};
                            if (record.id) {
                                sa_record_val = $scope.recordIds[record.id].fieldValues[sa_field_rec.id];
                            }
                            sa_record_val.field = sa_field_rec._links.self.href;
                            sa_record_val.content = record.fieldValues[sa_field_rec.id].content;
                            sa_record_val.record = record_href;
                            var oldLastCB = lastCallback;
                            lastCallback = {};
                            lastCallback.last = oldLastCB;
                            lastCallback.recd = sa_record_val;
                            lastCallback.func = function (rec) {
                                SAValues.save(this.recd, this.last);
                            };
                        }
                        lastCallback.func('');
                    });
                };
            }
        })
        .controller('SARolesCtrl', function ($scope, $ionicModal, $ionicPopup, $timeout, $stateParams, SAItems, SARoles, SAPermissions) {
            if (typeof $stateParams.roleId === 'undefined') {
                console.log('getting no role id ');
                SARoles.query(function (recs) {
                    $scope.sa_roles = recs;
                });
            } else {
                var load = function() {
                    $scope.permissionMap = {};
                    console.log('getting role');
                    SARoles.get($stateParams.roleId, function (role_data) {
                        $scope.sa_role = role_data;
                        console.log(role_data);
                        SARoles.getApp($stateParams.roleId, function (data) {
                            console.log(data);
                            SAItems.findByApp(data.id, function (recs) {
                                console.log('got apps');
                                $scope.sa_app_items = recs;
                                for (var sa_item_no in $scope.sa_app_items) {
                                    console.log(sa_item_no);
                                    var sa_item = $scope.sa_app_items[sa_item_no];
                                    console.log(sa_item.id);
                                    SAPermissions.findByRoleAndItem($stateParams.roleId,sa_item.id,function(sa_permission,role_id,item_id) {
                                        if (!sa_permission) {
                                            console.log('no permission found for item: ' + item_id);
                                            $scope.permissionMap[item_id] = {
                                                accessAllowed: false,
                                                createAllowed: false,
                                                editAllowed: false,
                                                deteleAllowed: false
                                            };
                                        } else {
                                            console.log('permission found for item: ' + item_id);
                                            $scope.permissionMap[item_id] = sa_permission[0];
                                        }
                                    });
                                };
                            });
                        });
                    });
                    
                };
                
                load();
                
                $scope.permissionChanged = function(sa_item) {
                    console.log($scope.permissionMap);
                    console.log('Permission changed for the item: ' +sa_item.name);
                    var permission = $scope.permissionMap[sa_item.id];
                    console.log(permission);
                    permission.role = $scope.sa_role._links.self.href;
                    permission.item = sa_item._links.self.href;
                    SAPermissions.save(permission, function (data) {
                        SAPermissions.findByRoleAndItem($scope.sa_role.id,sa_item.id, function (sa_permission) {
                            $scope.permissionMap[sa_item] = sa_permission;
                        });
                    });
                };
                $scope.allowAllItems = function() {
                    console.log('Allow all items');
                    var confirmAllowAllItemsPopup = $ionicPopup.confirm({
                        title: 'Allow  all items',
                        template: 'Are you sure you want to allow all items for the role: ' + $scope.sa_role.name + '?'
                    });
                    confirmAllowAllItemsPopup.then(function (res) {
                        if (res) {
                            console.log('You are sure');
                            SARoles.allowAllItems($scope.sa_role.id, true, function () {
                                load();
                            });
                        } else {
                            console.log('You are not sure');
                        }
                    });
                };
                
                $scope.giveSpecialPermissions = function() {
                    console.log('Give special permissions');
                    SARoles.allowAllItems($scope.sa_role.id, false, function () {
                        load();
                    });
                };
            }
        })
        .controller('SAAppsCtrl', function ($scope, $ionicModal, SAApps) {
            console.log('getting apps');
            SAApps.query(function (recs) {
                $scope.sa_apps = recs;
            });
        })
        .controller('SAAppsCtrl', function ($scope, $ionicModal, $ionicPopup, $stateParams, SAApps, SAItems, SARoles) {
            if (typeof $stateParams.appId === 'undefined') {
                console.log('getting app no id ');
                SAApps.query(function (recs) {
                    $scope.sa_apps = recs;
                });
            } else {
                console.log('getting app');
                
                var loadApp = function() {
                    SAApps.get($stateParams.appId, function (data) {
                        $scope.sa_app = data;
                    });
                };
                var loadItems = function() {
                    SAItems.findByApp($stateParams.appId, function (recs) {
                        $scope.sa_app_items = recs;
                    });
                };
                var loadRoles = function() {
                    SARoles.findByApp($stateParams.appId, function (recs) {
                        $scope.sa_app_roles = recs;
                    });
                };
                var load = function() {
                    loadApp();
                    loadItems();
                    loadRoles();
                };
                
                load();
                
                // Form data for the item modal
                $scope.itemData = {};

                // Create the item modal that we will use later
                $ionicModal.fromTemplateUrl('templates/save_item.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.itemModal = modal;
                });

                // Triggered in the item modal to close it
                $scope.closeSaveItem = function () {
                    $scope.itemModal.hide();
                };

                // Open the add item dialog
                $scope.showAddItem = function () {
                    $scope.itemData = {};
                    $scope.itemModal.show();
                };

                // Open the edit item dialog
                $scope.showEditItem = function (item) {
                    $scope.itemData = item;
                    $scope.itemModal.show();
                };

                // Open the confirm delete item dialog
                $scope.showConfirmDeleteItem = function (item) {
                    $scope.itemData = item;
                    var confirmDeleteItemPopup = $ionicPopup.confirm({
                        title: 'Delete Item',
                        template: 'Are you sure you want to delete the item: ' + item.id + '?'
                    });
                    confirmDeleteItemPopup.then(function (res) {
                        if (res) {
                            console.log('You are sure');
                            SAItems.delete($scope.itemData, function (data) {
                                loadItems();
                            });
                        } else {
                            console.log('You are not sure');
                        }
                    });
                };

                // Perform the save action when the user submits the item form
                $scope.saveItem = function () {
                    $scope.closeSaveItem();
                    var item = $scope.itemData;
                    console.log('Saving item', item);
                    item.app = $scope.sa_app._links.self.href;
                    SAItems.save(item, function (data) {
                        loadItems();
                    });
                    console.log('Saved item', item);
                };
                
                
                // Form data for the role modal
                $scope.roleData = {
                    name: "",
                    allItemsAllowed: true
                };

                // Create the role modal that we will use later
                $ionicModal.fromTemplateUrl('templates/save_role.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.roleModal = modal;
                });

                // Triggered in the role modal to close it
                $scope.closeSaveRole = function () {
                    $scope.roleModal.hide();
                };

                // Open the add role dialog
                $scope.showAddRole = function () {
                    $scope.roleData = {};
                    $scope.roleModal.show();
                };

                // Open the edit role dialog
                $scope.showEditRole = function (role) {
                    $scope.roleData = role;
                    $scope.roleModal.show();
                };

                // Open the confirm delete role dialog
                $scope.showConfirmDeleteRole = function (role) {
                    $scope.roleData = role;
                    var confirmDeleteRolePopup = $ionicPopup.confirm({
                        title: 'Delete Role',
                        template: 'Are you sure you want to delete the role: ' + role.id + '?'
                    });
                    confirmDeleteRolePopup.then(function (res) {
                        if (res) {
                            console.log('You are sure');
                            SARoles.delete($scope.roleData, function (data) {
                                loadRoles();
                            });
                        } else {
                            console.log('You are not sure');
                        }
                    });
                };

                // Perform the save action when the user submits the role form
                $scope.saveRole = function () {
                    $scope.closeSaveRole();
                    var role = $scope.roleData;
                    console.log('Saving role', role);
                    role.app = $scope.sa_app._links.self.href;
                    SARoles.save(role, function (data) {
                        loadRoles();
                    });
                };
            }
        })
        .controller('SessionsCtrl', function ($scope, Session) {
            console.log('getting sids');
            $scope.sessions = Session.query();
        })
        .controller('SessionsCtrl', function ($scope, $stateParams, Session) {
            if (typeof $stateParams.sessionId === 'undefined') {
                console.log('getting no sid ');
                $scope.sessions = Session.query();
            } else {
                console.log('getting sid ' + $stateParams.sessionId);
                $scope.session = Session.get({sessionId: $stateParams.sessionId});
            }
        });
