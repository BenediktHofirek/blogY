const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const passport = require('passport');
const dotenv = require('dotenv');

const schema = require('./graphql/schema.js');
const passportConfigFnc = require('./auth/passportjsConfig');
const { errorResponseMap } = require('./graphql/errors.js');

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
	graphqlHTTP(function(req, res) {
    return passport.authenticate('jwt', {session: false}, (err, user) => {
      console.log('user', user);
      return {
        schema,
        context: {
          user,
          req,
          res
        },
        customFormatErrorFn: (errName) => {
          return errorResponseMap[errName];
        },
        graphiql: process.env.NODE_ENV === 'development'
      }
    });
  })
);

app.listen(3000);