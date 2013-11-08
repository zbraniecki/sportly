if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var EventModel = require('reporter/models/event').EventModel;
  var ModelForm = require('feather/model_form').ModelForm;

  function EventForm(app) {
    ModelForm.call(this, app);
  }

  ModelForm.extend(EventForm);

  EventForm.model = EventModel;

  EventForm.formName = 'EventForm';

  exports.EventForm = EventForm;
});
