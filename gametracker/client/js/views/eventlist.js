if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var ViewManager = require('../view_manager');
  var View = ViewManager.View;

  function EventListView(viewManager) {
    View.call(this, viewManager);
  }


  EventListView.prototype = Object.create(View.prototype);
  EventListView.prototype.constructor = EventListView;

  EventListView.prototype._drawUI = function(cb) {
    var db = this.viewManager.app.db;
    db.getEvents(function (events) {
      var rootNode = this.viewNode.querySelector('tbody');
      events.forEach(function(evt) {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.textContent = evt.name;
        tr.appendChild(td);
        rootNode.appendChild(tr);
      }.bind(this));
      cb();
    }.bind(this));
  }

  EventListView.prototype._bindUI = function(cb) {
    var self = this;

    this.nodes['add_button'] = this.viewNode.querySelector('.btn-add');
    this.nodes['add_button'].addEventListener('click', function() {
      self.viewManager.showView('eventedit'); 
    });
    cb();
  }

  exports.View = EventListView;
});
