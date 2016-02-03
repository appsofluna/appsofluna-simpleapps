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

angular.module('appsoluna.simpleapps.controllers', ['mightyDatepicker','appsoluna.simpleapps.services'])
        .controller('AppCtrl', function ($scope,$state,$rootScope, $ionicModal, $ionicPopup, $timeout, SAApps, SAUsers,SALogin) {
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
                    $state.go('app.browse',{},{reload: true});
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
                    SAUsers.getUserByUsername($rootScope.username,function (data) {
                        $rootScope.user_id = data.id;
                    });
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
        .controller('SAUsersCtrl', function ($rootScope,$ionicModal, $ionicPopup, $state, $scope, $stateParams, SAUsers, SAApps, SARoles) {
            if (typeof $stateParams.userId === 'undefined') {
                console.log('getting no id ');
                $scope.sa_users = SAUsers.query();
            } else {
                console.log('getting user');
                $scope.app_role_map = {}; //maps app to assigned role
                $scope.roles_by_app_map = {}; //maps app to list of roles
                
                function refreshRole(app_id,user_id) {
                    var fnAppUserCB = {};
                    fnAppUserCB.app_id = app_id;
                    fnAppUserCB.user_id = user_id;
                    fnAppUserCB.func = function (appUser,appId,userId) {
                        if (appUser) {
                            console.log(appUser.id);
                            $scope.app_role_map[appId].original = appUser.role.id;
                            $scope.app_role_map[appId].select = appUser.role.id;
                            $scope.app_role_map[appId].changed = false;
                        };
                    };
                    SAUsers.getAppUser(fnAppUserCB.app_id,fnAppUserCB.user_id, fnAppUserCB);
                };
                
                function updateRole(app_id,user_id,role_id) {
                    console.log('updating role');
                    console.log('app_id:' + app_id);
                    console.log('user_id:' + user_id);
                    console.log('role_id:' + role_id);
                    if (role_id)
                        SAUsers.saveAppUser(app_id,user_id,role_id,function (res) {
                            refreshRole(app_id,user_id);
                        });
                    else
                        SAUsers.removeAppUser(app_id,user_id,function (res) {
                            var selection = {};
                            selection.select = null;
                            selection.original = null;
                            selection.changed = false;
                            $scope.app_role_map[app_id] = selection;
                            refreshRole(app_id,user_id);
                        });
                    console.log('updating done');
                }
                var loadApps = function() {
                    SAApps.query(function (recs) {
                            $scope.sa_apps = recs;
                            for (sa_app_index in $scope.sa_apps) {
                                sa_app = $scope.sa_apps[sa_app_index];
                                var cbObject = {};
                                cbObject.app_id = sa_app.id;
                                cbObject.func = function(sa_app_roles,cbObj) {
                                    $scope.roles_by_app_map[cbObj.app_id]= sa_app_roles;
                                };
                                SARoles.findByApp(sa_app.id,cbObject);
                                
                                var selection = {};
                                selection.select = null;
                                selection.original = null;
                                selection.changed = false;
                                $scope.app_role_map[sa_app.id] = selection;
                                refreshRole(sa_app.id,$stateParams.userId);
                            };
                        });
                };
                
                
                var load = function() {
                    SAUsers.get($stateParams.userId, function (rec) {
                        $scope.sa_user = rec;
                        SAUsers.getDefaultUsername(function (data) {
                            $scope.default_username = data;
                            $scope.default_user_selected = ($scope.default_username==$scope.sa_user.username);
                        });
                        loadApps();
                    });
                };
                
                $scope.roleChanged = function (app_id) {
                    $scope.app_role_map[app_id].changed = true;
                };
                $scope.updateRoleChange = function (app_id) {
                    if ($scope.app_role_map[app_id].select === $scope.app_role_map[app_id].original) {
                        $scope.app_role_map[app_id].changed = false;
                    } else {
                        updateRole(app_id,$stateParams.userId,$scope.app_role_map[app_id].select);
                    }
                };
                $scope.cancelRoleChange = function (app_id) {
                    $scope.app_role_map[app_id].select = $scope.app_role_map[app_id].original;
                    $scope.app_role_map[app_id].changed = false;
                };
                
                // Create the change password modal
                $ionicModal.fromTemplateUrl('templates/change_password.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.changePasswordModal = modal;
                });
                
                // Triggered in the change password modal to close it
                $scope.closeChangePassword = function () {
                    $scope.changePasswordModal.hide();
                };
                
                // Open the change password dialog
                $scope.showChangePassword = function () {
                    $scope.changePasswordData = {};
                    $scope.changePasswordData.username = $scope.sa_user.username;
                    $scope.changePasswordData.userId = $scope.sa_user.id;
                    $scope.changePasswordModal.show();
                };

                // Open the confirm delete item dialog
                $scope.showConfirmDeleteUser = function () {
                    var confirmDeleteItemPopup = $ionicPopup.confirm({
                        title: 'Delete User',
                        template: 'Are you sure you want to delete the user: ' + $scope.sa_user.username + '?'
                    });
                    confirmDeleteItemPopup.then(function (res) {
                        if (res) {
                            console.log('You are sure');
                            SAUsers.removeUser($scope.sa_user.id, function (data) {
                                $state.transitionTo('app.settings',{},{ reload: true });
                            });
                        } else {
                            console.log('You are not sure');
                        }
                    });
                };

                // Perform the save action when the user submits the user form
                $scope.changePassword = function () {
                    var newPassword = $scope.changePasswordData.newPassword;
                    var confirmPassword = $scope.changePasswordData.confirmPassword;
                    if(!newPassword || newPassword.length<1) {
                        $scope.changePasswordData.message = 'invalid password';
                        return;
                    } else if (newPassword != confirmPassword) {
                        $scope.changePasswordData.message = 'passwords does not match';
                        return;
                    }
                    $scope.changePasswordData.newPassword = '';
                    $scope.changePasswordData.confirmPassword = '';
                    $scope.closeChangePassword();
                    SAUsers.changePassword($scope.changePasswordData.userId,newPassword, function (data) {
                        if (data) {
                            $scope.changePasswordData.message = 'password changed';
                        }
                    });
                };

                load();
            }
        })
        .controller('SAItemsCtrl', function ($scope, $rootScope, $ionicModal, $ionicPopup, $timeout, $stateParams,
                                            SAItems, SAFields, SARecords, SAValues,SAPermissions,SAUsers) {
            if (typeof $stateParams.itemId === 'undefined') {
                console.log('getting no id ');
            } else {
                console.log('getting item');
                
                var loadItem = function() {
                    SAItems.get($stateParams.itemId, function (rec) {
                        $scope.sa_item = rec;
                        SAItems.byUrl(rec._links.app.href, function (app) {
                            SAUsers.getAppUser(app.id,$rootScope.user_id,function(data,app_id,user_id) {
                                $scope.current_userinfo.appuser = data;
                                if (data) {
                                    $scope.current_userinfo.assigned = true;
                                    SAPermissions.findByRoleAndItem($scope.current_userinfo.appuser.role.id,$stateParams.itemId, function(res) {
                                        $scope.current_userinfo.permission = res;
                                    });
                                }
                            });
                            
                            SAItems.findByApp(app.id, function (recs) {
                                $scope.sa_app_items = recs;
                            });
                        });
                    });
                };
                var loadRecords = function() {
                    SAFields.findByItem($stateParams.itemId, function (recs) {
                        $scope.sa_item_fields = recs;
                        $scope.fieldFormats = {};
                        $scope.fieldIds = {};
                        for (var sa_field_no in $scope.sa_item_fields) {
                            var sa_field = $scope.sa_item_fields[sa_field_no];
                            $scope.fieldIds[sa_field.id] = sa_field;
                            var fieldData = JSON.parse(sa_field.format);
                            if (fieldData) {
                                $scope.fieldFormats[sa_field.id] = fieldData;
                                if (sa_field.type=='item') {
                                    var cb = {};
                                    cb.field_id = sa_field.id;
                                    cb.func = function (recs) {
                                        console.log('field_id:');
                                        console.log(this.field_id);
                                        $scope.fieldFormats[this.field_id]['fields'] = recs;
                                        for (var f_rec_no in recs) {
                                            var f_rec = recs[f_rec_no];
                                            if (f_rec.id==$scope.fieldFormats[this.field_id]['field']) {
                                                $scope.fieldFormats[this.field_id]['field-full'] = f_rec;
                                            };
                                        };
                                    };
                                    SAFields.findByItem(Number(fieldData['refer']), cb);
                                };
                            } else
                                $scope.fieldFormats[sa_field.id] = {};
                        }
                        loadFieldItems();
                        SARecords.findByItem($stateParams.itemId, function (recs) {
                            $scope.sa_item_records = recs;
                            $scope.recordIds = {};
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
                                            var record_field_value = sa_value[0];
                                            if ($scope.fieldIds[field_id].type=='date') {
                                                record_field_value.content = new Date(record_field_value.content);
                                            };
                                            $scope.recordIds[record_id].fieldValues[field_id] = record_field_value;
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

                $scope.current_userinfo = {};
                $scope.current_userinfo.assigned = false;
                SAUsers.getDefaultUsername(function (data) {
                    $scope.default_username = data;
                    $scope.current_userinfo.default = ($scope.default_username==$rootScope.username);
                });
                load();
                
                $scope.newOption = {};
                // Form data for the field modal
                function resetFieldData() {
                    $scope.fieldData = {};
                    $scope.formatData = {};
                    $scope.formatData['min'] = 0;
                    $scope.formatData['max'] = 10;
                    $scope.fieldTypePage = "";
                    $scope.newOption.text = '';
                    $scope.newOption.adding = false;
                    $scope.addNewOptionText = false;
                    $scope.reference_item_fields = {};
                    $scope.reference_item_fields_by_id = {};
                }
                resetFieldData();
                $scope.fieldTypeCheck = function () {
                    if ($scope.fieldData.type === 'item') {
                        $scope.fieldTypePage = 'templates/field_types/item.html';
                    } else {
                        $scope.fieldTypePage = '';
                    }
                };
                $scope.addNewOption = function() {
                    console.log('add new op. works');
                    if ($scope.newOption.adding) {
                        var options = $scope.formatData['options'];
                        if (!options) options='';
                        if ($scope.newOption.text.length>0) {
                            if (options.length>0) options = options.concat(', ');
                            options = options.concat($scope.newOption.text);
                            $scope.formatData['options'] = options;
                        }
                    }
                    $scope.newOption.text = '';
                    $scope.newOption.adding = false;
                };
                $scope.clearOptions = function() {
                    console.log('clear options');
                    if ($scope.newOption.clearing) {
                        $scope.formatData['options'] = '';
                        $scope.newOption.text = '';
                        $scope.newOption.clearing = false;
                    }
                };
                
                $scope.fieldTypeCheck();
                
                $scope.itemReferenceSelected = function () {
                    if ($scope.formatData['refer']) {
                        $scope.formatData['refer'] = Number($scope.formatData['refer']);
                        $scope.reference_item_fields_by_id = {};
                        SAFields.findByItem($scope.formatData['refer'], function (recs) {
                            $scope.reference_item_fields = recs;
                            for (var refItemFieldNo in recs) {
                                var refItemField = recs[refItemFieldNo];
                                $scope.reference_item_fields_by_id[refItemField.id] = refItemField;
                            }
                        });
                        if($scope.formatData['field'])
                            $scope.formatData['field'] = Number($scope.formatData['field']);
                        if($scope.formatData['field2'])
                            $scope.formatData['field2'] = Number($scope.formatData['field2']);
                        if($scope.formatData['field3'])
                            $scope.formatData['field3'] = Number($scope.formatData['field3']);
                    } else {
                        $scope.reference_item_fields = {};
                        $scope.reference_item_fields_by_id = {};
                        
                        $scope.formatData['field'] = '';
                        $scope.formatData['field2'] = '';
                        $scope.formatData['field3'] = '';
                        $scope.formatData['template'] = '';
                    }
                };
                $scope.itemReferenceSelected();

                $scope.fieldReferenceSelected = function () {
                    var template = '';
                    if ($scope.formatData['field']) {
                        var f_id = Number($scope.formatData['field']);
                        template = template.concat('{',$scope.reference_item_fields_by_id[f_id].name,'}');
                    };
                    if ($scope.formatData['field2']) {
                        var f_id = Number($scope.formatData['field2']);
                        if(template.length>0) template = template.concat(' ');
                        template = template.concat('{',$scope.reference_item_fields_by_id[f_id].name,'}');
                    };
                    if ($scope.formatData['field3']) {
                        var f_id = Number($scope.formatData['field3']);
                        if(template.length>0) template = template.concat(' ');
                        template = template.concat('{',$scope.reference_item_fields_by_id[f_id].name,'}');
                    };
                    $scope.formatData['template'] = template;
                };
                
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
                    resetFieldData();
                    $scope.fieldModal.show();
                };

                // Open the edit field dialog
                $scope.showEditFiled = function (fieldRec) {
                    resetFieldData();
                    SAFields.get(fieldRec.id, function (field) {
                        $scope.fieldData = field;
                        var formatData = JSON.parse(field.format);
                        if(formatData)
                            $scope.formatData = formatData;
                        $scope.fieldTypeCheck();
                        $scope.itemReferenceSelected();
                        $scope.fieldModal.show();
                    });
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
                                loadRecords();
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
                    console.log('$scope.formatData:');
                    
                    field.format = JSON.stringify($scope.formatData);
                    console.log('field.format:');
                    console.log(field.format);
                    SAFields.save(field, function () {
                        loadRecords();
//                        SAFields.findByItem($stateParams.itemId, function (recs) {
//                            $scope.sa_item_fields = recs;
//                        });
                    });

                    console.log('Added field', field);
                };


                // Form data for the record modal
                $scope.recordData = {};
                $scope.recordData.fieldValues = {};
                $scope.optionsDbA = {};
                $scope.optionsDbB = {};

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

                function loadFieldItems() {
                    //$scope.reference_values
                    //is a map of <field_id,list of recordDisplay>
                    //for recordDisplay, has 2 fields
                    //id: the id of the record object
                    //label: the display label for the record object
                    //the label can be taken via getRecordLabel method
                    $scope.reference_values = {};
                    $scope.reference_values_by_id = {};
                    $scope.selection_values = {};
                    for (var field_id in $scope.fieldIds) {
                        var sa_field = $scope.fieldIds[field_id];
                        if (sa_field.type=='item') {
                            var fieldData = $scope.fieldFormats[field_id];
                            var itemId = Number(fieldData['refer']);
                            var callback = {};
                            callback.fieldId = field_id;
                            callback.func = function(rec_list) {
                                var recordDisplayList = rec_list;
                                $scope.reference_values[this.fieldId] = recordDisplayList;
                                var fieldDataRef = $scope.fieldFormats[this.fieldId];
                                console.log(this.fieldId);
                                console.log(fieldDataRef);
                                var template = fieldDataRef['template'];
                                for (var rec_no in recordDisplayList) {
                                    var rec = recordDisplayList[rec_no];
                                    var cbReplaceRec = {};
                                    //cbReplaceRec.recordId = rec.id;
                                    cbReplaceRec.rec = rec;
                                    cbReplaceRec.fieldId = this.fieldId;
                                    cbReplaceRec.func = function(label) {
                                        console.log(label);
                                        //var recObj = $scope.reference_values[this.fieldId][this.recordId];
                                        this.rec.label = label;
                                    };
                                    SARecords.formatRecord(rec.id,template,cbReplaceRec);
                                }
                                var recordDisplayListById = {};
                                for (var rec_no in recordDisplayList) {
                                    var rec = recordDisplayList[rec_no];
                                    recordDisplayListById[rec.id]=rec;
                                }
                                $scope.reference_values_by_id[this.fieldId] = recordDisplayListById;
                            };
                            SARecords.findByItem(itemId,callback);
                        } else if (sa_field.type=='selection') {
                            var fieldData = $scope.fieldFormats[field_id];
                            var options = fieldData['options'].split(', ');
                            console.log(options);
                            $scope.selection_values[field_id] = [];
                            for (var op in options) {
                                $scope.selection_values[field_id].push({
                                    name: options[op],
                                    Name: options[op],
                                    id: options[op],
                                    text: options[op],
                                    ticked: false
                                });
                            }
                        };
                    };
                };
                
                
                // Open the add record dialog
                $scope.showAddRecord = function () {
                    $scope.recordData = {};
                    loadFieldItems();
                    $scope.recordModal.show();
                };

                // Open the edit record dialog
                $scope.showEditRecord = function (record) {
                    $scope.recordData = record;
                    $scope.selectionArrays = [];
                    //loadFieldItems();
                    for(saItemFieldNo in $scope.sa_item_fields) {
                        var saItemField = $scope.sa_item_fields[saItemFieldNo];
                        if (saItemField.type=='item') {
                            var recId = Number($scope.recordData.fieldValues[saItemField.id].content);
                            if (recId)
                                $scope.recordData.fieldValues[saItemField.id].content = ($scope.reference_values_by_id[saItemField.id])[recId].id;
                        } else if(saItemField.type=='period') {
                            var range = {};
                            range.isRange = true;
                            if($scope.recordData.fieldValues[saItemField.id].content) {
                                console.log($scope.recordData.fieldValues[saItemField.id].content);
                                var res = $scope.recordData.fieldValues[saItemField.id].content.split("|");
                                range.dateDbA= moment(res[0]);
                                range.dateDbB= moment(res[1]);
                            } else {
                                range.dateDbA =  moment();
                                range.dateDbB =  moment();
                            }
                            $scope.recordData.fieldValues[saItemField.id].content = range;
                        } else if(saItemField.type=='selection') {
                            var fieldData = $scope.fieldFormats[saItemField.id];
                            var multiple = fieldData['multiple'];
                            fieldData['multiple_var'] = (multiple) ? 'multiple' : 'single';
                            if($scope.recordData.fieldValues[saItemField.id].content) {
                                if(multiple)
                                    $scope.selectionArrays[saItemField.id] = $scope.recordData.fieldValues[saItemField.id].content.split(",");
                                else
                                    $scope.selectionArrays[saItemField.id] = $scope.recordData.fieldValues[saItemField.id].content;
                            };
                        }
                    }
                    $scope.recordModal.show();
                };
                
                $scope.formatRange = function (rangeContent,format,part) {
                    if (!rangeContent) return '';
                    var range;
                    if (rangeContent.isRange) {
                        range = rangeContent;
                    } else {
                        range = {};
                        range.isRange = true;
                        var res = rangeContent.split("|");
                        range.dateDbA= moment(res[0]);
                        range.dateDbB= moment(res[1]);
                    }
                    if (part==='from')
                        return ''.concat('From: ',range.dateDbA.format(format));
                    else if (part==='to')
                        return ''.concat('To: ',range.dateDbB.format(format));
                    else
                        return ''.concat('From: ',range.dateDbA.format(format),' ','To: ',range.dateDbB.format(format));
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
                            
                            if(sa_field_rec.type=='selection') {
                                var fieldData = $scope.fieldFormats[sa_field_rec.id];
                                var multiple = fieldData['multiple'];
                                if (multiple) {
                                    if($scope.selectionArrays[sa_field_rec.id]) {
                                        record.fieldValues[sa_field_rec.id].content = $scope.selectionArrays[sa_field_rec.id].join();
                                    }
                                } else {
                                    record.fieldValues[sa_field_rec.id].content = $scope.selectionArrays[sa_field_rec.id];
                                }
                            }
                            
                            if(record.fieldValues[sa_field_rec.id].content) {
                                if (record.fieldValues[sa_field_rec.id].content.isRange) {
                                    var range = record.fieldValues[sa_field_rec.id].content;
                                    sa_record_val.content = ''.concat(range.dateDbA,'|',range.dateDbB);
                                } else if (Array.isArray(record.fieldValues[sa_field_rec.id].content)) {
                                    sa_record_val.content = record.fieldValues[sa_field_rec.id].content.join();
                                } else {
                                    sa_record_val.content = record.fieldValues[sa_field_rec.id].content;
                                }
                                
                            } else {
                                sa_record_val.content = '';
                            }
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
                                                deleteAllowed: false
                                            };
                                        } else {
                                            console.log('permission found for item: ' + item_id);
                                            $scope.permissionMap[item_id] = sa_permission;
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
        .controller('SAAppsCtrl', function ($scope,$rootScope, $ionicModal, $ionicPopup, $stateParams, SAApps, SAItems, SARoles, SAUsers,SAPermissions) {
            if (typeof $stateParams.appId === 'undefined') {
                console.log('getting app no id ');
                SAApps.query(function (recs) {
                    $scope.sa_apps = recs;
                });
            } else {
                console.log('getting app');
                
                var loadApp = function(callback) {
                    SAApps.get($stateParams.appId, function (data) {
                        $scope.sa_app = data;
                        SAUsers.getAppUser($stateParams.appId,$rootScope.user_id,function(data,app_id,user_id) {
                            $scope.current_userinfo.appuser = data;
                            if (data) {
                                $scope.current_userinfo.assigned = true;
                            }
                            callback && callback();
                        });
                    });
                };
                var loadItems = function() {
                    SAItems.findByApp($stateParams.appId, function (recs) {
                        $scope.sa_app_items = recs;
                        $scope.allowed_sa_app_items = {};
                        for (sa_app_item_index in recs) {
                            var sa_app_item = recs[sa_app_item_index];
                            //get permission
                            if ($scope.current_userinfo.appuser) {
                                var callback = {};
                                callback.item = sa_app_item;
                                callback.func = function(res) {
                                    if(res.accessAllowed) {
                                        $scope.allowed_sa_app_items[this.item.id] = this.item;
                                    }
                                };
                                SAPermissions.findByRoleAndItem($scope.current_userinfo.appuser.role.id,sa_app_item.id, callback);
                            }
                        }
                    });
                };
                var loadRoles = function() {
                    SARoles.findByApp($stateParams.appId, function (recs) {
                        $scope.sa_app_roles = recs;
                    });
                };
                var load = function() {
                    loadApp(function() {
                        loadItems();
                        loadRoles();
                    });
                };
                
                $scope.current_userinfo = {};
                $scope.current_userinfo.assigned = false;
                SAUsers.getDefaultUsername(function (data) {
                    $scope.default_username = data;
                    $scope.current_userinfo.default = ($scope.default_username==$rootScope.username);
                });
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
                        template: 'Are you sure you want to delete the item: ' + item.label + '?'
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
                
                $scope.labelChanged = function() {
                    var label = $scope.itemData.label;
                    if(label && label.length>0) {
                        $scope.itemData.name = label.toLowerCase().replace(new RegExp(' ','g'),'_');
                    };
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
                        $scope.$apply();
                    });
                };
            }
        })
        .controller('SAGenerateCtrl', function ($scope, $ionicModal, $ionicPopup, $stateParams, SAGenerate) {
            console.log('loading generate controler');
            if (typeof $stateParams.appId === 'undefined') {
                console.log('error: appId is not defined ');
            };
            $scope.lang = 'php';
            SAGenerate.files($scope.lang,$stateParams.appId, function (rec) {
                $scope.files = rec.files;
            });
            $scope.subSource = "";
            $scope.selectedFile = "";
            $scope.showFileContent = false;
            $scope.zipFile = "api/generate/"+$scope.lang+"/"+$stateParams.appId+"/zip";
            $scope.fileClicked = function(file_name) {
                $scope.selectedFile = file_name;
                $scope.showFileContent = true;
                $scope.subSource = "api/generate/"+$scope.lang+"/"+$stateParams.appId+"/"+file_name;
            };
        });
