define(['feather/utils/io'],
       function (io) {
  'use strict';

var DEBUG = false;

function dump(msg) {
  if (DEBUG) {
    console.log('ViewManager: '+msg);
  }
}

  function ViewManager(chrome) {
    this.chrome = chrome;
    this.views = {};
    this.currentView = null;
  }

  ViewManager.prototype.init = function(opts) {
    var viewNodes = document.querySelectorAll('#views > section');

    return new Promise(function (resolve, reject) {
      for (var i = 0; i < viewNodes.length; i++) {
        var node = viewNodes[i];
        var name = viewNodes[i].getAttribute('id');

        this.views[name] = {'node': viewNodes[i], 'obj': null};
      } 
      resolve();
    }.bind(this));
  }

  ViewManager.prototype.loadHTML = function(name) {
    return new Promise(function (resolve, reject) {
      var link = document.querySelector('link[rel="import"][for="'+name+'"]');

      var importURL = link.getAttribute('href');

      io.load(importURL).then(function(source) {
        this.views[name].node.innerHTML = source;
        resolve();
      }.bind(this));
    }.bind(this));
  }

  ViewManager.prototype.loadClass = function(name) {
    var view = this.views[name];
    var appDir = this.chrome.app.constructor.name.toLowerCase();

    return new Promise(function (resolve, reject) {
      require([appDir+'/views/'+name], function(View) {
        view.obj = new View.View(this);
        view.obj.init(view.node).then(function() {
          resolve();
        });
      }.bind(this));
    }.bind(this));
  }

  ViewManager.prototype.initView = function(name) {
    return new Promise(function (resolve, reject) {
      this.views[name].node = document.querySelector('section[is="'+name+'"]'); 
      this.loadHTML(name).then(this.loadClass.bind(this, name)).then(resolve);
    }.bind(this));
  }

  ViewManager.prototype.ensureViewInitialized = function(name) {
    var view = this.views[name];
    return new Promise(function (resolve, reject) {
      if (!view.obj) {
        this.initView(name).then(resolve);
      } else {
        resolve();
      }
    }.bind(this));
  }

  ViewManager.prototype.showView = function(name, options) {
    var view = this.views[name];

    return new Promise(function (resolve, reject) {
      this.ensureViewInitialized(name).then(function() {
        view.obj.preShow(options).then(function() {
          if (this.currentView) {
            this.views[this.currentView].obj.preHide();
            this.views[this.currentView].node.classList.remove('current');
          }
          view.node.classList.add('current');
          this.currentView = name;
          resolve();
        }.bind(this));
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

  View.prototype.init = function(node) {
    return new Promise(function (resolve, reject) {
      dump('View.init '+this.constructor.name);
      this.viewNode = node;
      resolve();
    }.bind(this));
  }

  View.prototype.preShow = function(options, cb) {
    return new Promise(function (resolve, reject) {
      dump('View.preShow '+this.constructor.name);
      resolve();
    }.bind(this));
  }

  View.prototype.preHide = function(cb) {
    dump('View.preHide '+this.constructor.name);
    if (cb) {
      cb();
    }
  }

  return {
    ViewManager: ViewManager,
    View: View
  };
});
