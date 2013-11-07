if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var DB = require('db').DB;
  var ViewManager = require('view_manager').ViewManager;

  function Reporter() {
    this.db = null;
  }

  Reporter.prototype.init = function() {
    this.db = new DB();

    var viewManager = new ViewManager(this);
    viewManager.init();
  }

  exports.Reporter = Reporter;
});
