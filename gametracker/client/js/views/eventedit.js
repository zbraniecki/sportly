if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var ViewManager = require('../view_manager');
  var View = ViewManager.View;

  var EventForm = null;

  function EventEditView(viewManager) {
    View.call(this, viewManager);
  }


  EventEditView.prototype = Object.create(View.prototype);
  EventEditView.prototype.constructor = EventEditView;

  EventEditView.prototype._init = function(cb) {
    require(['../model_form',
             '../form_manager',
             '../model/event',
             '../form/event'], function(MF, FM, EM, EF) {
      EventForm = EF.EventForm;
      cb();
    });
  }

  EventEditView.prototype._drawUI = function(cb) {
    var ef = new EventForm(this.viewManager.app);

    ef.addEventListener('commit', function() {
      this.viewManager.showView('eventlist');
    }.bind(this));

    var domFragment = ef.getHTML();
    var rootNode = this.viewNode.querySelector('.panel-body');

    rootNode.appendChild(domFragment);
    cb();
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

