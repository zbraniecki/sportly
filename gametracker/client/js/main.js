(function() {
  require(['reporter',
           'view_manager',
           'eventemitter',
           'db',
           'utils/date'], function(Reporter) {
    var reporter = new Reporter.Reporter();
    reporter.init();
  });
})();
