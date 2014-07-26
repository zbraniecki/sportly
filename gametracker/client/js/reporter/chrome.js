define(['feather/view_manager'],
       function (vm) {
  'use strict';

  function Chrome(app) {
    this.nodes = [];
    this.app = app;
    this.viewManager = new vm.ViewManager(this);
    this.chromeNode = null;
  }

  Chrome.prototype.init = function() {

    this.chromeNode = document.body;

    return new Promise(function (resolve, reject) {
      this.nodes['nav'] = this.chromeNode.querySelector('nav');

      this.nodes['logo'] = this.chromeNode.querySelector('#logo');
      this.nodes['logo'].addEventListener('click', function() {
        this.chromeNode.classList.toggle('menu_open');
      }.bind(this));

      this.viewManager.init().then(function() {
        resolve();
      });
    }.bind(this));
  }


  return {
    Chrome: Chrome,
  };
});
