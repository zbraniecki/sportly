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


  PlayerModel.schema = [
    { 
      'name': '_id',
      'type': 'string',
    },
    { 
      'name': '_rev',
      'type': 'string',
    },
    {
      'name': 'firstname',
      'type': 'string'
    },
    {
      'name': 'lastname',
      'type': 'string'
    },
  ];


  return {
    PlayerModel: PlayerModel,
  };
});

