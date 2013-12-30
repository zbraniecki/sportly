if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var RosterModel = require('reporter/models/roster').RosterModel;
  var ModelForm = require('feather/forms/model_form').ModelForm;

  function RosterForm(instance) {
    ModelForm.call(this, instance);
  }

  ModelForm.extend(RosterForm);

  RosterForm.model = RosterModel;

  RosterForm.formName = 'RosterForm';

  RosterForm.fields = [
    'event', 'team',
  ];

  exports.RosterForm = RosterForm;
});

