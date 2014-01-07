define(function (require, exports) {
  'use strict';

var DEBUG = true;

function dump(msg) {
  if (DEBUG) {
    console.log('ViewManager: '+msg);
  }
}

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
          this.views[this.currentView].obj.preHide();
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
    dump('View.init '+this.constructor.name);
    this.viewNode = node;
    cb();
  }

  View.prototype.preShow = function(options, cb) {
    dump('View.preShow '+this.constructor.name);
    cb();
  }

  View.prototype.preHide = function(cb) {
    dump('View.preHide '+this.constructor.name);
    if (cb) {
      cb();
    }
  }

  exports.ViewManager = ViewManager;
  exports.View = View;
});
