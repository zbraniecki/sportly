$(function() {
  var tournament = new Tournament();

  $("#add_stage").on('click', function() {
    tournament.addStage();
  });
  $( "#teams" ).sortable({
    placeholder: "ui-state-highlight"
  }); 
  $( "#teams li" ).addClass('team');
});


function Tournament() {
  this.stages = [];
  this.node = $('#tournament tr');
}

Tournament.prototype.addStage = function() {
  var stage = new Stage(this.stages.length, this);
  this.stages.push(stage);
  stage.draw();
  stage.setType('bucket');
}

function Stage(num, t) {
  this.tournament = t;
  this.node = null;
  this.num = num;
  this.id = 'stage'+num;
  this.groups = [];
  this.ladder = null;
  this.type = 'bucket';
}

Stage.prototype.setType = function(type) {
  this.type = type;
  $('.groupbox', this.node).empty();
  this.groups = [];
  this.drawSettings();
  this.drawGroups();
}

Stage.prototype.drawSettings = function() {
  var settings = $('.type_settings', this.node);
  settings.empty();
  switch(this.type) {
    case 'bucket':
      var addgroup = $("<button/>")
        .text("Add Bucket")
        .on('click', {'self': this}, function(e) {
          e.data.self.addGroup();
        });
      settings.append(addgroup);
      break;
    case 'group':
      var addgroup = $("<button/>")
        .text("Add Group")
        .on('click', {'self': this}, function(e) {
          e.data.self.addGroup();
        });
      settings.append(addgroup);
      break;
    case 'ladder':
      var teams = $("<input/>")
        .val(4)
        .on('change', {'self': this}, function(e) {
          e.data.self.ladder.tmsnr = $(this).val(); 
        });
      var draw = $("<button />")
        .text("Draw")
        .on("click", {'self': this}, function(e) {
          if (e.data.self.ladder) {
            e.data.self.ladder.clear();
          } else {
            var ladder = new Ladder(0, e.data.self);
            e.data.self.ladder = ladder;
          }
          e.data.self.ladder.draw();
        });
      settings.append(teams);
      settings.append(draw);
      break;
  }
}

Stage.prototype.drawGroups = function() {
  for (var i in this.groups) {
    this.groups[i].draw();
  }
}

Stage.prototype.draw = function() {
  var stage = $("<td/>", {
    'class': 'stage'
  });
  var settings = $("<div/>", {
    'class': 'settings'
  });
  var type = $("<select/>").on('change', {'self': this}, function(e) {
    e.data.self.setType($(this).val());
  });
  var option1 = $("<option/>").text("bucket");
  var option2 = $("<option/>").text("group");
  var option3 = $("<option/>").text("ladder");
  type.append(option1);
  type.append(option2);
  type.append(option3);
  var ts = $('<div/>', {
    'class': 'type_settings'
  });
  settings.append(type);
  settings.append(ts);


  var groupbox = $('<div/>', {
    'class': 'groupbox'
  });
  stage.append(settings);
  stage.append(groupbox);
  this.node = stage;
  this.tournament.node.append(stage);
}

Stage.prototype.addGroup = function() {
  var group = new Group(this.groups.length, this);
  this.groups.push(group);
  group.draw(); 
}

var Group = function(num, s) {
  this.node = null;
  this.num = num;
  this.id = 'group'+num;
  this.stage = s;
}

Group.prototype.draw = function() {
  var id = this.stage.id+"-"+this.id;
  var groupbox = $('.groupbox', this.stage.node);
  var group = $('<div/>', {
    'class': 'group tabbable tabs-left'
  });
  var name = this.stage.type == 'bucket' ? 'Bucket': 'Group';
  var span = $('<span/>').text(name+' '+this.num);
  group.append(span);
  var button = $('<button/>').text('clear');
  group.append(button);
  var ul = $('<ul/>', {
    'class': 'nav nav-tabs'
  });
  var li1 = $('<li/>').addClass('active');
  var li1a = $('<a/>', {
    'href': '#'+id+'-seeds',
      'data-toggle': 'tab',
  }).text('Seeds');
  li1.append(li1a);
  ul.append(li1);
  var li2 = $('<li/>');
  var li2a = $('<a/>', {
    'href': '#'+id+'-links',
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
      'id': id+'-seeds',
  });
  content.append(pane1);
  var table = $('<table/>').addClass('rows').attr('border', 1);
  pane1.append(table);
  for (var i=0;i<2;i++) {
    switch (this.stage.type) {
      case 'bucket':
        var tr = $('<tr><td class="slot">&nbsp;</td></tr>');
        break;
      case 'group':
        var tr = $('<tr><td>'+(i+1)+'</td><td class="slot">&nbsp;</td></tr>');
        break;
    }
    pane1.find('table').append(tr);
  }
  $("td.slot", table).droppable({
    //hoverClass: "ui-state-active",
    accept: ".team:not(.placed), .link",
    drop: function(event, ui) {
      $(this).text(ui.draggable.text());
      ui.draggable.addClass('placed');
    }
  });
  var pane2 = $('<div/>', {
    'class': 'tab-pane',
      'id': id+'-links',
  });
  if (this.stage.type == 'bucket') {
    $( "tbody", table).sortable({
      placeholder: "ui-state-highlight"
    }); 
  }
  content.append(pane2);
  var table = $('<table/>').addClass('rows').attr('border', 1);
  pane2.append(table);
  for (var i=0;i<2;i++) {
    switch (this.stage.type) {
      case 'bucket':
        var tr = $('<tr><td><div class="link">B'+this.num+''+i+'</div></td></tr>');
        break;
      case 'group':
        var tr = $('<tr><td>'+(i+1)+'</td><td class="slot"><div class="link">G'+this.num+''+i+'</div></td></tr>');
        break;
    }
    pane2.find('table').append(tr);
  }
  $("td > div.link", pane2).draggable({ helper: "clone" });
  groupbox.append(group);
}


var Ladder = function(num, s) {
  this.node = null;
  this.num = num;
  this.id = 'ladder'+num;
  this.stage = s;
  this.tmsnr = 8;
}

Ladder.prototype.draw = function() {
  var table = $("<table />").addClass('ladder');
  this.stage.node.append(table);
  var tr = $("<tr />");
  var rounds = Math.log(this.tmsnr)/Math.log(2);
  var round = 0;
  table.append(tr);
  while (round < rounds) {
    var td = $("<td />");
    tr.append(td);
    var gtb = $("<table />");
    for (var i=0;i<this.tmsnr/2;i++) {
      var gtr = $("<tr />");
      var gtd = $("<td />");
      var t1 = "t1";
      var t2 = "t2";
      if (round > 0) {
        t1 = "G"+(round-1)+(i*2)+"W";
        t2 = "G"+(round-1)+(i*2+1)+"W";
      }
      var gtable = $("<table><tr><td>"+t1+"</td></tr><tr><td>G"+round+i+"</td></tr><tr><td>"+t2+"</td></tr></table>");
      gtable.addClass('game');
      gtd.append(gtable);
      gtr.append(gtd);
      gtb.append(gtr);
    }
    td.append(gtb);
    this.tmsnr /= 2;
    round++;
  }
  $("td.game", table).droppable({
    //hoverClass: "ui-state-active",
    accept: ".team:not(.placed), .link",
    drop: function(event, ui) {
      $(this).text(ui.draggable.text());
      ui.draggable.addClass('placed');
    }
  });
  this.node = table;
}

Ladder.prototype.clear = function() {
  $("table", this.stage.node).remove();
}
