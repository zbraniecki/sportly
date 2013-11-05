if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  function DivisionModel() {
  }

  DivisionModel.model = {
    'name': String,
  };

  function EventModel() {
  }

  EventModel.model = {
    'name': {'type': 'String'},
    //'parent': {'type': 'ForeignKey', 'fk': 'Division'},
    //'series': Array,
    //'event_type': Array,
    //'field_type': Array,
    'start_date': {'type': 'DateTime'},
    'end_date': {'type': 'DateTime'},
    'location': {'type': 'String'},
    //'visibility': Array,
    //'organizer': Array,
  };

  function EventDivisionModel() {
  }

  EventDivisionModel.model = {
    'event': {'type': 'ForeignKey', 'fk': 'Event'},
    'division': {'type': 'ForeignKey', 'fk': 'Division'},
  };

  exports.EventModel = EventModel;
  exports.EventDivisionModel = EventDivisionModel;
});
