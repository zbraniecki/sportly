var Game = function(id) {
  this.id = id;
  this.elements = {
    'in': [],
    'status': [],
    'out': [],
  };
  this.cells = {
    'in': [],
    'status': [],
    'out': [],
  };
}

Game.prototype.init = function() {
  var link;
  link = new Link();
  link.init(this, 0);
  this.elements.out.push(link);
  link = new Link();
  link.init(this, 1);
  this.elements.out.push(link);
}

Game.prototype.draw = function(parentNode) {
  var t1='t1';
  var t2='t2';
  var gtable = $("<table><tr class='team1' /></tr><tr><td>"+this.id+"</td></tr><tr><td class='team2' /></tr></table>");
  gtable.addClass('game');
  var cell1 = new Cell(this, 0);
  cell1.settings.droppable = true;
  cell1.draw($('.team1', gtable)[0]);
  this.cells['in'][0] = cell1;
  var cell2 = new Cell(this, 1);
  cell2.settings.droppable = true;
  cell2.draw($('.team2', gtable)[0]);
  this.cells['in'][1] = cell2;
  parentNode.appendChild(gtable[0]);
}
