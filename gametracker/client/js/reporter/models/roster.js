if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(['feather/utils/date',
        'feather/models/model',
        'feather/models/manager',
        'reporter/models/player'],
        function (date, model, manager, player) {
  'use strict';

  var Model = model.Model;
  var ModelManager = manager.ModelManager;
  var PlayerModel = player.PlayerModel;

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

  function RosterPlayerModel() {
    Model.call(this);
  }

  RosterPlayerModel.prototype = Object.create(Model.prototype);
  RosterPlayerModel.prototype.constructor = RosterPlayerModel;

  RosterPlayerModel.dbName = 'roster_player';

  RosterPlayerModel.objects = new ModelManager(RosterPlayerModel);


  RosterPlayerModel.schema = [
    { 
      'name': '_id',
      'type': 'string',
    },
    { 
      'name': '_rev',
      'type': 'string',
    },
    {
      'name': 'roster',
      'type': 'foreignkey',
      'model': 'Roster',
    },
    {
      'name': 'player',
      'type': 'foreignkey',
      'model': 'Player',
    }
  ];

  return {
    RosterModel: RosterModel,
    RosterPlayerModel: RosterPlayerModel,
  };
});

