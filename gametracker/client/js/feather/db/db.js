define(['feather/event_emitter',
        'feather/db/models/model'], function (ee, model) {
  'use strict';

  var EventEmitter = ee.EventEmitter;


var DEBUG = false;

function dump(msg) {
  if (DEBUG) {
    console.log('DB: '+msg);
  }
}

function DB(app) {
  this.app = app;
  this.dbs = null;
}

DB.prototype = {
  dbEmitters: {
  },

  init: function(opts) {
    var promise = new Promise(function(resolve, reject) {
      model.Model.db = this;
      require(['feather/db/dbs/pouchdb'], function(dbs) {
        this.dbs = new dbs.DBS(this);
        for (var name of opts.dbs) {
          this.dbs.openDB(name);
        }
        resolve();
      }.bind(this));
    }.bind(this));
    return promise;
  },

  addEventListener: function(db, type, cb) {
    if (!(db in this.dbEmitters)) {
      this.dbEmitters[db] = new EventEmitter();
      this.dbs.registerChangeListener(db);
    }
    this.dbEmitters[db].addEventListener(type, cb);
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
    PouchDB.destroy('event', function(err, info) { console.dir(err); console.dir(info); });
  },

  putDocument: function(doc, dbName, cb) {
    this.dbs.putDocument(doc, dbName).then(function(did) {
      cb(did);
    });
  },
  getDocuments: function(dbName) {
    return this.dbs.getDocuments(dbName);
  },
  removeDocument: function(doc, dbName, cb) {
    this.dbs.removeDocument(doc, dbName).then(function() {
      cb();
    });
  },
  getDocument: function(did, dbName, cb) {
    this.dbs.getDocument(did, dbName).then(function(doc) {
      cb(doc);
    });
  },
}

return {
  DB: DB,
};

});
