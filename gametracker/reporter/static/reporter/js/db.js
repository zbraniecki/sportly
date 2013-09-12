
function DB() {
}

DB.prototype = {
  dbName: 'sportlyGames',
  dbGameStoreName: 'games',
  dbEventStoreName: 'events',
  dbTransactionStoreName: 'transactions',
  db: null,

  openDb: function(cb) {
    if (this.db) {
      if (cb) {
        cb();
      }
      return;
    }
    console.log("openDb ...");
    var req = indexedDB.open(this.dbName, 13);
    var self = this;
    req.onsuccess = function (evt) {
      self.db = this.result;
      console.log("openDb DONE");
      if (cb) {
        cb();
      }
    };
    req.onerror = function (evt) {
      console.error("openDb:", evt.target.errorCode);
    };

    req.onupgradeneeded = function (evt) {
      console.log("openDb.onupgradeneeded");
      //evt.currentTarget.result.deleteObjectStore(self.dbGameStoreName);
      //evt.currentTarget.result.deleteObjectStore(self.dbTransactionStoreName);
      //evt.currentTarget.result.deleteObjectStore(self.dbEventStoreName);
      var gameStore = evt.currentTarget.result.createObjectStore(self.dbGameStoreName, {keyPath: 'id'});
      evt.currentTarget.result.createObjectStore(self.dbTransactionStoreName, {keyPath: 'tid', 'autoIncrement': true});
      var eventStore = evt.currentTarget.result.createObjectStore(self.dbEventStoreName, {keyPath: 'eid', 'autoIncrement': true});


      eventStore.createIndex("gid", "gid", { unique: false });

      console.log('created');
    };
  },

  clear: function() {
    var self = this;
    this.openDb(function() {
      var store = self.getObjectStore(self.dbGameStoreName, 'readwrite');
      store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          var request = store.delete(cursor.key);
          cursor.continue();
        }
      };
      var store2 = self.getObjectStore(self.dbEventStoreName, 'readwrite');
      store2.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          var request = store2.delete(cursor.key);
          cursor.continue();
        }
      };
    });
  },

  getObjectStore: function(store_name, mode) {
    var tx = this.db.transaction(store_name, mode);
    return tx.objectStore(store_name);
  },
  addGame: function(game) {
    var self = this;
    this.openDb(function() {
      var store = self.getObjectStore(self.dbGameStoreName, 'readwrite');
      var request = store.add(game);
      request.onsuccess = function(event) {
        console.log('added game');
      }
    });
  },
  removeGame: function(gid, cb, eb) {
    var self = this;
    this.openDb(function() {
      var store = self.getObjectStore(self.dbGameStoreName, 'readwrite');
      var request = store.delete(parseInt(gid));
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
    this.openDb(function() {
      var store = self.getObjectStore(self.dbGameStoreName, 'readonly');
      var games = [];
      store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          cursor.value.id = cursor.key;
          games.push(cursor.value);
          cursor.continue();
        }
        else {
          cb(games);
        }
      };
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
  addTransaction: function(operations, cb, eb) {
    var self = this;
    this.openDb(function() {
      var store = self.getObjectStore(self.dbTransactionStoreName, 'readwrite');
      var trns = {
        'timestamp': new Date().getTime(),
    'operations': operations
      };
      var request = store.add(trns);

      request.onerror = function(event) {
        console.log('Database error: ' + event.target.errorCode);
        eb();
      }
      request.onsuccess = function(event) {
        console.log('added transaction');
      }
    });
  },
  getTransactions: function(cb, eb) {
    var self = this;
    this.openDb(function() {
      var store = self.getObjectStore(self.dbTransactionStoreName, 'readwrite');
      var trans = [];
      store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          trans.push(cursor.value);
          cursor.continue();
        }
        else {
          cb(trans);
        }
      };
    });
  },
}
