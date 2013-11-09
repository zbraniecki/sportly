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

  EventListView.prototype._drawUI = function(cb) {
    var rootNode = this.viewNode.querySelector('tbody');
    EventModel.objects.all(function(models) {
      models.forEach(function(model) {
        rootNode.appendChild(this.buildRowNode(model.fields));
      }.bind(this));
    }.bind(this));

    console.log('setting listener');
    EventModel.objects.addEventListener('event', 'added', function(evt) {
      console.log(evt);
      var rootNode = this.viewNode.querySelector('tbody');
      rootNode.appendChild(this.buildRowNode(evt));
    }.bind(this));
    cb();
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
