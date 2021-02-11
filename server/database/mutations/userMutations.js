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
  image = null,
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
      image = COALESCE($image, image)
    WHERE id = $id
    RETURNING 
      id,
      description,
      email,
      image,
      username,
      first_name as "firstName",
      last_name as "lastName",
      birthdate,
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
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
      image,
    },
    type: QueryTypes.UPDATE,
  });
}

function userDeleteMutation(userId) {
  return sequelize.query(`
      DELETE FROM users
      WHERE id = $userId
      RETURNING
        id,
        description,
        email,
        image,
        username,
        first_name as "firstName",
        last_name as "lastName",
        birthdate,
        TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
        TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
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