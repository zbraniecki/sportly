
(function( $ ) {
  $.widget( "sportly.group", {
    options: { 
      name: "Group",
      board: null,
      parent: null
    },
  _create: function() {
    var self=this;
    this.element
      .addClass("sportly-group")
      .addClass("sportly-element")
      .resizable({
        containment: "parent",
        resize: function(event, ui) {
          self._adjustLabel();
        }
      })
      .draggable({
        containment: "parent",
        handle: "h1"
      })
      .on("mousedown", function(event) {
        event.preventDefault();
        event.stopPropagation() 
      });

    this.label = $("<h1/>")
    .text(this.options.name)
    .appendTo(this.element);
  },
  _setOption: function( key, value ) {
    switch( key ) {
      case "clear":
        break;
    }
    this._super( "_setOption", key, value );
  },
  _destroy: function() {
    this.element
      .removeClass("sportly-group")
      .removeClass("sportly-element")
      .resizable("destroy")
      .draggable("destroy")
  },
  resize: function(dem) {
    this.element.css({'width': dem[0], 'height': dem[1]});
    this._adjustLabel(dem[1]);
  },
  _adjustLabel: function(h) {
    if (!h)
      h = this.element.height();
    this.label.css({'width': h, 'margin-top': h/2-10, 'margin-left': (h/2-10)*-1});  
  }
  });
}( jQuery ) );



