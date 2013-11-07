if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var ViewManager = require('../view_manager');
  var View = ViewManager.View;
  var DateFormatter = require('utils/date').DateFormatter;

  var cols = [
    'date',
    'name',
    'division',
    'teams',
    'status',
    'action',
  ];


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
        rootNode.appendChild(this.buildRowNode(evt));
      }.bind(this));

      cb();
    }.bind(this));
  }

  EventListView.prototype.onRemoveEvent = function(e) {
    var tr = e.target.parentNode.parentNode;

    var evt = {
      '_id': tr.dataset.eid,
      '_rev': tr.dataset.rev
    };

    this.viewManager.app.db.removeEvent(evt);
  }

  EventListView.prototype.onEditEvent = function(e) {
  }

  EventListView.prototype.buildRowNode = function(evt) {
    var tr = document.createElement('tr');
    tr.dataset.eid = evt._id;
    tr.dataset.rev = evt._rev;

    cols.forEach(function (col) {
      var td = document.createElement('td');
      switch (col) {
        case 'date':
          if (evt.start_date && evt.end_date) {
            var dtStart = DateFormatter.dateToString(evt.start_date);
            var dtEnd = DateFormatter.dateToString(evt.end_date);
            td.textContent = dtStart + ' - ' + dtEnd;
          }
          break;
        case 'name':
          td.textContent = evt.name;
          break;
        case 'action':
          var button = document.createElement('button');
          button.classList.add('btn');
          button.classList.add('btn-default');
          button.classList.add('btn-lg');
          button.classList.add('btn-edit');
          var span = document.createElement('span');
          span.classList.add('glyphicon');
          span.classList.add('glyphicon-edit');
          button.appendChild(span);
          button.addEventListener('click', this.onEditEvent.bind(this));
          td.appendChild(button);

          var button = document.createElement('button');
          button.classList.add('btn');
          button.classList.add('btn-default');
          button.classList.add('btn-lg');
          button.classList.add('btn-remove');
          var span = document.createElement('span');
          span.classList.add('glyphicon');
          span.classList.add('glyphicon-remove');
          button.appendChild(span);
          button.addEventListener('click', this.onRemoveEvent.bind(this));
          td.appendChild(button);
      }
      tr.appendChild(td);
    }.bind(this));
    return tr;
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
