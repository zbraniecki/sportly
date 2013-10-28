
function DB() {
  this.startSync();
}

DB.prototype = {
  dbNames: {
    'team': 'team',
    'game': 'game',
    'event': 'event',
  },
  dbHandles: {
  },
  remote: 'http://zbraniecki:lomtjjz@127.0.0.1:5984/',

  openDb: function(name, cb) {
    if (!this.dbHandles[name]) {
      this.dbHandles[name] = new PouchDB(name);
    }
    cb(this.dbHandles[name]);
  },

  startSync: function() {
    for (var name in this.dbNames) {
      if (!this.dbHandles[name]) {
        this.dbHandles[name] = new PouchDB(name);
      }
      this.sync(this.dbNames[name]);
    }
  },

  sync: function(name) {
    var opts = {continuous: true, complete: this.syncError};
    this.dbHandles[name].replicate.to(this.remote+name, opts);
    this.dbHandles[name].replicate.from(this.remote+name, opts);
  },

  syncError: function(err) {
    console.error(err);
  },

  clear: function() {
  },

  addGame: function(game) {
    var self = this;
    this.openDb('game', function(db) {
      game._id = PouchDB.uuids()[0];
      db.put(game, function callback(err, result) {
        console.log(err);
        if (!err) {
          console.log('added a game');
        }
      });
    });
  },
  editGame: function(game) {
    var self = this;
    this.openDb(function() {
      var store = self.getObjectStore(self.dbGameStoreName, 'readwrite');
      var request = store.put(game);
      request.onsuccess = function(event) {
        console.log('edited game');
      }
    });
  },
  removeGame: function(gid, cb, eb) {
    var self = this;
    this.openDb(function() {
      var store = self.getObjectStore(self.dbGameStoreName, 'readwrite');
      var request = store.delete(parseInt(gid));
      self.deleteGameEvents(gid);
      request.onerror = function() {
        console.log('error');
      }
      request.onsuccess = function(evt) {
        console.log('success');
        if (cb) {
          cb();
        }
      }
    });
  },
  getGames: function(cb) {
    var self = this;
    this.openDb('game', function(db) {
      db.allDocs({include_docs: true, descending: true}, function(err, doc) {
        var games = [];
        doc.rows.forEach(function (doc) {
          games.push(doc.doc);
        });
        cb(games);
      });
    });
  },
  getGame: function(id, cb) {
    var self = this;
    this.openDb(function() {
      var store = self.getObjectStore(self.dbGameStoreName, 'readonly');
      var request = store.get(1);
      request.onerror = function(event) {
        console.log("Database error: " + event.target.errorCode);
      }
      request.onsuccess = function(event) {
        console.log('game:' + event.target.result);
        cb(event.target.result);
      }
    });
  },
  addTeam: function(team, cb, eb) {
    var self = this;
    this.openDb(function() {
      var store = self.getObjectStore(self.dbTeamStoreName, 'readwrite');
      var request = store.add(team);
      request.onsuccess = function(event) {
      }
    });
  },
  getTeams: function(cb, eb) {
    var self = this;
    this.openDb(function() {
      var store = self.getObjectStore(self.dbTeamStoreName, 'readonly');
      var teams = [];
      store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          cursor.value.id = cursor.key;
          teams.push(cursor.value);
          cursor.continue();
        }
        else {
          cb(teams);
        }
      };
    });
  },
  addEvent: function(evt, cb, eb) {
    var self = this;
    this.openDb(function() {
      var store = self.getObjectStore(self.dbEventStoreName, 'readwrite');
      var request = store.add(evt);
      request.onsuccess = function(event) {
        cb(event.target.result);
        console.log('added event');
      }

      request.onerror = function(event) {
        console.log("Database error: " + event.target.errorCode);
        eb();
      }
    });
  },
  getEvents: function(gid, cb) {
    var self = this;
    this.openDb(function() {
      var store = self.getObjectStore(self.dbEventStoreName, 'readonly');
      var events = [];
      var index = store.index('gid');
      index.openCursor(IDBKeyRange.only(parseInt(gid))).onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          events.push(cursor.value);
          cursor.continue();
        }
        else {
          cb(events);
        }
      };
    });
  },
  deleteEvent: function(key, cb, eb) {
    var self = this;
    this.openDb(function() {
      var store = self.getObjectStore(self.dbEventStoreName, 'readwrite');
      var request = store.delete(key);
      request.onsuccess = function(evt) {
        if (cb) {
          cb();
        }
      }
    });
  },
  deleteGameEvents: function(gid, cb, eb) {
    var self = this;
    this.openDb(function() {
      var store = self.getObjectStore(self.dbEventStoreName, 'readwrite');
      var index = store.index('gid');
      index.openCursor(IDBKeyRange.only(parseInt(gid))).onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          var request = store.delete(cursor.primaryKey);
          cursor.continue();
        }
      };
    });
  },
}
