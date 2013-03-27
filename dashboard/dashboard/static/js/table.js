var Table = function(group) {
  this.group = group;
  this.node = null;
  this.cells = {
    'in': [],
    'out': [],
    'status': [],
  };
}

Table.prototype.draw = function() {
  var tabs = [];
  var activeTab = 0;
  if (this.group.settings.incoming) {
    tabs.push('in');
  }
  if (this.group.settings.resolvable) {
    tabs.push('status');
  }
  if (this.group.settings.outgoing) {
    tabs.push('out');
  }

  var id = this.group.stage.id+"-"+this.group.id;
  var groupbox = $('.groupbox', this.group.stage.nodes.stage);
  var groupNode = $('<div/>', {
    'class': 'group tabbable'
  });
  this.node = groupNode[0];
  var ul = $('<ul/>', {
    'class': 'nav nav-tabs'
  });
  if (tabs.length > 1) {
    tabs.reverse().forEach(function(title, idx) {
      var li = $('<li/>');
      if (idx == (tabs.length-1+activeTab)) {
        li.addClass('active');
      }
      var a = $('<a/>', {
        'href': '#'+id+'-'+title,
          'data-toggle': 'tab',
      }).text(title);
      li.append(a);
      ul.append(li);
    });
  }
  var title = $('<li class="name">'+this.group.name+'</li>');
  title.editable({
    title: "Group name",
    placement: 'right',
    send: 'never',
    toggle: 'click', 
  });
  ul.append(title);
  groupNode.append(ul);

  var content = $('<div/>', {
    'class': 'tab-content'
  });
  groupNode.append(content);
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
      var cell = new Cell(this, i);
      cell.link = this.group.elements[title][i];
      if (title === 'in') {
        cell.settings.droppable = true;
      }
      cell.draw(tr[0]);
      this.cells[title][i] = cell;
      if (title === 'status' && this.group.elements['in'][i]) {
        this.group.elements['in'][i].resolveName();
      }
      table.append(tr);
    }
    var gr = this.group;
    this.cells[title].forEach(function(cell, idx) {
      if (gr.elements[title][idx]) {
        gr.elements[title][idx].draw(title);
      }
    });
    pane.append(table);
    content.append(pane);
  }, this);
  groupbox.append(groupNode);
}

var Bracket = function(group) {
  this.group = group;
  this.node = null;
  this.tmsnr = 8;
  this.games = [];

  for (var i=0;i<this.tmsnr/2;i++) {
    var game = new Game('G0'+i);
    this.games.push(game);
  }
}

Bracket.prototype.draw = function() {
  var table = $("<table />").addClass('bracket');
  this.group.stage.nodes.stage.append(table);
  var tr = $("<tr />");
  var rounds = Math.log(this.tmsnr)/Math.log(2);
  var round = 0;
  table.append(tr);
  while (round < 1) {
    var td = $("<td />");
    tr.append(td);
    var gtb = $("<table />");
    for (var i=0;i<this.games.length;i++) {
      var game = this.games[i];
      var gtr = $("<tr />");
      var gtd = $("<td />");
      game.draw(gtd[0]);
      gtr.append(gtd);
      gtb.append(gtr);
    }
    td.append(gtb);
    this.tmsnr /= 2;
    round++;
  }
  this.group.node = table;
}

Bracket.prototype.clear = function() {
  $("table", this.stage.node).remove();
}

