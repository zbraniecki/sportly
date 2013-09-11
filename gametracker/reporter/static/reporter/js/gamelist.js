
function GameListPanel() {
}

GameListPanel.prototype = Object.create(Panel.prototype);
GameListPanel.prototype.construtor = GameListPanel;

panels['gamelist'].class = GameListPanel;

GameListPanel.prototype.bindAPI = function() {
  $('.view-gamelist .btn-add').click(function() {
    loadPanel('gamesettings');
  });
  $('.view-gamelist .btn-clear').click(function() {
    db.clear();
  });
}

GameListPanel.prototype.draw = function() {
  var tbody = $('.game-list tbody');
  tbody.empty();
  var game;
  for (var i in gameData.games) {
    game = gameData.games[i];
    var data = game.data;
    var tr = $('<tr/>'); 

    var td = $('<td/>');
    td.text(new Date(data.settings.starts));
    td.click(function() {
      currentGame = $(this).parent().attr('data-game-id'); 
      loadPanel('score');
    });
    tr.append(td);
    var td = $('<td/>');
    td.text(gameData.teams[data.team1.id].name);
    tr.append(td);
    var td = $('<td/>');
    td.text(gameData.teams[data.team2.id].name);
    tr.append(td);
    var td = $('<td/>');
    td.text(data.team1.goals + ' : ' + data.team2.goals);
    tr.append(td);
    var td = $('<td/>');
    td.text(game.stage);
    tr.append(td);
    var td = $('<td><button type="button" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-edit"></span></button><button type="button" class="btn btn-default btn-lg remove-btn"><span class="glyphicon glyphicon-remove"></span></button></td>');
    $('.remove-btn', td).click(function(e) {
      e.preventDefault();
      var id = $(this).parent().parent().attr('data-game-id');
      gameData.removeGame(id);
      $(this).parent().parent().fadeOut();
    });
    tr.append(td);
    tr.attr('data-game-id', data.id);

    tbody.append(tr);
  };
}
