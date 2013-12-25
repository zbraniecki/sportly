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

  function TeamModel() {
    Model.call(this);
  }

  TeamModel.prototype = Object.create(Model.prototype);
  TeamModel.prototype.constructor = TeamModel;

  TeamModel.dbName = 'team';

  TeamModel.objects = new ModelManager(TeamModel);


  TeamModel.schema = [
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
      'name': 'division',
      'type': 'string'
    },
    {
      'name': 'city',
      'type': 'string'
    },
    {
      'name': 'region',
      'type': 'string'
    },
    {
      'name': 'country',
      'type': 'string'
    },
  ];


  return {
    TeamModel: TeamModel,
  };
});

