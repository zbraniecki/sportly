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
    this.constructor.fields.forEach(function(field) {
      var mfield = this.model.constructor.schema[field];

      if (mfield) {
        switch (mfield.type) {
          case 'foreignkey':
            if (this.model.fields[mfield.name]) {
              field.value = this.model.fields[mfield.name].id;
            }
            break;
          default:
            field.value = this.model.fields[mfield.name];
        }
        mfield.name = field;
        fields.push(mfield);
      } else {
        fields.push(field);
      }
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

  ModelForm.prototype.commit = function(cb) {
    this.form.fields.forEach(function (field) {
      if (field.name && (field.name in this.model.fields)) {
        switch (field.schema.type) {
          case 'string':
            this.model.fields[field.name] = field.value;
            break;
          case 'dateTime':
            var dt = DateFormatter.stringToDate(field.value);
            this.model.fields[field.name] = dt;
            break;
          case 'foreignkey':
            // here should go model object, not it's ID
            this.model.fields[field.name] = field.value;
            break;
        }
      }
    }.bind(this));
    this.model.commit(function(id) {
      this._emitter.emit('commit');
      if (cb) {
        cb(id);
      }
    }.bind(this));
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
