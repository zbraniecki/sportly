var panels = {
  'gamelist': {'class': null, 'instance': null},
  'gamesettings': {'class': null, 'instance': null},
  'score': {'class': null, 'instance': null},
};

var teams = {
  1: {name: 'BAB'},
  2: {name: 'OSC'},
  3: {name: 'Fluffer'},
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
  if (!id) {
    id = 'gamesettings';
  }
  var pc = panels[id].class;

  if (!panels[id].instance) {
    panels[id].instance = new pc();
    panels[id].instance.bindAPI();
  }
  $('.view').removeClass('current');
  $('.view-'+id).addClass('current');

  panels[id].instance.draw();
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
