define(['feather/utils/date',
        'feather/models/model'],
        function (date, model) {
  'use strict';

  var DateFormatter = date.DateFormatter;
  var Model = model.Model;

  function EventModel() {
    Model.call(this);
  }

  Model.extend(EventModel);

  EventModel.schema = {
    '_id': {
      'type': 'string',
    },
    '_rev': {
      'type': 'string',
    },
    'name': {
      'type': 'string',
    },
    //'parent': {'type': 'ForeignKey', 'fk': 'Division'},
    //'series': Array,
    //'event_type': Array,
    //'field_type': Array,
    'start_date': {
      'type': 'dateTime',
      'default': function() {
        var d = new Date();
        return DateFormatter.dateToString(d);
      },
    },
    'end_date': {
      'type': 'dateTime',
      'default': function() {
        var d = new Date();
        var h = d.getHours();
        d.setHours(h+24);
        return DateFormatter.dateToString(d);
      },
    },
    'location': {
      'type': 'string'
    },
    //'visibility': Array,
    //'organizer': Array,
  };


  return {
    EventModel: EventModel,
  };
});
