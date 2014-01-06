define(function (require, exports) {
  'use strict';

  var View = require('feather/view_manager').View;
  var DateFormatter = require('feather/utils/date').DateFormatter;
  var EventModel = require('reporter/models/event').EventModel;

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

  View.extend(EventListView);

  EventListView.prototype.init = function(node, cb) {
    View.prototype.init.call(this, node, cb);

    var self = this;

    this.nodes['add_button'] = this.viewNode.querySelector('.btn-add');
    this.nodes['add_button'].addEventListener('click', function() {
      self.viewManager.showView('eventedit'); 
    });

    this.nodes['teams_button'] = this.viewNode.querySelector('.btn-teams');
    this.nodes['teams_button'].addEventListener('click', function() {
      self.viewManager.showView('teamlist'); 
    });

    this.nodes['players_button'] = this.viewNode.querySelector('.btn-players');
    this.nodes['players_button'].addEventListener('click', function() {
      self.viewManager.showView('playerlist'); 
    });

  }

  EventListView.prototype.onDataLoaded = function() {
    EventModel.objects.addEventListener('added', this.drawRow.bind(this));
    EventModel.objects.addEventListener('removed', this.removeRow.bind(this));
    //EventModel.db.sync('event');
  }

  EventListView.prototype.preShow = function(options, cb) {
    var EventModel = require('reporter/models/event').EventModel;

    EventModel.objects.all(this.drawRows.bind(this, function() {
      this.onDataLoaded();
      View.prototype.preShow.call(this, options, cb);
    }.bind(this)));

  }

  EventListView.prototype.preHide = function(cb) {
    EventModel.objects.removeEventListener('added');
    EventModel.objects.removeEventListener('removed');
    View.prototype.preHide.call(this, cb);
  }


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

  EventListView.prototype.removeRow = function(eid) {
    console.log('removed registered '+eid)
    var rootNode = this.viewNode.querySelector('tbody');
    var trs = rootNode.getElementsByTagName('tr');

    for (var i=0; i < trs.length; i++) {
      if (trs[i].dataset.eid == eid) {
        trs[i].parentNode.removeChild(trs[i]);
      }
    }
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

  exports.View = EventListView;
});
