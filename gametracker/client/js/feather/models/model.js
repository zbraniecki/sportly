define(function (require, exports) {
  'use strict';

  function Model() {
    this.fields = {};
    this.constructor.model.forEach(function (field) {
      var name = field.name.toLowerCase().replace(' ', '_');
      this.fields[name] = null;
    }.bind(this));
  }

  Model.prototype.commit = function() {
    var doc = {};
    for (var k in this.fields) {
      doc[k] = this.fields[k];
    }
    Model.db.addEvent(doc);
  }

  exports.Model = Model;
});
