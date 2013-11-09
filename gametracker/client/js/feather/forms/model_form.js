if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var EventEmitter = require('feather/event_emitter').EventEmitter;
  var Form = require('feather/forms/manager').Form;
  var DateFormatter = require('feather/utils/date').DateFormatter;

  function ModelForm(instance) {
    this._emitter = new EventEmitter();

    var fields = this.constructor.model.model.filter(function (f) {
      var name = f.name.toLowerCase().replace(' ', '_');
      return this.constructor.fields.indexOf(name) !== -1;
    }.bind(this));
    this.form = new Form(fields, this.constructor.formName);

    this.form.addEventListener('commit', this.commit.bind(this));

    this.model = new this.constructor.model();

    if (instance) {
      this.fillForm(instance);
    }
  }

  ModelForm.prototype.fillForm = function(instance) {
    this.form.fields.forEach(function (field) {
      field.value = instance.fields[field.name];
    }.bind(this));
  }

  ModelForm.prototype.addEventListener = function(type, cb) {
    return this._emitter.addEventListener(type, cb);
  }

  ModelForm.prototype.removeEventListener = function(type, cb) {
    return this._emitter.removeEventListener(type, cb);
  }

  ModelForm.prototype.commit = function() {
    this.form.fields.forEach(function (field) {
      if (field.name in this.model.fields) {
        switch (field.schema.type) {
          case 'String':
            this.model.fields[field.name] = field.value;
            break;
          case 'DateTime':
            var dt = DateFormatter.stringToDate(field.value);
            this.model.fields[field.name] = dt;
            break;
        }
      }
    }.bind(this));
    this.model.commit();
    this._emitter.emit('commit');
  }

  ModelForm.prototype.getHTML = function() {
    return this.form.getHTML();
  }

  ModelForm.extend = function(subForm){
    subForm.prototype = Object.create(ModelForm.prototype);
    subForm.prototype.constructor = subForm;
  }

  exports.ModelForm = ModelForm;

});
