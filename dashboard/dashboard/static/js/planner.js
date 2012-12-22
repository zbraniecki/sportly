$(function() {
  var tournament = new Tournament();
  tournament.drawTeams();
  tournament.drawSeeding();
  tournament.drawStandings();

  $("#add_stage").on('click', function() {
    tournament.addStage();
  });

  $( "#teams li" ).addClass('team');
});


function Tournament() {
  this.stages = [];
  this.size = 8; // number of teams
  this.node = $('#tournament tr');
}

// Teams / Standings should be its own classes same as other stages

Tournament.prototype.drawTeams = function() {
  var node = $("#teams");
  for (var i=0;i<this.size;i++) {
    var li = $("<li><div class='team'>Team "+i+"</div></li>");
    node.append(li);
  }
  $('.team', node).draggable({
    helper: 'clone',
  });
}

Tournament.prototype.drawSeeding = function() {
  var stage = this.addStage('Seeding');
  var group = stage.addGroup('Seeding 0');
  group.draw();
}

Tournament.prototype.drawStandings = function() {
  var stage = this.addStage('Standings');
  var group = stage.addGroup('Standings 0');
  group.settings.outgoing = false;
  group.draw();
}

Tournament.prototype.addStage = function(name) {
  var stage = new Stage(this.stages.length, this, name);
  this.stages.push(stage);
  stage.draw();
  stage.setType('bucket');
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
  this.name = name
}

Stage.prototype.setType = function(type) {
  this.type = type;
  $('.groupbox', this.node).empty();
  this.groups = [];
  this.drawSettings();
  this.drawGroups();
}

Stage.prototype.drawSettings = function() {
  var settings = $('.type_settings', this.node);
  settings.empty();
  switch(this.type) {
    case 'bucket':
      var addgroup = $("<button/>")
        .text("Add Bucket")
        .on('click', {'self': this}, function(e) {
          e.data.self.addGroup();
        });
      settings.append(addgroup);
      break;
    case 'group':
      var addgroup = $("<button/>")
        .text("Add Group")
        .on('click', {'self': this}, function(e) {
          e.data.self.addGroup();
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

Stage.prototype.draw = function() {
  var stage = $("<td/>", {
    'class': 'stage'
  });
  var name = $("<h1/>").text(this.name);
  stage.append(name);
  /*var settings = $("<div/>", {
    'class': 'settings'
  });
  var type = $("<select/>").on('change', {'self': this}, function(e) {
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
  //stage.append(settings);
  stage.append(groupbox);
  this.node = stage;
  this.tournament.node.append(stage);
}

Stage.prototype.addGroup = function(name) {
  var group = new Group(this.groups.length, this, name);
  this.groups.push(group);
  return group;
}

