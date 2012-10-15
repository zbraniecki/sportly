
var team = [
  '4hands',
  'B.C.'
]
$(function() {
  $(".seed td").droppable({
    hoverClass: "ui-state-active",
    accept: ":not(.placed)",
    drop: function(event, ui) {
      $(this).text(ui.draggable.text())
      ui.draggable.addClass('placed')
    }
  });
  $(".advances td > span").draggable({ revert: true });
  $( ".tabs" ).tabs();
        $( "#teams" ).sortable({
            placeholder: "ui-state-highlight"
            }); 
});

function add_phase() {
  var phases = $(".edition");
  var phase = $("<div/>", {
    'class': 'phase'
  });
  var tab_titles = ['seed', 'games', 'advances'];
  var tabstrip = $("<div><ul><li><a/></li><li><a/></li><li><a/></li></ul></div>", {
    'class': 'tabs'
  });
  $('a', tabstrip).each(function(index, elem) {
    $(elem).text(tab_titles[index]).attr('href', '#phase-1-'+tab_titles[index]);
  });
  phase.append(tabstrip);
  
  var seed = $("<div/>", {
    'id': 'phase-1-seed',
    'class': 'seed'
  });
  tabstrip.append(seed);

  var games = $("<div/>", {
    'id': 'phase-1-games',
    'class': 'games'
  });
  tabstrip.append(games);
  var advances = $("<div/>", {
    'id': 'phase-1-advances',
    'class': 'advances'
  });
  tabstrip.append(advances);

  tabstrip.tabs();

  phases.append(phase);
  setGroupPhase(phase);
}

function setGroupPhase(phase) {
   var settings = {
     'groups': 2,
   }
   var seed = $('.seed', phase);
   var groupbox = $('<div/>', {
     'class': 'groupbox'
   });
   for(var n=0;n<settings['groups'];n++) {
   var group = $('<div><span/><button/><table/></div>');
   group.addClass('group');
   group.find('button').text('clear');
   group.find('span').text('Group '+n);
   group.find('table').addClass('rows').attr('border', 1);
   for (var i=0;i<4;i++) {
     var tr = $('<tr><td>&nbsp;</td></tr>');
     group.find('table').append(tr);
   }
   groupbox.append(group);
   }

  $("td", groupbox).droppable({
    hoverClass: "ui-state-active",
    accept: ":not(.placed)",
    drop: function(event, ui) {
      $(this).text(ui.draggable.text())
      ui.draggable.addClass('placed')
    }
  });
  seed.append(groupbox);
  setPhaseSchedule(phase);
  setAdvances(phase);
}

function setPhaseSchedule(phase) {
  var settings = {
    'fields': 2,
  }
  var games = $('.games', phase);
  var schedulebox = $('<div/>').addClass('schedulebox');
  for (var n=0;n<settings['fields'];n++) {
    var field = $('<div><span/><table/></div>')
    field.addClass('games')
    field.find('span').text('Field 1')
    var table = $('table', field);
    table.attr('border', 1);
    for (var i=0;i<4;i++) {
      var tr = $('<tr/>');
      tr.append($('<td/>').text('round1'))
      tr.append($('<td/>').text('HH:MM'))
      tr.append($('<td/>').text('?? vs. ??'))
      table.append(tr);
    }
    schedulebox.append(field)
  }
  games.append(schedulebox);
}

function setAdvances(phase) {
   var settings = {
     'groups': 2,
   }
   var advances = $('.advances', phase);
   var groupbox = $('<div/>', {
     'class': 'groupbox'
   });
   for(var n=0;n<settings['groups'];n++) {
   var group = $('<div><span/><button/><table/></div>');
   group.addClass('group');
   group.find('button').text('clear');
   group.find('span').text('Group '+n);
   group.find('table').addClass('rows').attr('border', 1);
   for (var i=0;i<4;i++) {
     var tr = $('<tr><td><span/></td></tr>');
     tr.find('span').text('A1')
     group.find('table').append(tr);
   }
   groupbox.append(group);
   }

  $("td", groupbox).droppable({
    hoverClass: "ui-state-active",
    accept: ":not(.placed)",
    drop: function(event, ui) {
      $(this).text(ui.draggable.text())
      ui.draggable.addClass('placed')
    }
  });
  advances.append(groupbox);
  $("td > span", advances).draggable({ revert: true });
}
