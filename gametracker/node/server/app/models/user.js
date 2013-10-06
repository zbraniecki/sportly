module.exports = function (db, cb) {
  var Player = db.define('Player', {
    number: Number,
    name: String,
    lastname: String,
    nick: String,
    sex: ['m', 'f'],
    // roles: [],
    // pic: [],
  });

  var Event = db.define('Event', {
    name: String,
    division: String,
  });

  var Team = db.define('Team', {
    id: String, 
    name : String,
  });

  var Squad = db.define('Squad', {
    name: String,
  });

  Squad.hasMany('team', Team);
  Squad.hasOne('event', Event);
  Squad.hasMany('player', Player);

  var Game = db.define('Game', {
    id: String,
  });

  Game.hasOne('squad1', Squad);
  Game.hasOne('squad2', Squad);

  var GameSettings = db.define('GameSettings', {
    key: String,
      value: String,
      type: ['int', 'str', 'bool'],
  });

  GameSettings.hasOne('game', Game); 

  var GameEventType = db.define('EventType', {
    name: String,
  });

  var GameEvent = db.define('GameEvent', {
    time: Number,
      notes: String,
  });

  GameEvent.hasOne('team', Team);
  GameEvent.hasOne('type', GameEventType);
  GameEvent.hasOne('game', Game);

  return cb();
};
