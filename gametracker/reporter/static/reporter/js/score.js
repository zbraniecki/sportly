
var gameData = {};
var db = null

$(document).ready(function() {
  db = new DB();
  gameData = new LocalData();

  bindAPI();
  db.openDb(function() {
    gameData.loadData(drawData);
  });
});

function drawData() {
  $('.team1 .panel-heading').text(gameData.team1.name);
  $('.team2 .panel-heading').text(gameData.team2.name);
  $('.team1 .goals').text(gameData.team1.goals);
  $('.team2 .goals').text(gameData.team2.goals);

  var tbody = $('.logs tbody');
  tbody.empty();
  gameData.events.forEach(function(evt) {
    var tr = $('<tr/>'); 

    var td = $('<td/>');
    td.text(new Date(evt.time).getMinutes());
    tr.append(td);
    var td = $('<td/>');
    td.text(evt.type);
    tr.append(td);
    var td = $('<td/>');
    tr.append(td);
    var td = $('<td/>');
    tr.append(td);
    var td = $('<td/>');
    td.text(gameData[evt.team].name);
    tr.append(td);
    var td = $('<td/>');
    tr.append(td);
    var td = $('<td><button type="button" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-sort"></span></button><button type="button" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-edit"></span></button><button type="button" class="btn btn-default btn-lg remove-btn"><span class="glyphicon glyphicon-remove"></span></button></td>');
    $('.remove-btn', td).click(function() {
      var row = $(this).parent().parent();
      gameData.deleteEvent(evt.eid, function() {
        row.remove();
      },
      function() {
        row.fadeIn();
      });
      row.fadeOut();
    });
    tr.append(td);
    tr.attr('data-event-id', evt.eid);
    tbody.append(tr);
  });
}

function bindAPI() {
  $('#myTab a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
  $('.team1 .pull-btn').click(function () {
    $.ajax({
      url: '/reporter/api/add_moment',
      data: {
        'moment_type': 2,
      'team': 1,
      },
      type: 'GET',
    });
  });
  $('.team2 .pull-btn').click(function () {
    $.ajax({
      url: '/reporter/api/add_moment',
      data: {
        'moment_type': 2,
      'team': 2,
      },
      type: 'GET',
    });
  });
  $('.team1 .goal-btn').click(function () {
    gameData.addGoal(1, null, function() {
      drawData();
    });
    drawData();
  });
  $('.team2 .goal-btn').click(function () {
    gameData.addGoal(2, null, function() {
      drawData();
    });
    drawData();
  });
}
