var Group = function(num, s, name, id, size) {
  this.node = null;
  this.num = num;
  this.id = id || 'group'+num;
  this.stage = s;
  this.type = this.stage.type == 'ladder' ? 'bracket' : 'group';
  this.struct = null;
  if (!name) {
    name = 'Group '+num;
  }
  this.name = name;
  if (size === undefined) {
    size = 4;
  }
  this.size = size;
  this.elements = {
    'in': [],
    'status': [],
    'out': [],
  };
  this.settings = {
    positional: true,
    incoming: true,
    resolvable: true,
    outgoing: true,
  };
}

Group.prototype.init = function() {
  var link;
  for (var i = 0; i < this.size; i++) {
    link = new Link();
    link.init(this, i);
    this.elements.out.push(link);
    if (this.struct) {
      this.struct.cells.out[i].link = link;
    }
  }
}

Group.prototype.getCodeName = function() {
  return 'S'+this.stage.num+'G'+this.num;
}


Group.prototype.setElement = function(type, pos, elem) {
  this.elements[type][pos] = elem;
  if (this.struct) {
    this.struct.cells[type][pos].link = elem;
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
