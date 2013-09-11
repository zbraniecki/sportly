function Game() {
  this.data = {
    id: null,
    team1: {
      id: null,
      goals: 0,
      timeouts: 0,
    },
    team2: {
      id: null,
      goals: 0,
      timeouts: 0,
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
          type: null,
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
    db.addEvent(evt, function (eid, evt) {
      if (cb) {
        cb();
      }
    }.bind(this, evt), function errback(team, evt) {
    }.bind(this, team, evt));
    self.data.events.push(evt);
    self.stage = 'first half';
  },
  addPeriodEnd: function(type, cb, eb) {
    var evt = {
      'gid': this.data.id,
      'time': new Date().getTime(),
      'type': type,
    };
    var self = this;
    db.addEvent(evt, function (eid, evt) {
      if (cb) {
        cb();
      }
    }.bind(this, evt), function errback(evt) {
    }.bind(this, evt));
    self.data.events.push(evt);
  },
  addTimeout: function(tpos, cb, eb) {
    var team = 'team' + tpos;

    var evt = {
      'time': new Date().getTime(),
      'type': 'timeout',
      'team': team
    };
    var self = this;
    db.addEvent(evt, function (eid, evt) {
      if (cb) {
        cb();
      }
    }.bind(this, evt), function errback(team, evt) {
    }.bind(this, team, evt));
    self.events.push(evt);
    self[team].timeouts += 1;
  },

  addGoal: function(tpos, cb, eb) {
    var team = 'team'+tpos;
    /*var oper1 = {
      'store': 'games',
      'key': team+'.goals',
      'type': 'math_inc', // 'math_inc', 'math_dec', 'edit', 'delete', 'add',
      'value': 1, 
    };
    var self = this;
    db.addTransaction([oper1], null, function errback() {
      self[team].goals -= 1;
      eb();
    });

    this[team].goals += 1;*/

    var evt = {
      'time': new Date().getTime(),
      'type': 'goal',
      'team': team
    };
    var self = this;
    db.addEvent(evt, function(eid, evt) {
      evt.eid = eid;
    }.bind(this, evt), function errback(team, evt) {
      this[team].goals -= 1;
      this.events.forEach(function (evt2, k) {
        if (evt2 === evt) {
          this.events.splice(k, 1);
        }
      }.bind(this));
      eb();
    }.bind(this, team, evt));
    self.events.push(evt);
    this[team].goals += 1;
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
    this.data['team1'].goals = 0;
    this.data['team2'].goals = 0;
    this.data.events.forEach(function (evt) {
      switch (evt.type) {
        case 'goal':
          var team = evt.team;
          self.data[team].goals += 1;
          break;
        case 'pull':
          self.stage = 'first half';
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
};


function LocalData () {
}

LocalData.prototype = {
  teams: {
    1: {name: 'BAB'},
    2: {name: 'OSC'},
    3: {name: 'Fluffer'},
  },
  games: {
  },

  removeGame: function(gid, cb, eb) {
    this.games.forEach(function (game, k) {
      delete this.games[gid];
      db.removeGame(gid);
    }.bind(this));
    if (cb) {
      cb();
    }
  },
  addGame: function(game, cb, eb) {
    this.games[game.data.id] = game;
    db.addGame(game.data);
  },
  loadData: function(cb) {
    var self = this;
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


