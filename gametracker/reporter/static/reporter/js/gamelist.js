
function GameListPanel() {
}

GameListPanel.prototype = Object.create(Panel.prototype);
GameListPanel.prototype.construtor = GameListPanel;


GameListPanel.prototype.draw = function() {
  var tbody = $('.game-list tbody');
  tbody.empty();
  gameData.games.forEach(function(game) {
    var tr = $('<tr/>'); 

    var td = $('<td/>');
    td.text(new Date(game.settings.starts));
    tr.append(td);
    var td = $('<td/>');
    td.text(game.team1.name);
    tr.append(td);
    var td = $('<td/>');
    td.text(game.team2.name);
    tr.append(td);
    var td = $('<td/>');
    td.text(game.team1.goals + ' : ' + game.team2.goals);
    tr.append(td);
    var td = $('<td/>');
    td.text(game.stage);
    tr.append(td);
    var td = $('<td><button type="button" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-sort"></span></button><button type="button" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-edit"></span></button><button type="button" class="btn btn-default btn-lg remove-btn"><span class="glyphicon glyphicon-remove"></span></button></td>');
    $('.remove-btn', td).click(function() {
    });
    tr.append(td);
    tr.attr('data-game-id', game.id);

    tr.click(function() {
      loadPanel('score');
    });
    tbody.append(tr);
  });
  
}
