

function GameSettingsPanel() {
  this.defaults = {
    team1: {
      id: null,
    },
    team2: {
      id: null,
    },
    settings: {
      starts: new Date().getTime(), 
      caps: {
        regular: {
          type: 'points',
          value: 15,
        },
        point: {
          value: 17,
        },
        time: {
          value: 0,
        },
        soft: {
          type: 'min',
          value: 90,
          diff: 2,
        },
        hard: {
          type: 'min',
          value: 110,
        }
      },
      timeouts: {
        number: 2,
        per: 'half',
      },
    }
  };

  this.dataBindings = {
    'team1.id': 'inputTeam1',
    'team2.id': 'inputTeam2',
    'settings.starts': 'inputStarts',
    'settings.caps.regular.type': 'inputCapType',
    'settings.caps.regular.value': 'inputCap', 
    'settings.caps.point.value': 'inputPointCap',
    'settings.caps.time.value': 'inputTimeCap',
    'settings.caps.soft.value': 'inputSoftCap',
    'settings.caps.soft.type': 'inputSoftCapType',
    'settings.caps.soft.diff': 'inputSoftCapDiff',
    'settings.caps.hard.type': 'inputHardCapType',
    'settings.caps.hard.value': 'inputHardCap',
    'settings.timeouts.number': 'inputTimeouts',
    'settings.timeouts.per': 'inputTimeoutsPer',
  };

  this.gid = null;
}

GameSettingsPanel.prototype = Object.create(Panel.prototype);
GameSettingsPanel.prototype.construtor = GameSettingsPanel;

panels['gamesettings'].class = GameSettingsPanel;

GameSettingsPanel.prototype.setData = function(data) {
  if (data && data.gid) {
    this.gid = data.gid;
  } else {
    this.gid = null;
  }
}

GameSettingsPanel.prototype.bindAPI = function() {
  var self = this;
  $('.view-gamesettings .btn-back').click(function() {
    loadPanel('gamelist');
  });
  $('.view-gamesettings .btn-submit').click(function(e) {
    e.preventDefault();
    if (self.gid) {
      var game = eventData.getGame(self.gid);
    } else {
      var game = new Game();
      game.data.id = Object.keys(eventData.games).length+1;
      game.data.stage = 'not-started';
    }
    game.data.team1.id = $('#inputTeam1').val();
    game.data.team2.id = $('#inputTeam2').val();

    for (var i in self.dataBindings) {
      var node = $('#'+self.dataBindings[i]);
      var val = game.data;
      var def = self.defaults;

      var chunks = i.split('.');
      for (var j in chunks) {
        if (j == chunks.length-1) {
          continue;
        }
        val = val[chunks[j]];
        def = def[chunks[j]];
      }
      if (node.val()) {
        var v = node.val();
        if (chunks[j] == 'starts') {
          v = parseDate(v).getTime();
        }
        val[chunks[j]] = v;
      } else {
        var v = def[chunks[j]];
        val[chunks[j]] = v;
      }
    }

    game.data['team1'].timeouts = game._buildTimeoutStructure();
    game.data['team2'].timeouts = game._buildTimeoutStructure();
    if (self.gid) {
      eventData.editGame(game);
    } else {
      eventData.addGame(game);
    }
    loadPanel('gamelist');
  });
}


GameSettingsPanel.prototype.draw = function() {
  var team1Select = $('.view-gamesettings #inputTeam1');
  team1Select.empty();
  for (var i in eventData.teams) {
    var team = eventData.teams[i];
    var option = $('<option/>');
    option.text(team.name);
    option.attr('value', i);
    team1Select.append(option);
  }
  var team2Select = $('.view-gamesettings #inputTeam2');
  team2Select.empty();
  for (var i in eventData.teams) {
    var team = eventData.teams[i];
    var option = $('<option/>');
    option.text(team.name);
    option.attr('value', i);
    team2Select.append(option);
  }

  if (this.gid) {
    var game = eventData.getGame(this.gid);
  } else {
    var game = null;
  }

  for (var i in this.dataBindings) {
    var node = $('#'+this.dataBindings[i]);
    if (game) {
      var val = game.data;
    } else {
      var val = this.defaults;
    }
    var chunks = i.split('.');
    for (var j in chunks) {
      val = val[chunks[j]];
    }
    if (chunks[j] == 'starts') {
      val = formatDateString(new Date(val));
    }
    if (node.is('select') || game) {
      node.val(val);
    } else {
      node.val("");
      node.attr('placeholder', val); 
    }
  }

  if (this.gid) {
    $('.view-gamesettings .btn-submit').text('Edit');
    $('.view-gamesettings .panel-heading').text('Edit game');
  } else {
    $('.view-gamesettings .btn-submit').text('Add');
    $('.view-gamesettings .panel-heading').text('Add new game');
  }
  return;
}

