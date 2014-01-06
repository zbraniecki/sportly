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

  function PlayerModel() {
    Model.call(this);
  }

  PlayerModel.prototype = Object.create(Model.prototype);
  PlayerModel.prototype.constructor = PlayerModel;

  PlayerModel.dbName = 'player';

  PlayerModel.objects = new ModelManager(PlayerModel);


  PlayerModel.schema = {
    '_id': {
      'type': 'string',
    },
    '_rev': {
      'type': 'string',
    },
    'firstname': {
      'type': 'string'
    },
    'lastname': { 
      'type': 'string'
    },
  };

  PlayerModel.prototype.toString = function() {
    return this.fields.firstname + ' ' + this.fields.lastname;
  }

  return {
    PlayerModel: PlayerModel,
  };
});

