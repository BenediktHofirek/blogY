require('dotenv').config();

module.exports = {
  url: process.env.CONNECTION,
  dialect: 'postgres',
  logging: false,
};