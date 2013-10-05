module.exports = function (db, cb) {
    db.define('Person', {
        name : String,
        surname: String,
    });

    return cb();
};
