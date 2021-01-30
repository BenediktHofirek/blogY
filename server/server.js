const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const passport = require('passport');
const dotenv = require('dotenv');
const { formatError } = require('graphql');

const schema = require('./graphql/schema.js');
const passportConfigFnc = require('./auth/passportjsConfig');

dotenv.config();
passportConfigFnc(passport);

const app = express();
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(cors());

app.use(
  '/graphql',
	graphqlHTTP(function(req, res, next) {
    let user;
    passport.authenticate('jwt', {session: false}, (err, user) => {
      user = user;
    })(req, res, next);
    
    return {
      schema,
      context: {
        user,
        req,
        res
      },
      customFormatErrorFn: (error) => {
        return formatError(error);
      },
      graphiql: process.env.NODE_ENV === 'development'
    }
  })
);

app.listen(3000);