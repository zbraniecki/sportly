$(function() {
  var tournament = null;
  $("#add_stage").on('click', function() {
    var stage = tournament.addStage();
    stage.draw(false);
  });
  $("#create_tournament").on('click', function() {
    tournament = new Tournament();
    tournament.init();
    tournament.draw();
  });
});

var UI = {
  draggedLinks: {},
};
