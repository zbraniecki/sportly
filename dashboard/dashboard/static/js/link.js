var Link = function(from, pos) {
  this.from = from;
  this.fromPos = pos;
  this.to = null;
  this.toPos = null
  this.node = null;

  from.sportlyGetLink = function() {
    return this;
  }
}

Link.prototype.bindNode = function(node) {
  this.node = node;
  console.log(node);
  node.sportlyGetLink = function() {
    return this;
  }
}
