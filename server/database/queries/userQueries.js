const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function getUserByCredentialsQuery(usernameOrEmail) {
  return sequelize.query(`
    SELECT 
      id,
      description,
      email,
      photo_url as "photoUrl",
      username,
      password,
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
    FROM users
    WHERE username = $usernameOrEmail
    OR email = $usernameOrEmail
  `, {
    bind: {
      usernameOrEmail,
    },
    type: QueryTypes.SELECT,
  }).then((result) => {
    return (result && result[0]) || null;
  });
}

function getUserQuery({
  userId = '',
  username = ''
}) {
  return sequelize.query(`
    SELECT 
      id,
      description,
      email,
      photo_url as "photoUrl",
      username,
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
    FROM users
    WHERE '' != $username AND username = $username
    OR '' != $userId AND id::text = $userId
  `, {
    bind: {
      userId,
      username,
    },
    type: QueryTypes.SELECT,
  }).then((result) => {
    return (result && result[0]) || null;
  });
}

function getUserByBlogIdQuery(blogId) {
  return sequelize.query(`
    SELECT 
      id,
      description,
      email,
      photo_url as "photoUrl",
      username,
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
    FROM users
    WHERE users.id = (
        SELECT
          author_id
        FROM blogs
        WHERE blogs.id = $blogId
      )
  `, {
    bind: {
      blogId,
    },
    type: QueryTypes.SELECT,
  });
}

function getUserListQuery({
  offset,
  limit,
  filter,
  sortBy,
  orderBy,
  timeframe,
}) {
  return sequelize.query(`
    SELECT
      (ARRAY_AGG(JSON_BUILD_OBJECT(
        'id', id,
        'firstName', first_name,
        'lastName', last_name,
        'username', username,
        'createdAt', TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
        'updatedAt', TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS')
      )))[$offset : $limit] as "userList",
      COUNT(*) as count
    FROM (
    	select *
    	from users
      order by 
          CASE WHEN 'ASC' = $orderBy THEN (
            CASE when 'username' = $sortBy then "username" end,
            CASE when 'firstName' = $sortBy then "first_name" end,
            CASE when 'lastName' = $sortBy then "last_name" end,
            CASE when 'createdAt' = $sortBy then "created_at" end
          ) end ASC,
      		CASE WHEN 'DESC' = $orderBy THEN (
      			CASE when 'username' = $sortBy then "username" end,
            CASE when 'firstName' = $sortBy then "first_name" end,
            CASE when 'lastName' = $sortBy then "last_name" end,
            CASE when 'createdAt' = $sortBy then "created_at" end
      		) end DESC
    ) as a
    WHERE LOWER(username) LIKE LOWER($filter || '%')
    AND created_at >= to_timestamp($timeframe)
  `, {
    bind: {
      offset,
      limit,
      filter,
      sortBy,
      orderBy,
      timeframe,
    },
    type: QueryTypes.SELECT
  });
}

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
      password = COALESCE(:password, password),
      email = COALESCE(:email, email),
      description = COALESCE(:description, description),
      photo_url = COALESCE(:photoUrl, photo_url)
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
  getUserByCredentialsQuery,
  getUserQuery,
  getUserByBlogIdQuery,
  getUserListQuery,
  createUserMutation,
  updateUserMutation,
  deleteUserMutation,
}