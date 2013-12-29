if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var EventEmitter = require('feather/event_emitter').EventEmitter;

function DB() {
  this.startSync();
}

var DEBUG = false;

function dump(msg) {
  if (DEBUG) {
    console.log(msg);
  }
}

DB.prototype = {
  dbNames: {
    'team': 'team',
    'game': 'game',
    'event': 'event',
    'player': 'player',
  },
  dbHandles: {
  },
  dbEmitters: {
  },
  remote: 'http://zbraniecki:zbraniecki@127.0.0.1:5984/',

  openDb: function(name, cb) {
    if (!this.dbHandles[name]) {
      this.initDBHandle(name);
    }
    cb(this.dbHandles[name]);
  },

  addEventListener: function(db, type, cb) {
    if (!(db in this.dbEmitters)) {
      this.dbEmitters[db] = new EventEmitter();
      this.registerChangeListener(db);
    }
    this.dbEmitters[db].addEventListener(type, cb);
  },

  initDBHandle: function(name) {
    this.dbHandles[name] = new PouchDB(name);
  },

  registerChangeListener: function(name) {
    this.dbHandles[name].changes({
      continuous: true,
      include_docs: true,
      onChange: function(change) {
        if (!change.deleted) {
          this.dbEmitters[name].emit('added', change.doc);
        } else {
          this.dbEmitters[name].emit('removed', change.id); 
        }
      }.bind(this)
    });
  },

  startSync: function() {
    for (var name in this.dbNames) {
      if (!this.dbHandles[name]) {
        this.initDBHandle(name);
      }
      this.sync(this.dbNames[name]);
    }
  },

  sync: function(name) {
    var opts = {continuous: true, complete: this.onComplete.bind(this, name)};
    this.dbHandles[name].replicate.to(this.remote+name, opts);
    this.dbHandles[name].replicate.from(this.remote+name, opts);
  },

  onComplete: function(name) {
    if (this.dbEmitters[name]) {
      this.dbEmitters[name].emit('complete');
    }
  },

  syncError: function(err) {
    console.error(err);
  },

  clear: function() {
  },

  putDocument: function(doc, dbName) {
    var self = this;
    this.openDb(dbName, function(db) {
      var oper = db.put;
      if (!doc['_id']) {
        oper = db.post;
      }
      oper(doc, function callback(err, result) {
        if (!err) {
          dump('added doc to '+dbName);
        }
      });
    });
  },
  getDocuments: function(dbName, cb) {
    var self = this;
    this.openDb(dbName, function(db) {
      db.allDocs({include_docs: true, descending: true}, function(err, doc) {
        var docs = [];
        doc.rows.forEach(function (doc) {
          docs.push(doc.doc);
        });
        cb(docs);
      });
    });
  },
  removeDocument: function(evt, dbName, cb, eb) {
    var self = this;
    this.openDb(dbName, function(db) {
      db.remove(evt, function(err, response) {
        dump('document removed');
      });
    });
  },
  getDocument: function(eid, dbName, cb) {
    var self = this;
    this.openDb(dbName, function(db) {
      db.get(eid, function(err, doc) {
        cb(doc);
      });
    });
  },
}

exports.DB = DB;

});
