var express = require('express');
var swig = require('swig');
var orm = require('orm');
var passport = require('passport');
var http = require('http');
var LocalStrategy = require('passport-local').Strategy;

var env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env];

//require('./config/passport')(passport, config);

var app = express();

app.configure(function() {
  app.engine('html', swig.renderFile);
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'html');
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'SECRET' }));
  app.use(passport.initialize());
  app.use(passport.session());
});

function syncdb() {
  orm.connect('sqlite://./db.sqlite', function (err, db) {
    if (err) throw err;
    db.load("./app/models/models", function(err) {
      db.sync();
      var Person = db.models.Person;
    });
  });
}

function fillDefaults() {
  orm.connect('sqlite://./db.sqlite', function (err, db) {
    if (err) throw err;
    db.load("./app/models/models", function(err) {
      var Event = db.models.Event;

      Event.create([
        {
          name: '2013 USA Ultimate Nor Cal Sectionals',
          division: 'mixed',
        }
      ], function(err, items) {
        console.log(err);
        console.log(items);
      });
    });
  });
}

//syncdb();
//fillDefaults();

require('./config/routes')(app, passport);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
