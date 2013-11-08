if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  function ViewManager(app) {
    this.app = app;
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
    var appDir = this.app.appName.toLowerCase();
    var self = this;
    require([appDir+'/views/'+name], function(View) {
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

  ViewManager.prototype.showView = function(name, options, cb) {
    var view = this.views[name];
    var self = this;
    this.ensureViewInitialized(name, function() {
      view.obj.preShow(options, function() {
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

    this.options = {};
  }

  View.prototype.init = function(node, cb) {
    if (this._init) {
      this._init(function() {
        this.viewNode = node;
        cb();
      }.bind(this));
    } else {
      this.viewNode = node;
      cb();
    }
  }

  View.prototype.bindUI = function(cb) {
    if (this._bindUI) {
      this._bindUI(function() {
        this.loaded = true;
        cb();
      }.bind(this));
    } else {
      this.loaded = true;
      cb();
    }
  }

  View.prototype.drawUI = function(cb) {
    if (this._drawUI) {
      this._drawUI(cb);
    } else {
      cb();
    }
  }

  View.prototype.preShow = function(options, cb) {
    if (options) {
      this.options = options;
    } else {
      this.options = {};
    }
    if (this._preShow) {
      this._preShow(function() {
        if (!this.loaded) {
          this.drawUI(this.bindUI.bind(this, cb));
        } else {
          cb();
        }
      }.bind(this));
    } else {
      if (!this.loaded) {
        this.drawUI(this.bindUI.bind(this, cb));
      } else {
        cb();
      }
    }
  }

  View.prototype.preHide = function() {
  }

  exports.ViewManager = ViewManager;
  exports.View = View;
});
