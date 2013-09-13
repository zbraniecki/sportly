function Game() {
  this.data = {
    id: null,
    team1: {
      id: null,
      goals: 0,
      timeouts: [],
    },
    team2: {
      id: null,
      goals: 0,
      timeouts: [],
    },
    settings: {
      starts: null,
      caps: {
        regular: {
          type: null,
          value: 0,
        },
        point: {
          value: 0,
        },
        time: {
          value: 0,
        },
        soft: {
          type: null,
          value: 0,
          diff: 0,
        },
        hard: {
          type: null,
          value: 0,
        },
      },
      timeouts: {
        number: 0,
        per: null,
      },
    },
    events: [],
  };
  this.stage = 'not started';
  this.offense = null;
}

Game.stages = [
  'not started',
  'first half',
  'half time',
  'second half',
  'end',
];


Game.prototype = {
  data: null,
  addPull: function(tpos, notes, cb, eb) {
    var team = 'team'+tpos;

    var evt = {
      'gid': this.data.id,
      'time': new Date().getTime(),
      'type': 'pull',
      'notes': notes,
      'team': team
    };
    var self = this;
    db.addEvent(evt, function (evt, eid) {
      evt.eid = eid;
      if (cb) {
        cb();
      }
    }.bind(this, evt), function errback(team, evt) {
    }.bind(this, team, evt));
    self.data.events.push(evt);
    self.offense = team == 'team1' ? 'team2' : 'team1';
    self.stage = 'first half';
  },
  addPeriodEnd: function(type, cb, eb) {
    var evt = {
      'gid': this.data.id,
      'time': new Date().getTime(),
      'type': type,
    };
    var self = this;
    db.addEvent(evt, function (evt, eid) {
      evt.eid = eid;
      if (cb) {
        cb();
      }
    }.bind(this, evt), function errback(evt) {
    }.bind(this, evt));
    if (type == 'second half') {
      var startOffense = this.getPull().team;
      self.offense = startOffense == 'team1' ? 'team1' : 'team2';
    }
    self.data.events.push(evt);
  },
  addTimeout: function(tpos, cb, eb) {
    var team = 'team' + tpos;

    var evt = {
      'gid': this.data.id,
      'time': new Date().getTime(),
      'type': 'timeout',
      'team': team
    };
    var self = this;
    db.addEvent(evt, function (evt, eid) {
      evt.eid = eid;
      if (cb) {
        cb();
      }
    }.bind(this, evt), function errback(team, evt) {
    }.bind(this, team, evt));
    self.data.events.push(evt);
    self._addTimeout(team);
  },

  addGoal: function(tpos, cb, eb) {
    var team = 'team'+tpos;

    var evt = {
      'gid': this.data.id,
      'time': new Date().getTime(),
      'type': 'goal',
      'team': team
    };
    var self = this;
    db.addEvent(evt, function(evt, eid) {
      evt.eid = eid;
    }.bind(this, evt), function errback(team, evt) {
      this[team].goals -= 1;
      this.data.events.forEach(function (evt2, k) {
        if (evt2 === evt) {
          this.data.events.splice(k, 1);
        }
      }.bind(this));
      eb();
    }.bind(this, team, evt));
    self.data.events.push(evt);
    this.data[team].goals += 1;
    this.offense = team == 'team1' ? 'team2' : 'team1';
    if (cb) {
      cb();
    }
  },
  deleteEvent: function(eid, cb) {
    this.data.events.forEach(function (evt, k) {
      if (evt.eid === eid) {
        this.data.events.splice(k, 1);
      }
    }.bind(this));
    db.deleteEvent(eid, cb);
    this.calculateEvents();
  },
  calculateEvents: function(cb) {
    var self = this;
    this.stage = 'not started';
    this.offense = null;
    this.data['team1'].goals = 0;
    this.data['team2'].goals = 0;
    this.data['team1'].timeouts = this._buildTimeoutStructure();
    this.data['team2'].timeouts = this._buildTimeoutStructure();
    this.data.events.forEach(function (evt) {
      switch (evt.type) {
        case 'goal':
          var team = evt.team;
          self.data[team].goals += 1;
          self.offense = team == 'team1' ? 'team2' : 'team1';
          break;
        case 'timeout':
          self._addTimeout(evt.team);
          break;
        case 'pull':
          self.stage = 'first half';
          if (evt.team == 'team1') {
            self.offense = 'team2';
          } else {
            self.offense = 'team1';
          }
          break;
        case 'half time':
          self.stage = 'half time';
          break;
        case 'second half':
          self.stage = 'second half';
          break;
        case 'end':
          self.stage = 'end';
          break;
      }
    });
  },
  applyTransactions: function(cb) {
    var self = this;
    db.getTransactions(function(trans) {
      trans.forEach(function (tr) {
        tr.operations.forEach(function (op) {
          var elem = self;
          var keyitems = op.key.split('.');
          var lastItem = keyitems.pop();
          keyitems.forEach(function(item) {
            elem = elem[item];
          });
          switch (op.type) {
            case 'math_inc':
              elem[lastItem] += op.value;
          }
        });
      });
      cb();
    });
  },
  getTimeouts: function(team) {
    var periods = this._getTimeoutPeriods();
    var period = this._getTimeoutPeriod();
    
    return this.data[team].timeouts[period];
  },
  _buildTimeoutStructure: function() {
    var ts = [];
    
    var periods = this._getTimeoutPeriods();
    for (var i = 0; i < periods; i++) {
      ts[i] = 0;
    }
    return ts;
  },
  getPull: function () {
    for (var i in this.data.events) {
      var evt = this.data.events[i];
      if (evt.type == 'pull') {
        return evt;
      }
    }
    return null;
  },
  _addTimeout: function(team) {
    var periods = this._getTimeoutPeriods();
    var period = this._getTimeoutPeriod();
    
    this.data[team].timeouts[period] += 1;
  },
  _getTimeoutPeriod: function() {
    var period = 0;
    var periods = this._getTimeoutPeriods();

    if (periods > 1 &&
        Game.stages.indexOf(this.stage) > Game.stages.indexOf('half time')) {
      period += 1;
    }

    return period;
  },
  _getTimeoutPeriods: function() {
    var periods = 1;
    switch (this.data.settings.timeouts.per) {
      case 'half':
        periods = 2;
        break;
      case 'game':
        periods = 1;
        break;
    }
    return periods;
  }
};


function Event() {
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

    db.getTeams(function(teams) {
      teams.forEach(function (team) {
        self.teams[team.id] = team;
      });
      cb();
    });

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
        db.getEvents(gd.id, function(events) {
          self.games[gd.id].data.events = events;
          self.games[gd.id].calculateEvents();
          
          gamesToLoad--;
          if (gamesToLoad == 0) {
            cb();
          }
        });
      });
    });
  },
}


