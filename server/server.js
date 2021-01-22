const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dotenv = require('dotenv');
dotenv.config();

const routes = require('./routes/routes.js');
const schema = require('./graphql/schema.js');

// Configure the local strategy for use by Passport.
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
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({ secret: `${process.env.SECRET}`, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.post('/login', 
  passport.authenticate('local'),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  console.log('logout');
  req.logout();
  res.send(200);
});

app.use(
  '/graphql',
  bodyParser.json(),
	graphqlHTTP({
		schema,
		graphiql: true
	})
);


app.use(routes);

app.listen(3000);