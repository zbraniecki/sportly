// models.js
module.exports = function (db, cb) {
    db.load("./user", function (err) {
        if (err) {
            return cb(err);
        }

        return cb();
    });
};
