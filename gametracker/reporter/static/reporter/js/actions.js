function LocalData () {
}

LocalData.prototype = {
  games: [
    {
      id: 1,
      team1: {
        name: 'BAB',
        goals: 0,
      },
      team2: {
        name: 'OSC',
        goals: 0,
      },
      settings: {
        starts: 1378628005935
      },
      stage: 'not-started',
    },
    {
      id: 2,
      team1: {
        name: 'BAB',
        goals: 0,
      },
      team2: {
        name: 'Fluffer',
        goals: 0,
      },
      settings: {
        starts: 1378629125935
      },
      stage: 'not-started',
    }
  ],
  team1: {
    name: null,
    goals: null,
    timeouts: 0,
  },
  team2: {
    name: null,
    goals: null,
    timeouts: 0,
  },
  events: [],
  settings: {
    starts: 1378628005935,
    caps: {
      regular: {
        type: 'point',
        value: 15,
      },
      point: {
        value: 17,
      },
      time: null,
      soft: {
        type: 'time',
        value: 90,
        diff: 2,
      },
      hard: {
        type: 'time',
        value: 110,
      },
    },
    timeouts: {
      number: 2,
      per: 'half',
    },
  },
  stage: 'not-started',

  addPeriodEnd: function(type, cb, eb) {
    var evt = {
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
    self.events.push(evt);
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
  addPull: function(tpos, cb, eb) {
    var team = 'team'+tpos;

    var evt = {
      'time': new Date().getTime(),
      'type': 'pull',
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
    self.stage = 'first half';
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
    this.events.forEach(function (evt, k) {
      if (evt.eid === eid) {
        this.events.splice(k, 1);
      }
    }.bind(this));
    db.deleteEvent(eid, cb);
  },
  loadData: function(cb) {
    var self = this;
    db.getGame(function(game) {
      self.team1.name = game.team1.name;
      self.team2.name = game.team2.name;
      self.team1.goals = game.team1.goals;
      self.team2.goals = game.team2.goals;
      //self.applyTransactions(cb);
      db.getEvents(function(events) {
        self.events = events;
        self.calculateEvents();
        cb();
      });
    });
  },
  calculateEvents: function(cb) {
    var self = this;
    this.events.forEach(function (evt) {
      switch (evt.type) {
        case 'goal':
          var team = evt.team;
          self[team].goals += 1;
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
}


