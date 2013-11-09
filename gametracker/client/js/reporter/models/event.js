if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(['feather/utils/date',
        'feather/models/model',
        'feather/models/manager'],
        function (date, model, manager) {
  'use strict';

  var DateFormatter = date.DateFormatter;
  var Model = model.Model;
  var ModelManager = manager.ModelManager;

  function DivisionModel() {
  }

  DivisionModel.model = {
    'name': String,
  };

  function EventModel() {
    Model.call(this);
  }

  EventModel.prototype = Object.create(Model.prototype);
  EventModel.prototype.constructor = EventModel;

  EventModel.objects = new ModelManager(EventModel);

  EventModel.model = [
    { 
      'name': '_id',
      'type': 'String',
    },
    { 
      'name': '_rev',
      'type': 'String',
    },
    {
      'name': 'Name',
      'type': 'String'
    },
    //'parent': {'type': 'ForeignKey', 'fk': 'Division'},
    //'series': Array,
    //'event_type': Array,
    //'field_type': Array,
    {
      'name': 'Start date',
      'type': 'DateTime',
      'default': function() {
        var d = new Date();
        return DateFormatter.dateToString(d);
      },
    },
    {
      'name': 'End date',
      'type': 'DateTime',
      'default': function() {
        var d = new Date();
        var h = d.getHours();
        d.setHours(h+24);
        return DateFormatter.dateToString(d);
      },
    },
    {
      'name': 'Location',
      'type': 'String'
    },
    //'visibility': Array,
    //'organizer': Array,
  ];

  function EventDivisionModel() {
  }

  EventDivisionModel.model = {
    'event': {'type': 'ForeignKey', 'fk': 'Event'},
    'division': {'type': 'ForeignKey', 'fk': 'Division'},
  };

  return {
    EventModel: EventModel,
    EventDivisionModel: EventDivisionModel
  };
});
