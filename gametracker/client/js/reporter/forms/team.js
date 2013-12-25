if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var TeamModel = require('reporter/models/team').TeamModel;
  var ModelForm = require('feather/forms/model_form').ModelForm;

  function TeamForm(instance) {
    ModelForm.call(this, instance);
  }

  ModelForm.extend(TeamForm);

  TeamForm.model = TeamModel;

  TeamForm.formName = 'TeamForm';

  TeamForm.fields = [
    'name', 'division', 'city', 'region', 'country'
  ];

  exports.TeamForm = TeamForm;
});

