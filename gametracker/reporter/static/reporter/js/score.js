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
    $('#score .panel-team').addClass('panel-default');
    $('#score .panel-team').removeClass('panel-primary');
    $('#score .panel-team').removeClass('panel-danger');
    $('#score .panel-team').removeClass('panel-success');
    return;
  }

  var defense = offense == 'team1'?'team2':'team1';

  $('.panel', $('#score .'+offense)).removeClass('panel-default');
  $('.panel', $('#score .'+offense)).addClass('panel-primary');
  $('.panel', $('#score .'+defense)).addClass('panel-default');
  $('.panel', $('#score .'+defense)).removeClass('panel-primary');
  $('.panel', $('#score .'+offense)).removeClass('panel-danger');
  $('.panel', $('#score .'+offense)).removeClass('panel-success');
  $('.panel', $('#score .'+defense)).removeClass('panel-danger');
  $('.panel', $('#score .'+defense)).removeClass('panel-success');
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
    $('#score .panel-team').addClass('panel-default');
    $('#score .panel-team').removeClass('panel-primary');
    $('#score .panel-team').removeClass('panel-danger');
    $('#score .panel-team').removeClass('panel-success');
    return;
  }

  var looser = winner == 'team1'?'team2':'team1';

  $('.panel', $('#score .'+winner)).removeClass('panel-default');
  $('.panel', $('#score .'+looser)).removeClass('panel-default');
  $('.panel', $('#score .'+winner)).removeClass('panel-primary');
  $('.panel', $('#score .'+looser)).removeClass('panel-primary');
  $('.panel', $('#score .'+looser)).addClass('panel-danger');
  $('.panel', $('#score .'+winner)).addClass('panel-success');
}

ScorePanel.prototype.drawButtons = function() {
  var game = eventData.games[currentGame];
  var nextStage = Game.stages[Game.stages.indexOf(game.stage)+1];
  $('.period-end-btn').text(nextStage);


  switch (game.stage) {
    case 'not started':
      $('#score .pull-btn').removeClass('hidden');
      $('#score .goal-btn').addClass('hidden');
      $('#score .timeout-btn').addClass('hidden');
      $('#score .period-end-btn').addClass('hidden');
      $('#score .goal-btn').addClass('disabled');
      $('#score .timeout-btn').addClass('disabled');
      this._setOffense();
      break;
    case 'first half':
      $('#score .pull-btn').addClass('hidden');
      $('#score .goal-btn').removeClass('hidden');
      $('#score .timeout-btn').removeClass('hidden');
      this._setOffense();
      $('#score .period-end-btn').removeClass('hidden');
      $('#score .goal-btn').removeClass('disabled');
      $('#score .timeout-btn').removeClass('disabled');
      break;
    case 'half time':
      $('#score .pull-btn').addClass('hidden');
      $('#score .goal-btn').removeClass('hidden');
      $('#score .timeout-btn').removeClass('hidden');
      $('#score .period-end-btn').removeClass('hidden');
      $('#score .goal-btn').addClass('disabled');
      $('#score .timeout-btn').addClass('disabled');
      this._setOffense();
      break;
    case 'second half':
      $('#score .pull-btn').addClass('hidden');
      $('#score .goal-btn').removeClass('hidden');
      $('#score .timeout-btn').removeClass('hidden');
      this._setOffense();
      $('#score .period-end-btn').removeClass('hidden');
      $('#score .goal-btn').removeClass('disabled');
      $('#score .timeout-btn').removeClass('disabled');
      break;
    case 'end':
      $('#score .pull-btn').addClass('hidden');
      $('#score .goal-btn').addClass('hidden');
      $('#score .timeout-btn').addClass('hidden');
      this._setWinner();
      $('#score .period-end-btn').addClass('hidden');
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


  this.drawLines();
}

var lineLength = 7;

ScorePanel.prototype.drawlineButtons = function() {
  var self = this;
  var game = eventData.games[currentGame];
  var pull = game.getPull();
  if (game.stage == 'end') {
    $('#lines .pull-btn').addClass('hidden');
    $('#lines .offense-btn').addClass('hidden');
    $('#lines .line-start').addClass('hidden');
  } else if (game.stage == 'not started') {
    $('#lines .pull-btn').removeClass('hidden');
    $('#lines .offense-btn').removeClass('hidden');
    $('#lines .line-start').addClass('hidden');
  } else {
    $('#lines .pull-btn').addClass('hidden');
    $('#lines .offense-btn').addClass('hidden');
    $('#lines .line-start').removeClass('hidden');
  }
  if (this.line.length == lineLength) {
    $('#lines .btn').removeClass('disabled');
    $('#lines td').addClass('disabled');
  } else {
    $('#lines .btn').addClass('disabled');
    $('#lines td').removeClass('disabled');
  }
}

ScorePanel.prototype.calculatePlays = function(players) {
  var points = {};
  var game = eventData.games[currentGame];

  game.data.events.forEach(function (evt) {
    if (evt.type == 'line' && evt.notes) {
      var notes = evt.notes;
      var pls = notes.split(',');
      for (i in pls) {
        if (!points[pls[i]]) {
          points[pls[i]] = 0;
        }
        points[pls[i]] += 1;
      }
    }
  });

  return points;
}

ScorePanel.prototype.drawLines = function() {
  var self = this;
  this.line = [];
  var game = eventData.games[currentGame];

  function togglePlayerLine(e) {
    e.preventDefault();
    var node = $(this);
    var pid = node.data('pid');
    
    if (node.hasClass('in')) {
      var pos = self.line.indexOf(pid);
      self.line.splice(pos, 1);
    } else {
      if (self.line.length == lineLength) {
        return;
      }
      self.line.push(pid);
    }
    node.toggleClass('in');
    self.drawlineButtons();
  }

  var players = {
    men: [],
    women: [],
  };

  var plays = this.calculatePlays(eventData.players);

  eventData.players.forEach(function (player, k) {
    player.id = k;
    if (player.sex == 'm') {
      players.men.push(player);
    } else {
      players.women.push(player);
    }
  });
  

  var cols = 5;

  for (sex in players) {
    var i = 0;
    var tr, td;

    var tbody = $('#lines .table-lines-'+sex+' tbody');
    tbody.empty();

    players[sex].forEach(function (player, k) {
      if (i==0) {
        tr = $('<tr/>');
      }
      td = $('<td/>');
      td.data('pid', player.id);
      td.click(togglePlayerLine);

      var name = player.nick;
      if (plays[player.id]) {
        name += ' ('+plays[player.id]+')';
      }
      td.text(name);
      tr.append(td);
      if (i==0) {
        tbody.append(tr);
      }
      i++;
      if (i >= cols) {
        i = 0;
      }
    });
  }
  self.drawlineButtons();

  var lines = [];
  var score = [0,0];

  lines.push({'score': '0:0',
    'type': 'O',
    'players': []});
  game.data.events.forEach(function (evt) {
    if (evt.type == 'goal') {
      if (evt.team == 'team1') {
        score[0]++;
      } else {
        score[1]++;
      }
      lines.push({'score': score[0]+':'+score[1],
                  'type': 'O',
                  'players': []});
    } else if (evt.type == 'line') {
      lines[lines.length-1].players = evt.notes.split(',');
    }
  });

  var table = $('.table-lines-stats');
  var thr = $('thead tr', table);
  thr.empty();
  var tbody = $('tbody', table);
  tbody.empty();

  var th = $('<th/>');
  th.text('Player');
  thr.append(th);

  lines.forEach(function (line, k) {
    if (k == lines.length-1) {
      return;
    }
    var th = $('<th/>');
    th.text(line.score);
    thr.append(th);
  });
  eventData.players.forEach(function(player) {
    var tr = $('<tr/>');

    var td = $('<td/>');
    td.text(player.nick);
    tr.append(td);
    lines.forEach(function (line, k) {
      if (k == lines.length-1) {
        return;
      }
      var td = $('<td/>');
      if (line.players.indexOf(player.id.toString()) == -1) {
        td.text('');
      } else {
        td.text('1');
      }
      tr.append(td);
    });
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
  $('#score .team1 .pull-btn').click(function () {
    var side = $(this).data('side');
    eventData.games[currentGame].addPull(1, side, null, function() {
      self.draw();
    });
    

    self.draw();
  });
  $('#score .team2 .pull-btn').click(function () {
    eventData.games[currentGame].addPull(2, null, function() {
      self.draw();
    });
    self.draw();
  });
  $('#score .team1 .goal-btn').click(function () {
    eventData.games[currentGame].addGoal(1, null, function() {
      self.draw();
    });
    self.draw();
    $('#myTab a[href="#lines"]').tab('show');
  });
  $('#score .team2 .goal-btn').click(function () {
    eventData.games[currentGame].addGoal(2, null, function() {
      self.draw();
    });
    self.draw();
    $('#myTab a[href="#lines"]').tab('show');
  });
  $('#score .team1 .timeout-btn').click(function () {
    eventData.games[currentGame].addTimeout(1, null, function() {
      self.draw();
    });
    self.draw();
  });
  $('#score .team2 .timeout-btn').click(function () {
    eventData.games[currentGame].addTimeout(2, null, function() {
      self.draw();
    });
    self.draw();
  });

  $('#score .period-end-btn').click(function () {
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

  $('#lines .pull-left').click(function() {
    var game = eventData.games[currentGame];
    var bab = game.data.team1.id == 9 ? 1 : 2;
    var op = bab == 1 ? 2 : 1;

    eventData.games[currentGame].addPull(bab, 'left', null, function() {
      self.draw();
    });
    eventData.games[currentGame].addLine(self.line, null, function() {
      self.draw();
    });
    self.draw();
    $('#myTab a[href="#score"]').tab('show');
    
  });

  $('#lines .offense-left').click(function() {
    var game = eventData.games[currentGame];
    var bab = game.data.team1.id == 9 ? 1 : 2;
    var op = bab == 1 ? 2 : 1;

    eventData.games[currentGame].addPull(op, 'right', null, function() {
      self.draw();
    });
    eventData.games[currentGame].addLine(self.line, null, function() {
      self.draw();
    });
    self.draw();
    $('#myTab a[href="#score"]').tab('show');
  });
  $('#lines .pull-right').click(function() {
    var game = eventData.games[currentGame];
    var bab = game.data.team1.id == 9 ? 1 : 2;
    var op = bab == 1 ? 2 : 1;

    eventData.games[currentGame].addPull(bab, 'right', null, function() {
      self.draw();
    });
    eventData.games[currentGame].addLine(self.line, null, function() {
      self.draw();
    });
    self.draw();
    $('#myTab a[href="#score"]').tab('show');
  });

  $('#lines .offense-right').click(function() {
    var game = eventData.games[currentGame];
    var bab = game.data.team1.id == 9 ? 1 : 2;
    var op = bab == 1 ? 2 : 1;

    eventData.games[currentGame].addPull(op, 'left', null, function() {
      self.draw();
    });
    eventData.games[currentGame].addLine(self.line, null, function() {
      self.draw();
    });
    self.draw();
    $('#myTab a[href="#score"]').tab('show');
  });
  $('#lines .line-start').click(function() {
    var game = eventData.games[currentGame];

    eventData.games[currentGame].addLine(self.line, null, function() {
      self.draw();
    });
    self.draw();
    $('#myTab a[href="#score"]').tab('show');
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
