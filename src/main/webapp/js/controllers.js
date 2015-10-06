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

.controller('AppCtrl', function($scope, $ionicModal, $timeout,SAApps,SAUsers) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  //loading the apps
  $scope.sa_apps = SAApps.query();

  //loading the users
  $scope.sa_users = SAUsers.query();
})


.controller('SAUsersCtrl', function($scope, SAUsers) {
  console.log('getting users');
  $scope.sa_users = SAUsers.query();
})
.controller('SAUsersCtrl', function($scope, $stateParams, SAUsers) {
  if(typeof $stateParams.userId === 'undefined'){
    console.log('getting no id ');
    $scope.sa_users = SAUsers.query();
  } else {
    console.log('getting user');
    $scope.sa_user = SAUsers.get({userId: $stateParams.userId});
  }
})
.controller('SAItemsCtrl', function($scope, $ionicModal, $ionicPopup, $timeout, $stateParams, SAItems, SAFields, SARecords) {
  if(typeof $stateParams.itemId === 'undefined'){
    console.log('getting no id ');
    $scope.sa_items = SAItems.query();
  } else {
    console.log('getting item');
    $scope.sa_item = SAItems.get({itemId: $stateParams.itemId});
    $scope.sa_item_fields = SAFields.findByItem({itemId: $stateParams.itemId});
    $scope.sa_item_records = SARecords.findByItem({itemId: $stateParams.itemId});

    // Form data for the field modal
    $scope.fieldData = {};

    // Create the field modal that we will use later
    $ionicModal.fromTemplateUrl('templates/save_field.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.fieldModal = modal;
    });

    // Triggered in the field modal to close it
    $scope.closeSaveField = function() {
      $scope.fieldModal.hide();
    };

    // Open the add field dialog
    $scope.showAddFiled = function() {
      $scope.fieldData = {};
      $scope.fieldModal.show();
    };

    // Open the edit field dialog
    $scope.showEditFiled = function(field) {
      $scope.fieldData = field;
      $scope.fieldModal.show();
    };

    // Open the confirm delete field dialog
    $scope.showConfirmDeleteFiled = function(field) {
      $scope.fieldData = field;
      var confirmDeleteFieldPopup = $ionicPopup.confirm({
        title: 'Delete Field',
        template: 'Are you sure you want to delete the field: '+field.name+'?'
      });
      confirmDeleteFieldPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
          SAFields.deleteField($scope.fieldData);
          $scope.sa_item_fields = SAFields.findByItem({itemId: $stateParams.itemId});
        } else {
          console.log('You are not sure');
        }
      });
    };

    // Perform the save action when the user submits the field form
    $scope.saveField = function() {
      $scope.closeSaveField();
      var field = $scope.fieldData;
      field.item_id = $scope.sa_item.id;
      SAFields.saveField(field);

      $scope.sa_item_fields = SAFields.findByItem({itemId: $stateParams.itemId});
      console.log('Added field',field);
    };


    // Form data for the record modal
    $scope.recordData = {};
    $scope.recordData.fieldValues = {};

    // Create the record modal that we will use later
    $ionicModal.fromTemplateUrl('templates/save_record.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.recordModal = modal;
    });

    // Triggered in the record modal to close it
    $scope.closeSaveRecord = function() {
      $scope.recordModal.hide();
    };

    // Open the add record dialog
    $scope.showAddRecord = function() {
      $scope.recordData = {};
      $scope.recordModal.show();
    };

    // Open the edit record dialog
    $scope.showEditRecord = function(field) {
      $scope.recordData = field;
      $scope.recordModal.show();
    };

    // Open the confirm delete record dialog
    $scope.showConfirmDeleteRecord = function(record) {
      $scope.recordData = record;
      var confirmDeleteRecordPopup = $ionicPopup.confirm({
        title: 'Delete Record',
        template: 'Are you sure you want to delete the record: '+record.id+'?'
      });
      confirmDeleteRecordPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
          SARecords.deleteRecord($scope.recordData);
          $scope.sa_item_records = SARecords.findByItem({itemId: $stateParams.itemId});
        } else {
          console.log('You are not sure');
        }
      });
    };

    // Perform the save action when the user submits the record form
    $scope.saveRecord = function() {
      $scope.closeSaveRecord();
      var record = $scope.recordData;
      console.log('Saving record',record);
      record.item_id = $scope.sa_item.id;
      SARecords.saveRecord(record);

      $scope.sa_item_records = SARecords.findByItem({itemId: $stateParams.itemId});
      console.log('Saved record',record);
    };
  }
})

.controller('SAAppsCtrl', function($scope, SAApps) {
    console.log('getting apps');
    $scope.sa_apps = SAApps.query();
})
.controller('SAAppsCtrl', function($scope, $ionicModal, $stateParams, SAApps,SAItems) {
  if(typeof $stateParams.appId === 'undefined'){
    console.log('getting app no id ');
    $scope.sa_apps = SAApps.query();
  } else {
    console.log('getting app');
    $scope.sa_app = SAApps.get({appId: $stateParams.appId});
    $scope.sa_app_items = SAItems.findByApp({appId: $stateParams.appId});

    // Form data for the item modal
    $scope.itemData = {};

    // Create the item modal that we will use later
    $ionicModal.fromTemplateUrl('templates/save_item.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.itemModal = modal;
    });

    // Triggered in the item modal to close it
    $scope.closeSaveItem = function() {
      $scope.itemModal.hide();
    };

    // Open the add item dialog
    $scope.showAddItem = function() {
      $scope.itemData = {};
      $scope.itemModal.show();
    };

    // Open the edit item dialog
    $scope.showEditItem = function(field) {
      $scope.itemData = field;
      $scope.itemModal.show();
    };

    // Open the confirm delete item dialog
    $scope.showConfirmDeleteItem = function(item) {
      $scope.itemData = item;
      var confirmDeleteItemPopup = $ionicPopup.confirm({
        title: 'Delete Item',
        template: 'Are you sure you want to item the record: '+item.id+'?'
      });
      confirmDeleteRecordPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
          SAItems.deleteItem($scope.itemData);
          $scope.sa_app_items = SAItems.findByApp({appId: $stateParams.appId});
        } else {
          console.log('You are not sure');
        }
      });
    };

    // Perform the save action when the user submits the item form
    $scope.saveItem = function() {
      $scope.closeSaveItem();
      var item = $scope.itemData;
      console.log('Saving item',item);
      item.app_id = $scope.sa_app.id;
      SAItems.saveItem(item);

      $scope.sa_app_items = SAItems.findByApp({appId: $stateParams.appId});
      console.log('Saved item',item);
    };
  }
})
.controller('SessionsCtrl', function($scope, Session) {
    console.log('getting sids');
    $scope.sessions = Session.query();
})
.controller('SessionsCtrl', function($scope, $stateParams, Session) {
  if(typeof $stateParams.sessionId === 'undefined'){
    console.log('getting no sid ');
    $scope.sessions = Session.query();
  } else {
    console.log('getting sid '+$stateParams.sessionId);
    $scope.session = Session.get({sessionId: $stateParams.sessionId});
  }
});
