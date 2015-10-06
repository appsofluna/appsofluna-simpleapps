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

angular.module('appsoluna.simpleapps.services', ['ngResource','hateoas'])
.factory('SAApps', function ($resource) {
    var fac = {};
    fac.records = [
      {"name" : "Photo Manager","id":0,"description":"Keep your memories neat"},
      {"name" : "Contact Box","id":1,"description":"Never miss a contact"},
      {"name" : "Account Master","id":2,"description":"Your account matters"}
    ];

    fac.query = function() {
      return fac.records;
    };
    fac.get = function(app) {
      return fac.records.filter( function(rec){return (rec.id==app.appId);} )[0];
    }
    return fac;
})
.factory('SAItems', function ($resource) {
    var fac = {};
    fac.records = [
      {"name" : "Photo","id":0,"app_id":0},
      {"name" : "Contact","id":1,"app_id":1},
      {"name" : "Address","id":2,"app_id":1}
    ];

    fac.query = function() {
      return fac.records;
    };
    fac.get = function(item) {
      return fac.records.filter( function(rec){return (rec.id==item.itemId);} )[0];
    }
    fac.findByApp = function(app) {
      return fac.records.filter( function(rec){return (rec.app_id==app.appId);} );
    }
    fac.saveItem = function(item) {
      if (!item.id) {
        var lastId = (fac.records.length>0) ? fac.records[fac.records.length-1].id : 0;
        item.id = lastId + 1;
        fac.records.push(item);
      } else {
        var loc = fac.records.indexOf(fac.get({itemId: item.id}));
        fac.records[loc] = item;
      }
      console.log(fac.records.length);
    }
    fac.deleteItem = function(item) {
      var loc = fac.records.indexOf(fac.get({itemId: item.id}));
      fac.records.splice(loc, 1);
      console.log(fac.records.length);
    }
    return fac;
})
.factory('SAFields', function ($resource) {
    var fac = {};
    console.log('reload field service');
    fac.records = [
      {"name" : "First Name","id":0,"item_id":1},
      {"name" : "Last Name","id":1,"item_id":1}
    ];

    fac.query = function() {
      return fac.records;
    };
    fac.get = function(field) {
      return fac.records.filter( function(rec){return (rec.id==field.fieldId);} )[0];
    }
    fac.findByItem = function(item) {
      console.log('getting item fields ' + fac.records.length);
      return fac.records.filter( function(rec){return (rec.item_id==item.itemId);} );
    }
    fac.saveField = function(field) {
      if (!field.id) {
        var lastId = (fac.records.length>0) ? fac.records[fac.records.length-1].id : 0;
        field.id = lastId + 1;
        fac.records.push(field);
      } else {
        var loc = fac.records.indexOf(fac.get({fieldId: field.id}));
        fac.records[loc] = field;
      }
      console.log(fac.records.length);
    }
    fac.deleteField = function(field) {
      var loc = fac.records.indexOf(fac.get({fieldId: field.id}));
      fac.records.splice(loc, 1);
      console.log(fac.records.length);
    }
    return fac;
})
.factory('SARecords', function ($resource) {
    var fac = {};
    console.log('reload record service');
    fac.records = [
      {"id":0,"item_id":1},
      {"id":1,"item_id":1},
      {"id":2,"item_id":1}
    ];

    fac.query = function() {
      return fac.records;
    };
    fac.get = function(record) {
      return fac.records.filter(function(rec){return (rec.id==record.recordId);} )[0];
    }
    fac.findByItem = function(item) {
      console.log('getting item records ' + fac.records.length);
      return fac.records.filter( function(rec){return (rec.item_id==item.itemId);} );
    }
    fac.saveRecord = function(record) {
      if (!record.id) {
        var lastId = (fac.records.length>0) ? fac.records[fac.records.length-1].id : 0;
        record.id = lastId + 1;
        fac.records.push(record);
      } else {
        var loc = fac.records.indexOf(fac.get({recordId: record.id}));
        fac.records[loc] = record;
      }
      console.log(fac.records.length);
    }
    fac.deleteRecord = function(record) {
      var loc = fac.records.indexOf(fac.get({recordId: record.id}));
      fac.records.splice(loc, 1);
      console.log(fac.records.length);
    }
    return fac;
})
.factory('SAUsers', function ($resource) {
    var fac = {};
    fac.records = [
      {"name" : "Harry Potter","id":0},
      {"name" : "Dexter Morgan","id":1},
      {"name" : "Steave Jobs","id":2}
    ];

    fac.query = function() {
      return fac.records;
    };
    fac.get = function(user) {
      return fac.records.filter( function(rec){return (rec.id==user.userId);} )[0];
    }
    return fac;
})
.factory('Session', function ($resource) {
    var fac = {};
    fac.records = [
      {"time" : "2015-09-10 12:10","id":0},
      {"time" : "2015-09-20 12:50","id":1},
      {"time" : "2015-09-30 12:40","id":2}
    ];

    fac.query = function() {
      return fac.records;
    };
    fac.get = function(session) {
      return fac.records.filter( function(rec){return (rec.id==session.sessionId);} )[0];
    }
    return fac;
});
