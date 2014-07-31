define(['feather/view_manager'],
       function (vm) {
  'use strict';

  function Chrome(app) {
    this.nodes = [];
    this.app = app;
    this.viewManager = new vm.ViewManager(this);
    this.chromeNode = null;

    this.breadcrumbs = [];
  }

  Chrome.prototype.init = function() {

    this.chromeNode = document.body;

    return new Promise(function (resolve, reject) {
      this.nodes['nav'] = this.chromeNode.querySelector('nav');
      this.nodes['breadcrumb'] = this.chromeNode.querySelector('.breadcrumb');

      this.nodes['logo'] = this.chromeNode.querySelector('#logo');
      this.nodes['logo'].addEventListener('click', function() {
        this.chromeNode.classList.toggle('menu_open');
      }.bind(this));

      this.updateBreadcrumbs();

      this.viewManager.init().then(function() {
        resolve();
      });
    }.bind(this));
  }

  Chrome.prototype.updateBreadcrumbs = function() {
    for (var i in this.breadcrumbs) {
      var li = document.createElement('li');
      li.textContent = this.breadcrumbs[i].name;

      this.nodes['breadcrumb'].appendChild(li);
    }

    this.nodes['breadcrumb'].lastElementChild.classList.add('active');
  }

  Chrome.prototype.updateMenu = function() {
  }

  return {
    Chrome: Chrome,
  };
});
