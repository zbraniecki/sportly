
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
    game.data.settings.caps.regular.type = $('#inputCapType').val();
    game.data.settings.caps.regular.value = $('#inputCap').val();
    game.data.settings.caps.point.value = $('#inputPointCap').val();
    game.data.settings.caps.soft.type = $('#inputSoftCapType').val();
    game.data.settings.caps.soft.value = $('#inputSoftCap').val();
    game.data.settings.caps.soft.diff= $('#inputSoftCapDiff').val();
    game.data.settings.caps.hard.type = $('#inputHardCapType').val();
    game.data.settings.caps.hard.value = $('#inputHardCap').val();
    game.data.settings.timeouts.number = $('#inputTimeouts').val();
    game.data.settings.timeouts.per = $('#inputTimeoutsPer').val();
    game.data.stage = 'not-started';
    game.data['team1'].timeouts = game._buildTimeoutStructure();
    game.data['team2'].timeouts = game._buildTimeoutStructure();
    gameData.addGame(game);
    loadPanel('gamelist');
  });
}


GameSettingsPanel.prototype.draw = function() {
}

