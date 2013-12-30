if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var ViewManager = require('feather/view_manager');
  var RosterModel = require('reporter/models/roster').RosterModel;
  var View = ViewManager.View;
  var DateFormatter = require('feather/utils/date').DateFormatter;

  var cols = [
    'firstname',
    'lastname',
    'action',
  ];


  function RosterListView(viewManager) {
    View.call(this, viewManager);
  }


  RosterListView.prototype = Object.create(View.prototype);
  RosterListView.prototype.constructor = RosterListView;

  RosterListView.prototype.drawRows = function(cb, docs) {
    docs.forEach(this.drawRow.bind(this));
    cb();
  }

  RosterListView.prototype.drawRow = function(doc) {
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

  RosterListView.prototype._drawUI = function(cb) {
    var rootNode = this.viewNode.querySelector('tbody');

    RosterModel.objects.all(this.drawRows.bind(this, cb));

    // it unfortunately reruns all events
    RosterModel.objects.addEventListener('added', this.drawRow.bind(this));
  }

  RosterListView.prototype.onRemoveEvent = function(e) {
    var tr = e.target.parentNode.parentNode;

    var evt = {
      '_id': tr.dataset.eid,
      '_rev': tr.dataset.rev
    };

    RosterModel.objects.delete(evt);
  }

  RosterListView.prototype.onTeamEvent = function(e) {
    var tr = e.target.parentNode.parentNode;
    this.viewManager.showView('rosteredit', {
      eid: tr.dataset.eid 
    }); 
  }

  RosterListView.prototype.buildRowNode = function(evt) {
    var tr = document.createElement('tr');
    tr.dataset.eid = evt._id;
    tr.dataset.rev = evt._rev;

    cols.forEach(function (col) {
      var td = document.createElement('td');
      switch (col) {
        case 'firstname':
        case 'lastname':
          td.textContent = evt[col];
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
          button.addEventListener('click', this.onTeamEvent.bind(this));
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

  RosterListView.prototype._bindUI = function(cb) {
    var self = this;

    this.nodes['add_button'] = this.viewNode.querySelector('.btn-add');
    this.nodes['add_button'].addEventListener('click', function() {
      self.viewManager.showView('rosteredit'); 
    });

    this.nodes['events_button'] = this.viewNode.querySelector('.btn-events');
    this.nodes['events_button'].addEventListener('click', function() {
      self.viewManager.showView('eventlist'); 
    });

    this.nodes['teams_button'] = this.viewNode.querySelector('.btn-teams');
    this.nodes['teams_button'].addEventListener('click', function() {
      self.viewManager.showView('teamlist'); 
    });

    RosterModel.objects.addEventListener('removed', function(eid) {
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

  exports.View = RosterListView;
});

