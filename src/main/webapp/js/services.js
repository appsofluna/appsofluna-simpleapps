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

function hateoasFac($http, name) {
    var HATEOAS_URL = "/api/" + name;
    var fac = {};
    fac.facUrl = HATEOAS_URL;
    fac.facName = name;
    fac.query = function (callback) {
        $http.get(HATEOAS_URL).success(function (data) {
            callback && callback(data._embedded && data._embedded[name]);
        });
    };
    fac.byUrl = function (by_url, callback) {
        $http.get(by_url).success(function (data) {
            callback && callback(data);
        });
    };
    fac.get = function (recId, callback) {
        $http.get(HATEOAS_URL + '/' + recId).success(function (data) {
            data.id = recId;
            callback && callback(data);
        });
    };

    fac.save = function (rec, callback) {
        var fnCallback = function (res) {
            if (callback) {
                if (callback.func)
                    callback.func(res);
                else
                    callback(res);
            }
        };
        if (!rec._links) {
            $http.post(HATEOAS_URL, rec).then(fnCallback, fnCallback);
        } else {
            $http.patch(rec._links.self.href, rec).then(fnCallback, fnCallback);
        }
    };
    fac.delete = function (rec, callback) {
        var fnCallback = function (res) {
            callback && callback(res.data);
        };
        $http.delete(HATEOAS_URL + '/' + rec.id).then(fnCallback, fnCallback);
    };
    return fac;
}

angular.module('appsoluna.simpleapps.services', ['ngResource', 'ngStorage','spring-data-rest'])
        .factory('SAApps', ['$http', function ($http) {
                return hateoasFac($http, 'app');
            }])
        .factory('SAItems', ['$http', function ($http) {
                var fac = hateoasFac($http, 'item');
                fac.findByApp = function (app_id, callback) {
                    $http.get(fac.facUrl + '/search/findByApp?appId=' + app_id).success(function (data) {
                        callback && callback(data._embedded && data._embedded[fac.facName]);
                    });
                };
                return fac;
            }])
        .factory('SARoles', ['$http', function ($http) {
                var fac = hateoasFac($http, 'role');
                fac.findByApp = function (app_id, callback) {
                    $http.get(fac.facUrl + '/search/findByApp?appId=' + app_id).success(function (data) {
                        if (callback) {
                           if (callback.func) {
                               callback.func(data._embedded && data._embedded[fac.facName],callback);
                           } else {
                               callback(data._embedded && data._embedded[fac.facName]);
                           }
                        }
                    });
                };
                fac.getApp = function (role_id,callback) {
                    $http.get(fac.facUrl + '/'+role_id+'/app').success(function (data) {
                        callback && callback(data);
                    });
                };
                fac.allowAllItems = function (role_id, enabled,callback) {
                    $http.get(fac.facUrl + '/'+role_id+'/allowAllItems?enabled='+(enabled ? 'true' : 'false')).success(function (data) {
                        callback && callback(data);
                    });
                };
                return fac;
            }])
        .factory('SAPermissions', ['$http', function ($http) {
                var fac = hateoasFac($http, 'permission');
                fac.findByRoleAndItem = function(role_id,item_id,callback) {
                    $http.get(fac.facUrl + '/search/findByRoleAndItem?roleId=' + role_id+'&itemId='+item_id).success(function (data) {
                        if (callback){
                            if (callback.func)
                                callback.func(data._embedded && data._embedded[fac.facName][0],role_id,item_id)
                            else
                                callback(data._embedded && data._embedded[fac.facName][0],role_id,item_id)
                        }
                    });
                };
                fac.save = function (rec, callback) {
                    var fnCallback = function (res) {
                        callback && callback(res);
                    };
                    $http.post(fac.facUrl + '/save', rec).then(fnCallback, fnCallback);
                };
                return fac;
            }])
        .factory('SAFields', ['$http', function ($http) {
                var fac = hateoasFac($http, 'field');
                fac.findByItem = function (item_id, callback) {
                    $http.get(fac.facUrl + '/search/findByItem?itemId=' + item_id).success(function (data) {
                        if(callback) {
                            if (callback.func) {
                                callback.func(data._embedded && data._embedded[fac.facName]);
                            } else {
                                callback(data._embedded && data._embedded[fac.facName]);
                            }
                        }
                    });
                };
                return fac;
            }])
        .factory('SARecords', ['$http', function ($http) {
                var fac = hateoasFac($http, 'record');
                fac.findByItem = function (item_id, callback) {
                    $http.get(fac.facUrl + '/search/findByItem?itemId=' + item_id).success(function (data) {
                        if(callback) {
                            if (callback.func) {
                                callback.func(data._embedded && data._embedded[fac.facName]);
                            } else {
                                callback(data._embedded && data._embedded[fac.facName]);
                            }
                        }
                    });
                };
                fac.formatRecord = function (record_id,format, callback) {
                    var cbS =function (data) {
                        if(callback) {
                            if (callback.func) {
                                callback.func(data);
                            } else {
                                callback(data);
                            }
                        }
                    };
                    $http.get(fac.facUrl + '/' + record_id + '/formatRecord?template=' + format).success(cbS);
                };
                return fac;
            }])
        .factory('SAValues', ['$http', function ($http) {
                var fac = hateoasFac($http, 'value');
                fac.findByRecordAndField = function(record_id,field_id,callback) {
                    $http.get(fac.facUrl + '/search/findByRecordAndField?recordId=' + record_id+'&fieldId='+field_id).success(function (data) {
                        callback && callback(data._embedded && data._embedded[fac.facName],record_id,field_id);
                    });
                };
                return fac;
            }])
        .factory('SAUsers', ['$http', function ($http) {
                var fac = hateoasFac($http, 'user');
                fac.getDefaultUsername = function(callback) {
                    $http.get(fac.facUrl + '/getDefaultUsername').success(function (data) {
                        if (callback)
                            callback(data);
                    });
                };
                fac.save = function (rec, callback) {
                    var fnCallback = function (res) {
                        callback && callback(res);
                    };
                    $http.post(fac.facUrl + '/save', rec).then(fnCallback, fnCallback);
                };
                
                fac.changePassword = function(user_id, password, callback) {
                    var fnCallback = function (data) {
                        if (callback) {
                            if (callback.func)
                                callback.func(data);
                            else
                                callback(data);
                        };
                    };
                    var stringModel = {};
                    stringModel.string = password;
                    $http.post(fac.facUrl + '/changePassword?userId='+user_id,stringModel).then(fnCallback, fnCallback);
                };
                fac.removeUser = function(user_id, callback) {
                    var fnCallback = function (data) {
                        if (callback) {
                            if (callback.func)
                                callback.func(data);
                            else
                                callback(data);
                        };
                    };
                    $http.post(fac.facUrl + '/removeUser?userId='+user_id,null).then(fnCallback, fnCallback);
                };
                fac.getUserByUsername = function (username, callback) {
                    $http.get(fac.facUrl + '/search/findByUsername?username='+username).success(function (data) {
                        if (callback)
                            callback(data._embedded && data._embedded[fac.facName][0]);
                    });
                };
                fac.getAppUser = function(app_id,user_id,callback) {
                    $http.get(fac.facUrl + '/findAppUser?appId='+app_id+'&userId='+user_id).success(function (data) {
                        if (callback) {
                            if (callback.func) callback = callback.func;
                            callback(data,app_id,user_id);
                        }
                    });
                };
                fac.saveAppUser = function (app_id,user_id,role_id, callback) {
                    var fnCallback = function (res) {
                        if (callback) {
                            if (callback.func)
                                callback.func(res);
                            else
                                callback(res);
                        }
                    };
                    $http.post(fac.facUrl + '/saveAppUser?appId='+app_id+'&userId='+user_id+'&roleId='+role_id,null).then(fnCallback, fnCallback);
                };
                fac.removeAppUser = function (app_id,user_id, callback) {
                    var fnCallback = function (res) {
                        if (callback) {
                            if (callback.func)
                                callback.func(res);
                            else
                                callback(res);
                        }
                    };
                    $http.post(fac.facUrl + '/removeAppUser?appId='+app_id+'&userId='+user_id,null).then(fnCallback, fnCallback);
                };
                return fac;
            }])
        .factory("SALogin", ['$http', '$sessionStorage', function ($http, $sessionStorage ) {
                var fac = {};

                fac.login = function (userName, password, callback) {
                    var headers = {authorization: "Basic " + btoa(userName + ":" + password)};
                    $http.get('api', {headers: headers}).success(function (data) {
                        console.log("DT: " + data);
                        if (data._links) {
                            authenticated = true;
                        } else {
                            authenticated = false;
                        }
                        $sessionStorage.authStat = JSON.stringify(
                        {
                            authenticated: authenticated,
                            username: userName
                        });
                        callback && callback(authenticated);
                    }).error(function () {
                        authenticated = false;
                        $sessionStorage.authStat = JSON.stringify({authenticated: authenticated});
                        callback && callback(authenticated);
                    });
                };

                fac.isLoggedIn = function () {
                    if ($sessionStorage.authStat && (typeof $sessionStorage["authStat"] !== "undefined")) {
                        var authStat = JSON.parse($sessionStorage.authStat);
                        if (authStat) {
                            return authStat.authenticated;
                        } else {
                            return false;
                        };
                    } else {
                        return false;
                    }
                };
                
                fac.getUsername = function() {
                    if ($sessionStorage.authStat && (typeof $sessionStorage["authStat"] !== "undefined")) {
                        var authStat = JSON.parse($sessionStorage.authStat);
                        if (authStat) {
                            return authStat.username;
                        } else {
                            return null;
                        };
                    } else {
                        return null;
                    }
                };
                fac.logout = function(callback) {
                    delete $sessionStorage.authStat;
                    callback && callback();
                };

                return fac;
            }])
            .factory("SAGenerate", ['$http', function ($http) {
                var fac = {};
                fac.files = function (lang, recId,callback) {
                    $http.get("/api/generate/"+lang+"/"+recId+'/files').success(function (data) {
                        callback && callback(data);
                    });
                };
                return fac;
            }]);
