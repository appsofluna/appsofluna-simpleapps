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

function hateoasFac($http,name) {
    var HATEOAS_URL = "/api/" +name;
    var fac = {};
    fac.facUrl = HATEOAS_URL;
    fac.facName= name;
    fac.query = function(callback) {
      $http.get(HATEOAS_URL).success(function (data) {
          callback && callback(data._embedded && data._embedded[name]);
      });
    };
    fac.get = function(recId,callback) {
      $http.get(HATEOAS_URL+'/'+recId).success(function(data) {
          data.id = recId;
          callback && callback(data);
      });
    };
    
    fac.save = function(rec,callback) {
      var fnCallback = function(res) {
        callback && callback(res);
      };
      if (!rec._links) {
        $http.post(HATEOAS_URL,rec).then(fnCallback,fnCallback);
      } else {
        $http.patch(rec._links.self.href,rec).then(fnCallback,fnCallback);
      }
    };
    fac.delete = function(rec,callback) {
      var fnCallback = function (res) {
          callback && callback(res.data);
      };
      $http.delete(HATEOAS_URL+'/'+rec.id).then(fnCallback,fnCallback);
    };
    return fac;
}

angular.module('appsoluna.simpleapps.services', ['ngResource','spring-data-rest'])
.factory('SAApps', ['$http', function($http) {
    return hateoasFac($http,'app');
}])
.factory('SAItems', ['$http', function($http) {
    var fac = hateoasFac($http,'item');
    fac.findByApp = function(app_id,callback) {
      $http.get(fac.facUrl+'/search/findByApp?appId='+app_id).success(function (data) {
          callback && callback(data._embedded && data._embedded[fac.facName]);
      });
    };
    return fac;
}])
.factory('SARoles', ['$http', function($http) {
    var fac = hateoasFac($http,'role');
    fac.findByApp = function(app_id,callback) {
      $http.get(fac.facUrl+'/search/findByApp?appId='+app_id).success(function (data) {
          callback && callback(data._embedded && data._embedded[fac.facName]);
      });
    };
    return fac;
}])
.factory('SAFields', ['$http', function($http) {
    var fac = hateoasFac($http,'field');
    fac.findByItem = function(item_id,callback) {
      $http.get(fac.facUrl+'/search/findByItem?itemId='+item_id).success(function (data) {
          callback && callback(data._embedded && data._embedded[fac.facName]);
      });
    };
    return fac;
}])
.factory('SARecords', ['$http', function($http) {
    var fac = hateoasFac($http,'record');
    fac.findByItem = function(item_id,callback) {
      $http.get(fac.facUrl+'/search/findByItem?itemId='+item_id).success(function (data) {
          callback && callback(data._embedded && data._embedded[fac.facName]);
      });
    };
    return fac;
}])
.factory('SAValues', ['$http', function($http) {
    var fac = hateoasFac($http,'value');
    return fac;
}])
.factory('SAUsers', ['$http', function($http) {
    return hateoasFac($http,'user');
}])
.factory('SASessions', ['$http', function($http) {
    return hateoasFac($http,'session');
}]);
