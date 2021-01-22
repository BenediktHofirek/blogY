const { sequelize } = require('../models/index.js');

function getUserQuery(userId) {
  return sequelize.query(`
    SELECT 
      id,
      description,
      email,
      photo_url as "photoUrl",
      username,
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM users
    WHERE id = :userId
  `, {
    userId
  });
}








module.exports = {
  getUserQuery,
}