define(['feather/event_emitter',
        'feather/models/model'],
       function (emitter, model) {
  'use strict';

  var EventEmitter = emitter.EventEmitter;
  var Model = model.Model;

  function ModelManager(model) {
    this.model = model;
    this.emitter = new EventEmitter();

    Model.db.addEventListener('event', 'added', function(model) {
      this.emitter.emit('added', model);
      console.log('emitted');
    }.bind(this));
    Model.db.addEventListener('event', 'removed', function(model) {
      this.emitter.emit('removed', model);
    }.bind(this));
  }

  ModelManager.prototype.addEventListener = function(type, cb) {
    this.emitter.addEventListener(type, cb);
  }

  ModelManager.prototype.get = function(eid, cb) {
    var model = new this.model();
    Model.db.getEvent(eid, function(doc) {
      for(var k in model.fields) {
        model.fields[k] = doc[k];
      }
      cb(model);
    }.bind(this));
  }

  ModelManager.prototype.all = function(cb) {
    Model.db.getEvents(function(docs) {
      var models = [];
      docs.forEach(function(doc) {
        var model = new this.model();
        for(var k in model.fields) {
          model.fields[k] = doc[k];
        }
        models.push(model);
      }.bind(this));
      cb(models);
    }.bind(this));
  }

  ModelManager.prototype.delete = function(evt, cb) {
    Model.db.removeEvent(evt);
  }

  return {
    ModelManager: ModelManager
  };
});
