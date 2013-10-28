function Game() {
  this.data = {
    _id: null,
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
  addLine: function(players, cb, eb) {
    var evt = {
      'gid': this.data.id,
      'time': new Date().getTime(),
      'type': 'line',
      'notes': players.join(','),
    };
    var self = this;
    db.addEvent(evt, function (evt, eid) {
      evt.eid = eid;
      if (cb) {
        cb();
      }
    }.bind(this, evt), function errback(evt) {
    }.bind(this, evt));
    self.data.events.push(evt);
  },
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
    var firstPull = null;
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
          if (!firstPull) {
            self.stage = 'first half';
            if (evt.team == 'team1') {
              self.offense = 'team2';
            } else {
              self.offense = 'team1';
            }
          firstPull = true;
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

