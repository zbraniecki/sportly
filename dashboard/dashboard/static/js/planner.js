
var tournament = null;
var tid = 1;


function feedTournamentData(data) {
  tournament.name = data.name;
  for (var i=0;i<tournament.size;i++) {
    if (!tournament.stages[0].groups[0].elements['out'][i]) {
      var team = new Team(data.teams[i]['name'], data.teams[i]['id']);
      team.init(tournament.stages[0].groups[0], i);
      tournament.stages[0].groups[0].setElement('out', i, team);
      if (data.teams[i]['seed'] !== undefined) {
        var to = tournament.stages[1].groups[0];
        team.setTo(to, data.teams[i]['seed']);
        tournament.stages[1].groups[0].setElement('in', data.teams[i]['seed'], team);
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
