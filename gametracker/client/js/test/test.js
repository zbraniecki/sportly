define(['feather/db/db'],
        function (db) {
  'use strict';

  var DB = db.DB;

  function Test() {
    this.db = null;
    this.viewManager = null;
  }

  Test.prototype.init = function() {
    this.db = new DB(this);

    this.db.init({
      'driver': 'pouchdb',
      'dbs': ['game']
    }).then(function() {
      require(['test/models/game'], function(game) {
        var GameModel = game.GameModel;
        GameModel.objects.all(function(games) {
          if (games.length) {
            console.dir(games);
          }
        });
      });
    }.bind(this));
  }

  return {
    Test: Test
  };
});

