var Link = function() {
  this.from = {'group': null, 'pos': null};
  this.to = {'group': null, 'pos': null};
  this.nodes = {'link': null, 'source': null};
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
  this.updateTournamentData(to, pos);
  this.setTo(to, pos);
  this.draw();
}

Link.prototype.setTo = function(to, pos) {
  this.to.group = to;
  this.to.pos = pos;
}

Link.prototype.updateTournamentData = function(to, pos) {
  if (this.to.group) {
    delete this.to.group.elements['in'][this.to.pos];
  }
  to.elements['in'][pos] = this;
}

Link.prototype.getSourceNode = function() {
  var link = this;
  if (!this.nodes.source) {
    var source = $('<div class="source"><div class="name"/><div class="target"/><div class="actions"/></div>');
    $('.actions', source).html($('<button class="cancel">cancel</button>'));
    $('button.cancel', source).on('click', function() {
      var fromCell = link.from.group.struct.cells['out'][link.from.pos].node;
      $(fromCell).empty();
      link.nodes.source = null;

      fromCell.appendChild(link.nodes.link);
      link.to.group = null;
      link.to.pos = null;
    });
    this.nodes.source = source[0];
  }
  $('.name', this.nodes.source).text(this.name);
  $('.target', this.nodes.source).text(this.to.group.name + '#' + (this.to.pos+1));
  return this.nodes.source;
}

Link.prototype.getLinkNode = function() {
  var link = this;
  if (!this.nodes.link) {
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
    this.nodes.link = node[0];
  }
  return this.nodes.link;
}

Link.prototype.draw = function(type) {
  if (!type) {
    type = 'both';
  }
  var cell;
  var node;

  if (type == 'out' || type == 'both') {
    cell = this.from.group.struct.cells['out'][this.from.pos];
    if (!this.to.group) {
      node = this.getLinkNode();
    } else {
      node = this.getSourceNode();
    }
    cell.node.appendChild(node);
  }

  if (type == 'in' || type == 'both') {
    cell = this.to.group.struct.cells['in'][this.to.pos];
    cell.node.appendChild(this.getLinkNode());
  }
}

var Team = function(name, id) {
  Link.call(this);
  this.name = name;
  this.id = id;
}

Team.prototype = new Link();
Team.prototype.constructor = Team;

Team.prototype.draw = function(type) {
  Link.prototype.draw.call(this, type);
  if (this.nodes.link) {
    this.nodes.link.classList.add('team');
  }
}
