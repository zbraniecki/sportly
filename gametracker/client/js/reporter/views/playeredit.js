if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var ViewManager = require('feather/view_manager');
  var View = ViewManager.View;

  var PlayerForm = null;
  var PlayerModel = null;

  function PlayerEditView(viewManager) {
    View.call(this, viewManager);
  }


  PlayerEditView.prototype = Object.create(View.prototype);
  PlayerEditView.prototype.constructor = PlayerEditView;

  PlayerEditView.prototype._init = function(cb) {
    require(['feather/forms/model_form',
             'feather/forms/manager',
             'reporter/models/player',
             'reporter/forms/player'], function(MF, FM, PM, PF) {
      PlayerForm = PF.PlayerForm;
      PlayerModel = PM.PlayerModel;
      cb();
    });
  }

  PlayerEditView.prototype._preShow = function(cb) {
    var rootNode = this.viewNode.querySelector('.panel-body');

    if (rootNode.childNodes.length) {
      rootNode.removeChild(rootNode.childNodes[0]);
    }

    if (!('eid' in this.options)) {
      var tf = new PlayerForm();

      tf.addEventListener('commit', function() {
        this.viewManager.showView('playerlist');
      }.bind(this));

      var domFragment = tf.getHTML();

      rootNode.appendChild(domFragment);
      cb();
      return;
    }
    PlayerModel.objects.get(this.options.eid, function(model) {
      var tf = new PlayerForm(model);

      tf.addEventListener('commit', function() {
        this.viewManager.showView('playerlist');
      }.bind(this));

      var domFragment = tf.getHTML();

      rootNode.appendChild(domFragment);
      cb();
    }.bind(this));
  }

  PlayerEditView.prototype._bindUI = function(cb) {
    var self = this;

    this.nodes['back_button'] = this.viewNode.querySelector('.btn-back');
    this.nodes['back_button'].addEventListener('click', function() {
      self.viewManager.showView('playerlist'); 
    });
    cb();
  }

  exports.View = PlayerEditView;
});

