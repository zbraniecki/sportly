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

Link.prototype.setTo = function(to, pos) {
  this.to.group = to;
  this.to.pos = pos;
  this.updateSourceCell();
}

Link.prototype.updateSourceCell = function() {
  var source = $('<div class="source"><div class="name"/><div class="target"/><div class="actions"/></div>');
  var link = this;
  this.nodes.source = source[0];
  $('.name', source).text(this.name);
  $('.target', source).text(this.to.group.name + '#' + (this.to.pos+1));
  $('.actions', source).html($('<button class="cancel">cancel</button>'));
  $('button.cancel', source).on('click', function() {
    var fromCell = link.from.group.struct.cells['out'][link.from.pos].node;
    $(fromCell).empty();
    link.nodes.source = null;
    delete link.to.group.elements['in'][link.from.pos];

    $(link.to.group.struct.cells['in'][link.to.pos].node).empty();
    fromCell.appendChild(link.nodes.main);
    link.to.group = null;
    link.to.pos = null;
  });
  this.from.group.struct.cells['out'][this.from.pos].node.appendChild(source[0]);
}

Link.prototype.draw = function(parent) {
  var link = this;
  var node = $('<div class="link">'+this.name+'</div>');
  node.attr('id', this.name);
  node.draggable({
    helper: 'clone',
    start: function( event, ui ) {
      $('#tournament').addClass('dragging');
      UI.draggedLinks[link.name] = link;
    },
    stop: function( event, ui ) {
      $('#tournament').removeClass('dragging');
      var linkName = this.getAttribute('id');
      delete UI.draggedLinks[link.name];
    },
  });
  this.nodes.main = node[0];
  parent.appendChild(node[0]);
}

var Team = function(name) {
  Link.call(this);
  this.name = name;
}

Team.prototype = new Link();
Team.prototype.constructor = Team;

Team.prototype.draw = function(parent) {
  Link.prototype.draw.call(this, parent);
  this.nodes.main.classList.add('team');
}
