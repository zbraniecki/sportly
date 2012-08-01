
function setValue(t, val) {
  $( ".amount", t).val( val );
  $(".slider", t).slider("value", val);
}

function customSort(a, b) {
  var vala = $('.amount', a).val();
  var valb = $('.amount', b).val();
  return vala > valb ? -1 : vala < valb ? 1 : 0;
}

function sortByValues(list) {
  var ul = $(list);
  var lis = ul.children("li");
  lis.sort(customSort);
  lis.each(function() {
    ul.append(this);
  });
}

function updateServer(pid, value) {
$.ajax({
  url: "/playerpicker/api/teamactivity/update",
  data: { pid: pid, value: value }
}).done(function() { 
});
}

$(function() {
  $( ".slider" ).slider({
    value:1,
    min: 0,
    max: 99,
    step: 1,
    slide: function(event, ui) {
      setValue(this.parentNode, ui.value);
    },
    change: function( event, ui ) {
      sortByValues(this.parentNode.parentNode);
      var pid = $("label", $(this).parent()).attr("id").substring(7)
      updateServer(pid, ui.value);
    }
  });
  //$( ".amount", this.parentNode ).val( $( ".slider" ).slider( "value" ) );


  $( ".sortable" ).sortable({
    placeholder: "ui-state-highlight",
    update: function(event, ui) {
      var elem = ui.item;
      var list = elem.parentNode;
      var elems = $(list).children("li");
      var prev = elem.prev();
      var next = elem.next();
      var prevVal = prev.size() ? $("input", prev).val() : $(".slider").slider("option", "max");
      var nextVal = next.size() ? $("input", next).val() : 0;

      var avg = parseInt((parseInt(nextVal) + parseInt(prevVal)) / 2)
      setValue(elem, avg);
      var pid = $("label", ui.item).attr("id").substring(7)
      updateServer(pid, avg);
    }
  });
  $( ".sortable" ).disableSelection();
});

