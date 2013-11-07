(function() {
  require.config({
    baseUrl: "./js",
    urlArgs: "bust=" +  (new Date()).getTime()
  });
  require(['reporter/reporter'], function(reporter) {
    var reporter = new reporter.Reporter();
    reporter.init();
  });
})();
