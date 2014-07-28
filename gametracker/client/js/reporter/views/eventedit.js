define(['feather/view_manager'],
       function (vm) {
  'use strict';

  var View = vm.View;

  var EventForm = null;
  var EventModel = null;

  function EventEditView(viewManager) {
    View.call(this, viewManager);
  }

  View.extend(EventEditView);

  EventEditView.prototype.init = function(node) {
    return new Promise(function (resolve, reject) {
      require(['reporter/models/event',
               'reporter/forms/event'], function(EM, EF) {
          EventForm = EF.EventForm;
          EventModel = EM.EventModel;
          View.prototype.init.call(this, node).then(function() {
            resolve();
          });
          var self = this;

          this.nodes['back_button'] = this.viewNode.querySelector('.btn-back');
          this.nodes['back_button'].addEventListener('click', function() {
            self.viewManager.showView('eventlist'); 
          });
        }.bind(this));
    }.bind(this));
  }

  EventEditView.prototype.preShow = function(options) {
    return new Promise(function (resolve, reject) {
      var rootNode = this.viewNode.querySelector('.panel-body');

      if (rootNode.childNodes.length) {
        rootNode.removeChild(rootNode.childNodes[0]);
      }

      if (options && ('eid' in options)) {
        EventModel.objects.get(options.eid, function(model) {
          var ef = new EventForm(model);

          ef.addEventListener('commit', function() {
            this.viewManager.showView('eventlist');
          }.bind(this));

          var domFragment = ef.getHTML();

          rootNode.appendChild(domFragment);
          View.prototype.preShow.call(this, options, cb);
        }.bind(this));
        return;
      }
      var ef = new EventForm();

      ef.addEventListener('commit', function() {
        this.viewManager.showView('eventlist');
      }.bind(this));

      var domFragment = ef.getHTML();

      rootNode.appendChild(domFragment);
      View.prototype.preShow.call(this, options).then(function() {
        resolve();
      });
    }.bind(this));
  }

  return {
    View: EventEditView,
  };
});

