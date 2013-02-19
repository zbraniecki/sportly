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
     scope: "links",
     drop: function(event, ui) {
       var linkName = $(ui.draggable).attr('id');
       var link = UI.draggedLinks[linkName];
       //$(this).append(ui.draggable);
       link.onToChange(cell.table.group, cell.pos);
     },
     activate: function(event, ui) {
      $(this).addClass('activeTarget');
     },
     deactivate: function(event, ui) {
      $(this).removeClass('activeTarget');
     },
   });
 }
 parent.appendChild(td[0]);
}

