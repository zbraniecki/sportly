
(function( $ ) {
  $.widget( "sportly.drawboard", {
    options: { 
      clear: null
    },
  _create: function() {
    var self = this;
    this.objectType = "Phase";
    this.objectCount = 0;
    this.toolbox = $("<div/>", {
      "class": "ui-widget-content toolbox"
    })
    .draggable({
      containment: "parent",
      opacity: 0.35
    })
    .on("mousedown", function(event) {
      event.preventDefault();
      event.stopPropagation();
    })
    .appendTo(this.element);

    var buttonset = $("<div/>");
    var buttons = ["Phase", "Group", "Game"];
    for (var i in buttons) {
      var button = buttons[i];
      var input = $("<input/>", {
        type: "radio",
        id: "radio"+i,
        name: "object_type",
        value: buttons[i]
      }).on("click", function(event) {
          self.objectType = event.target.value
        })
        .appendTo(buttonset)

      if (i==0) {
        input.attr("checked", "checked");
      }
      $("<label/>", {
        'for': "radio"+i
      })
      .text(buttons[i])
        .appendTo(buttonset)
    }

    buttonset.buttonset();
    buttonset.appendTo(this.toolbox);
    this._on(this.element, { mousedown: function(event) {
      if (!this.newObject) {
        this.addElement(event);

      }  
    }});
    this.objects = [];
  },
  _setOption: function( key, value ) {
    switch( key ) {
      case "clear":
        break;
    }
    this._super( "_setOption", key, value );
  },
  _destroy: function() {
    this.toolbox.remove();
    this._off(this.element, "mousedown");
    for (var i in this.objects) {
      this.objects[i].remove();
      delete this.objects[i];
    }
  },
  
  _bubbleName: function(obj) {
    var str = [obj.objectCount]
    while (obj) {
      str.push(obj.options.num);
      obj = obj.options.parent;
    }
    str.reverse();
    return str.join(".");
  },
  _bubblePos: function(obj) {
    var left = 0;
    var top = 0;
    var tp = obj;
    while (tp) {
      var pos = tp.element.position();
      left += pos.left;
      top += pos.top;
      tp = tp.options.parent;
    }
    return {'top': top, 'left': left}
  },
  addElement: function(event, parent) {
    var x = event.pageX;
    var y = event.pageY;
    var self = this;


    if (!parent) {
      parent = this;
    }

    event.preventDefault();
    event.stopPropagation() 


    var pos = this._bubblePos(parent);
    var newObject = $("<div/>")
    .css({'top': y-pos.top, 'left': x-pos.left})
    switch(this.objectType) {
      case 'Phase':
        newObject.phase({
          name: "Phase "+this._bubbleName(parent),
          num: parent.objectCount,
          board: this,
          parent: parent
        });
        parent.objectCount++;
        break;
      case 'Group':
        newObject.group({
          board: this,
          parent: parent
        });
        break;
    }
    newObject.appendTo(parent.element);
    parent.objects.push(newObject);
    this.newObject = newObject;
    parent._on(parent.element, {
      mousemove: function(event) {
        if (self.newObject) {
          var pos = self.newObject.position()
          var ppos = self._bubblePos(parent);
          var w = event.pageX - pos.left - ppos.left;
          var h = event.pageY - pos.top - ppos.top;
          switch(self.objectType) {
            case 'Phase':
              self.newObject.phase("resize", [w, h]);
              break;
            case 'Group':
              self.newObject.group("resize", [w, h]);
              break;
          }
        }
      },
      mouseup: function(event) {
        console.log("up!")
        if (self.newObject) {
          parent._off(parent.element, "mousemove mouseup");
          if (self.newObject.width() < 30 ||
              self.newObject.height() < 30) {
            self.newObject.remove();
            parent.objects.pop();
          }
          self.newObject = null;
        }
      }
    });
  },
  selectElement: function(element) {
    if (this.activeElement)
      this.deselectElement();
    element.addClass("active");
    this.activeElement = element;
  },
  deselectElement: function() {
    this.activeElement.removeClass("active");
    this.activeElement = null;
  }
  });
}( jQuery ) );



