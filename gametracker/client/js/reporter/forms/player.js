if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var PlayerModel = require('reporter/models/player').PlayerModel;
  var ModelForm = require('feather/forms/model_form').ModelForm;

  function PlayerForm(instance) {
    ModelForm.call(this, instance);
  }

  ModelForm.extend(PlayerForm);

  PlayerForm.model = PlayerModel;

  PlayerForm.formName = 'PlayerForm';

  PlayerForm.fields = [
    'firstname', 'lastname'
  ];

  exports.PlayerForm = PlayerForm;
});

