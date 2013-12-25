if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var ViewManager = require('feather/view_manager');
  var EventModel = require('reporter/models/event').EventModel;
  var View = ViewManager.View;
  var DateFormatter = require('feather/utils/date').DateFormatter;

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

  EventListView.prototype.drawRows = function(cb, docs) {
    docs.forEach(this.drawRow.bind(this));
    cb();
  }

  EventListView.prototype.drawRow = function(doc) {
    var rootNode = this.viewNode.querySelector('tbody');
    var rows = rootNode.children;
    var newRow = this.buildRowNode(doc.fields);
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (row.dataset.eid == doc.fields._id) {
        rootNode.replaceChild(newRow, row);
        return;
      }
    }
    rootNode.appendChild(newRow);
  }

  EventListView.prototype._drawUI = function(cb) {
    var rootNode = this.viewNode.querySelector('tbody');

    EventModel.objects.all(this.drawRows.bind(this, cb));

    // it unfortunately reruns all events
    EventModel.objects.addEventListener('added', this.drawRow.bind(this));
  }


  EventListView.prototype.onRemoveEvent = function(e) {
    var tr = e.target.parentNode.parentNode;

    var evt = {
      '_id': tr.dataset.eid,
      '_rev': tr.dataset.rev
    };

    EventModel.objects.delete(evt);
  }

  EventListView.prototype.onEditEvent = function(e) {
    var tr = e.target.parentNode.parentNode;
    this.viewManager.showView('eventedit', {
      eid: tr.dataset.eid 
    }); 
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
            var dtStart = new Date(evt.start_date);
            var dtEnd = new Date(evt.end_date);
            var startStr = DateFormatter.dateToString(dtStart);
            var endStr = DateFormatter.dateToString(dtEnd);
            td.textContent = startStr + ' - ' + endStr;
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

    this.nodes['teams_button'] = this.viewNode.querySelector('.btn-teams');
    this.nodes['teams_button'].addEventListener('click', function() {
      self.viewManager.showView('teamlist'); 
    });

    EventModel.objects.addEventListener('removed', function(eid) {
      var rootNode = this.viewNode.querySelector('tbody');
      var trs = rootNode.getElementsByTagName('tr');

      for (var i=0; i < trs.length; i++) {
        if (trs[i].dataset.eid == eid) {
          trs[i].parentNode.removeChild(trs[i]);
        }
      }
    }.bind(this));
    cb();
  }

  exports.View = EventListView;
});