define(['feather/app',
        'feather/db/db',
        'reporter/chrome'],
        function (app, db, chrome) {
  'use strict';

  var DB = db.DB;
  var Chrome = chrome.Chrome;

  function Reporter() {
    app.App.call(this);

    this.db = null;
    this.chrome = null;
  }

  app.App.extend(Reporter);

  Reporter.prototype.init = function() {
    this.db = new DB(this);
    this.chrome = new Chrome(this);

    this.chrome.init().then(
      this.db.init.bind(this.db, {
        'driver': 'pouchdb',
        'dbs': ['event']
      })).then(function() {
        this.chrome.viewManager.showView('eventlist');
      }.bind(this));
  }

  return {
    Reporter: Reporter
  };
});
