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
    var name = form.name.toLowerCase() + '_' + field.name.toLowerCase();
    var formGroup = document.createElement('div');
    formGroup.classList.add('form-group');

    var label = document.createElement('label');
    label.textContent = field.name;
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

  ModelForm.prototype.createDateTimeField = function(field, form) {
    var name = form.name.toLowerCase() + '_' + field.name.toLowerCase();
    var formGroup = document.createElement('div');
    formGroup.classList.add('form-group');

    var label = document.createElement('label');
    label.textContent = field.name;
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
    valDiv.appendChild(input);
    formGroup.appendChild(valDiv);
    return formGroup;
  }

  ModelForm.prototype.draw = function() {
    var rootNode = this.view.viewNode.querySelector('.form-'+this.model.name.toLowerCase());
    this.model.fields.forEach(function(field) {
      var fieldNode;
      switch(field.field.type) {
        case 'String':
          fieldNode = this.createStringField(field, this.model);
          break;
        case 'DateTime':
          fieldNode = this.createDateTimeField(field, this.model);
          break;
      }
      rootNode.appendChild(fieldNode);
    }.bind(this));
  }

  exports.ModelForm = ModelForm;

});
