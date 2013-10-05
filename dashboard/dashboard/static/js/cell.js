var Cell = function(parent, pos) {
  this.parent = parent;
  this.node = null;
  this.id = null;
  this.pos = pos;
  this.link = null;
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
       if (cell.parent instanceof Game) {
         link.onToChange(cell.parent, cell.pos);
       } else {
         link.onToChange(cell.parent.group, cell.pos);
       }
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

