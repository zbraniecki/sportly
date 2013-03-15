
var tournament = null;
var tid = 1;


function feedTournamentData(data) {
  var groups = {};

  tournament.name = data.name;
  for (var i=0;i<tournament.size;i++) {
    var team = new Team(data.teams[i]['name'], data.teams[i]['id']);
    team.init(tournament.stages[0].groups[0], i);
    tournament.teams[team.id] = team;
    tournament.stages[0].groups[0].setElement('out', i, team);
  }

  for (i=0;i<data.stages.length;i++) {
    var dtStage = data.stages[i];

    var stage = tournament.addStage(dtStage.name, dtStage.type);
    stage.settings.settings = false;
    for (j=0;j<dtStage.groups.length;j++) {
      var dtGroup = dtStage.groups[j];
      var group = stage.addGroup(dtGroup.name, dtGroup.id, tournament.size);
      groups[dtGroup.id] = group;
      group.settings.resolvable = false;
      group.size = tournament.size / dtStage.groups.length;
      group.init();
    }
  }

  for (i=0;i<data.links.length;i++) {
    var dtLink = data.links[i];

    if (dtLink.from.type == 'Roster') {
      var team = tournament.teams[dtLink.from.id];
      team.setTo(groups[dtLink.to.id], dtLink.to.pos);
      groups[dtLink.to.id].setElement('in', dtLink.to.pos, team);
    } else if (dtLink.from.type == 'Group') {
      var link = groups[dtLink.from.id].elements['out'][dtLink.from.pos];
      link.setTo(groups[dtLink.to.id], dtLink.to.pos);
      groups[dtLink.to.id].setElement('in', dtLink.to.pos, link);
    }
  }
}

function loadTournament() {
  $.ajax({
    url: '/api/planner/event/'+tid,
    dataType: 'json',
  }).done(function(data) {
    tournament = new Tournament();
    tournament.init();
    feedTournamentData(data);
    tournament.feedData();
    tournament.draw();
  });
}


function saveLinks() {
  for (var i=0;i<tournament.stages.length;i++) {
    var stage = tournament.stages[i];
    for (var j=0;j<stage.groups.length;j++) {
      var group = stage.groups[j];
      var links = group.elements['in'];
      for (var l in links) {
        var link = links[l];
        $.ajax({
          url: '/api/planner/setlink',
          data: {
            edid: tid,
            from_type: link instanceof Team ? 'roster' : 'group',
            from_id: link instanceof Team ? link.id : link.from.group.id,
            from_pos: link.from.pos,
            to_type: 'group',
            to_id: link.to.group.id,
            to_pos: link.to.pos
          },
        });
      }
    }
  }
}

$(function() {
  $("#add_stage").on('click', function() {
    var stage = tournament.addStage();
    stage.draw(false);
  });
  $("#create_tournament").on('click', function() {
    if (tid) {
      loadTournament();
    } else {
      tournament = new Tournament();
      tournament.init();
      tournament.feedData();
      tournament.draw();
    }
  });
  $("#save_tournament").on('click', function() {
    saveLinks();
  });
});

var UI = {
  draggedLinks: {},
};
