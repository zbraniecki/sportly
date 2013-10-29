if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  function ViewManager() {
    this.views = {};
    this.currentView = null;
  }

  ViewManager.prototype.init = function() {
    var viewNodes = document.querySelectorAll('.view');

    for (var i = 0; i < viewNodes.length; i++) {
      var node = viewNodes[i];
      var name = viewNodes[i].getAttribute('id').substring(5);

      this.views[name] = {'node': viewNodes[i], 'obj': null};
    } 
    this.showView('eventlist');
  }

  ViewManager.prototype.initView = function(name, cb) {
    var view = this.views[name];
    var self = this;
    require(['views/'+name], function(View) {
      view.obj = new View.View(self);
      view.obj.init(view.node, cb);
    });
  }

  ViewManager.prototype.ensureViewInitialized = function(name, cb) {
    var view = this.views[name];
    if (!view.obj) {
      this.initView(name, cb);
    } else {
      cb();
    }
  }

  ViewManager.prototype.showView = function(name, cb) {
    var view = this.views[name];
    var self = this;
    this.ensureViewInitialized(name, function() {
      view.obj.preShow(function() {
        if (self.currentView) {
          self.views[self.currentView].node.classList.remove('current');
        }
        view.node.classList.add('current');
        self.currentView = name;
        if (cb) {
          cb();
        }
      });
    });
  }


  function View(viewManager) {
    this.viewManager = viewManager;
    this.viewNode = null;
    this.nodes = {};
    this.loaded = false;
  }

  View.prototype.init = function(node, cb) {
    this.viewNode = node;
    cb();
  }

  View.prototype.bindUI = function(cb) {
    cb();
  }

  View.prototype.preShow = function(cb) {
    if (!this.uiBinded) {
      this.bindUI(cb);
    } else {
      cb();
    }
  }

  View.prototype.preHide = function() {
  }

  exports.ViewManager = ViewManager;
  exports.View = View;
});
