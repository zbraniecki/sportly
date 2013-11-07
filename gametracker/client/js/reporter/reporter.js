define(['feather/app',
        'feather/view_manager',
        'feather/db'],
        function (app, view_manager, db) {
  'use strict';

  var DB = db.DB;
  var ViewManager = view_manager.ViewManager;

  function Reporter() {
    app.App.call(this);

    this.appName = 'Reporter';

    this.db = null;
  }

  Reporter.prototype = Object.create(app.App);
  Reporter.prototype.constructor = Reporter;

  Reporter.prototype.init = function() {
    this.db = new DB();

    var viewManager = new ViewManager(this);
    viewManager.init();
  }

  return {
    Reporter: Reporter
  };
});
