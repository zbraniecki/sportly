function Event() {
}

Event.getEvent = function(eid) {
  return new Event();
}

Event.prototype = {
  name: "2013 USA Ultimate Nor Cal Sectionals",
  division: "mixed",
  teams: {
    1: {'name': 'BW Ultimate'},
    2: {'name': 'Groove'},
    3: {'name': 'Capitol Punishment'},
    4: {'name': 'Classy'},
    5: {'name': 'DR'},
    6: {'name': 'The Greater Good'},
    7: {'name': 'Fluffy'},
    8: {'name': 'Happy Cows'},
    9: {'name': 'BAB'},
    10: {'name': 'OSC'},
    11: {'name': 'Feral Cows'},
  },
  games: {},
  players: [
    {
      number: 8,
      pic: 'player8_photo.jpg',
      name: 'Zibi',
      lastname: 'Braniecki',
      nick: 'Zibi',
      sex: 'm',
      roles: ['defender', 'cutter'],
    },
    {
      number: 69,
      pic: 'player69_photo.jpg',
      name: 'Alice',
      lastname: 'Barton',
      nick: 'Alice',
      sex: 'f',
      roles: [],
    },
    {
      number: 16,
      pic: null,
      name: 'Arvind',
      lastname: 'Chari',
      nick: 'Arvind',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Carl',
      lastname: 'Ma',
      nick: 'Carl',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Christabelle',
      lastname: 'Piansay',
      nick: 'Belle',
      sex: 'f',
      roles: [],
    },
    {
      number: 17,
      pic: null,
      name: 'Deborah',
      lastname: 'Liu',
      nick: 'Debbie',
      sex: 'f',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Pradeep',
      lastname: 'Nair',
      nick: 'Pradeep',
      sex: 'm',
      roles: [],
    },
    {
      number: 20,
      pic: null,
      name: 'Eric',
      lastname: 'Hartge',
      nick: 'Hartch',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Jason',
      lastname: 'Schissel',
      nick: 'Jason',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Katherine',
      lastname: 'Johnson',
      nick: 'Tango',
      sex: 'f',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Tyler',
      lastname: 'Walker',
      nick: 'Tyler',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Julie',
      lastname: 'Clemmensen',
      nick: 'Juicebox',
      sex: 'f',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Dave',
      lastname: 'Kavulak',
      nick: 'Caddy',
      sex: 'm',
      roles: [],
    },
    {
      number: 9,
      pic: null,
      name: 'Kristen',
      lastname: 'Clemmensen',
      nick: 'Kristen',
      sex: 'f',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Shannon',
      lastname: 'Speaker',
      nick: 'Speaks',
      sex: 'f',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Alex',
      lastname: 'Taipale',
      nick: 'Alex',
      sex: 'f',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Franklin',
      lastname: 'Pearsall',
      nick: 'Franklin',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Rob',
      lastname: 'Jaslow',
      nick: 'Rob',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Ed',
      lastname: 'Parsons',
      nick: 'Woody',
      sex: 'm',
      roles: [],
    },
    {
      number: 14,
      pic: null,
      name: 'Matt',
      lastname: 'Christie',
      nick: 'Christie',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Charlotte',
      lastname: 'Koeniger',
      nick: 'Charlotte',
      sex: 'f',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Patrick',
      lastname: 'Lee',
      nick: 'Pat',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Emily',
      lastname: 'Paris',
      nick: 'Emily',
      sex: 'f',
      roles: [],
    },
  ],

  removeGame: function(gid, cb, eb) {
    delete this.games[gid];
    db.removeGame(gid);
    if (cb) {
      cb();
    }
  },
  addGame: function(game, cb, eb) {
    this.games[game.data.id] = game;
    db.addGame(game.data);
  },
  editGame: function(game) {
    this.games[game.data.id] = game;
    db.editGame(game.data);
  },
  getGame: function(gid) {
    return this.games[gid]; 
  },
  syncWithCloud: function(cb) {
    var self = this;
    cloud.getTeams(function(teams) {
      teams.forEach(function (to) {
        if (!self.teams[to.id]) {
          self.teams[to.id] = to;
          db.addTeam(to);
        }
      });
    });
    cloud.getGames(function(games) {
      games.forEach(function (gd) {
        if (!self.games[gd.id]) {
          var game = new Game();
          game.data = gd;
          self.games[gd.id] = game;
          db.addGame(gd);
        }
      });
      if (cb) {
        cb();
      }
    });
  },
  loadData: function(cb) {
    var self = this;

    /*db.getTeams(function(teams) {
      teams.forEach(function (team) {
        self.teams[team.id] = team;
      });
      cb();
    });*/

    db.getGames(function(games) {
      self.games = {};

      var gamesToLoad = games.length;
      if (gamesToLoad == 0) {
        cb();
        return;
      }

      games.forEach(function (gd) {
        var game = new Game();
        game.data = gd;
        self.games[gd.id] = game;
        /*db.getEvents(gd.id, function(events) {
          self.games[gd.id].data.events = events;
          self.games[gd.id].calculateEvents();
          
          gamesToLoad--;
          if (gamesToLoad == 0) {
            cb();
          }
        });*/
      });
      cb();
    });
  },
}

