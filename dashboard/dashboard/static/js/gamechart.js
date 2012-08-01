function Canvas(chart) {
    var self = this;
    var chart = $(chart);
    $("#toolbox", chart).draggable({ containment: "parent" });
    $("#toolbox", chart).on("mousedown", function(event) {
        event.preventDefault();
        event.stopPropagation() 
    });

    chart.on("mousedown", {'self': this}, this.addPhase2);
}

Canvas.prototype = {
  // new object handler
  noh: null,
  // active object handler
  aoh: null,
  name: "Foo",

  addPhase: function(event) {
    var self = event.data.self;
    if (self.aoh && self.aoh.get(0) != event.target) {
      self.deactivateElement(self.aoh, self);
    }
    if (self.aoh)
      var parent = self.aoh;
    else
      var parent = $("#chart");
    if (self.noh)
      return

    event.preventDefault();
    event.stopPropagation()
    var parentPos = parent.position() 
    var x = event.pageX - parentPos.left;
    var y = event.pageY - parentPos.top;
    self.noh = $("<div/>").addClass('phase').css({'top': y, 'left': x}).appendTo(parent);
    $("<h1/>").text("Phase 1").appendTo(self.noh);
    parent.on("mousemove", {'self': self}, function(event) {
      var self = event.data.self;
      event.preventDefault();
      event.stopPropagation() 
      var x = event.pageX;
      var y = event.pageY;
      var pos = self.noh.position();
      var parentPos = parent.position() 
      var w = x - pos.left - parentPos.left;
      var h = y - pos.top - parentPos.top; 
      self.noh.css({'width': w, 'height': h});
      $("h1", self.noh).css({'width': h, 'margin-top': h/2-10, 'margin-left': (h/2-10)*-1}); 
    });
    parent.one("mouseup", {'self': self}, function(event) {
      var self = event.data.self;
      if (self.noh.width()<20 || self.noh.height<20) {
        self.noh.remove();
        self.noh = null;
        parent.off("mousemove");
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      self.noh.draggable({
        containment: "parent",
        handle: "h1"
      });
      self.noh.on("mousedown", {'self': self}, function(event) {
        var self = event.data.self;
        self.activateElement(event.target, self);
        event.stopPropagation() 
      });
      self.noh.resizable({
        containment: "parent",
        resize: function(event, ui) {
          var elem = $(event.target);
          var h = elem.height();
          $("h1", elem).css({'width': h, 'margin-top': h/2-10, 'margin-left': (h/2-10)*-1}); 
        }
      });
      self.noh.on("mousedown", {'self': self}, self.addPhase);
      self.noh = null;
      parent.off("mousemove");
    });
  },
  activateElement: function(elem, self) {
    if (self.aoh)
      self.deactivateElement(self.aoh, self);
    self.aoh = $(elem);
    self.aoh.addClass('active');
  },
  deactivateElement: function(elem, self) {
    self.aoh.removeClass('active');
    self.aoh = null;
  },

  addPhase2: function(event) {
    $("<div/>").appendTo($("#chart")).phase()
  }
}

