
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

function add_stage() {
  var stages = $(".event");
  var stage = $("<div/>", {
    'class': 'stage'
  });
  var settings = $("<div/>", {
    'class': 'settings'
  });
  var type = $("<select/>");
  var option1 = $("<option/>").text("bucket");
  var option2 = $("<option/>").text("group");
  var option3 = $("<option/>").text("ladder");
  type.append(option1);
  type.append(option2);
  type.append(option3);

  var addgroup = $("<button/>")
    .text("Add Bucket")
    .on('click', function() {
    add_group(stage);
  });
  settings.append(type);
  settings.append(addgroup);

   var groupbox = $('<div/>', {
     'class': 'groupbox'
   });
  stage.append(settings);
  stage.append(groupbox);
  stages.append(stage);
  setGroupstage(stage);
}

function add_group(stage) {
  var groupbox = $('.groupbox', stage);
   //var group = $('<div><span/><button/><ul/><div><div><table/></div></div></div>');
   var group = $('<div/>', {
     'class': 'group tabbable tabs-left'
   });
   var span = $('<span/>').text('Bucket 1');
   group.append(span);
   var button = $('<button/>').text('clear');
   group.append(button);
   var ul = $('<ul/>', {
     'class': 'nav nav-tabs'
   });
   var li1 = $('<li/>').addClass('active');
   var li1a = $('<a/>', {
     'href': '#group1-seeds',
     'data-toggle': 'tab',
   }).text('Seeds');
   li1.append(li1a);
   ul.append(li1);
   var li2 = $('<li/>');
   var li2a = $('<a/>', {
     'href': '#group1-links',
     'data-toggle': 'tab',
   }).text('Links');
   li2.append(li2a);
   ul.append(li2);
   group.append(ul);
   var content = $('<div/>', {
     'class': 'tab-content'
   });
   group.append(content);
   var pane1 = $('<div/>', {
     'class': 'tab-pane active',
     'id': 'group1-seeds',
   });
   content.append(pane1);
   var table = $('<table/>').addClass('rows').attr('border', 1);
   pane1.append(table);
   for (var i=0;i<4;i++) {
     var tr = $('<tr><td>&nbsp;</td></tr>');
     group.find('table').append(tr);
   }
  $("td", group).droppable({
    hoverClass: "ui-state-active",
    accept: ":not(.placed)",
    drop: function(event, ui) {
      $(this).text(ui.draggable.text())
      ui.draggable.addClass('placed')
    }
  });
   var pane2 = $('<div/>', {
     'class': 'tab-pane',
     'id': 'group1-links',
   });
   pane2.text('foo')
   content.append(pane2);
  groupbox.append(group);
}

function setGroupstage(stage) {
   var settings = {
     'groups': 2,
   }
   var seed = $('.seed', stage);
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
  setstageSchedule(stage);
  setAdvances(stage);
}

function setstageSchedule(stage) {
  var settings = {
    'fields': 2,
  }
  var games = $('.games', stage);
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

function setAdvances(stage) {
   var settings = {
     'groups': 2,
   }
   var advances = $('.advances', stage);
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
