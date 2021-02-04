const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function getUserByCredentialsQuery(usernameOrEmail) {
  return new Promise((resolve, reject) => {
    sequelize.query(`
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
      resolve((result && result[0]) || null);
    }).catch((err) => reject(err))
  });
}

function getUserQuery({
  userId = '',
  username = ''
}) {
  return new Promise((resolve, reject) => {
    sequelize.query(`
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
      resolve((result && result[0]) || null);
    }).catch((err) => reject(err))
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

module.exports = {
  getUserByCredentialsQuery,
  getUserQuery,
  getUserByBlogIdQuery,
  getUserListQuery,
}