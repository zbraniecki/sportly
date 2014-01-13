define(['feather/db/dbs/dbs'], function (dbs) {

  function PouchDBS() {
    dbs.DBS.call(this);

    this.dbHandles = {};
    this.remote = 'http://zbraniecki:zbraniecki@127.0.0.1:5984/';
  }

  dbs.DBS.extend(PouchDBS);

  PouchDBS.prototype.openDB = function(name) {
    if (!this.dbHandles[name]) {
      this.dbHandles[name] = new PouchDB(name);
    }
  }

  PouchDBS.prototype.closeDB = function(close) {
  }

  PouchDBS.prototype.putDocument = function(doc, dbName) {
    var promise = new Promise(function(resolve, reject) {

      var oper = this.dbHandles[dbName].put;
      if (!doc['_id']) {
        oper = this.dbHandles[dbName].post;
      }
      oper(doc, function callback(err, result) {
        if (!err) {
          dump('added doc to '+dbName);
        }
        resolve(result.id);
      });

    }.bind(this));
    return promise;
  }

  PouchDBS.prototype.getDocuments = function(dbName) {
    var promise = new Promise(function(resolve, reject) {

      this.dbHandles[dbName].allDocs({
          include_docs: true,
          descending: true
        },
        function(err, doc) {
          var docs = [];
          doc.rows.forEach(function (doc) {
            docs.push(doc.doc);
          });
          resolve(docs);
        }
      );

    }.bind(this));
    return promise;
  }

  PouchDBS.prototype.removeDocument = function(doc, dbName) {
    var promise = new Promise(function(resolve, reject) {

      this.dbHandlers[dbName].remove(evt, function(err, response) {
        dump('document removed');
        resolve();
      });

    }.bind(this));
    return promise;
  }

  PouchDBS.prototype.getDocument = function(did, dbName) {
    var promise = new Promise(function(resolve, reject) {

      this.dbHandlers[dbName].get(did, function(err, doc) {
        resolve(doc);
      });

    }.bind(this));
    return promise;
  }

  PouchDBS.prototype.registerChangeListener = function(name) {
    dump('registering change listener for '+name);
    this.dbHandles[name].info(function(err, info) {
      this.dbHandles[name].changes({
        continuous: true,
        since: info.update_seq,
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
    }.bind(this));
  };

  return {
    DBS: PouchDBS,
  };
});
