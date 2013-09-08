function LocalData () {
}

LocalData.prototype = {
  team1: {
    name: null,
    goals: null,
  },
  team2: {
    name: null,
    goals: null,
  },
  events: [],

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
    this.events.forEach(function (evt) {
      if (evt.eid === eid) {
        this.events.splice(k, 1);
      }
    });
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


