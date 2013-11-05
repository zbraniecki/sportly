if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var EventModel = require('../model/event').EventModel;

  var EventForm = {
    'name': 'EventForm',
    'fields': [
      {'name': 'Name', 'field': EventModel.model.name},
      {'name': 'Start date', 'field': EventModel.model.start_date},
      {'name': 'End date', 'field': EventModel.model.end_date},
    ]
  };

  exports.EventForm = EventForm;
});
