function Tournament() {
  this.stages = [];
  this.size = 8; // number of teams
  this.nodes = [];
  this.name = null;
  this.teams = {};
}

Tournament.prototype.init = function(name, teams) {

  this.addTeamsStage(teams);
  //this.addSeedingStage(teams);
  //this.addStandingsStage();
}


Tournament.prototype.feedData = function() {
  if (!this.name) {
    this.name = 'Tournament 0';
  }
  for (var i=0;i<this.size;i++) {
    if (!this.stages[0].groups[0].elements['out'][i]) {
      var team = new Team('Team '+(i+1));
      team.init(this.stages[0].groups[0], i);
      this.stages[0].groups[0].setElement('out', i, team);
    } 
  }
}

Tournament.prototype.addTeamsStage = function(teams) {
  var stage = this.addStage('Teams', true);
  stage.settings.modifygroups = false;
  stage.settings.settings = false;
  var group = stage.addGroup('Teams 0', this.size);
  group.settings.positional = false;
  group.settings.resolvable = false;
  group.settings.incoming = false;
  group.size = this.size;

}

Tournament.prototype.addSeedingStage = function(teams) {
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
  var title = $('<h1>'+this.name+'</h1>');
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


Tournament.prototype.addStage = function(name, type) {
  var stage = new Stage(this.stages.length, this, name);
  stage.type = type;
  this.stages.push(stage);
  return stage;
}


