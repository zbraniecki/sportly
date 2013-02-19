var Link = function() {
  this.from = {'group': null, 'pos': null};
  this.to = {'group': null, 'pos': null};
  this.nodes = {'main': null, 'source': null};
  this.name = null;
}

Link.prototype.init = function(from, pos) {
  this.from.group = from;
  this.from.pos = pos;
  if (!this.name) {
    this.name = this.from.group.getCodeName() + this.from.pos;
  }
}

Link.prototype.onToChange = function(to, pos) {
  this.setTo(to, pos);
  this.updateTournamentData();
  this.draw();
}

Link.prototype.setTo = function(to, pos) {
  this.to.group = to;
  this.to.pos = pos;
}

Link.prototype.updateTournamentData = function() {
  //delete link.to.group.elements['in'][link.from.pos];
}

Link.prototype.drawSourceCell = function() {
  var link = this;
  if (!this.nodes.source) {
    var source = $('<div class="source"><div class="name"/><div class="target"/><div class="actions"/></div>');
    this.nodes.source = source[0];
    $('.actions', this.nodes.source).html($('<button class="cancel">cancel</button>'));
    $('button.cancel', source).on('click', function() {
      var fromCell = link.from.group.struct.cells['out'][link.from.pos].node;
      $(fromCell).empty();
      link.nodes.source = null;

      fromCell.appendChild(link.nodes.main);
      link.to.group = null;
      link.to.pos = null;
    });
    $(this.from.group.struct.cells['out'][this.from.pos].node).empty().append(this.nodes.source);
  }
  //this.to.group.elements['in'][this.to.pos] = link;
  $('.name', this.nodes.source).text(this.name);
  $('.target', this.nodes.source).text(this.to.group.name + '#' + (this.to.pos+1));
}

Link.prototype.draw = function() {
  var link = this;
  var cell;

  if (link.to.group) {
    this.drawSourceCell();
    cell = this.to.group.struct.cells['in'][this.to.pos];
  } else {
    cell = this.from.group.struct.cells['out'][this.from.pos];
  }
  if (!this.nodes.main) {
    var node = $('<div class="link">'+this.name+'</div>');
    node.attr('id', this.name);
    node.draggable({
      helper: 'clone',
      scope: "links",
      start: function( event, ui ) {
        UI.draggedLinks[link.name] = link;
      },
      stop: function( event, ui ) {
        delete UI.draggedLinks[link.name];
      },
    });
    this.nodes.main = node[0];
  }
  cell.node.appendChild(this.nodes.main);
}

var Team = function(name, id) {
  Link.call(this);
  this.name = name;
  this.id = id;
}

Team.prototype = new Link();
Team.prototype.constructor = Team;

Team.prototype.draw = function(parent) {
  Link.prototype.draw.call(this, parent);
  this.nodes.main.classList.add('team');
}
