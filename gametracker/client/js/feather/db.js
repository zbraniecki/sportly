define(['feather/event_emitter',
        'feather/models/model'], function (ee, model) {
  'use strict';

  var EventEmitter = ee.EventEmitter;

function DB(app) {
  this.app = app;
}

var DEBUG = true;

function dump(msg) {
  if (DEBUG) {
    console.log('DB: '+msg);
  }
}

DB.prototype = {
  dbHandles: {
  },
  dbEmitters: {
  },
  remote: 'http://zbraniecki:zbraniecki@127.0.0.1:5984/',

  init: function(opts) {
    model.Model.db = this;
  },
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
    //this.sync(name);
  },

  registerChangeListener: function(name) {
    dump('registering change listener for '+name);
    this.dbHandles[name].changes({
      continuous: true,
      include_docs: true,
      onChange: function(change) {
        if (!change.deleted) {
          dump('added event fired');
          this.dbEmitters[name].emit('added', change.doc);
        } else {
          dump('remove event fired');
          this.dbEmitters[name].emit('removed', change.id); 
        }
      }.bind(this)
    });
  },

  sync: function(name) {
    dump('starting sync for '+name);
    var opts = {continuous: false};
    this.dbHandles[name].replicate.to(this.remote+name, opts);
    this.dbHandles[name].replicate.from(this.remote+name, opts);
  },

  syncError: function(err) {
    console.error(err);
  },

  clear: function() {
  },

  putDocument: function(doc, dbName, cb) {
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
        cb(result.id);
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

return {
  DB: DB,
};

});
