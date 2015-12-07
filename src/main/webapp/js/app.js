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

// SimpleApps
// 'appsoluna.simpleapps.controllers' is found in controllers.js
angular.module('appsoluna.simpleapps', ['ionic', 'appsoluna.simpleapps.controllers'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
  .state('app.live_item', {
    url: "/live_item/:itemId",
    views: {
      'menuContent': {
        templateUrl: "templates/live_item.html",
        controller: 'SAItemsCtrl'
      }
    }
  })
  .state('app.live', {
    url: "/live/:appId",
    views: {
      'menuContent': {
        templateUrl: "templates/live.html",
        controller: 'SAAppsCtrl'
      }
    }
  })
  .state('app.sa_app', {
    url: "/sa_app/:appId",
    views: {
      'menuContent': {
        templateUrl: "templates/sa_apps_single.html",
        controller: 'SAAppsCtrl'
      }
    }
  })
  .state('app.sa_user', {
    url: "/sa_user/:userId",
    views: {
      'menuContent': {
        templateUrl: "templates/sa_users_single.html",
        controller: 'SAUsersCtrl'
      }
    }
  })
  .state('app.sa_item', {
    url: "/sa_item/:itemId",
    views: {
      'menuContent': {
        templateUrl: "templates/sa_items_single.html",
        controller: 'SAItemsCtrl'
      }
    }
  })
  .state('app.sa_role', {
    url: "/sa_role/:roleId",
    views: {
      'menuContent': {
        templateUrl: "templates/sa_roles_single.html",
        controller: 'SARolesCtrl'
      }
    }
  })
  .state('app.browse', {
    url: "/browse",
    views: {
        'menuContent': {
          templateUrl: "templates/browse.html",
          controller: 'AppCtrl'
      }
    }
  })
  .state('app.settings', {
    url: "/settings",
    views: {
        'menuContent': {
          templateUrl: "templates/settings.html",
          controller: 'SettingsCtrl'
      }
    }
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/browse');
});