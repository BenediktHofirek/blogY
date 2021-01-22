const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const passport = require('passport');
const dotenv = require('dotenv');

const schema = require('./graphql/schema.js');
const passportConfigFnc = require('./config/passport');

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
	graphqlHTTP({
		schema,
		graphiql: process.env.NODE_ENV === 'development'
	})
);

app.listen(3000);