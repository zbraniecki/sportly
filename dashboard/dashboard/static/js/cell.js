var Cell = function(table, pos) {
  this.table = table;
  this.node = null;
  this.id = null;
  this.pos = pos;
  this.settings = {
    'droppable': false,
  };
}


Cell.prototype.draw = function(parent) {
 var td = $('<td class="main cell"></td>'); 
 var cell = this;
 this.node = td[0];
 if (this.settings.droppable) {
   td.droppable({
     accept: ".team, .link",
     drop: function(event, ui) {
       var linkName = $(ui.draggable).attr('id');
       var link = UI.draggedLinks[linkName];
       cell.table.group.elements['in'][cell.pos] = link;
       $(this).append(ui.draggable);
       link.setTo(cell.table.group, cell.pos);
       ui.draggable.addClass('placed');
     }
   });
 }
 parent.appendChild(td[0]);
}
