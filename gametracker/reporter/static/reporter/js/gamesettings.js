
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
    var game = new Game();
    game.data.id = Object.keys(gameData.games).length+1;
    game.data.team1.id = $('#inputTeam1').val();
    game.data.team2.id = $('#inputTeam2').val();
    game.data.settings.starts = parseDate($('#inputStarts').val());
    game.data.settings.caps.regular.type = 'point';
    game.data.settings.caps.regular.value = 15;
    game.data.settings.caps.point.value = 17;
    game.data.settings.caps.soft.type = 'time';
    game.data.settings.caps.soft.value = 90;
    game.data.settings.caps.soft.diff= 2;
    game.data.settings.caps.hard.type = 'time';
    game.data.settings.caps.hard.value = 110;
    game.data.settings.timeouts.number = 2;
    game.data.settings.timeouts.per = 'half';
    game.data.stage = 'not-started';
    gameData.addGame(game);
    loadPanel('gamelist');
  });
}


GameSettingsPanel.prototype.draw = function() {
}

