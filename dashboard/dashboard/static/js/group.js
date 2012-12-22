


var Group = function(num, s, name) {
  this.node = null;
  this.num = num;
  this.id = 'group'+num;
  this.stage = s;
  this.type = this.stage.type == 'ladder' ? 'bracket' : 'group';
  this.struct = null;
  this.name = name;
  this.size = 4;
  this.settings = {
    positional: true,
    incoming: true,
    resolvable: true,
    outgoing: true,
  }
}

Group.prototype.draw = function() {
  switch (this.type) {
    case 'group':
      this.struct = new Table(this);
      this.struct.draw();
      break;
    case 'bracket':
      this.struct = new Bracket(this);
      this.struct.draw();
      break;
  }
}

var Table = function(group) {
  this.group = group;
}

Table.prototype.draw = function() {
  var tabs = ['in', 'result'];
  if (this.group.settings.outgoing) {
    tabs.push('out');
  }

  var id = this.group.stage.id+"-"+this.group.id;
  var groupbox = $('.groupbox', this.group.stage.node);
  var group = $('<div/>', {
    'class': 'group tabbable'
  });
  //var name = this.group.stage.type == 'bucket' ? 'Bucket': 'Group';
  //var button = $('<button/>').text('clear');
  //group.append(button);
  var ul = $('<ul/>', {
    'class': 'nav nav-tabs'
  });
  tabs.reverse().forEach(function(title, idx) {
    var li = $('<li/>');
    if (idx == 2) {
      li.addClass('active');
    }
    var a = $('<a/>', {
      'href': '#'+id+'-'+title,
      'data-toggle': 'tab',
    }).text(title);
    li.append(a);
    ul.append(li);
  });
  ul.append($('<li class="name">'+this.group.name+'</li>'));
  group.append(ul);

  var content = $('<div/>', {
    'class': 'tab-content'
  });
  group.append(content);
  tabs.reverse().forEach(function(title, idx) {
    var pane = $('<div/>', {
      'class': 'tab-pane',
      'id': id+'-'+title,
    });
    if (idx == 0) {
      pane.addClass('active');
    }
    var table = $('<table/>').addClass('rows');
    for (var i=0;i<this.group.size;i++) {
      var tr = $('<tr/>');
      if (this.group.settings.positional) {
        var td = $('<td class="pos">'+(i+1)+'</td>');
        tr.append(td);
      }
      var td = $('<td class="main"></td>');
      tr.append(td);
      table.append(tr);
    }
    switch (title) {
      case 'in':
        var main = $('td.main', table);
        main.addClass('slot');
        main.droppable({
          accept: ".team:not(.placed), .link",
          drop: function(event, ui) {
            $(this).append(ui.draggable);
            ui.draggable.addClass('placed');
          }
        });
        break;
      case 'out':
        var mains = $('td.main', table);
        mains.each(function(idx, main) {
          var link = $('<div class="link">G0'+idx+'</div>');
          link.draggable({
            helper: 'clone',
          });
          $(main).append(link);
        });
        break;
    }

    pane.append(table);
    content.append(pane);
  }, this);
  groupbox.append(group);
}

var Bracket = function(group) {
  this.group = group;
  this.tmsnr = 8;
}

Bracket.prototype.draw = function() {
  var table = $("<table />").addClass('bracket');
  this.group.stage.node.append(table);
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
  this.group.node = table;
}

Bracket.prototype.clear = function() {
  $("table", this.stage.node).remove();
}
