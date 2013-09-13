var panels = {
  'gamelist': {'class': null, 'instance': null},
  'gamesettings': {'class': null, 'instance': null},
  'score': {'class': null, 'instance': null},
  'roster': {'class': null, 'instance': null},
};

var eventData = null;
var db = null;
var currentGame = null;

$(document).ready(function() {
  $(document.body).hide();
  db = new DB();
  eventData = new Event();


  db.openDb(function() {
  eventData.loadData(loadPanel);
  });
});


function loadPanel(id, data) {
  if (!id) {
    id = 'gamelist';
  }
  var pc = panels[id].class;

  if (!panels[id].instance) {
    panels[id].instance = new pc();
    panels[id].instance.bindAPI();
  }
  panels[id].instance.setData(data);
  $('.view').removeClass('current');
  $('.view-'+id).addClass('current');

  panels[id].instance.draw();
  $(document.body).show();
}


function Panel(id) {
  this.id = id;
}

Panel.prototype = {
  bindAPI: function() {},
  draw: function() {},
  setData: function() {},
}
