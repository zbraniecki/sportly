require(["orm"], function(orm) {
  orm.connect("", function (err, db) {
    var Event = db.define('Event', {
      name: String,
      division: String,
    });
    console.log(Event);
  });
});
