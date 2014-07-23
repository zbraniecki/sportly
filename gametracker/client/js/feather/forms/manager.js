if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var EventEmitter = require('feather/event_emitter').EventEmitter;
  var DateFormatter = require('feather/utils/date').DateFormatter;

  function Form(fields, name, model) {

    this.fields = [];
    this.schema = [];
    this._emitter = new EventEmitter();

    if (model) {
      this.fillSchema(fields, name);
      this.createFields();
      this.fillFields(model);
    }
  }

  Form.prototype.fillSchema = function(schema, name) {
    schema.forEach(function (field) {
      this.schema.push(field);
    }.bind(this));
    this.schema.push({
      'type': 'submit',
      'name': 'submit',
    });
    this.name = name;
  }

  Form.prototype.fillFields = function(model) {
    this.fields.forEach(function (field) {
      switch (field.schema.type) {
        case 'dateTime':
          var val = model.fields[field.name];
          if (val) {
            val = DateFormatter.dateToString(val);
          }
          field.value = val;
          break;
        case 'foreignkey':
          if (model.fields[field.name]) {
            field.value = model.fields[field.name].id;
          }
          break;
        default:
          field.value = model.fields[field.name];
      }
    }.bind(this));
  }

  function createFields() {
    this.schema.forEach(function(schemaElement) {
      var field;
      if (!schemaElement.type) {
        field = new schemaElement(this);
      } else {
        switch(schemaElement.type) {
          case 'string':
            field = new StringField(schemaElement, this);
            break;
          case 'dateTime':
            field = new DateTimeField(schemaElement, this);
            break;
          case 'foreignkey':
            field = new ForeignkeyField(schemaElement, this);
            break;
          case 'fieldgroup':
            field = new FieldGroup(schemaElement, this);
            break;
          case 'submit':
            field = new SubmitField(schemaElement, this);
            break;
        }
        field.name = schemaElement.name.toLowerCase().replace(' ', '_');
      }
      this.fields.push(field);
    }.bind(this));
  }

  Form.prototype.createFields = createFields; 

  Form.prototype.getHTML = function() {
    var formNode = document.createElement('form');
    formNode.classList.add('form-horizontal');
    formNode.classList.add('form-eventform');
    formNode.setAttribute('role', 'form');

    this.fields.forEach(function(field) {
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

  function toDisplayName(name) {
    var name = name.replace('_', ' ');
    return name[0].toUpperCase() + name.substr(1);
  }

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
    label.textContent = toDisplayName(this.schema.name);
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
    if (this.value === null && this.schema.default) {
      this.value = this.schema.default();
    }
    if (this.value) {
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
    this.value = evt.target.value;
  }

  DateTimeField.prototype.getHTML = function() {
    var name = this.form.name.toLowerCase() + '_';
    name += this.schema.name.replace(' ', '_').toLowerCase();
    var formGroup = document.createElement('div');
    formGroup.classList.add('form-group');

    var label = document.createElement('label');
    label.textContent = toDisplayName(this.schema.name);
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
    if (this.value === null && this.schema.default) {
      this.value = this.schema.default();
    }
    if (this.value) {
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

  function ForeignkeyField(schema, form) {
    this.form = form;
    this.schema = schema;

    this.value = null;
    this.node = null;
  }

  ForeignkeyField.prototype.onChange = function(evt) {
    this.value = evt.target.value;
  }

  ForeignkeyField.prototype.getHTML = function() {

    var lname = this.schema.model.toLowerCase();
    var Model = require('reporter/models/'+lname)[this.schema.model+'Model'];

    var formGroup = document.createElement('div');

    Model.objects.all(function(docs) {
      var label = document.createElement('label');
      label.textContent = this.schema.model;
      var select = document.createElement('select');

      var option = document.createElement('option');
      option.textContent = '---';
      option.value = null;
      select.appendChild(option);
      for (var i in docs) {
        var doc = docs[i];
        var option = document.createElement('option');
        option.textContent = doc.toString();
        option.value = doc.fields._id;
        select.appendChild(option);

        if (this.value == doc.fields._id) {
          option.setAttribute('selected', 'selected');
        }
      }
      select.addEventListener('change', this.onChange.bind(this));

      formGroup.appendChild(label);
      formGroup.appendChild(select);
    }.bind(this));


    return formGroup;
  }

  /*
  function FieldGroup(schema, form) {
    this.form = form;
    this.fields = [];
    this.schema = schema;

    this.createFields();

    this.node = null;
  }

  FieldGroup.prototype.createFields = createFields;

  FieldGroup.prototype.getHTML = function() {
    var PlayerModel = require('reporter/models/player').PlayerModel;

    var table = document.createElement('table');
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.textContent = 'Name';
    tr.appendChild(th);
    table.appendChild(tr);

    var selects = [];

    for (var i in this.fields) {
      var tr = document.createElement('tr');

      var td = document.createElement('td');
      td.appendChild(this.fields[i].getHTML());
      tr.appendChild(td);

      table.appendChild(tr);
    }
    PlayerModel.objects.all(function(docs) {
      for (var i in selects) {
        for (var j in docs) {
          var option = document.createElement('option');
          option.textContent = docs[j].fields.firstname;
          option.value = docs[j].fields._id;
          selects[i].appendChild(option);
        }
      }
    });
    return table;
  }
  */

  exports.Form = Form;
  exports.Field = Field;
  //exports.FieldGroup = FieldGroup;
});
