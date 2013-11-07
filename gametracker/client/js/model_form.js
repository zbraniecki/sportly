if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var EventEmitter = require('eventemitter').EventEmitter;
  var Form = require('form_manager').Form;
  var DateFormatter = require('utils/date').DateFormatter;

  function ModelForm(app) {
    this.app = app;

    this.form = null;

    this._emitter = new EventEmitter();

    this.form = new Form();

    this.form.addEventListener('commit', this.commit.bind(this));

    this.model = new this.constructor.model(app);

    this.createFormSchema();
  }

  ModelForm.prototype.createFormSchema = function() {
    this.constructor.model.model.forEach(function (field) {
      this.form.schema.push(field);
    }.bind(this));
    this.form.schema.push({
      'type': 'Submit',
      'name': 'Add',
    });
    this.form.name = this.constructor.formName;
  }

  ModelForm.prototype.addEventListener = function(type, cb) {
    return this._emitter.addEventListener(type, cb);
  }

  ModelForm.prototype.removeEventListener = function(type, cb) {
    return this._emitter.removeEventListener(type, cb);
  }

  ModelForm.prototype.commit = function() {
    this.model.fields['name'] = this.form.fields[0].value;
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
