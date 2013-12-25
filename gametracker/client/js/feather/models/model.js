define(function (require, exports) {
  'use strict';

  function Model() {
    this.fields = {};
    this.constructor.schema.forEach(function (field) {
      this.fields[field.name] = null;
    }.bind(this));
  }

  Model.prototype.commit = function() {
    var doc = {};
    for (var i in this.constructor.schema) {
      var field = this.constructor.schema[i];
      switch (field.type) {
        case 'foreignkey':
          doc[field.name] = {
            'type': 'foreignkey',
            'model': field.model,
            //'id': this.fields[field.name].fields._id
            'id': this.fields[field.name]
          }
          break;
        default:
          doc[field.name] = this.fields[field.name];
      }
    }
    doc['acl'] = {
      'groups': ['4hands'],
      'users': ['rlenczewski'],
    };
    Model.db.putDocument(doc, this.constructor.dbName);
  }

  exports.Model = Model;
});
