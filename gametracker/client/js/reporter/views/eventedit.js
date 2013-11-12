if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var ViewManager = require('feather/view_manager');
  var View = ViewManager.View;

  var EventForm = null;
  var EventModel = null;

  function EventEditView(viewManager) {
    View.call(this, viewManager);
  }


  EventEditView.prototype = Object.create(View.prototype);
  EventEditView.prototype.constructor = EventEditView;

  EventEditView.prototype._init = function(cb) {
    require(['feather/forms/model_form',
             'feather/forms/manager',
             'reporter/models/event',
             'reporter/forms/event'], function(MF, FM, EM, EF) {
      EventForm = EF.EventForm;
      EventModel = EM.EventModel;
      cb();
    });
  }

  EventEditView.prototype._preShow = function(cb) {
    var rootNode = this.viewNode.querySelector('.panel-body');

    if (rootNode.childNodes.length) {
      rootNode.removeChild(rootNode.childNodes[0]);
    }

    if (!('eid' in this.options)) {
      var ef = new EventForm();

      ef.addEventListener('commit', function() {
        this.viewManager.showView('eventlist');
      }.bind(this));

      var domFragment = ef.getHTML();

      rootNode.appendChild(domFragment);
      cb();
      return;
    }
    EventModel.objects.get(this.options.eid, function(model) {
      var ef = new EventForm(model);

      ef.addEventListener('commit', function() {
        this.viewManager.showView('eventlist');
      }.bind(this));

      var domFragment = ef.getHTML();

      rootNode.appendChild(domFragment);
      cb();
    }.bind(this));
  }

  EventEditView.prototype._bindUI = function(cb) {
    var self = this;

    this.nodes['back_button'] = this.viewNode.querySelector('.btn-back');
    this.nodes['back_button'].addEventListener('click', function() {
      self.viewManager.showView('eventlist'); 
    });
    cb();
  }

  exports.View = EventEditView;
});

