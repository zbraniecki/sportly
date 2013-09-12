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

function formatDate(date) {
  /*
  t = "2013-09-12 09:00";
  var t = convertDateTime(t);
  console.log(t.toISOString());
  t.setTime( t.getTime() - t.getTimezoneOffset()*60*1000 );
  console.log(t.toGMTString());
  */
  var today = new Date();

  var ref = new Date(date);

  if (date.getFullYear() == today.getFullYear()) {
    if (date.getMonth() == today.getMonth() &&
        date.getDate() == today.getDate()) {
      return formatHour(ref.getHours(), ref.getMinutes());
    }
    return (ref.getMonth() + 1) +
           '/' +
           (ref.getDate() + 1) +
           ' ' +
           formatHour(ref.getHours(), ref.getMinutes());
  }    
  return ref.getFullYear() + 
         '-' +
         (ref.getMonth() + 1) +
         '-' +
         (ref.getDate() + 1) +
         ' ' +
         formatHour(ref.getHours(), ref.getMinutes());
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
    return prefix + ' in ' + (timeDiff/1000/60) + ' min';
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
