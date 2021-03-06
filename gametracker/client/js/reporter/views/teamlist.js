if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var ViewManager = require('feather/view_manager');
  var TeamModel = require('reporter/models/team').TeamModel;
  var View = ViewManager.View;
  var DateFormatter = require('feather/utils/date').DateFormatter;

  var cols = [
    'name',
    'division',
    'city',
    'region',
    'country',
    'action',
  ];


  function TeamListView(viewManager) {
    View.call(this, viewManager);
  }


  TeamListView.prototype = Object.create(View.prototype);
  TeamListView.prototype.constructor = TeamListView;

  TeamListView.prototype.drawRows = function(cb, docs) {
    docs.forEach(this.drawRow.bind(this));
    cb();
  }

  TeamListView.prototype.drawRow = function(doc) {
    var rootNode = this.viewNode.querySelector('tbody');
    var rows = rootNode.children;
    var newRow = this.buildRowNode(doc.fields);
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (row.dataset.tid == doc.fields._id) {
        rootNode.replaceChild(newRow, row);
        return;
      }
    }
    rootNode.appendChild(newRow);
  }

  TeamListView.prototype._drawUI = function(cb) {
    var rootNode = this.viewNode.querySelector('tbody');

    TeamModel.objects.all(this.drawRows.bind(this, cb));

    // it unfortunately reruns all events
    TeamModel.objects.addEventListener('added', this.drawRow.bind(this));
  }

  TeamListView.prototype.onRemoveEvent = function(e) {
    var tr = e.target.parentNode.parentNode;

    var evt = {
      '_id': tr.dataset.tid,
      '_rev': tr.dataset.rev
    };

    TeamModel.objects.delete(evt);
  }

  TeamListView.prototype.onTeamEvent = function(e) {
    var tr = e.target.parentNode.parentNode;
    this.viewManager.showView('teamedit', {
      tid: tr.dataset.tid 
    }); 
  }

  TeamListView.prototype.onRosterListEvent = function(e) {
    var tr = e.target.parentNode.parentNode;
    this.viewManager.showView('rosterlist', {
      tid: tr.dataset.tid 
    }); 
  }

  TeamListView.prototype.buildRowNode = function(evt) {
    var tr = document.createElement('tr');
    tr.dataset.tid = evt._id;
    tr.dataset.rev = evt._rev;

    cols.forEach(function (col) {
      var td = document.createElement('td');
      switch (col) {
        case 'name':
        case 'division':
        case 'city':
        case 'region':
        case 'country':
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
          span.classList.add('glyphicon-user');
          button.appendChild(span);
          button.addEventListener('click', this.onRosterListEvent.bind(this));
          td.appendChild(button);

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

  TeamListView.prototype._bindUI = function(cb) {
    var self = this;

    this.nodes['add_button'] = this.viewNode.querySelector('.btn-add');
    this.nodes['add_button'].addEventListener('click', function() {
      self.viewManager.showView('teamedit'); 
    });

    this.nodes['events_button'] = this.viewNode.querySelector('.btn-events');
    this.nodes['events_button'].addEventListener('click', function() {
      self.viewManager.showView('eventlist'); 
    });

    this.nodes['players_button'] = this.viewNode.querySelector('.btn-players');
    this.nodes['players_button'].addEventListener('click', function() {
      self.viewManager.showView('playerlist'); 
    });

    TeamModel.objects.addEventListener('removed', function(tid) {
      var rootNode = this.viewNode.querySelector('tbody');
      var trs = rootNode.getElementsByTagName('tr');

      for (var i=0; i < trs.length; i++) {
        if (trs[i].dataset.tid == tid) {
          trs[i].parentNode.removeChild(trs[i]);
        }
      }
    }.bind(this));
    cb();
  }

  exports.View = TeamListView;
});

