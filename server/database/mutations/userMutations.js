const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function createUserMutation(newUserMap) {
  return sequelize.query(`
    INSERT INTO users (username, password, email)
    VALUES (
      $username,
      $password,
      $email
    )
    RETURNING *
  `, {
    bind: {
      ...newUserMap,
    },
    type: QueryTypes.INSERT,
  });
}

function updateUserMutation(alteredUserMap) {
  return sequelize.query(`
    UPDATE users
    SET
      username = COALESCE($username, username),
      password = COALESCE($password, password),
      email = COALESCE($email, email),
      birthdate = COALESCE($birthdate, birthdate),
      description = COALESCE($description, description),
      photo_url = COALESCE($photoUrl, photo_url)
    WHERE id = $id
    RETURNING *
  `, {
    bind: {
      ...alteredUserMap,
    },
    type: QueryTypes.UPDATE,
  });
}

function deleteUserMutation(userId) {
  return sequelize.query(`
      DELETE FROM users
      WHERE id = $userId
      RETURNING *
  `, {
    bind: {
      userId,
    },
    type: QueryTypes.DELETE,
  });
}

module.exports = {
  createUserMutation,
  updateUserMutation,
  deleteUserMutation,
}