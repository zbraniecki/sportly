
var team = [
  '4hands',
  'B.C.'
]
$(function() {
  $(".seed td").droppable({
    hoverClass: "ui-state-active",
    drop: function(event, ui) {
      $(this).text(ui.draggable.text())
    }
  });
  $( ".tabs" ).tabs();
        $( "#teams" ).sortable({
            placeholder: "ui-state-highlight"
            }); 
        $( "#teams li" ).draggable(); 
});

function add_phase() {
  var phases = $(".edition");
  var phase = $("<div/>", {
    'class': 'phase'
  });
  var settings = $("<div/>", {
    'class': 'settings'
  });
  var add_group = $("<button/>", {
  }).text("Add group");
  settings.append(add_group)
  phase.append(settings);
  phases.append(phase);
}
