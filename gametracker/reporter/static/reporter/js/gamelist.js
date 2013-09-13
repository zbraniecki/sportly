
function GameListPanel() {
}

GameListPanel.prototype = Object.create(Panel.prototype);
GameListPanel.prototype.construtor = GameListPanel;

panels['gamelist'].class = GameListPanel;


GameListPanel.prototype.bindAPI = function() {
  var self = this;
  $('.view-gamelist .btn-add').click(function() {
    loadPanel('gamesettings');
  });
  $('.view-gamelist .btn-clear').click(function() {
    db.clear();
  });
  $('.view-gamelist .btn-roster').click(function() {
    loadPanel('roster');
  });
  $('.view-gamelist .btn-fullscreen').click(function() {
    toggleFullScreen();
  });
  $('.view-gamelist .btn-sync').click(function() {
    //eventData.syncWithCloud(self.draw.bind(this));
  });
}

GameListPanel.prototype.draw = function() {
  $('.view-gamelist h1').text(eventData.name + ', ' + eventData.division);
  var tbody = $('.game-list tbody');
  tbody.empty();
  var game;

  var games = [];

  for (var i in eventData.games) {
    games.push(eventData.games[i]);
  }

  games.sort(function (a, b) {
    if (a.data.settings.starts > b.data.settings.starts) {
      return 1;
    } else if (a.data.settings.starts < b.data.settings.starts) {
      return -1;
    }
    return 0;
  });

  for (var i in games) {
    game = games[i];
    var data = game.data;
    var tr = $('<tr/>'); 

    var td = $('<td/>');
    td.text(formatDate(new Date(data.settings.starts)));
    td.click(function() {
      currentGame = $(this).parent().attr('data-game-id'); 
      loadPanel('score');
    });
    tr.append(td);
    var td = $('<td/>');
    td.text(eventData.teams[data.team1.id].name);
    tr.append(td);
    var td = $('<td/>');
    td.text(eventData.teams[data.team2.id].name);
    tr.append(td);
    var td = $('<td/>');
    td.text(data.team1.goals + ' : ' + data.team2.goals);
    tr.append(td);
    var td = $('<td/>');
    td.text(game.stage);
    tr.append(td);
    var td = $('<td><button type="button" class="btn btn-default btn-lg btn-edit"><span class="glyphicon glyphicon-edit"></span></button><button type="button" class="btn btn-default btn-lg btn-remove"><span class="glyphicon glyphicon-remove"></span></button></td>');
    $('.btn-edit', td).click(function(e) {
      e.preventDefault();
      var id = $(this).parent().parent().attr('data-game-id');
      loadPanel('gamesettings', {gid: id});
    });
    $('.btn-remove', td).click(function(e) {
      e.preventDefault();
      var id = $(this).parent().parent().attr('data-game-id');
      eventData.removeGame(id);
      $(this).parent().parent().fadeOut();
    });
    tr.append(td);
    tr.attr('data-game-id', data.id);

    tbody.append(tr);
  };
}
