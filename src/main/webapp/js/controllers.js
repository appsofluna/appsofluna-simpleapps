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
        .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopup, $timeout, SAApps, SAUsers) {
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

            // Perform the login action when the user submits the login form
            $scope.doLogin = function () {
                console.log('Doing login', $scope.loginData);
                
                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                $timeout(function () {
                    $scope.closeLogin();
                }, 1000);
            };

            //loading the apps
            SAApps.query(function (recs) {
                $scope.sa_apps = recs;
            });

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
                            SAApps.query(function (recs) {
                                $scope.sa_apps = recs;
                            });
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
                    SAApps.query(function (recs) {
                        $scope.sa_apps = recs;
                    });
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
                SAItems.get($stateParams.itemId, function (rec) {
                    $scope.sa_item = rec;
                });
                SAFields.findByItem($stateParams.itemId, function (recs) {
                    $scope.sa_item_fields = recs;
                });
                SARecords.findByItem($stateParams.itemId, function (recs) {
                    $scope.sa_item_records = recs;
                });

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
                $scope.showEditRecord = function (field) {
                    $scope.recordData = field;
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
                                SARecords.findByItem($stateParams.itemId, function (recs) {
                                    $scope.sa_item_records = recs;
                                });
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
                    record.status_no = -1;
                    SARecords.save(record, function (saved) {
                        var record_href = saved.headers('Location');
                        var lastCallback = function () {

                        };
                        for (sa_field_sec in $scope.sa_item_fields) {
                            var sa_field_rec = $scope.sa_item_fields[sa_field_sec];
                            var sa_record_val = {};
                            sa_record_val.field = sa_field_rec._links.self.href;
                            sa_record_val.content = record.fieldValues[sa_field_rec.id];
                            sa_record_val.record = record_href;
                            lastCallback = function () {
                                SAValues.save(sa_record_val, lastCallback);
                            };
                        }
                        lastCallback();

                        SARecords.findByItem($stateParams.itemId, function (recs) {
                            $scope.sa_item_records = recs;
                        });
                    });
                    console.log('Saved record', record);
                };
            }
        })

        .controller('SAAppsCtrl', function ($scope, $ionicModal, SAApps) {
            console.log('getting apps');
            SAApps.query(function (recs) {
                $scope.sa_apps = recs;
            });
        })
        .controller('SAAppsCtrl', function ($scope, $ionicModal, $ionicPopup, $stateParams, SAApps, SAItems) {
            if (typeof $stateParams.appId === 'undefined') {
                console.log('getting app no id ');
                SAApps.query(function (recs) {
                    $scope.sa_apps = recs;
                });
            } else {
                console.log('getting app');
                SAApps.get($stateParams.appId, function (data) {
                    $scope.sa_app = data;
                });
                SAItems.findByApp($stateParams.appId, function (recs) {
                    $scope.sa_app_items = recs;
                });

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
                $scope.showEditItem = function (field) {
                    $scope.itemData = field;
                    $scope.itemModal.show();
                };

                // Open the confirm delete item dialog
                $scope.showConfirmDeleteItem = function (item) {
                    $scope.itemData = item;
                    var confirmDeleteItemPopup = $ionicPopup.confirm({
                        title: 'Delete Item',
                        template: 'Are you sure you want to item the record: ' + item.id + '?'
                    });
                    confirmDeleteItemPopup.then(function (res) {
                        if (res) {
                            console.log('You are sure');
                            SAItems.delete($scope.itemData, function (data) {
                                SAItems.findByApp($stateParams.appId, function (recs) {
                                    $scope.sa_app_items = recs;
                                });
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
                        SAItems.findByApp($stateParams.appId, function (recs) {
                            $scope.sa_app_items = recs;
                        });
                    });
                    console.log('Saved item', item);
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
