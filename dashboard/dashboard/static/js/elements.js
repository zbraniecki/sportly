var Link = function(from, pos) {
  this.from = from;
  this.fromPos = pos;
  this.to = null;
  this.toPos = null
  this.node = null;
}

Link.prototype.draw = function(parent) {

}

var Team = function(name) {
  this.name = name;
}

Team.prototype.draw = function(parent) {
  var team = $("<div class='team'>"+this.name+"</div>");
  team.draggable({helper: 'clone'});
  parent.append(team);
}
