if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var EventEmitter = require('feather/event_emitter').EventEmitter;

  function Form() {

    this.fields = [];
    this.schema = [];
    this._emitter = new EventEmitter();
  }

  Form.prototype.getHTML = function() {
    var formNode = document.createElement('form');
    formNode.classList.add('form-horizontal');
    formNode.classList.add('form-eventform');
    formNode.setAttribute('role', 'form');

    this.schema.forEach(function(schemaElement) {
      var field;
      switch(schemaElement.type) {
        case 'String':
          field = new StringField(schemaElement, this);
          break;
        case 'DateTime':
          field = new DateTimeField(schemaElement, this);
          break;
        case 'Submit':
          field = new SubmitField(schemaElement, this);
          break;
      }
      field.name = schemaElement.name.toLowerCase().replace(' ', '_');
      this.fields.push(field);
      formNode.appendChild(field.getHTML());
    }.bind(this));
    return formNode;
  }

  Form.prototype.addEventListener = function(type, cb) {
    return this._emitter.addEventListener(type, cb);
  }

  Form.prototype.removeEventListener = function(type, cb) {
    return this._emitter.removeEventListener(type, cb);
  }

  Form.prototype.commit = function() {
    this._emitter.emit('commit');
  }

  Form.extend = function(subForm){
    subForm.prototype = Object.create(Form.prototype);
    subForm.prototype.constructor = subForm;
  }

  function Field() {
  }

  /* Fields */

  function StringField(schema, form) {
    this.form = form;
    this.schema = schema;

    this.value = null;
    this.node = null;
  }

  StringField.prototype.onChange = function(evt) {
    this.value = evt.target.value;
  }

  StringField.prototype.getHTML = function() {
    var name = this.form.name.toLowerCase() + '_';
    name += this.schema.name.replace(' ', '_').toLowerCase();
    var formGroup = document.createElement('div');
    formGroup.classList.add('form-group');

    var label = document.createElement('label');
    label.textContent = this.schema.name;
    label.classList.add('col-lg-2');
    label.classList.add('control-label');
    label.setAttribute('for', name);
    formGroup.appendChild(label);

    var valDiv = document.createElement('div');
    valDiv.classList.add('col-lg-10');
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.classList.add('form-control');
    input.setAttribute('id', name);
    if (this.schema.default) {
      this.value = this.schema.default();
      input.value = this.value;
    }

    input.addEventListener('change', this.onChange.bind(this));
    valDiv.appendChild(input);
    formGroup.appendChild(valDiv);
    this.node = formGroup;
    return formGroup;
  }

  function DateTimeField(schema, form) {
    this.form = form;
    this.schema = schema;

    this.value = null;
    this.node = null;
  }

  DateTimeField.prototype.onChange = function(evt) {
    this.value = evt.value;
  }

  DateTimeField.prototype.getHTML = function() {
    var name = this.form.name.toLowerCase() + '_';
    name += this.schema.name.replace(' ', '_').toLowerCase();
    var formGroup = document.createElement('div');
    formGroup.classList.add('form-group');

    var label = document.createElement('label');
    label.textContent = this.schema.name;
    label.classList.add('col-lg-2');
    label.classList.add('control-label');
    label.setAttribute('for', name);
    formGroup.appendChild(label);

    var valDiv = document.createElement('div');
    valDiv.classList.add('col-lg-10');
    var input = document.createElement('input');
    input.setAttribute('type', 'datetime');
    input.classList.add('form-control');
    input.setAttribute('id', name);
    if (this.schema.default) {
      this.value = this.schema.default();
      input.value = this.value;
    }

    input.addEventListener('change', this.onChange.bind(this));
    valDiv.appendChild(input);
    formGroup.appendChild(valDiv);
    this.node = formGroup;
    return formGroup;
  }

  function SubmitField(schema, form) {
    this.form = form;
    this.schema = schema;
  }

  SubmitField.prototype.getHTML = function() {
    var name = this.form.name.toLowerCase() + '_';
    name += this.schema.name.replace(' ', '_').toLowerCase();

    var formGroup = document.createElement('div');
    formGroup.classList.add('form-group');

    var valDiv = document.createElement('div');
    valDiv.classList.add('col-lg-offset-2');
    valDiv.classList.add('col-lg-10');
    var button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.classList.add('btn');
    button.classList.add('btn-default');
    button.classList.add('btn-submit');
    button.textContent = this.schema.name;

    button.addEventListener('click', function(e) {
      e.preventDefault();
      this.form.commit();
    }.bind(this));

    valDiv.appendChild(button);
    formGroup.appendChild(valDiv);
    return formGroup;
  }

  exports.Form = Form;
  exports.Field = Field;
});
