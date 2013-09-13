function formatTime(num) {
  return num < 10? '0' + num : num;
}

function formatHour(h, m) {
  if (h > 12) {
    h -= 12;
    return formatTime(h) + ':' + formatTime(m) + 'pm';
  }
  return formatTime(h) + ':' + formatTime(m) + 'am';
}

function formatTwoDigit(h) {
  if (h < 10) {
    return '0' + h;
  }
  return h;
}

function formatDate(date) {
  var today = new Date();

  var ref = new Date(date);

  if (date.getFullYear() == today.getFullYear()) {
    if (date.getMonth() == today.getMonth() &&
        date.getDate() == today.getDate()) {
      return formatHour(ref.getHours(), ref.getMinutes());
    }
    return (ref.getMonth() + 1) +
           '/' +
           (ref.getDate()) +
           ' ' +
           formatHour(ref.getHours(), ref.getMinutes());
  }    
  return ref.getFullYear() + 
         '-' +
         (ref.getMonth() + 1) +
         '-' +
         (ref.getDate()) +
         ' ' +
         formatHour(ref.getHours(), ref.getMinutes());
}

function formatDateString(date) {
  var curr_date = formatTwoDigit(date.getDate());
  var curr_month = formatTwoDigit(date.getMonth() + 1); //Months are zero based
  var curr_year = date.getFullYear();
  var curr_hour = formatTwoDigit(date.getHours());
  var curr_minute = formatTwoDigit(date.getMinutes());
  return curr_year + "-" + curr_month + "-" + curr_date + " " + curr_hour + ":" + curr_minute;
}


function humanizeTimeDiff(prefix, time1, time2) {
  var timeDiff = time1 - time2;

  if (timeDiff < -1000) {
    return '';
  }
  if (timeDiff < 1000) {
    return prefix + ' now';
  }
  if (timeDiff < 1000 * 60 * 60) {
    return prefix + ' in ' + parseInt(timeDiff/1000/60) + ' min';
  }
  if (timeDiff < 1000 * 60 * 60 * 24) {
    return prefix + ' in ' + parseInt(timeDiff/1000/60/60) + ' hours';
  }
  if (timeDiff < 1000 * 60 * 60 * 24 * 7) {
    return prefix + ' in ' + parseInt(timeDiff/1000/60/60/24) + ' days';
  }

  return prefix + ' in a long time';
}

function parseDate(str){
    dateTime = str.split(" ");

    var date = dateTime[0].split("-");
    var yyyy = date[0];
    var mm = date[1]-1;
    var dd = date[2];

    var time = dateTime[1].split(":");
    var h = time[0];
    var m = time[1];

    return new Date(yyyy,mm,dd,h,m);
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}
