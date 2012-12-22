$(function() {
  var tournament = null;
  $("#add_stage").on('click', function() {
    tournament.addStage();
  });
  $("#create_tournament").on('click', function() {
    tournament = new Tournament();
    tournament.drawTeams();
    tournament.drawSeeding();
    tournament.drawStandings();
  });
});


function Tournament() {
  this.stages = [];
  this.size = 8; // number of teams
  this.node = $('#tournament table#stages > tbody > tr');
}

// Teams / Standings should be its own classes same as other stages

Tournament.prototype.drawTeams = function() {
  var stage = this.addStage('Teams', true);
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
  group.draw();
}

Tournament.prototype.drawSeeding = function() {
  var stage = this.addStage('Seeding', true);
  var group = stage.addGroup('Seeding 0');
  group.settings.resolvable = false;
  group.size = this.size;
  group.draw();
}

Tournament.prototype.drawStandings = function() {
  var stage = this.addStage('Standings', true);
  var group = stage.addGroup('Standings 0');
  group.settings.outgoing = false;
  group.size = this.size;
  group.draw();
}

Tournament.prototype.addStage = function(name, append) {
  var stage = new Stage(this.stages.length, this, name);
  this.stages.push(stage);
  stage.draw(append);
  stage.setType('group');
  return stage;
}

function Stage(num, t, name) {
  this.tournament = t;
  this.node = null;
  this.num = num;
  this.id = 'stage'+num;
  this.groups = [];
  this.ladder = null;
  this.type = 'bucket';
  if (!name) {
    name = 'Stage '+num;
  }
  this.name = name;
}

Stage.prototype.setType = function(type) {
  this.type = type;
  $('.groupbox', this.node).empty();
  this.groups = [];
  this.drawSettings();
  this.drawGroups();
}

Stage.prototype.drawSettings = function() {
  var settings = $('.toolbar', this.node);
  settings.empty();
  switch(this.type) {
    case 'group':
      var addgroup = $("<button/>")
        .text("Add Group")
        .on('click', {'self': this}, function(e) {
          var group = e.data.self.addGroup();
          group.draw();
        });
      settings.append(addgroup);
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
  var stage = $("<td/>", {
    'class': 'stage'
  });
  var header = $('<header/>');
  var name = $("<h1/>").text(this.name);
  header.append(name);
  var toolbar = $("<div/>", {
    'class': 'toolbar'
  });
  /*var type = $("<select/>").on('change', {'self': this}, function(e) {
    e.data.self.setType($(this).val());
  });
  var option1 = $("<option/>").text("bucket");
  var option2 = $("<option/>").text("group");
  var option3 = $("<option/>").text("ladder");
  type.append(option1);
  type.append(option2);
  type.append(option3);
  var ts = $('<div/>', {
    'class': 'type_settings'
  });
  settings.append(type);
  settings.append(ts);*/


  var groupbox = $('<div/>', {
    'class': 'groupbox'
  });
  header.append(toolbar);
  stage.append(header);
  stage.append(groupbox);
  this.node = stage;
  if (append) {
    this.tournament.node.append(stage);
  } else {
    $('.stage:last', this.tournament.node).before(stage);
  }
}

Stage.prototype.addGroup = function(name) {
  console.log('add group');
  var group = new Group(this.groups.length, this, name);
  this.groups.push(group);
  console.log(group);
  return group;
}

