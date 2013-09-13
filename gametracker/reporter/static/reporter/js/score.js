function ScorePanel() {
}

ScorePanel.prototype = Object.create(Panel.prototype);
ScorePanel.prototype.construtor = ScorePanel;

panels['score'].class = ScorePanel;


function getPullTime(game) {
  var pull = game.getPull();
  if (pull) {
    return pull.time;
  }
  return null;
}

function getGameTime(game) {
  if (game.stage == 'end') {
    return '';
  }
  if (game.stage !== 'not started') {
    var t = new Date().getTime() - getPullTime(game);
    return 'min ' + (parseInt(t/1000/60) + 1);
  }
  return humanizeTimeDiff('Starts', game.data.settings.starts, new Date().getTime()); 
}

ScorePanel.prototype._setGameTime = function(game) {
  var time = getGameTime(game);
  var pullTime = getPullTime(game);
  var percent = 0;
  if (!pullTime) {
    pullTime = 0;
  }
  if (!pullTime || game.stage == 'end') {
    $('.game-settings .progress-striped').addClass('hidden');
  } else {
    $('.game-settings .progress-striped').removeClass('hidden');
    var delta = ((new Date().getTime() - pullTime)/1000/60) + 1;
    var percent = delta / game.data.settings.caps.hard.value;
  }
  if (percent > 1) {
    percent = 1;
  }
  if (percent == 0 || percent == 1) {
    clearInterval(this.I);
  }
  if (game.stage == 'end') {
    var delta = ((new Date().getTime() - pullTime)/1000/60) + 1;
    $('.game-settings .starts-in').text('Game length: '+parseInt(delta) + ' min');
  } else {
    $('.game-settings .starts-in').text(time);
  }
  $('.game-settings .progress-bar-info').css('width', parseInt(percent*100)+'%');
}

ScorePanel.prototype._setOffense = function () {
  var game = eventData.games[currentGame];

  var offense = game.offense;

  if (!offense) {
    $('.panel-team').addClass('panel-default');
    $('.panel-team').removeClass('panel-primary');
    $('.panel-team').removeClass('panel-danger');
    $('.panel-team').removeClass('panel-success');
    return;
  }

  var defense = offense == 'team1'?'team2':'team1';

  $('.panel', $('.'+offense)).removeClass('panel-default');
  $('.panel', $('.'+offense)).addClass('panel-primary');
  $('.panel', $('.'+defense)).addClass('panel-default');
  $('.panel', $('.'+defense)).removeClass('panel-primary');
  $('.panel', $('.'+offense)).removeClass('panel-danger');
  $('.panel', $('.'+offense)).removeClass('panel-success');
  $('.panel', $('.'+defense)).removeClass('panel-danger');
  $('.panel', $('.'+defense)).removeClass('panel-success');
}
ScorePanel.prototype._setWinner = function () {
  var game = eventData.games[currentGame];

  var winner = null
  if (game.data.team1.goals > game.data.team2.goals) {
    winner = 'team1';
  }
  if (game.data.team1.goals < game.data.team2.goals) {
    winner = 'team2';
  }

  if (!winner) {
    $('.panel-team').addClass('panel-default');
    $('.panel-team').removeClass('panel-primary');
    $('.panel-team').removeClass('panel-danger');
    $('.panel-team').removeClass('panel-success');
    return;
  }

  var looser = winner == 'team1'?'team2':'team1';

  $('.panel', $('.'+winner)).removeClass('panel-default');
  $('.panel', $('.'+looser)).removeClass('panel-default');
  $('.panel', $('.'+winner)).removeClass('panel-primary');
  $('.panel', $('.'+looser)).removeClass('panel-primary');
  $('.panel', $('.'+looser)).addClass('panel-danger');
  $('.panel', $('.'+winner)).addClass('panel-success');
}

ScorePanel.prototype.drawButtons = function() {
  var game = eventData.games[currentGame];
  var nextStage = Game.stages[Game.stages.indexOf(game.stage)+1];
  $('.period-end-btn').text(nextStage);


  switch (game.stage) {
    case 'not started':
      $('.pull-btn').removeClass('hidden');
      $('.goal-btn').addClass('hidden');
      $('.timeout-btn').addClass('hidden');
      $('.period-end-btn').addClass('hidden');
      $('.goal-btn').addClass('disabled');
      $('.timeout-btn').addClass('disabled');
      this._setOffense();
      break;
    case 'first half':
      $('.pull-btn').addClass('hidden');
      $('.goal-btn').removeClass('hidden');
      $('.timeout-btn').removeClass('hidden');
      this._setOffense();
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
      this._setOffense();
      break;
    case 'second half':
      $('.pull-btn').addClass('hidden');
      $('.goal-btn').removeClass('hidden');
      $('.timeout-btn').removeClass('hidden');
      this._setOffense();
      $('.period-end-btn').removeClass('hidden');
      $('.goal-btn').removeClass('disabled');
      $('.timeout-btn').removeClass('disabled');
      break;
    case 'end':
      $('.pull-btn').addClass('hidden');
      $('.goal-btn').addClass('hidden');
      $('.timeout-btn').addClass('hidden');
      this._setWinner();
      $('.period-end-btn').addClass('hidden');
      break;
  }
}



ScorePanel.prototype.draw = function() {
  var self = this;

  var game = eventData.games[currentGame];


  var team1Name = eventData.teams[game.data.team1.id].name;
  var team2Name = eventData.teams[game.data.team2.id].name;
  
  var title = team1Name + " vs. " + team2Name + ' ('+game.data.team1.goals+':'+game.data.team2.goals+')';
  document.head.getElementsByTagName('title')[0].textContent = title;

  $('.game-settings .starts').text('Starts: ' + formatDate(new Date(game.data.settings.starts)));
  $('.game-settings .regular-cap').text('Game to: ' + game.data.settings.caps.regular.value);
  $('.game-settings .point-cap').text('Point cap: ' + game.data.settings.caps.point.value);
  $('.game-settings .soft-cap').text('Soft cap: ' + game.data.settings.caps.soft.value + ' min, +' + game.data.settings.caps.soft.diff);
  $('.game-settings .hard-cap').text('Hard cap: ' + game.data.settings.caps.hard.value + ' min');
  $('.game-settings .timeouts').text('Time-outs: ' + game.data.settings.timeouts.number + ' / ' + game.data.settings.timeouts.per);


  $('.team1 .panel-heading').text(team1Name);
  $('.team2 .panel-heading').text(team2Name);
  $('.team1 .goals').text(game.data.team1.goals);
  $('.team2 .goals').text(game.data.team2.goals);


  $('.team1 .timeout-btn').text('Time-out ('+game.getTimeouts('team1')+'/'+game.data.settings.timeouts.number+')');
  $('.team2 .timeout-btn').text('Time-out ('+game.getTimeouts('team2')+'/'+game.data.settings.timeouts.number+')');

  this.drawButtons();
  this._setGameTime(game);


  var tbody = $('.logs tbody');
  tbody.empty();
  game.data.events.forEach(function(evt) {
    var tr = $('<tr/>'); 

    var td = $('<td/>');
    var dt = new Date(evt.time);
    td.text(formatHour(dt.getHours(), dt.getMinutes()));
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
      var team = eventData.games[currentGame].data[evt.team].id; 
      td.text(eventData.teams[team].name);
    }
    tr.append(td);
    var td = $('<td/>');
    if (evt.notes) {
      td.text(evt.notes);
    }
    tr.append(td);
    var td = $('<td><button type="button" class="btn btn-default btn-lg remove-btn"><span class="glyphicon glyphicon-remove"></span></button></td>');
    $('.remove-btn', td).click(function() {
      var row = $(this).parent().parent();
      eventData.games[currentGame].deleteEvent(evt.eid, function() {
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
    eventData.games[currentGame].addPull(1, side, null, function() {
      self.draw();
    });
    

    self.draw();
  });
  $('.team2 .pull-btn').click(function () {
    eventData.games[currentGame].addPull(2, null, function() {
      self.draw();
    });
    self.draw();
  });
  $('.team1 .goal-btn').click(function () {
    eventData.games[currentGame].addGoal(1, null, function() {
      self.draw();
    });
    self.draw();
  });
  $('.team2 .goal-btn').click(function () {
    eventData.games[currentGame].addGoal(2, null, function() {
      self.draw();
    });
    self.draw();
  });
  $('.team1 .timeout-btn').click(function () {
    eventData.games[currentGame].addTimeout(1, null, function() {
      self.draw();
    });
    self.draw();
  });
  $('.team2 .timeout-btn').click(function () {
    eventData.games[currentGame].addTimeout(2, null, function() {
      self.draw();
    });
    self.draw();
  });

  $('.period-end-btn').click(function () {
    var stage = Game.stages.indexOf(eventData.games[currentGame].stage);

    if (stage >= Game.stages.length -1) {
      return;
    }
    var nextStage = Game.stages[stage+1];
    eventData.games[currentGame].stage = nextStage;

    eventData.games[currentGame].addPeriodEnd(nextStage, null, function() {
      self.draw();
    });
    self.draw();
  });

  if (this.I) {
    clearInterval(this.I);
  }
  this.I = setInterval(this._setGameTime.bind(this, eventData.games[currentGame]), 1000);
}

ScorePanel.prototype.unbindAPI = function() {
  if (this.I) {
    clearInterval(this.I);
  }
}
