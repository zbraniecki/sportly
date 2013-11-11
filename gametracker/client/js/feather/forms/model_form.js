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

    this.model = new this.constructor.model();

    if (instance) {
      this.fillModel(instance);
    }

    var fields = [];
    this.model.constructor.schema.forEach(function(field) {
      if (this.constructor.fields.indexOf(field.name) === -1) {
        return;
      }
      field.value = this.model.fields[field.name];
      fields.push(field);
    }.bind(this));

    this.form = new Form(fields, this.constructor.formName, this.model);

    this.form.addEventListener('commit', this.commit.bind(this));


  }

  ModelForm.prototype.fillModel = function(instance) {
    for (var k in this.model.fields) {
      this.model.fields[k] = instance.fields[k];
    }
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
          case 'string':
            this.model.fields[field.name] = field.value;
            break;
          case 'dateTime':
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
