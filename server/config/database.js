require('dotenv').config();

module.exports = {
  url: process.env.CONNECTION,
  dialect: 'postgres',
  ssl: true,
};