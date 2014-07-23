(function() {
  require.config({
    baseUrl: "./js",
    urlArgs: "bust=" +  (new Date()).getTime()
  });
  require(['test/test'], function(test) {
    var test = new test.Test();
    test.init();
  });
})();
