define(['feather/app',
        'feather/view_manager',
        'feather/db',
        'feather/models/model'],
        function (app, view_manager, db, model) {
  'use strict';

  var DB = db.DB;
  var ViewManager = view_manager.ViewManager;
  var Model = model.Model;

  function Reporter() {
    app.App.call(this);

    this.appName = 'Reporter';

    this.db = null;
  }

  Reporter.prototype = Object.create(app.App);
  Reporter.prototype.constructor = Reporter;

  Reporter.prototype.init = function() {
    this.db = new DB();
    Model.db = this.db;

    var viewManager = new ViewManager(this);
    viewManager.init();
  }

  return {
    Reporter: Reporter
  };
});
