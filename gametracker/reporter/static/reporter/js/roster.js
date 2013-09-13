
function RosterPanel() {
}

RosterPanel.prototype = Object.create(Panel.prototype);
RosterPanel.prototype.construtor = RosterPanel;

panels['roster'].class = RosterPanel;

RosterPanel.prototype.bindAPI = function() {
  $('.view-roster .btn-back').click(function() {
    loadPanel('gamelist');
  });
}

RosterPanel.prototype.draw = function() {
  var tbody = $('#view-roster .table-roster tbody');
  tbody.empty();
  var tr, td;

  var stats = {
    'players': 0,
    'men': 0,
    'women': 0,
    'handlers': 0,
    'cutters': 0,
    'defenders': 0,
  };

  var roles = [
    'handler',
    'cutter',
    'thrower',
    'defender'
  ];

  for(var i in eventData.players) {
    var player = eventData.players[i];

    stats.players += 1;
    if (player.sex == 'm') {
      stats.men += 1;
    } else {
      stats.women += 1;
    }
    for (var j in player.roles) {
      switch (player.roles[j]) {
        case 'defender':
          stats.defenders += 1;
          break;
        case 'handler':
          stats.handlers += 1;
          break;
        case 'cutter':
          stats.cutters += 1;
          break;
      }
    }
    tr = $('<tr/>');
    for (var key in player) {
      td = $('<td/>');
      if (key == 'pic') {
        //var img = $("<img/>");
        //img.attr('src', "/static/reporter/img/"+player[key]);
        //td.append(img);
        continue;
      } else if (key == 'roles') {
        td.text(player[key].join(', '));
      } else {
        td.text(player[key]);
      }
      tr.append(td);
    }
    tbody.append(tr);
  }

  for (i in stats) {
    $('#roster-stats-'+i).text(stats[i]);
  }
}
