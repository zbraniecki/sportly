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


  TeamModel.schema = {
    '_id': {
      'type': 'string',
    },
    '_rev': {
      'type': 'string',
    },
    'name': {
      'type': 'string'
    },
    'division': {
      'type': 'string'
    },
    'city': {
      'type': 'string'
    },
    'region': {
      'type': 'string'
    },
    'country': {
      'type': 'string'
    },
  };


  return {
    TeamModel: TeamModel,
  };
});

