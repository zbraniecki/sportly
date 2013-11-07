if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

function formatTwoDigit(h) {
  if (h < 10) {
    return '0' + h;
  }
  return h;
}

  exports.DateFormatter = {
    stringToDate: function(str) {
      var dateTime = str.split(" ");

      var date = dateTime[0].split("-");
      var yyyy = date[0];
      var mm = date[1]-1;
      var dd = date[2];

      var time = dateTime[1].split(":");
      var h = time[0];
      var m = time[1];

      return new Date(yyyy,mm,dd,h,m);
    },
    dateToString: function(date) {
      var curr_date = formatTwoDigit(date.getDate());
      var curr_month = formatTwoDigit(date.getMonth() + 1); //Months are zero based
      var curr_year = date.getFullYear();
      var curr_hour = formatTwoDigit(date.getHours());
      var curr_minute = formatTwoDigit(date.getMinutes());
      return curr_year + "-" + curr_month + "-" + curr_date + " " + curr_hour + ":" + curr_minute;
    }
  };

});
