function ScorePanel() {
}

ScorePanel.prototype = Object.create(Panel.prototype);
ScorePanel.prototype.construtor = ScorePanel;

panels['score'].class = ScorePanel;

var stages = [
  'not started',
  'first half',
  'half time',
  'second half',
  'end',
  ];

ScorePanel.prototype.draw = function() {
  var self = this;

  var game = gameData.games[currentGame];


  var team1Name = gameData.teams[game.data.team1.id].name;
  var team2Name = gameData.teams[game.data.team2.id].name;
  
  var title = team1Name + " vs. " + team2Name + ' ('+game.data.team1.goals+':'+game.data.team2.goals+')';
  document.head.getElementsByTagName('title')[0].textContent = title;

  $('.game-settings .starts').text('Starts: ' + new Date(game.data.settings.starts));
  $('.game-settings .regular-cap').text('Game to: ' + game.data.settings.caps.regular.value);
  $('.game-settings .point-cap').text('Point cap: ' + game.data.settings.caps.point.value);
  $('.game-settings .soft-cap').text('Soft cap: ' + game.data.settings.caps.soft.value + ' min, +' + game.data.settings.caps.soft.diff);
  $('.game-settings .hard-cap').text('Hard cap: ' + game.data.settings.caps.hard.value + ' min');
  $('.game-settings .timeouts').text('Time-outs: ' + game.data.settings.timeouts.number + ' / ' + game.data.settings.timeouts.per);
  $('.team1 .panel-heading').text(team1Name);
  $('.team2 .panel-heading').text(team2Name);
  $('.team1 .goals').text(game.data.team1.goals);
  $('.team2 .goals').text(game.data.team2.goals);
  $('.team1 .timeout-btn').text('Time-out ('+game.data.team1.timeouts+'/'+game.data.settings.timeouts.number+')');
  $('.team2 .timeout-btn').text('Time-out ('+game.data.team2.timeouts+'/'+game.data.settings.timeouts.number+')');

  var nextStage = stages[stages.indexOf(game.stage)+1];
  $('.period-end-btn').text(nextStage);


  switch (game.stage) {
    case 'not started':
      $('.pull-btn').removeClass('hidden');
      $('.goal-btn').addClass('hidden');
      $('.timeout-btn').addClass('hidden');
      $('.period-end-btn').addClass('hidden');
      $('.goal-btn').addClass('disabled');
      $('.timeout-btn').addClass('disabled');
      break;
    case 'first half':
      $('.pull-btn').addClass('hidden');
      $('.goal-btn').removeClass('hidden');
      $('.timeout-btn').removeClass('hidden');
      //$('.panel', $('.team2')).removeClass('panel-default');
      //$('.panel', $('.team2')).addClass('panel-primary');
      $('.period-end-btn').removeClass('hidden');
      $('.goal-btn').removeClass('disabled');
      $('.timeout-btn').removeClass('disabled');
      break;
    case 'half time':
      $('.pull-btn').addClass('hidden');
      $('.goal-btn').removeClass('hidden');
      $('.timeout-btn').removeClass('hidden');
      $('.period-end-btn').removeClass('hidden');
      $('.goal-btn').addClass('disabled');
      $('.timeout-btn').addClass('disabled');
      break;
    case 'second half':
      $('.pull-btn').addClass('hidden');
      $('.goal-btn').removeClass('hidden');
      $('.timeout-btn').removeClass('hidden');
      //$('.panel', $('.team2')).removeClass('panel-default');
      //$('.panel', $('.team2')).addClass('panel-primary');
      $('.period-end-btn').removeClass('hidden');
      $('.goal-btn').removeClass('disabled');
      $('.timeout-btn').removeClass('disabled');
      break;
    case 'end':
      $('.pull-btn').addClass('hidden');
      $('.goal-btn').addClass('hidden');
      $('.timeout-btn').addClass('hidden');
      //$('.panel', $('.team2')).removeClass('panel-default');
      //$('.panel', $('.team2')).addClass('panel-primary');
      $('.period-end-btn').addClass('hidden');
      break;
  }

  var tbody = $('.logs tbody');
  tbody.empty();
  game.data.events.forEach(function(evt) {
    var tr = $('<tr/>'); 

    var td = $('<td/>');
    td.text(new Date(evt.time).getMinutes());
    tr.append(td);
    var td = $('<td/>');
    td.text(evt.type);
    tr.append(td);
    var td = $('<td/>');
    tr.append(td);
    var td = $('<td/>');
    tr.append(td);
    var td = $('<td/>');
    if (evt.team) {
      var team = gameData.games[currentGame].data[evt.team].id; 
      td.text(gameData.teams[team].name);
    }
    tr.append(td);
    var td = $('<td/>');
    if (evt.notes) {
      td.text(evt.notes);
    }
    tr.append(td);
    var td = $('<td><button type="button" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-sort"></span></button><button type="button" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-edit"></span></button><button type="button" class="btn btn-default btn-lg remove-btn"><span class="glyphicon glyphicon-remove"></span></button></td>');
    $('.remove-btn', td).click(function() {
      var row = $(this).parent().parent();
      gameData.games[currentGame].deleteEvent(evt.eid, function() {
        row.remove();
        self.draw();
      },
      function() {
        row.fadeIn();
      });
      row.fadeOut();
    });
    tr.append(td);
    tr.attr('data-event-id', evt.eid);
    tbody.append(tr);
  });
}

ScorePanel.prototype.bindAPI = function() {
  var self = this;
  $('.game-settings .btn-back').click(function() {
    loadPanel('gamelist');
  });
  $('#myTab a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
  $('.team1 .pull-btn').click(function () {
    var side = $(this).data('side');
    gameData.games[currentGame].addPull(1, side, null, function() {
      self.draw();
    });
    

    self.draw();
  });
  $('.team2 .pull-btn').click(function () {
    gameData.games[currentGame].addPull(2, null, function() {
      self.draw();
    });
    self.draw();
  });
  $('.team1 .goal-btn').click(function () {
    gameData.addGoal(1, null, function() {
      drawData();
    });
    drawData();
  });
  $('.team2 .goal-btn').click(function () {
    gameData.addGoal(2, null, function() {
      drawData();
    });
    drawData();
  });
  $('.team1 .timeout-btn').click(function () {
    gameData.addTimeout(1, null, function() {
      drawData();
    });
    drawData();
  });
  $('.team2 .timeout-btn').click(function () {
    gameData.addTimeout(2, null, function() {
      drawData();
    });
    drawData();
  });

  $('.period-end-btn').click(function () {
    var stage = stages.indexOf(gameData.games[currentGame].stage);

    if (stage >= stages.length -1) {
      return;
    }
    var nextStage = stages[stage+1];
    console.log(nextStage);
    gameData.games[currentGame].stage = nextStage;
    if (1==2 && stage >= stages.length - 2) {
      // it's the end of the game
      $('.goal-btn').addClass('hidden');
      $('.timeout-btn').addClass('hidden');
      $('.period-end-btn').addClass('hidden');
      $('.panel').removeClass('panel-primary');
      $('.panel').removeClass('panel-default');
      if (gameData.team1.goals > gameData.team2.goals) {
        $('.team1 .panel').addClass('panel-success');
        $('.team2 .panel').addClass('panel-danger');
      } else {
        $('.team2 .panel').addClass('panel-success');
        $('.team1 .panel').addClass('panel-danger');
      }
    }

    gameData.games[currentGame].addPeriodEnd(nextStage, null, function() {
      self.draw();
    });
    self.draw();
  });
}
