if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(['feather/utils/date',
        'feather/models/model',
        'feather/models/manager'],
        function (date, model, manager) {
  'use strict';

  var Model = model.Model;
  var ModelManager = manager.ModelManager;

  function RosterModel() {
    Model.call(this);
  }

  RosterModel.prototype = Object.create(Model.prototype);
  RosterModel.prototype.constructor = RosterModel;

  RosterModel.dbName = 'team';

  RosterModel.objects = new ModelManager(RosterModel);


  RosterModel.schema = [
    { 
      'name': '_id',
      'type': 'string',
    },
    { 
      'name': '_rev',
      'type': 'string',
    },
    {
      'name': 'name',
      'type': 'string'
    },
    {
      'name': 'event',
      'type': 'foreignkey',
      'model': 'Event',
    },
    {
      'name': 'team',
      'type': 'foreignkey',
      'model': 'Team',
    }
  ];


  return {
    RosterModel: RosterModel,
  };
});

