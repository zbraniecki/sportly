if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var DateFormatter = require('feather/utils/date').DateFormatter;

  function DivisionModel() {
  }

  DivisionModel.model = {
    'name': String,
  };

  function EventModel(db) {
    this.db = db;

    this.fields = {};
    this.constructor.model.forEach(function (field) {
      var name = field.name.toLowerCase().replace(' ', '_');
      this.fields[name] = null;
    }.bind(this));
  }

  EventModel.get = function(db, eid, cb) {
    var model = new EventModel(db);
    db.getEvent(eid, function(doc) {
      for(var k in model.fields) {
        model.fields[k] = doc[k];
      }
      cb(model);
    }.bind(this));
  }

  EventModel.prototype.commit = function() {
    var doc = {};
    for (var k in this.fields) {
      doc[k] = this.fields[k];
    }
    this.db.addEvent(doc);
  }

  EventModel.model = [
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

  exports.EventModel = EventModel;
  exports.EventDivisionModel = EventDivisionModel;
});
