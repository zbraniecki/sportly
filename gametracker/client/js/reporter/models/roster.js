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

  RosterModel.dbName = 'roster';

  RosterModel.objects = new ModelManager(RosterModel);


  RosterModel.schema = {
    'name': {
      'type': 'string',
    },
    'event': {
      'type': 'foreignkey',
      'model': 'Event',
    },
    'team': {
      'type': 'foreignkey',
      'model': 'Team',
    }
  };

  function RosterPlayerModel() {
    Model.call(this);
  }

  RosterPlayerModel.prototype = Object.create(Model.prototype);
  RosterPlayerModel.prototype.constructor = RosterPlayerModel;

  RosterPlayerModel.dbName = 'roster_player';

  RosterPlayerModel.objects = new ModelManager(RosterPlayerModel);


  RosterPlayerModel.schema = {
    '_id': {
      'type': 'string',
    },
    '_rev': {
      'type': 'string',
    },
    'roster': {
      'type': 'foreignkey',
      'model': 'Roster',
    },
    'player': {
      'type': 'foreignkey',
      'model': 'Player',
    },
    'number': {
      'type': 'string',
    },
  };

  return {
    RosterModel: RosterModel,
    RosterPlayerModel: RosterPlayerModel,
  };
});

