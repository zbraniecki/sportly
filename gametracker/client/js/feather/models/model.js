define(['feather/models/manager'],
       function (mmanager) {
  'use strict';

  function Model() {
    this.fields = {};
    for (var i in this.constructor.schema) {
      var field = this.constructor.schema[i];

      this.fields[i] = null;
    }
  }

  Model.db = null;

  function getDBName(db) {
    var name = db.name.substr(0, db.name.length - 5);
    return name.toLowerCase();
  }

  Model.extend = function(subClass){
    subClass.prototype = Object.create(Model.prototype);
    subClass.prototype.constructor = subClass;

    subClass.db = Model.db;
    subClass.dbName = getDBName(subClass);
    subClass.db.initDBHandle(subClass.dbName);
    subClass.objects = new mmanager.ModelManager(subClass);

  }

  Model.prototype.commit = function(cb) {
    var doc = {};
    for (var i in this.constructor.schema) {
      var field = this.constructor.schema[i];
      switch (field.type) {
        case 'foreignkey':
          doc[i] = {
            'type': 'foreignkey',
            'model': field.model,
            //'id': this.fields[field.name].fields._id
            'id': this.fields[i]
          }
          break;
        default:
          doc[i] = this.fields[i];
      }
    }
    doc['acl'] = {
      'groups': ['4hands'],
      'users': ['rlenczewski'],
    };
    Model.db.putDocument(doc, this.constructor.dbName, cb);
  }

  Model.prototype.toString = function() {
    return this.fields.name;
  }

  return {
    Model: Model,
  };
});
