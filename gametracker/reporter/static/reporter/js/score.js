function ScorePanel() {
}

ScorePanel.prototype = Object.create(Panel.prototype);
ScorePanel.prototype.construtor = ScorePanel;

var stages = [
'not started',
  'first half',
  'half time',
  'second half',
  'end',
  ];

ScorePanel.prototype.draw = function() {
  $('.game-settings .starts').text('Starts: ' + new Date(gameData.settings.starts));
  $('.game-settings .regular-cap').text('Game to: ' + gameData.settings.caps.regular.value);
  $('.game-settings .point-cap').text('Point cap: ' + gameData.settings.caps.point.value);
  $('.game-settings .soft-cap').text('Soft cap: ' + gameData.settings.caps.soft.value + ' min, +' + gameData.settings.caps.soft.diff);
  $('.game-settings .hard-cap').text('Hard cap: ' + gameData.settings.caps.hard.value + ' min');
  $('.game-settings .timeouts').text('Time-outs: ' + gameData.settings.timeouts.number + ' / ' + gameData.settings.timeouts.per);
  $('.team1 .panel-heading').text(gameData.team1.name);
  $('.team2 .panel-heading').text(gameData.team2.name);
  $('.team1 .goals').text(gameData.team1.goals);
  $('.team2 .goals').text(gameData.team2.goals);
  $('.team1 .timeout-btn').text('Time-out ('+gameData.team1.timeouts+'/'+gameData.settings.timeouts.number+')');
  $('.team2 .timeout-btn').text('Time-out ('+gameData.team2.timeouts+'/'+gameData.settings.timeouts.number+')');

  var nextStage = stages[stages.indexOf(gameData.stage)+1];
  $('.period-end-btn').text(nextStage);

  var tbody = $('.logs tbody');
  tbody.empty();
  gameData.events.forEach(function(evt) {
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
      td.text(gameData[evt.team].name);
    }
    tr.append(td);
    var td = $('<td/>');
    tr.append(td);
    var td = $('<td><button type="button" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-sort"></span></button><button type="button" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-edit"></span></button><button type="button" class="btn btn-default btn-lg remove-btn"><span class="glyphicon glyphicon-remove"></span></button></td>');
    $('.remove-btn', td).click(function() {
      var row = $(this).parent().parent();
      gameData.deleteEvent(evt.eid, function() {
        row.remove();
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
  bindAPI();
}

function bindAPI() {
  $('#myTab a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
  $('.team1 .pull-btn').click(function () {
    gameData.addPull(1, null, function() {
      drawData();
    });
    $('.pull-btn').addClass('hidden');
    $('.goal-btn').removeClass('hidden');
    $('.timeout-btn').removeClass('hidden');
    $('.panel', $('.team2')).removeClass('panel-default');
    $('.panel', $('.team2')).addClass('panel-primary');
    $('.period-end-btn').removeClass('hidden');
    drawData();
  });
  $('.team2 .pull-btn').click(function () {
    gameData.addPull(2, null, function() {
      drawData();
    });
    $('.pull-btn').addClass('hidden');
    $('.goal-btn').removeClass('hidden');
    $('.timeout-btn').removeClass('hidden');
    $('.panel', $('.team1')).removeClass('panel-default');
    $('.panel', $('.team1')).addClass('panel-primary');
    drawData();
  });
  $('.team1 .goal-btn').click(function () {
    gameData.addGoal(1, null, function() {
      drawData();
    });
    $('.panel', $('.team1')).removeClass('panel-primary');
    $('.panel', $('.team1')).addClass('panel-default');
    $('.panel', $('.team2')).removeClass('panel-default');
    $('.panel', $('.team2')).addClass('panel-primary');
    drawData();
  });
  $('.team2 .goal-btn').click(function () {
    gameData.addGoal(2, null, function() {
      drawData();
    });
    $('.panel', $('.team2')).removeClass('panel-primary');
    $('.panel', $('.team2')).addClass('panel-default');
    $('.panel', $('.team1')).removeClass('panel-default');
    $('.panel', $('.team1')).addClass('panel-primary');
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
    var stage = stages.indexOf(gameData.stage);

    if (stage >= stages.length -1) {
      return;
    }
    var nextStage = stages[stage+1];
    console.log(nextStage);
    gameData.stage = nextStage;
    if (stage >= stages.length - 2) {
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

    gameData.addPeriodEnd(nextStage, null, function() {
      drawData();
    });
    drawData();
  });
}
