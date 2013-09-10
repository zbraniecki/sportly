
function GameSettingsPanel() {
}

GameSettingsPanel.prototype = Object.create(Panel.prototype);
GameSettingsPanel.prototype.construtor = GameSettingsPanel;

panels['gamesettings'].class = GameSettingsPanel;

GameSettingsPanel.prototype.bindAPI = function() {
  $('.view-gamesettings .btn-back').click(function() {
    loadPanel('gamelist');
  });
  $('.view-gamesettings .btn-add').click(function(e) {
    e.preventDefault();
    var game = {
      id: gameData.games.length,
      team1: {
        id: $('#inputTeam1').val(),
        goals: 0,
        timeouts: 0,
      },
      team2: {
        id: $('#inputTeam2').val(),
        goals: 0,
        timeouts: 0,
      },
      settings: {
        starts: Date.parse($('#inputStarts').val()),
        caps: {
          regular: {
            type: 'point',
            value: 15,
          },
          point: {
            value: 17,
          },
          time: null,
          soft: {
            type: 'time',
            value: 90,
            diff: 2,
          },
          hard: {
            type: 'time',
            value: 110,
          },
        },
        timeouts: {
          number: 2,
          per: 'half',
        },
      },
      stage: 'not-started',
    };
    gameData.addGame(game);
  });
}


GameSettingsPanel.prototype.draw = function() {
}

