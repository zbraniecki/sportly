

function GameSettingsPanel() {
  this.defaults = {
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
    }
  };

  this.dataBindings = {
    'caps.regular.type': 'inputCapType',
    'caps.regular.value': 'inputCap', 
    'caps.point.value': 'inputPointCap',
    'caps.time.value': 'inputTimeCap',
    'caps.soft.value': 'inputSoftCap',
    'caps.soft.type': 'inputSoftCapType',
    'caps.soft.diff': 'inputSoftCapDiff',
    'caps.hard.type': 'inputHardCapType',
    'caps.hard.value': 'inputHardCap',
    'timeouts.number': 'inputTimeouts',
    'timeouts.per': 'inputTimeoutsPer',
  };
}

GameSettingsPanel.prototype = Object.create(Panel.prototype);
GameSettingsPanel.prototype.construtor = GameSettingsPanel;

panels['gamesettings'].class = GameSettingsPanel;


GameSettingsPanel.prototype.bindAPI = function() {
  var self = this;
  $('.view-gamesettings .btn-back').click(function() {
    loadPanel('gamelist');
  });
  $('.view-gamesettings .btn-add').click(function(e) {
    e.preventDefault();
    var game = new Game();
    game.data.id = Object.keys(gameData.games).length+1;
    game.data.team1.id = $('#inputTeam1').val();
    game.data.team2.id = $('#inputTeam2').val();


    for (var i in self.dataBindings) {
      var node = $('#'+self.dataBindings[i]);
      var val = game.data.settings;
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
        val[chunks[j]] = node.val();
      } else {
        val[chunks[j]] = def[chunks[j]];
      }
    }

    game.data.settings.starts = parseDate($('#inputStarts').val());
    game.data.stage = 'not-started';
    game.data['team1'].timeouts = game._buildTimeoutStructure();
    game.data['team2'].timeouts = game._buildTimeoutStructure();
    gameData.addGame(game);
    loadPanel('gamelist');
  });
}


GameSettingsPanel.prototype.draw = function() {
  for (var i in this.dataBindings) {
    var node = $('#'+this.dataBindings[i]);
    var val = this.defaults;
    var chunks = i.split('.');
    for (var j in chunks) {
      val = val[chunks[j]];
    }
    if (node.is('select')) {
      node.val(val);
    } else {
      node.attr('placeholder', val); 
    }
  }
  return;
}

