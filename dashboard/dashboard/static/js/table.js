var Table = function(group) {
  this.group = group;
  this.node = null;
}

Table.prototype.draw = function() {
  var tabs = [];
  var activeTab = 0;
  if (this.group.settings.incoming) {
    tabs.push('in');
  }
  if (this.group.settings.resolvable) {
    tabs.push('results');
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
      var cell = new Cell();
      cell.parent = this;
      var elem = this.group.elements[title][i] || null;
      var td = $('<td class="main"></td>');
      if (elem) {
        elem.draw(td);
      }
      cell.node = td[0];
      cell.pos = i;
      tr.append(td);
      table.append(tr);
    }
    switch (title) {
      case 'in':
        var main = $('td.main', table);
        var group = this.group;
        main.addClass('cell');
        main.droppable({
          accept: ".team, .link",
          drop: function(event, ui) {
            $(this).append(ui.draggable);
            var linkName = $(ui.draggable).attr('id');
            var link = UI.draggedLinks[linkName];
            link.to = group;
            link.toPos = parseInt($(this).prev().text())-1;

            console.log(link.from.struct.node);
            ui.draggable.addClass('placed');
          }
        });
        break;
      case 'out':
        var mains = $('td.main', table);
        var gr = this.group;
        mains.each(function(idx, main) {
          if (!gr.elements[title][idx]) {
            var linkName = gr.getCodeName() + idx;
            var link = $('<div class="link">'+linkName+'</div>');
            link.attr('id', linkName);
            link.draggable({
              helper: 'clone',
              start: function( event, ui ) {
                $('#tournament').addClass('dragging');
                var linkName = $(this).attr('id');
                UI.draggedLinks[linkName] = gr.links[idx];
              },
              stop: function( event, ui ) {
                $('#tournament').removeClass('dragging');
                var linkName = $(this).attr('id');
                delete UI.draggedLinks[linkName];
              },
            });
            $(main).append(link);
          }
        });
        break;
    }

    pane.append(table);
    content.append(pane);
  }, this);
  groupbox.append(groupNode);
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

