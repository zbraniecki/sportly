
var tournament = null;
var tid = 1;


function feedTournamentData(data) {
  tournament.name = data.name;
  for (var i=0;i<tournament.size;i++) {
    var team = new Team(data.teams[i]['name'], data.teams[i]['id']);
    team.init(tournament.stages[0].groups[0], i);
    tournament.teams[team.id] = team;
    tournament.stages[0].groups[0].setElement('out', i, team);
  }

  for (i=0;i<data.stages.length;i++) {
    var dtStage = data.stages[i];

    var stage = tournament.addStage(dtStage.name, true);
    stage.settings.settings = false;
    for (j=0;j<dtStage.groups.length;j++) {
      var dtGroup = dtStage.groups[j];
      var group = stage.addGroup(dtGroup.name, tournament.size);
      group.settings.resolvable = false;
      group.size = tournament.size;
      group.init();
      for (k=0;k<dtGroup.roster.length;k++) {
        var dtTeam = dtGroup.roster[k];
        var team = tournament.teams[dtTeam.id];
        team.setTo(tournament.stages[1].groups[0], dtTeam.pos);
        tournament.stages[1].groups[0].setElement('in', dtTeam.pos, team);
      }
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


function saveSeeding() {
  var seedStage = tournament.stages[1];
  var seedGroup = seedStage.groups[0];
  var elems = seedGroup.elements['in'];
  console.log(elems);
  for (var i in elems) {
    var elem = elems[i];
    $.ajax({
      url: '/api/planner/event/'+tid+'/setseeding/'+elem.id+'/'+i,
    });
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
    saveSeeding();
  });
});

var UI = {
  draggedLinks: {},
};
