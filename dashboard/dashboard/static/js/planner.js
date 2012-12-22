$(function() {
  var tournament = null;
  $("#add_stage").on('click', function() {
    var stage = tournament.addStage();
    stage.draw(false);
  });
  $("#create_tournament").on('click', function() {
    tournament = new Tournament();
    tournament.draw();
  });
});


function Tournament() {
  this.stages = [];
  this.size = 8; // number of teams
}

// Teams / Standings should be its own classes same as other stages

Tournament.prototype.draw = function() {
  this.node = $('<div id="tournament"/>');
  var header = $('<header/>');
  var title = $('<h1>Tournament 0</h1>');
  title.editable({
    title: "Tournament name",
    placement: 'right',
    send: 'never',
    toggle: 'click', 
  });
  header.append(title);
  this.node.append(header);
  this.stagesNode = $('<ul class="stages"/>');
  this.node.append(this.stagesNode);
  $(document.documentElement).append(this.node);
  this.drawTeams();
  this.drawSeeding();
  this.drawStandings();
}

Tournament.prototype.drawTeams = function() {
  var stage = this.addStage('Teams', true);
  stage.settings.modifygroups = false;
  stage.settings.settings = false;
  var group = stage.addGroup('Teams 0');
  group.settings.positional = false;
  group.settings.resolvable = false;
  group.settings.incoming = false;
  group.size = this.size;
  for (var i=0;i<this.size;i++) {
    var team = $("<div class='team'>Team "+(i+1)+"</div>");
    team.draggable({helper: 'clone'});
    group.setElement('out', i, team);
  }
  stage.draw(true);
}

Tournament.prototype.drawSeeding = function() {
  var stage = this.addStage('Seeding', true);
  stage.settings.settings = false;
  var group = stage.addGroup('Seeding 0');
  group.settings.resolvable = false;
  group.size = this.size;
  stage.draw(true);
}

Tournament.prototype.drawStandings = function() {
  var stage = this.addStage('Standings', true);
  stage.settings.settings = false;
  var group = stage.addGroup('Standings 0');
  group.settings.outgoing = false;
  group.size = this.size;
  stage.draw(true);
}

Tournament.prototype.addStage = function(name) {
  var stage = new Stage(this.stages.length, this, name);
  this.stages.push(stage);
  return stage;
}

