var panels = {
  'games': null,
  'score': null,
};

var gameData = {};
var db = null

$(document).ready(function() {
  $(document.body).hide();
  db = new DB();
  gameData = new LocalData();


  db.openDb(function() {
    gameData.loadData(loadPanel);
  });
});


function loadPanel(id) {
  var pc;
  if (!id) {
    id = 'games';
    pc = GameListPanel;
  } else {
    pc = ScorePanel;
  }
  if (!panels[id]) {
    panels[id] = new pc();
  }
  $('.view').removeClass('current');
  $('.view-'+id).addClass('current');

  panels[id].draw();
  $(document.body).show();
}


function Panel(id) {
  this.id = id;
}

Panel.prototype = {
  id: null,
  bindAPI: null,
  draw: null,
}
