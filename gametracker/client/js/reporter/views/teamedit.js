if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var ViewManager = require('feather/view_manager');
  var View = ViewManager.View;

  var TeamForm = null;
  var TeamModel = null;

  function TeamEditView(viewManager) {
    View.call(this, viewManager);
  }


  TeamEditView.prototype = Object.create(View.prototype);
  TeamEditView.prototype.constructor = TeamEditView;

  TeamEditView.prototype._init = function(cb) {
    require(['feather/forms/model_form',
             'feather/forms/manager',
             'reporter/models/team',
             'reporter/forms/team'], function(MF, FM, TM, TF) {
      TeamForm = TF.TeamForm;
      TeamModel = TM.TeamModel;
      cb();
    });
  }

  TeamEditView.prototype._preShow = function(cb) {
    var rootNode = this.viewNode.querySelector('.panel-body');

    if (rootNode.childNodes.length) {
      rootNode.removeChild(rootNode.childNodes[0]);
    }

    if (!('eid' in this.options)) {
      var tf = new TeamForm();

      tf.addEventListener('commit', function() {
        this.viewManager.showView('teamlist');
      }.bind(this));

      var domFragment = tf.getHTML();

      rootNode.appendChild(domFragment);
      cb();
      return;
    }
    TeamModel.objects.get(this.options.eid, function(model) {
      var tf = new TeamForm(model);

      tf.addEventListener('commit', function() {
        this.viewManager.showView('teamlist');
      }.bind(this));

      var domFragment = ef.getHTML();

      rootNode.appendChild(domFragment);
      cb();
    }.bind(this));
  }

  TeamEditView.prototype._bindUI = function(cb) {
    var self = this;

    this.nodes['back_button'] = this.viewNode.querySelector('.btn-back');
    this.nodes['back_button'].addEventListener('click', function() {
      self.viewManager.showView('teamlist'); 
    });
    cb();
  }

  exports.View = TeamEditView;
});

