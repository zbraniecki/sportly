if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  function FormManager(view) {
    this.view = view;
  }

  FormManager.prototype.draw = function(form) {
    var rootNode = this.view.viewNode.querySelector('.form-'+form.name.toLowerCase());
    form.schema.forEach(function(schemaElement) {
      var field;
      switch(schemaElement.type) {
        case 'String':
          field = new StringField(schemaElement, form);
          break;
        case 'DateTime':
          field = new DateTimeField(schemaElement, form);
          break;
        case 'Submit':
          field = new SubmitField(schemaElement, form);
          break;
      }
      rootNode.appendChild(field.getHTML());
    }.bind(this));
  }


  function Form() {
  }

  function Field() {
  }

  /* Fields */

  function StringField(schema, form) {
    this.form = form;
    this.schema = schema;
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
    valDiv.appendChild(input);
    formGroup.appendChild(valDiv);
    return formGroup;
  }

  function DateTimeField(schema, form) {
    this.form = form;
    this.schema = schema;
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
      input.value = this.schema.default();
    }
    valDiv.appendChild(input);
    formGroup.appendChild(valDiv);
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
    valDiv.appendChild(button);
    formGroup.appendChild(valDiv);
    return formGroup;
  }

  exports.FormManager = FormManager;
  exports.Form = Form;
  exports.Field = Field;
});
