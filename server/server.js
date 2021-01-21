var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var routes = require('./routes/routes.js');
var dotenv = require('dotenv');
dotenv.config();

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new LocalStrategy(
function(username, password, cb) {
  db.users.findByUsername(username, function(err, user) {
    if (err) { return cb(err); }
    if (!user) { return cb(null, false); }
    if (user.password != password) { return cb(null, false); }
    return cb(null, user);
  });
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Create a new Express application.
var app = express();
// app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: `${process.env.SECRET}`, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
  
app.post('/login', 
  passport.authenticate('local'),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.send(200);
});

app.get('/', routes);

app.listen(3000);