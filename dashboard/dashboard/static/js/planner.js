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
  var group = stage.addGroup('Seeding 0');
  group.settings.resolvable = false;
  group.size = this.size;
  stage.draw(true);
}

Tournament.prototype.drawStandings = function() {
  var stage = this.addStage('Standings', true);
  var group = stage.addGroup('Standings 0');
  group.settings.outgoing = false;
  group.size = this.size;
  stage.draw(true);
}

Tournament.prototype.addStage = function(name) {
  var stage = new Stage(this.stages.length, this, name);
  this.stages.push(stage);
  //stage.setType('group');
  return stage;
}

function Stage(num, t, name) {
  this.tournament = t;
  this.node = null;
  this.num = num;
  this.id = 'stage'+num;
  this.groups = [];
  this.ladder = null;
  this.type = 'group';
  if (!name) {
    name = 'Stage '+num;
  };
  this.settings = {
    'modifygroups': true,
  };
  this.name = name;
}

Stage.prototype.extendToolbar = function() {
  var settings = $('.toolbar', this.node);
  settings.empty();
  switch(this.type) {
    case 'group':
      console.log(this.settings.modifygroups);
      if (this.settings.modifygroups) {
        var addgroup = $("<button/>")
          .text("Add Group")
          .on('click', {'self': this}, function(e) {
            var group = e.data.self.addGroup();
            group.draw();
          });
        settings.append(addgroup);
      }
      break;
    case 'ladder':
      var addgroup = $("<button/>")
        .text("Add Bracket")
        .on('click', {'self': this}, function(e) {
          e.data.self.addGroup();
        });
      settings.append(addgroup);
      break;
  }
}

Stage.prototype.drawGroups = function() {
  for (var i in this.groups) {
    this.groups[i].draw();
  }
}

Stage.prototype.draw = function(append) {
  var stage = $("<li/>", {
    'class': 'stage'
  });
  var header = $('<header/>');
  var name = $("<h1/>").text(this.name);
  name.editable({
    title: "Stage name",
    placement: 'bottom',
    send: 'never',
    toggle: 'click',
  });
  header.append(name);
  var toolbar = $("<div/>", {
    'class': 'toolbar'
  });

  var groupbox = $('<div/>', {
    'class': 'groupbox'
  });
  header.append(toolbar);
  stage.append(header);
  stage.append(groupbox);
  this.node = stage;
  this.groups.forEach(function(group) {
    group.draw();
  });
  this.extendToolbar();
  if (append) {
    this.tournament.stagesNode.append(stage);
  } else {
    $('.stage:last', this.tournament.node).before(stage);
  }
}

Stage.prototype.addGroup = function(name) {
  var group = new Group(this.groups.length, this, name);
  this.groups.push(group);
  return group;
}

