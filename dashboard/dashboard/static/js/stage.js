
function Stage(num, t, name) {
  this.tournament = t;
  this.nodes = {
    'stage': null,
    'settings': null,
  };
  this.num = num;
  this.id = 'stage'+num;
  this.groups = [];
  this.ladder = null;
  this.type = 'bracket';
  if (!name) {
    name = 'Stage '+num;
  };
  this.settings = {
    'modifygroups': true,
    'settings': true,
  };
  this.name = name;
}

Stage.prototype.extendToolbar = function() {
  var settings = $('.toolbar', this.nodes.stage);
  settings.empty();
  switch(this.type) {
    case 'bracket':
      if (this.settings.modifygroups) {
        var addgroup = $("<button/>")
          .text("Add Group")
          .on('click', {'self': this}, function(e) {
            var group = e.data.self.addGroup();
            group.init();
            group.draw();
          });
        settings.append(addgroup);
      }
      break;
    case 'ladder':
      var addgroup = $("<button/>")
        .text("Add Bracket")
        .on('click', {'self': this}, function(e) {
          e.data.self.addGroup();
        });
      settings.append(addgroup);
      break;
  }
}

Stage.prototype.setType = function(type) {
  this.type = type;
}

Stage.prototype.drawSettings = function() {
  var stage = this;
  var settings = this.nodes.settings;
  var label = $('<label>Type</label>');
  var select = $('<select><option value="bracket">Bracket</option><option value="group">Group</option></select>');
  select.on('change', function(v) {
    stage.setType(v.target.value);
  });
  settings.append(label);
  settings.append(select);
}

Stage.prototype.draw = function(append) {
  var stage = $("<li/>", {
    'class': 'stage'
  });
  var header = $('<header/>');
  var name = $("<h1/>").text(this.name);
  name.editable({
    title: "Stage name",
    placement: 'bottom',
    send: 'never',
    toggle: 'click',
  });
  header.append(name);
  var toolbar = $("<div/>", {
    'class': 'toolbar'
  });
  var settingsTrigger = $('<div class="settings_trigger"><a href="#">^</a></div>');
  this.nodes.settings = $('<div class="settings"></div>');

  var groupbox = $('<div/>', {
    'class': 'groupbox'
  });
  if (this.settings.settings) {
    header.append(settingsTrigger);
  }
  header.append(toolbar);
  stage.append(header);
  if (this.settings.settings) {
    stage.append(this.nodes.settings);
  }
  stage.append(groupbox);
  this.nodes.stage = stage;
  this.groups.forEach(function(group) {
    group.draw();
  });
  this.extendToolbar();
  if (this.settings.settings) {
    this.drawSettings();
  }
  if (append) {
    $(this.tournament.nodes.stages).append(stage);
  } else {
    $('.stage:last', this.tournament.node).before(stage);
  }
}

Stage.prototype.addGroup = function(name, id, size) {
  var group = new Group(this.groups.length, this, name, id, size);
  switch (this.type) {
    case 'bracket':
      group.settings.positional = false;
      break;
    case 'group':
      break;
  }
  this.groups.push(group);
  return group;
}

