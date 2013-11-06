if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  function ModelForm(view) {
    this.model = null;
    this.view = view;
  }


  ModelForm.prototype.init = function(model) {
    this.model = model;
  }

  ModelForm.prototype.createStringField = function(field, form) {
  }

  ModelForm.prototype.createDateTimeField = function(field, form) {
  }

  ModelForm.prototype.draw = function() {
  }

  exports.ModelForm = ModelForm;

});
