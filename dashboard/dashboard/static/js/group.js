var Group = function(num, s, name, size) {
  this.node = null;
  this.num = num;
  this.id = 'group'+num;
  this.stage = s;
  this.links = [];
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
  for (var i=0;i<this.size;i++) {
    this.links.push(new Link(this, i));
  }
  this.elements = {
    'in': [],
    'results': [],
    'out': [],
  };
  this.settings = {
    positional: true,
    incoming: true,
    resolvable: true,
    outgoing: true,
  };
}

Group.prototype.getCodeName = function() {
  return 'S'+this.stage.num+'G'+this.num;
}


Group.prototype.setElement = function(type, pos, elem) {
  this.elements[type][pos] = elem;
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
