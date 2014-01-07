define(['feather/event_emitter'],
       function (emitter) {
  'use strict';

  var EventEmitter = emitter.EventEmitter;

  function ModelManager(model) {
    this.model = model;

  }

  ModelManager.prototype.addEventListener = function(type, cb) {
    if (!this.emitter) {
      this.emitter = new EventEmitter();
      this.model.db.addEventListener(this.model.dbName, 'added', function(doc) {
        var model = new this.model();
        for(var k in model.fields) {
          model.fields[k] = doc[k];
        }
        this.emitter.emit('added', model);
      }.bind(this));
      this.model.db.addEventListener(this.model.dbName, 'removed', function(docid) {
        this.emitter.emit('removed', docid);
      }.bind(this));
    }
    this.emitter.addEventListener(type, cb);
  }

  ModelManager.prototype.removeEventListener = function(type, cb) {
    this.emitter.removeEventListener(type, cb);
  }

  ModelManager.prototype.get = function(eid, cb) {
    var model = new this.model();
    this.model.db.getDocument(eid, this.model.dbName, function(doc) {
      for(var k in model.fields) {
        model.fields[k] = doc[k];
      }
      cb(model);
    }.bind(this));
  }

  ModelManager.prototype.all = function(cb) {
    this.model.db.getDocuments(this.model.dbName, function(docs) {
      var models = [];
      docs.forEach(function(doc) {
        var model = new this.model();
        for(var k in model.fields) {
          model.fields[k] = doc[k];
        }
        model.fields['_id'] = doc._id;
        model.fields['_rev'] = doc._rev;
        models.push(model);
      }.bind(this));
      cb(models);
    }.bind(this));
  }

  ModelManager.prototype.delete = function(evt, cb) {
    this.model.db.removeDocument(evt, this.model.dbName);
  }

  return {
    ModelManager: ModelManager
  };
});
