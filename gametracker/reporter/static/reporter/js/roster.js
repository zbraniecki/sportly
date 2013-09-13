
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

  var players = [
    {
      number: 8,
      pic: 'player8_photo.jpg',
      name: 'Zibi',
      lastname: 'Braniecki',
      nick: 'Zibi',
      sex: 'm',
      roles: ['defender', 'cutter'],
    },
    {
      number: 69,
      pic: 'player69_photo.jpg',
      name: 'Alice',
      lastname: 'Barton',
      nick: 'Alice',
      sex: 'f',
      roles: [],
    },
    {
      number: 16,
      pic: null,
      name: 'Arvind',
      lastname: 'Chari',
      nick: 'Arvind',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Carl',
      lastname: 'Ma',
      nick: 'Carl',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Christabelle',
      lastname: 'Piansay',
      nick: 'Belle',
      sex: 'f',
      roles: [],
    },
    {
      number: 17,
      pic: null,
      name: 'Deborah',
      lastname: 'Liu',
      nick: 'Debbie',
      sex: 'f',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Pradeep',
      lastname: 'Nair',
      nick: 'Pradeep',
      sex: 'm',
      roles: [],
    },
    {
      number: 20,
      pic: null,
      name: 'Eric',
      lastname: 'Hartge',
      nick: 'Hartch',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Jason',
      lastname: 'Schissel',
      nick: 'Jason',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Katherine',
      lastname: 'Johnson',
      nick: 'Tango',
      sex: 'f',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Tyler',
      lastname: 'Walker',
      nick: 'Tyler',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Julie',
      lastname: 'Clemmensen',
      nick: 'Juicebox',
      sex: 'f',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Dave',
      lastname: 'Kavulak',
      nick: 'Caddy',
      sex: 'm',
      roles: [],
    },
    {
      number: 9,
      pic: null,
      name: 'Kristen',
      lastname: 'Clemmensen',
      nick: 'Kristen',
      sex: 'f',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Shannon',
      lastname: 'Speaker',
      nick: 'Speaks',
      sex: 'f',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Alex',
      lastname: 'Taipale',
      nick: 'Alex',
      sex: 'f',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Franklin',
      lastname: 'Pearsall',
      nick: 'Franklin',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Rob',
      lastname: 'Jaslow',
      nick: 'Rob',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Ed',
      lastname: 'Parsons',
      nick: 'Woody',
      sex: 'm',
      roles: [],
    },
    {
      number: 14,
      pic: null,
      name: 'Matt',
      lastname: 'Christie',
      nick: 'Christie',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Charlotte',
      lastname: 'Koeniger',
      nick: 'Charlotte',
      sex: 'f',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Patrick',
      lastname: 'Lee',
      nick: 'Pat',
      sex: 'm',
      roles: [],
    },
    {
      number: 0,
      pic: null,
      name: 'Emily',
      lastname: 'Paris',
      nick: 'Emily',
      sex: 'f',
      roles: [],
    },
  ];

  for(var i in players) {
    var player = players[i];

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
