const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function userCreateMutation(newUserMap) {
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

function userUpdateMutation({
  id,
  username = null,
  password = null,
  firstName = null,
  lastName = null,
  email = null,
  birthdate = null,
  description = null,
  photoUrl = null,
}) {
  return sequelize.query(`
    UPDATE users
    SET
      username = COALESCE($username, username),
      password = COALESCE($password, password),
      first_name = COALESCE($firstName, first_name),
      last_name = COALESCE($lastName, last_name),
      email = COALESCE($email, email),
      birthdate = COALESCE($birthdate, birthdate),
      description = COALESCE($description, description),
      photo_url = COALESCE($photoUrl, photo_url)
    WHERE id = $id
    RETURNING *
  `, {
    bind: {
      id,
      username,
      password,
      firstName,
      lastName,
      email,
      birthdate,
      description,
      photoUrl,
    },
    type: QueryTypes.UPDATE,
  });
}

function userDeleteMutation(userId) {
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
  userCreateMutation,
  userUpdateMutation,
  userDeleteMutation,
}