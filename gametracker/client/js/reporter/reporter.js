define(['feather/app',
        'feather/view_manager',
        'feather/db'],
        function (app, view_manager, db) {
  'use strict';

  var DB = db.DB;
  var ViewManager = view_manager.ViewManager;

  function Reporter() {
    app.App.call(this);

    this.db = null;
    this.viewManager = null;
  }

  app.App.extend(Reporter);

  Reporter.prototype.init = function() {
    this.db = new DB(this);
    this.viewManager = new ViewManager(this);

    this.db.init({
      'dbs': ['team', 'game', 'event', 'player', 'roster', 'roster_player']
    });
    this.viewManager.init();
    this.viewManager.showView('eventlist');

  }

  return {
    Reporter: Reporter
  };
});
