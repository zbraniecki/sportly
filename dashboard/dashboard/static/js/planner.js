
var tournament = null;
var tid = 1;

function loadTournament() {
  $.ajax({
    url: '/api/planner/event/'+tid,
    dataType: 'json',
  }).done(function(data) {
    tournament = new Tournament();
    tournament.init(data.name, data.teams);
    tournament.draw();
  });
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
      tournament.draw();
    }
  });
});

var UI = {
  draggedLinks: {},
};
