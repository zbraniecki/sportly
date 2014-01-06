if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var RosterModel = require('reporter/models/roster').RosterModel;
  var RosterPlayerModel = require('reporter/models/roster').RosterPlayerModel;
  var ModelForm = require('feather/forms/model_form').ModelForm;
  var FieldGroup = require('feather/forms/manager').FieldGroup;

  function RosterForm(instance) {
    ModelForm.call(this, instance);
  }

  ModelForm.extend(RosterForm);

  RosterForm.model = RosterModel;

  RosterForm.formName = 'RosterForm';

  RosterForm.prototype.commit = function(cb) {
    ModelForm.prototype.commit.call(this, function(id) {
      this.form.fields.forEach(function (field) {
        if (field.fields) {
          for (var i in field.fields) {
            var player = new RosterPlayerModel();

            player.fields.roster = 'rosterID';
            player.fields.player = field.fields.value;
            player.fields.number = 0;

            //player.commit(); 
          }
        }
      }.bind(this));
    }.bind(this));
  }

  RosterForm.fields = [
    'event', 'team', RosterPlayersFG,
  ];

  function RosterPlayersFG(form) {
    var schema = [];
    
    for (var i = 0; i < 10; i++) {
      schema[i] = {
        'type': 'foreignkey',
        'name': 'player'+i,
        'model': 'Player',
      };
    }
    FieldGroup.call(this, schema, form);
  }

  RosterPlayersFG.prototype = Object.create(FieldGroup.prototype);
  RosterPlayersFG.prototype.constructor = RosterPlayersFG;

  exports.RosterForm = RosterForm;
});

