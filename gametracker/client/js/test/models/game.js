define(['feather/db/models/model'],
        function (model) {
  'use strict';

  var Model = model.Model;

  function GameModel() {
    Game.call(this);
  }

  Model.extend(GameModel);

  GameModel.schema = {
    '_id': {
      'type': 'string',
    },
    '_rev': {
      'type': 'string',
    },
    'name': {
      'type': 'string',
    },
  };


  return {
    GameModel: GameModel,
  };
});
