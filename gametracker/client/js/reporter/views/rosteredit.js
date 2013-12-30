if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var ViewManager = require('feather/view_manager');
  var View = ViewManager.View;

  var RosterForm = null;
  var RosterModel = null;

  function RosterEditView(viewManager) {
    View.call(this, viewManager);
  }


  RosterEditView.prototype = Object.create(View.prototype);
  RosterEditView.prototype.constructor = RosterEditView;

  RosterEditView.prototype._init = function(cb) {
    require(['feather/forms/model_form',
             'feather/forms/manager',
             'reporter/models/roster',
             'reporter/forms/roster'], function(MF, FM, RM, RF) {
      RosterForm = RF.RosterForm;
      RosterModel = RM.RosterModel;
      cb();
    });
  }

  RosterEditView.prototype._preShow = function(cb) {
    var rootNode = this.viewNode.querySelector('.panel-body');

    if (rootNode.childNodes.length) {
      rootNode.removeChild(rootNode.childNodes[0]);
    }

    if (!('eid' in this.options)) {
      var tf = new RosterForm();

      tf.addEventListener('commit', function() {
        this.viewManager.showView('rosterlist');
      }.bind(this));

      var domFragment = tf.getHTML();

      rootNode.appendChild(domFragment);
      cb();
      return;
    }
    RosterModel.objects.get(this.options.eid, function(model) {
      var tf = new RosterForm(model);

      tf.addEventListener('commit', function() {
        this.viewManager.showView('rosterlist');
      }.bind(this));

      var domFragment = tf.getHTML();

      rootNode.appendChild(domFragment);
      cb();
    }.bind(this));
  }

  RosterEditView.prototype._bindUI = function(cb) {
    var self = this;

    this.nodes['back_button'] = this.viewNode.querySelector('.btn-back');
    this.nodes['back_button'].addEventListener('click', function() {
      self.viewManager.showView('rosterlist'); 
    });
    cb();
  }

  exports.View = RosterEditView;
});

