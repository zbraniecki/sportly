if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var EventModel = require('reporter/models/event').EventModel;
  var ModelForm = require('feather/forms/model_form').ModelForm;

  function EventForm(instance) {
    ModelForm.call(this, instance);
  }

  ModelForm.extend(EventForm);

  EventForm.model = EventModel;

  EventForm.formName = 'EventForm';

  EventForm.fields = [
    'name', 'start_date', 'end_date', 'location', 'team',
  ];

  exports.EventForm = EventForm;
});
