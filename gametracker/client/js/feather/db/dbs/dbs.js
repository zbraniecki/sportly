define([], function () {
  'use strict';

function DBS() {
}

DBS.extend = function(subClass) {
  subClass.prototype = Object.create(DBS.prototype);
  subClass.prototype.constructor = subClass;
}

DBS.prototype = {
  openDb: function(name, cb) {
    if (!this.dbHandles[name]) {
      this.initDBHandle(name);
    }
    cb(this.dbHandles[name]);
  },
}

return {
  DBS: DBS,
};

});
