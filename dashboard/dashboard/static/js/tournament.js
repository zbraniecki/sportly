function Tournament() {
  this.stages = [];
  this.size = 4; // number of teams
  this.nodes = [];
}

Tournament.prototype.init = function() {
  this.addTeamsStage();
  this.addSeedingStage();
  this.addStandingsStage();
}

Tournament.prototype.addTeamsStage = function() {
  var stage = this.addStage('Teams', true);
  stage.settings.modifygroups = false;
  stage.settings.settings = false;
  var group = stage.addGroup('Teams 0', this.size);
  group.settings.positional = false;
  group.settings.resolvable = false;
  group.settings.incoming = false;
  group.size = this.size;
  for (var i=0;i<this.size;i++) {
    var team = new Team('Team '+(i+1));
    team.init(group, i);
    group.setElement('out', i, team);
  }
}

Tournament.prototype.addSeedingStage = function() {
  var stage = this.addStage('Seeding', true);
  stage.settings.settings = false;
  var group = stage.addGroup('Seeding 0', this.size);
  group.settings.resolvable = false;
  group.size = this.size;
  group.init();
}

Tournament.prototype.addStandingsStage = function() {
  var stage = this.addStage('Standings', true);
  stage.settings.settings = false;
  var group = stage.addGroup('Standings 0', this.size);
  group.settings.outgoing = false;
  group.size = this.size;
  group.init();
}

// Teams / Standings should be its own classes same as other stages

Tournament.prototype.draw = function() {
  var node = $('<div id="tournament"/>');
  var header = $('<header/>');
  var title = $('<h1>Tournament 0</h1>');
  title.editable({
    title: "Tournament name",
    placement: 'right',
    send: 'never',
    toggle: 'click', 
  });
  header.append(title);
  node.append(header);
  this.nodes.tournament = node[0];
  var stagesNode = $('<ul class="stages"/>');
  this.nodes.stages = stagesNode[0];
  node.append(stagesNode);
  for (var i in this.stages) {
    this.stages[i].draw(true);
  }
  $(document.documentElement).append(node);
}


Tournament.prototype.addStage = function(name) {
  var stage = new Stage(this.stages.length, this, name);
  this.stages.push(stage);
  return stage;
}

