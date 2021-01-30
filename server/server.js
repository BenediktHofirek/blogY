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
	graphqlHTTP(async function(req, res, next) {
    const user = await new Promise((resolve) => {
      passport.authenticate('jwt', {session: false}, (err, user) => {
        resolve(user);
      })(req, res, next);
    });
    
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