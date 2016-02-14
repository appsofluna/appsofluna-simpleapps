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

angular.module('appsofluna.simpleapps.controllers', ['appsofluna.simpleapps.services'])
        .controller('AppCtrl', function ($scope,$state,$rootScope, $ionicModal, $ionicPopup, $timeout, SAApps, SAUsers,SALogin) {
            
            function setupLoginDialog() {
                $scope.loginDialog = {};
                $ionicModal.fromTemplateUrl('templates/login.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.loginDialog.modal = modal;
                });

                var dialog = $scope.loginDialog;
                dialog.data = null;
                
                // Triggered in the login modal to close it
                dialog.fnClose = function () {
                    this.modal.hide();
                };
                
                // Open the login modal
                dialog.fnShow = function () {
                    this.data = {};
                    this.modal.show();
                };
                
                // Perform the login action when the user submits the login form
                dialog.fnSubmit = function () {
                    if ((!dialog.data.username || dialog.data.username.trim()=='') || (!dialog.data.password || dialog.data.password.trim()=='')) {
                        $ionicPopup.alert({
                            title: 'Unable to login!',
                            template: 'Please enter a username and a password'
                          });
                          return false;
                    };
                    SALogin.login(this.data.username,this.data.password,function(res_auth) {
                        if (res_auth) {
                            $rootScope.authenticated = res_auth;
                            $rootScope.username =  $scope.loginDialog.data.username;
                            $scope.loginDialog.data.loggedIn = true;
                            load();
                            $scope.loginDialog.fnClose();
                        } else {
                            $ionicPopup.alert({
                                title: 'Unable to login!',
                                template: 'Wrong password or username!'
                              });
                              return false;
                        }
                    });
                };
                
                dialog.fnLogout = function () {
                    SALogin.logout(function () {
                        $rootScope.authenticated = SALogin.isLoggedIn();
                        $state.go('app.browse',{},{reload: true});
                    });
                };
            }
            
            function setupSaveAppDialog() {
                $scope.saveAppDialog = {};
                
                $ionicModal.fromTemplateUrl('templates/save_app.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.saveAppDialog.modal = modal;
                });

                var dialog = $scope.saveAppDialog;
                dialog.data = null;
                
                // Triggered in the app modal to close it
                dialog.fnClose = function () {
                    this.modal.hide();
                };
                
                // Open the add app dialog
                dialog.fnShowAdd = function () {
                    this.data = {};
                    this.modal.show();
                };
                
                // Open the edit app dialog
                dialog.fnShowEdit = function (field) {
                    this.data = field;
                    this.modal.show();
                };
                
                // Perform the save action when the user submits the app form
                dialog.fnSubmit = function () {
                    $ionicPopup.alert({
                        title: 'Unable to save!',
                        template: 'Check whether the app name is already in use'
                      });
                    this.fnClose();
                    var callback = {};
                    callback.func = function (result) {
                        load();
                    };
                    callback.fnError = function (data) {
                        $ionicPopup.alert({
                            title: 'Unable to save!',
                            template: 'Check whether the app name is already in use'
                          });
                    };
                    SAApps.save(this.data, callback);
                };
            }
            
            function setupConfirmDeleteAppPopup() {
                $scope.confirmDeleteAppPopup = {};
                var popup = $scope.confirmDeleteAppPopup;
                popup.data = null;
                popup.modal = null;
                popup.fnShow = function (app) {
                    this.data = app;
                    this.modal = $ionicPopup.confirm({
                        title: 'Delete App',
                        template: 'Are you sure you want to delete the record: ' + app.id + '?'
                    });
                    this.modal.then(function (res) {
                        if (res) {
                            SAApps.delete($scope.confirmDeleteAppPopup.data, function () {
                                load();
                            });
                        }
                    });
                };
            }
            
            //loading the apps
            function load() {
                if ($rootScope.authenticated) {
                    SAUsers.getUserByUsername($rootScope.username,function (data) {
                        $rootScope.user_id = data.id;
                    });
                    SAApps.query(function (recs) {
                        $scope.sa_apps = recs;
                    });
                }
            };
            
            setupLoginDialog();
            setupSaveAppDialog();
            setupConfirmDeleteAppPopup();
            
            $rootScope.authenticated = SALogin.isLoggedIn();
            $rootScope.username = SALogin.getUsername();
            
            load();
        })
        .controller('SettingsCtrl', function ($scope, $ionicModal, $ionicPopup,SAUsers) {
            function setupSaveUserDialog() {
                $scope.saveUserDialog = {};
                
                $ionicModal.fromTemplateUrl('templates/save_user.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.saveUserDialog.modal = modal;
                });

                var dialog = $scope.saveUserDialog;
                dialog.data = null;
                
                // Triggered in the user modal to close it
                dialog.fnClose = function () {
                    this.modal.hide();
                };
                
                // Open the add user dialog
                dialog.fnShow = function () {
                    dialog.data = {};
                    dialog.modal.show();
                };
                
                // Perform the save action when the user submits the user form
                dialog.fnSubmit = function () {
                    if ((!dialog.data.username || dialog.data.username.trim()=='') || (!dialog.data.password || dialog.data.password.trim()=='')) {
                        $ionicPopup.alert({
                            title: 'Unable to save!',
                            template: 'Please enter a username and a password'
                          });
                          return false;
                    };
                    var callback = {};
                    callback.func = function () {
                        $scope.saveUserDialog.fnClose();
                        load();
                    };
                    callback.fnError = function (data) {
                        $ionicPopup.alert({
                            title: 'Unable to save!',
                            template: 'Check whether the user name is already in use'
                          });
                        return false;
                    };
                    SAUsers.save(this.data, callback);
                };
            }
            
            //loading the users
            function load() {
                SAUsers.query(function (recs) {
                    $scope.sa_users = recs;
                });
            }
            
            setupSaveUserDialog();
            load();
        })
        .controller('SAUsersCtrl', function ($ionicModal, $ionicPopup, $state, $scope, $stateParams, SAUsers, SAApps, SARoles) {
            if (typeof $stateParams.userId === 'undefined') {
                console.log('getting no id ');
                return;
            }
            
            function setupUserForm() {
                $scope.userForm = {
                    internal: {},
                    data: {}
                };
                var form = $scope.userForm;
                
                form.data.app_role_map = {}; //maps app to assigned role
                form.data.roles_by_app_map = {}; //maps app to list of roles
                form.data.sa_user = null;
                form.data.sa_apps = null;
                form.data.default_username = null;
                form.data.default_user_selected = null;
                
                form.internal.fnRefreshRole = function(app_id,user_id) {
                    var fnAppUserCB = {};
                    fnAppUserCB.app_id = app_id;
                    fnAppUserCB.user_id = user_id;
                    fnAppUserCB.func = function (appUser,appId,userId) {
                        if (appUser) {
                            console.log(appUser.id);
                            $scope.userForm.data.app_role_map[appId].original = appUser.role.id;
                            $scope.userForm.data.app_role_map[appId].select = appUser.role.id;
                            $scope.userForm.data.app_role_map[appId].changed = false;
                        };
                    };
                    SAUsers.getAppUser(fnAppUserCB.app_id,fnAppUserCB.user_id, fnAppUserCB);
                };
                
                form.internal.fnLoadApps = function() {
                    SAApps.query(function (recs) {
                        $scope.userForm.data.sa_apps = recs;
                        for (var sa_app_index in $scope.userForm.data.sa_apps) {
                            var sa_app = $scope.userForm.data.sa_apps[sa_app_index];
                            var cbObject = {};
                            cbObject.app_id = sa_app.id;
                            cbObject.func = function(sa_app_roles) {
                                $scope.userForm.data.roles_by_app_map[this.app_id]= sa_app_roles;
                            };
                            SARoles.findByApp(sa_app.id,cbObject);

                            var selection = {};
                            selection.select = null;
                            selection.original = null;
                            selection.changed = false;
                            $scope.userForm.data.app_role_map[sa_app.id] = selection;
                            $scope.userForm.internal.fnRefreshRole(sa_app.id,$stateParams.userId);
                        };
                    });
                };
                
                form.fnLoad = function() {
                    SAUsers.get($stateParams.userId, function (rec) {
                        $scope.userForm.data.sa_user = rec;
                        SAUsers.getDefaultUsername(function (data) {
                            $scope.userForm.data.default_username = data;
                            $scope.userForm.data.default_user_selected = ($scope.userForm.data.default_username==$scope.userForm.data.sa_user.username);
                        });
                        $scope.userForm.internal.fnLoadApps();
                    });
                };
                
                form.fnRoleChanged = function (app_id) {
                    this.data.app_role_map[app_id].changed = true;
                };
                
                form.fnUpdateRoleChange = function (app_id) {
                    if (this.data.app_role_map[app_id].select === this.data.app_role_map[app_id].original) {
                        this.data.app_role_map[app_id].changed = false;
                    } else {
                        var user_id = $stateParams.userId;
                        var role_id = this.data.app_role_map[app_id].select;
                        if (role_id)
                            SAUsers.saveAppUser(app_id,user_id,role_id,function (res) {
                                $scope.userForm.internal.fnRefreshRole(app_id,user_id);
                            });
                        else
                            SAUsers.removeAppUser(app_id,user_id,function (res) {
                                var selection = {};
                                selection.select = null;
                                selection.original = null;
                                selection.changed = false;
                                $scope.userForm.data.app_role_map[app_id] = selection;
                                $scope.userForm.internal.fnRefreshRole(app_id,user_id);
                            });
                    }
                };
                
                form.fnCancelRoleChange = function (app_id) {
                    this.data.app_role_map[app_id].select = this.data.app_role_map[app_id].original;
                    this.data.app_role_map[app_id].changed = false;
                };
            }
            
            function setupChangePasswordDialog() {
                $scope.changePasswordDialog = {};

                $ionicModal.fromTemplateUrl('templates/change_password.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.changePasswordDialog.modal = modal;
                });

                var dialog = $scope.changePasswordDialog;
                dialog.data = null;

                // Triggered in the change password modal to close it
                dialog.fnClose = function () {
                    this.modal.hide();
                };

                // Open the change password dialog
                dialog.fnShow = function () {
                    this.data = {};
                    this.data.username = $scope.userForm.data.sa_user.username;
                    this.data.userId = $scope.userForm.data.sa_user.id;
                    this.data.message = '';
                    this.modal.show();
                };
                
                // Perform the save action when the user submits the user form
                dialog.fnSubmit = function () {
                    var newPassword = this.data.newPassword;
                    var confirmPassword = this.data.confirmPassword;
                    if(!newPassword || newPassword.length<1) {
                        this.data.message = 'invalid password';
                        return;
                    } else if (newPassword != confirmPassword) {
                        this.data.message = 'passwords does not match';
                        return;
                    }
                    this.data.newPassword = '';
                    this.data.confirmPassword = '';
                    this.fnClose();
                    SAUsers.changePassword(this.data.userId,newPassword, function (data) {
                        if (data) {
                            $scope.changePasswordDialog.data.message = 'password changed';
                        }
                    });
                };
            }
            
            function setupConfirmDeleteUserPopup() {
                $scope.confirmDeleteUserPopup = {};
                var popup = $scope.confirmDeleteUserPopup;
                popup.modal = null;
                
                // Open the confirm delete item dialog
                popup.fnShow = function () {
                    this.modal = $ionicPopup.confirm({
                        title: 'Delete User',
                        template: 'Are you sure you want to delete the user: ' + $scope.userForm.data.sa_user.username + '?'
                    });
                    this.modal.then(function (res) {
                        if (res) {
                            console.log('You are sure');
                            SAUsers.removeUser($scope.userForm.data.sa_user.id, function (data) {
                                $state.transitionTo('app.settings',{},{ reload: true });
                            });
                        } else {
                            console.log('You are not sure');
                        }
                    });
                };
            }
            
            setupUserForm();
            setupChangePasswordDialog();
            setupConfirmDeleteUserPopup();
            
            $scope.userForm.fnLoad();
        })
        .controller('SAItemsCtrl', function ($scope, $rootScope, $ionicModal, $ionicPopup, $timeout, $stateParams,
                                            SAItems, SAFields, SARecords, SAValues,SAPermissions,SAUsers) {
            if (typeof $stateParams.itemId === 'undefined') {
                console.log('getting no id ');
                return;
            }
            
            var loadItem = function() {
                console.log('loadItem function');
                SAItems.get($stateParams.itemId, function (rec) {
                    $scope.sa_item = rec;
                    SAItems.byUrl(rec._links.app.href, function (app) {
                        SAUsers.getAppUser(app.id,$rootScope.user_id,function(data,app_id,user_id) {
                            $scope.current_userinfo.appuser = data;
                            $scope.current_userinfo.active_app_id = app.id;
                            if (data) {
                                $scope.current_userinfo.assigned = true;
                                if($scope.current_userinfo.appuser.role.allItemsAllowed) {
                                    $scope.current_userinfo.permission = {
                                        accessAllowed: true,
                                        createAllowed: true,
                                        editAllowed: true,
                                        deleteAllowed: true
                                    };
                                } else {
                                    SAPermissions.findByRoleAndItem($scope.current_userinfo.appuser.role.id,$stateParams.itemId, function(res) {
                                        $scope.current_userinfo.permission = res;
                                    });
                                }
                            }
                        });

                        SAItems.findByApp(app.id, function (recs) {
                            $scope.sa_app_items = recs;
                        });
                    });
                });
            };
            var loadRecords = function() {
                console.log('loadRecords function');
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
                        $scope.recordLabels = {};
                        for (var sa_record_no in $scope.sa_item_records) {
                            var sa_record = $scope.sa_item_records[sa_record_no];
                            $scope.recordIds[sa_record.id] = sa_record;
                            var fnCallback = {};
                            fnCallback.record_id = sa_record.id;
                            fnCallback.func = function(label) {
                                $scope.recordLabels[this.record_id] = label;
                            };
                            SARecords.formatRecord(sa_record.id,$scope.sa_item.template,fnCallback);
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
                                        if (record_field_value) {
                                            if ($scope.fieldIds[field_id].type=='date') {
                                                record_field_value.content = new Date(record_field_value.content);
                                            };
                                            $scope.recordIds[record_id].fieldValues[field_id] = record_field_value;
                                        }
                                    }
                                });
                            };
                        };
                    });
                });
            };
            var load = function () {
                console.log('load');
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

            function setupSaveFieldDialog() {
                $scope.saveFieldDialog = {
                    internal: {},
                    data: {},
                    modal: null
                };
                
                var dialog = $scope.saveFieldDialog;
                
                // Create the field modal that we will use later
                $ionicModal.fromTemplateUrl('templates/save_field.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.saveFieldDialog.modal = modal;
                });
                
                // Form data for the field modal
                dialog.internal.fnResetFieldData = function() {
                    console.log('saveFieldDialog.internal.fnResetFieldData function');
                    dialog.data.newOption = {};
                    dialog.data.fieldData = {};
                    dialog.data.formatData = {};
                    dialog.data.formatData['min'] = 0;
                    dialog.data.formatData['max'] = 10;
                    dialog.data.fieldTypePage = "";
                    dialog.data.newOption.text = '';
                    dialog.data.newOption.adding = false;
                    dialog.data.addNewOptionText = false;
                    dialog.data.reference_item_fields = {};
                    dialog.data.reference_item_fields_by_id = {};
                };
                
                
                dialog.fnLabelChanged = function() {
                    var label = dialog.data.fieldData.label;
                    if(!(dialog.data.fieldData.id) && label && label.length>0) {
                        dialog.data.fieldData.name = label.toLowerCase().replace(new RegExp(' ','g'),'_');
                    };
                };
                
                dialog.fnFieldTypeCheck = function () {
                    console.log('saveFieldDialog.fnFieldTypeCheck function');
                    if (dialog.data.fieldData.type === 'item') {
                        dialog.data.fieldTypePage = 'templates/field_types/item.html';
                    } else {
                        dialog.data.fieldTypePage = '';
                    }
                };
                
                dialog.fnItemReferenceSelected = function () {
                    console.log('saveFieldDialog.fnItemReferenceSelected function');
                    if (dialog.data.formatData['refer']) {
                        dialog.data.formatData['refer'] = Number(dialog.data.formatData['refer']);
                        dialog.data.reference_item_fields_by_id = {};
                        SAFields.findByItem(dialog.data.formatData['refer'], function (recs) {
                            var all_ref_item_fields = [];
                            for (var i in recs) {
                                var sa_item_field = recs[i];
                                if (sa_item_field.type!='item' && sa_item_field.type!='period') {
                                    all_ref_item_fields.push(sa_item_field);
                                }
                            }
                            $scope.saveFieldDialog.data.reference_item_fields = all_ref_item_fields;
                            for (var refItemFieldNo in all_ref_item_fields) {
                                var refItemField = all_ref_item_fields[refItemFieldNo];
                                $scope.saveFieldDialog.data.reference_item_fields_by_id[refItemField.id] = refItemField;
                            }
                        });
                        if(dialog.data.formatData['field'])
                            dialog.data.formatData['field'] = Number(dialog.data.formatData['field']);
                        if(dialog.data.formatData['field2'])
                            dialog.data.formatData['field2'] = Number(dialog.data.formatData['field2']);
                        if(dialog.data.formatData['field3'])
                            dialog.data.formatData['field3'] = Number(dialog.data.formatData['field3']);
                    } else {
                        dialog.data.reference_item_fields = {};
                        dialog.data.reference_item_fields_by_id = {};

                        dialog.data.formatData['field'] = '';
                        dialog.data.formatData['field2'] = '';
                        dialog.data.formatData['field3'] = '';
                        dialog.data.formatData['template'] = '';
                    }
                };
                
                dialog.fnFieldReferenceSelected = function () {
                    console.log('saveFieldDialog.fnFieldReferenceSelected function');
                    var template = '';
                    if (dialog.data.formatData['field']) {
                        var f_id = Number(dialog.data.formatData['field']);
                        template = template.concat('{',dialog.data.reference_item_fields_by_id[f_id].name,'}');
                        if (dialog.data.formatData['field2']) {
                            var f_id = Number(dialog.data.formatData['field2']);
                            if(template.length>0) template = template.concat(' ');
                            template = template.concat('{',dialog.data.reference_item_fields_by_id[f_id].name,'}');
                            if (dialog.data.formatData['field3']) {
                                var f_id = Number(dialog.data.formatData['field3']);
                                if(template.length>0) template = template.concat(' ');
                                template = template.concat('{',dialog.data.reference_item_fields_by_id[f_id].name,'}');
                            };
                        };
                    };
                    dialog.data.formatData['template'] = template;
                };
                
                dialog.fnAddNewOption = function() {
                    console.log('saveFieldDialog.fnAddNewOption function');
                    if (dialog.data.newOption.adding) {
                        var options = dialog.data.formatData['options'];
                        if (!options) options='';
                        if (dialog.data.newOption.text.length>0) {
                            if (options.length>0) options = options.concat(', ');
                            options = options.concat(dialog.data.newOption.text);
                            dialog.data.formatData['options'] = options;
                        }
                    }
                    dialog.data.newOption.text = '';
                    dialog.data.newOption.adding = false;
                };
                
                dialog.fnClearOptions = function() {
                    console.log('saveFieldDialog.fnClearOptions function');
                    if (dialog.data.newOption.clearing) {
                        dialog.data.formatData['options'] = '';
                        dialog.data.newOption.text = '';
                        dialog.data.newOption.clearing = false;
                    }
                };
                
                // Triggered in the field modal to close it
                dialog.fnClose = function () {
                    console.log('saveFieldDialog.fnClose function');
                    this.modal.hide();
                };
                
                // Open the add field dialog
                dialog.fnShowAdd = function () {
                    console.log('saveFieldDialog.fnShowAdd function');
                    this.internal.fnResetFieldData();
                    this.modal.show();
                };
                
                // Open the edit field dialog
                dialog.fnShowEdit = function (fieldRec) {
                    console.log('saveFieldDialog.fnShowEdit function');
                    this.internal.fnResetFieldData();
                    SAFields.get(fieldRec.id, function (field) {
                        $scope.saveFieldDialog.data.fieldData = field;
                        var formatData = JSON.parse(field.format);
                        if(formatData)
                            $scope.saveFieldDialog.data.formatData = formatData;
                        $scope.saveFieldDialog.fnFieldTypeCheck();
                        $scope.saveFieldDialog.fnItemReferenceSelected();
                        $scope.saveFieldDialog.modal.show();
                    });
                };
                
                // Perform the save action when the user submits the field form
                dialog.fnSubmit = function () {
                    console.log('saveFieldDialog.fnSubmit function');
                    this.fnClose();
                    var field = this.data.fieldData;
                    field.item = $scope.sa_item._links.self.href;

                    field.format = JSON.stringify(this.data.formatData);
                    console.log(field.format);
                    var callback = {};
                    callback.func = function () {
                        loadRecords();
                    };
                    callback.fnError = function (data) {
                        $ionicPopup.alert({
                            title: 'Unable to save!',
                            template: 'Check whether the field name is already in use'
                          });
                    };
                    SAFields.save(field, callback);

                    console.log('Added field', field);
                };
                
                dialog.initialize = function() {
                    console.log('saveFieldDialog.initialize function');
                    this.internal.fnResetFieldData();
                };
                
                dialog.initialize();
            }
            setupSaveFieldDialog();
            
//            $scope.saveFieldDialog.fnFieldTypeCheck();
//            $scope.saveFieldDialog.fnItemReferenceSelected();
            
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

            function setupChangeItemTemplateDialog() {
                $scope.changeItemTemplateDialog = {};
                $ionicModal.fromTemplateUrl('templates/change_item_template.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.changeItemTemplateDialog.modal = modal;
                });

                var dialog = $scope.changeItemTemplateDialog;
                dialog.data = null;

                // Close change item template dialog
                dialog.fnClose = function () {
                    this.modal.hide();
                };

                // Open change item template dialog
                dialog.fnShow = function () {
                    this.data = {};
                    this.data.message = '';
                    this.data.template = $scope.sa_item.template;
                    this.data.newField = '';
                    this.data.fields = [];
                    for (var i in $scope.sa_item_fields) {
                        var sa_item_field = $scope.sa_item_fields[i];
                        if (sa_item_field.type!='item' && sa_item_field.type!='period') {
                            this.data.fields.push(sa_item_field);
                        }
                    }
                    this.modal.show();
                };

                dialog.fnClear = function () {
                    this.data.template = '';
                };

                dialog.fnNewFieldOnChange = function() {
                    if(!this.data.template) this.data.template = '';
                    if(this.data.template!='') this.data.template = this.data.template.concat(' ');
                    this.data.template = this.data.template.concat('{',this.data.newField.name,'}');
                };

                dialog.fnSubmit = function () {
                    this.modal.hide();
                    var params = {
                        item_id: $scope.sa_item.id,
                        template: this.data.template,
                        fnCallback: function(result) {
                            load();
                        }
                    };
                    SAItems.updateTemplate(params);
                };
            }
            setupChangeItemTemplateDialog();

            function setupSaveRecordDialog() {
                $scope.saveRecordDialog = {};
                $ionicModal.fromTemplateUrl('templates/save_record.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.saveRecordDialog.modal = modal;
                });

                var dialog = $scope.saveRecordDialog;
                dialog.data = {
                    recordData: {},
                    fieldValues: {},
                    periodValues: {},
                    optionsDbA: {},
                    optionsDbB: {},
                    selectionArrays: {}
                };
                
                // Triggered in the record modal to close it
                dialog.fnClose = function () {
                    dialog.modal.hide();
                };
                
                // Open the add record dialog
                dialog.fnShowAdd = function () {
                    dialog.data.recordData = {
                        fieldValues: {}
                    };
                    dialog.data.selectionArrays = {};
                    dialog.data.mulitAllowed = {};
                    for(var saItemFieldNo in $scope.sa_item_fields) {
                        var saItemField = $scope.sa_item_fields[saItemFieldNo];
                        dialog.data.recordData.fieldValues[saItemField.id] = {
                            content: ""
                        };
                        if(saItemField.type=='period') {
                            var range = {};
                            range.isRange = true;
                            range.dateDbA =  moment();
                            range.dateDbB =  moment();
                            dialog.data.periodValues[saItemField.id] = range;
                        } else if(saItemField.type=='selection') {
                            var fieldData = $scope.fieldFormats[saItemField.id];
                            dialog.data.mulitAllowed[saItemField.id] = ((fieldData['multiple']) ? true : false);
                        }
                    }
                    loadFieldItems();
                    dialog.modal.show();
                };

                // Open the edit record dialog
                dialog.fnShowEdit = function (record) {
                    dialog.data.recordData = record;
                    dialog.data.selectionArrays = {};
                    dialog.data.mulitAllowed = {};
                    //loadFieldItems();
                    for(var saItemFieldNo in $scope.sa_item_fields) {
                        var saItemField = $scope.sa_item_fields[saItemFieldNo];
                        if (saItemField.type=='number') {
                            if (dialog.data.recordData.fieldValues[saItemField.id].content) {
                                var strnum = dialog.data.recordData.fieldValues[saItemField.id].content;
                                dialog.data.recordData.fieldValues[saItemField.id].content = Number(strnum.trim());
                            }
                        } else if (saItemField.type=='item') {
                            var recId = Number(dialog.data.recordData.fieldValues[saItemField.id].content);
                            if (recId)
                                dialog.data.recordData.fieldValues[saItemField.id].content = ($scope.reference_values_by_id[saItemField.id])[recId].id;
                        } else if(saItemField.type=='period') {
                            var range = {};
                            range.isRange = true;
                            if(dialog.data.recordData.fieldValues[saItemField.id].content) {
                                var res = dialog.data.recordData.fieldValues[saItemField.id].content.split("|");
                                range.dateDbA= moment(res[0],"MM-DD-YYYY");
                                range.dateDbB= moment(res[1],"MM-DD-YYYY");
                            } else {
                                range.dateDbA =  moment();
                                range.dateDbB =  moment();
                            }
                            dialog.data.periodValues[saItemField.id] = range;
                        } else if(saItemField.type=='selection') {
                            var fieldData = $scope.fieldFormats[saItemField.id];
                            dialog.data.mulitAllowed[saItemField.id] = (fieldData['multiple']) ? true : false;
                            if(dialog.data.recordData.fieldValues[saItemField.id].content) {
                                if(dialog.data.mulitAllowed[saItemField.id])
                                    dialog.data.selectionArrays[saItemField.id] = dialog.data.recordData.fieldValues[saItemField.id].content.split(",");
                                else
                                    dialog.data.selectionArrays[saItemField.id] = dialog.data.recordData.fieldValues[saItemField.id].content;
                            };
                        }
                    }
                    dialog.modal.show();
                };
                
                // Perform the save action when the user submits the record form
                dialog.fnSubmit = function () {
                    dialog.fnClose();
                    var record = dialog.data.recordData;
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
                                    if(dialog.data.selectionArrays[sa_field_rec.id]) {
                                        if (Array.isArray(dialog.data.selectionArrays[sa_field_rec.id]))
                                            record.fieldValues[sa_field_rec.id].content = dialog.data.selectionArrays[sa_field_rec.id].join();
                                        else
                                            record.fieldValues[sa_field_rec.id].content = dialog.data.selectionArrays[sa_field_rec.id];
                                    }
                                } else {
                                    record.fieldValues[sa_field_rec.id].content = dialog.data.selectionArrays[sa_field_rec.id];
                                }
                            } else if (sa_field_rec.type=='period') {
                                var range = dialog.data.periodValues[sa_field_rec.id];
                                if (range) {
                                    record.fieldValues[sa_field_rec.id].content = ''.concat(range.dateDbA.format("MM-DD-YYYY"),'|',range.dateDbB.format("MM-DD-YYYY"));
                                } else {
                                    record.fieldValues[sa_field_rec.id].content = '';
                                }
                            }

                            if(record.fieldValues[sa_field_rec.id].content) {
                                if (Array.isArray(record.fieldValues[sa_field_rec.id].content)) {
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
            setupSaveRecordDialog();

            function loadFieldItems() {
                console.log('loadFieldItems function');
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
                        var itemCallback = {};
                        itemCallback.field_id = field_id;
                        itemCallback.func =function(field_item) {
                            var callback = {};
                            callback.fieldId = this.field_id;
                            callback.defaultTemplate = field_item.template;
                            callback.func = function(rec_list) {
                                var recordDisplayList = rec_list;
                                $scope.reference_values[this.fieldId] = recordDisplayList;
                                var fieldDataRef = $scope.fieldFormats[this.fieldId];
                                var template = fieldDataRef['template'];
                                if (!template || template.trim()=='') {
                                    template = this.defaultTemplate;
                                };
                                for (var rec_no in recordDisplayList) {
                                    var rec = recordDisplayList[rec_no];
                                    if (!template || template.trim()=='') {
                                        rec.label = rec.id;
                                    } else {
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
                                }
                                var recordDisplayListById = {};
                                for (var rec_no in recordDisplayList) {
                                    var rec = recordDisplayList[rec_no];
                                    recordDisplayListById[rec.id]=rec;
                                }
                                $scope.reference_values_by_id[this.fieldId] = recordDisplayListById;
                            };
                            SARecords.findByItem(field_item.id,callback);
                        };
                        SAItems.get(itemId,itemCallback);
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

            $scope.formatRange = function (rangeContent,format,part) {
                if (!rangeContent) return '';
                var range;
                if (rangeContent.isRange) {
                    range = rangeContent;
                } else {
                    range = {};
                    range.isRange = true;
                    var res = rangeContent.split("|");
                    range.dateDbA= moment(res[0],"MM-DD-YYYY");
                    range.dateDbB= moment(res[1],"MM-DD-YYYY");
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
                        for (var sa_app_item_index in recs) {
                            var sa_app_item = recs[sa_app_item_index];
                            //get permission
                            if ($scope.current_userinfo.appuser) {
                                if ($scope.current_userinfo.appuser.role.allItemsAllowed) {
                                    $scope.allowed_sa_app_items[sa_app_item.id] = sa_app_item;
                                } else {
                                    var callback = {};
                                    callback.item = sa_app_item;
                                    callback.func = function(res) {
                                        if(res && res.accessAllowed) {
                                            $scope.allowed_sa_app_items[this.item.id] = this.item;
                                        }
                                    };
                                    SAPermissions.findByRoleAndItem($scope.current_userinfo.appuser.role.id,sa_app_item.id, callback);
                                }
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
                    var callback = {};
                    callback.func =function (data) {
                        loadItems();
                    };
                    callback.fnError = function (data) {
                        $ionicPopup.alert({
                            title: 'Unable to save!',
                            template: 'Check whether the item name is already in use'
                          });
                    };
                    SAItems.save(item, callback);
                    console.log('Saved item', item);
                };
                
                $scope.labelChanged = function() {
                    var label = $scope.itemData.label;
                    if(!($scope.itemData.id) && label && label.length>0) {
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
                    var callback = {};
                    callback.func = function () {
                        loadRoles();
                    };
                    callback.fnError = function (data) {
                        $ionicPopup.alert({
                            title: 'Unable to save!',
                            template: 'Check whether the role name is already in use'
                          });
                    };
                    SARoles.save(role, callback);
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
                $scope.subSource = "api/generate/"+$scope.lang+"/"+$stateParams.appId+"/file/"+file_name;
            };
        });
