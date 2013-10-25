define(function (require, exports) {
  var Model          = require("./Model").Model;
  var Settings       = require("./Settings");

  exports.settings   = new Settings.Container(Settings.defaults());

  function ORM(driver_name, driver, settings) {
	this.settings    = settings;
	this.driver_name = driver_name;
	this.driver      = driver;
	this.tools       = {};
	this.models      = {};
	this.plugins     = [];
	this.customTypes = {};
  }

  ORM.prototype.define = function (name, properties, opts) {
    var i;

    properties = properties || {};
    opts = opts || {};

    this.models[name] = new Model({
      db             : this,
      settings       : this.settings,
      driver_name    : this.driver_name,
      driver         : this.driver,
      table          : opts.table || opts.collection || ((this.settings.get("model.namePrefix") || "") + name),
      properties     : properties,
      extension      : opts.extension || false,
      indexes        : opts.indexes || [],
      cache          : opts.hasOwnProperty("cache") ? opts.cache : this.settings.get("instance.cache"),
      id             : opts.id || this.settings.get("properties.primary_key"),
      autoSave       : opts.hasOwnProperty("autoSave") ? opts.autoSave : this.settings.get("instance.autoSave"),
      autoFetch      : opts.hasOwnProperty("autoFetch") ? opts.autoFetch : this.settings.get("instance.autoFetch"),
      autoFetchLimit : opts.autoFetchLimit || this.settings.get("instance.autoFetchLimit"),
      cascadeRemove  : opts.hasOwnProperty("cascadeRemove") ? opts.cascadeRemove : this.settings.get("instance.cascadeRemove"),
      hooks          : opts.hooks || {},
      methods        : opts.methods || {},
      validations    : opts.validations || {}
    });

    for (i = 0; i < this.plugins.length; i++) {
      if (typeof this.plugins[i].define === "function") {
        this.plugins[i].define(this.models[name], this);
      }
    }

    return this.models[name];
  }

  var IndexedDBDriver = require('Drivers/indexeddb').Driver;

  exports.connect = function(uri, cb) {
    var proto = null;
    var driver = new IndexedDBDriver();
    var settings = new Settings.Container(exports.settings.get('*'));

    db = new ORM(proto, driver, settings);
    cb(null, db);
  }
});
