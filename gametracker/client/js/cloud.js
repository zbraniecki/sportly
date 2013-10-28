
function Cloud() {
  this.server = 'http://127.0.0.1:8000';
}

Cloud.prototype = {
  openDb: function(cb) {
  },

  clear: function() {
  },

  getObjectStore: function(store_name, mode) {
  },
  addGame: function(game) {
  },
  editGame: function(game) {
  },
  removeGame: function(gid, cb, eb) {
  },
  getGames: function(cb) {
    $.ajax({
      url: this.server + "/reporter/api/get_games",
      dataType: 'json',
      cache: false
    }).done(function( json ) {
      cb(json);
    });
  },
  getTeams: function(cb) {
    $.ajax({
      url: this.server + "/reporter/api/get_teams",
      dataType: 'json',
      cache: false
    }).done(function( json ) {
      cb(json);
    });
  },
  getGame: function(id, cb) {
  },
  addEvent: function(evt, cb, eb) {
  },
  getEvents: function(gid, cb) {
  },
  deleteEvent: function(key, cb, eb) {
  },
  deleteGameEvents: function(gid, cb, eb) {
  },
}

