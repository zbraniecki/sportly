if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var EventModel = require('../model/event').EventModel;

  var EventForm = {
    'name': 'EventForm',
    'schema': [
      {
        'name': 'Name',
        'type': 'String'
      },
      {
        'name': 'Start date',
        'type': 'DateTime',
        'default': function() {
          var d = new Date();
          return d.toLocaleString();
        },
      },
      {
        'name': 'End date',
        'type': 'DateTime',
        'default': function() {
          var d = new Date();
          var h = d.getHours();
          d.setHours(h+24);
          return d.toLocaleString();
        },
      },
      {
        'name': 'Add',
        'type': 'Submit'
      },
    ],
  };

  exports.EventForm = EventForm;
});
