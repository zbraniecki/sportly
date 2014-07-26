define(function (require, exports) {
  'use strict';

  function App() {
  }

  App.extend = function(subClass){
    subClass.prototype = Object.create(App.prototype);
    subClass.prototype.constructor = subClass;
  }

  exports.App = App;
});
