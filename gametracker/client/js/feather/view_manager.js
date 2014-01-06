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

  ViewManager.prototype.init = function(opts) {
    var viewNodes = document.querySelectorAll('.view');

    for (var i = 0; i < viewNodes.length; i++) {
      var node = viewNodes[i];
      var name = viewNodes[i].getAttribute('id').substring(5);

      this.views[name] = {'node': viewNodes[i], 'obj': null};
    } 
  }

  ViewManager.prototype.initView = function(name, cb) {
    var view = this.views[name];
    var appDir = this.app.constructor.name.toLowerCase();
    require([appDir+'/views/'+name], function(View) {
      view.obj = new View.View(this);
      view.obj.init(view.node, cb);
    }.bind(this));
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
    this.ensureViewInitialized(name, function() {
      view.obj.preShow(options, function() {
        if (this.currentView) {
          this.views[this.currentView].node.classList.remove('current');
        }
        view.node.classList.add('current');
        this.currentView = name;
        if (cb) {
          cb();
        }
      }.bind(this));
    }.bind(this));
  }


  function View(viewManager) {
    this.viewManager = viewManager;
    this.viewNode = null;
    this.nodes = {};
    this.loaded = false;

    this.options = {};
  }

  View.extend = function(subClass){
    subClass.prototype = Object.create(View.prototype);
    subClass.prototype.constructor = subClass;
  }

  View.prototype.init = function(node, cb) {
    this.viewNode = node;
    cb();
  }

  View.prototype.preShow = function(options, cb) {
    cb();
  }

  View.prototype.preHide = function(cb) {
    cb();
  }

  /*
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
  */

  exports.ViewManager = ViewManager;
  exports.View = View;
});
