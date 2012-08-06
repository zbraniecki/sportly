
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


    this.settings = $("<div/>", {
        'class': 'settings',
      })
      .on("mousedown", function(event) {
        event.stopPropagation();
      })
      .appendTo(this.element);

    $("<label/>", {
      'for': 'nr'+this.objectCount
    })
      .text("Teams:")
      .appendTo(this.settings);
    $("<input/>", {
      'type': 'text',
      'size': '3',
      'value': '4',
      'name': 'nr'+this.objectCount
    })
      .appendTo(this.settings);


    this.settingsView = $("<div/>", {
      'class': 'view',
    });
    $("<input/>", {
      'type': 'radio',
      'id': 'radio-type1',
      'checked': 'checked',
      'name': 'radio-type'
    })
      .appendTo(this.settingsView);
    $("<label/>", {
      'for': 'radio-type1'
    })
      .text("Teams")
      .appendTo(this.settingsView);
    $("<input/>", {
      'type': 'radio',
      'id': 'radio-type2',
      'name': 'radio-type'
    })
      .appendTo(this.settingsView);
    $("<label/>", {
      'for': 'radio-type2'
    })
      .text("Places")
      .appendTo(this.settingsView);
    this.settingsView
      .appendTo(this.element);

    this.settingsView.buttonset()


    this.table = $("<table/>", {
      'class': 'table',
    })

    for (var i=0;i<3;i++) {
      var tr = $("<tr/>")
      for (var j=0;j<2;j++) {
        var td = $("<td/>", {
          'class': j>0?'name':'pos',
        })
        td.text("Foo")
        td.appendTo(tr);
      }
      tr.appendTo(this.table);
    }
    this.table.appendTo(this.element);
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



