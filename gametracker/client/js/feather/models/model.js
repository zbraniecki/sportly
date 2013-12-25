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
    for (var k in this.fields) {
      doc[k] = this.fields[k];
    }
    doc['acl'] = {
      'groups': ['4hands'],
      'users': ['rlenczewski'],
    };
    Model.db.putDocument(doc, this.constructor.dbName);
  }

  exports.Model = Model;
});
