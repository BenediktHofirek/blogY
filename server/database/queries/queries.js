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

function getBlogByIdQuery(blogId) {
  return sequelize.query(`
    SELECT 
      id,
      name,
      author_id as "authorId",
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
    FROM blogs
    WHERE id = $blogId
  `, {
    bind: {
      blogId,
    },
    type: QueryTypes.SELECT,
  });
}

function getBlogListByAuthorIdQuery(authorId) {
  return sequelize.query(`
    SELECT
      id,
      author_id as "authorId",
      name,
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
    FROM blogs
    WHERE author_id = $authorId
  `, {
    bind: {
      authorId,
    },
    type: QueryTypes.SELECT
  });
}

function getBlogQuery({
  blogName,
  username
}) {
  return sequelize.query(`
    SELECT
      id,
      author_id as "authorId",
      name,
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
    FROM blogs
    WHERE name = $blogName
    AND author_id = (
      SELECT id
      FROM users
      WHERE username = $username
    )
  `, {
    bind: {
      blogName,
      username
    },
    type: QueryTypes.SELECT
  });
}

function getArticleListByBlogIdQuery(blogId) {
  return sequelize.query(`
    SELECT
      id,
      blog_id as "blogId",
      name,
      content,
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
    FROM articles
    WHERE blog_id = $blogId
  `, {
    bind: {
      blogId,
    },
    type: QueryTypes.SELECT
  });
}

function getArticleQuery({
  articleName,
  blogName,
  username
}) {
  return sequelize.query(`
    SELECT
      id,
      blog_id as "blogId",
      name,
      content,
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
    FROM articles
    WHERE name = $articleName
    AND blog_id = (
      SELECT id
      FROM blogs
      WHERE name = $blogName
      AND author_id = (
        SELECT id
        FROM users
        WHERE username = $username
      )
    )
  `, {
    bind: {
      articleName,
      blogName,
      username
    },
    type: QueryTypes.SELECT
  });
}

function getArticleListQuery({
  offset,
  limit,
  filter,
  sortBy,
  orderBy,
  timeframe,
  blogId = '',
}) {
  return sequelize.query(`
    SELECT
      (ARRAY_AGG(JSON_BUILD_OBJECT(
        'id', id,
        'blogId', blog_id,
        'name', name,
        'content', content,
        'createdAt', TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
        'updatedAt', TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS')
      )))[$offset : $limit] as "articleList",
      COUNT(*) as count
    FROM (
    	SELECT *
      FROM articles
      WHERE '' = $blogId or blog_id::text = $blogId
      ORDER BY
          CASE WHEN 'ASC' = $orderBy THEN (
            CASE when 'name' = $sortBy then "name" end,
            CASE when 'createdAt' = $sortBy then "created_at" end
          ) end ASC,
      		CASE WHEN 'DESC' = $orderBy THEN (
      			CASE when 'name' = $sortBy then "name" end,
      			CASE when 'createdAt' = $sortBy then "created_at" end
      		) end DESC
    ) AS a
    WHERE LOWER(name) LIKE LOWER($filter || '%')
    AND created_at >= to_timestamp($timeframe)
  `, {
    bind: {
      offset,
      limit,
      filter,
      sortBy,
      orderBy,
      timeframe,
      blogId,
    },
    type: QueryTypes.SELECT
  });
}

function getBlogListQuery({
  offset,
  limit,
  filter,
  sortBy,
  orderBy,
  timeframe,
  userId = '',
}) {
  return sequelize.query(`
    SELECT
      (ARRAY_AGG(JSON_BUILD_OBJECT(
        'id', id,
        'authorId', author_id,
        'name', name,
        'createdAt', TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS'),
        'updatedAt', TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS')
      )))[$offset : $limit] as "blogList",
      COUNT(*) as count
    FROM (
    	SELECT *
      FROM blogs
      WHERE '' = $userId or author_id::text = $userId
      ORDER BY
          CASE WHEN 'ASC' = $orderBy THEN (
            CASE when 'name' = $sortBy then "name" end,
            CASE when 'createdAt' = $sortBy then "created_at" end
          ) end ASC,
      		CASE WHEN 'DESC' = $orderBy THEN (
      			CASE when 'name' = $sortBy then "name" end,
      			CASE when 'createdAt' = $sortBy then "created_at" end
      		) end DESC
    ) AS a
    WHERE LOWER(name) LIKE LOWER($filter || '%')
    AND created_at >= to_timestamp($timeframe)
  `, {
    bind: {
      offset,
      limit,
      filter,
      sortBy,
      orderBy,
      timeframe,
      userId,
    },
    type: QueryTypes.SELECT
  });
}

function getArticleListByAuthorIdQuery(authorId) {
  return sequelize.query(`
    SELECT
      id,
      blog_id as "blogId",
      name,
      content,
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
    FROM articles
    WHERE blog_id IN (
        SELECT id
        FROM blogs
        WHERE author_id = $authorId
      )
  `, {
    bind: {
      authorId,
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


function extractQueryResult(query, isList = false) {
  return (...args) => new Promise((resolve, reject) => {
    query(...args)
      .then((queryResult) => {
        let temp = queryResult;
        while (Array.isArray(temp[0])) {
          temp = temp[0];
        }

        const result = temp.length === 1 && !isList ?
          temp[0] :
          temp;

        resolve(result);
      })
      .catch((err) => reject(err));
  });
}


module.exports = {
  getUserByCredentialsQuery: extractQueryResult(getUserByCredentialsQuery),
  getUserQuery: extractQueryResult(getUserQuery),
  getBlogByIdQuery: extractQueryResult(getBlogByIdQuery),
  getUserByBlogIdQuery: extractQueryResult(getUserByBlogIdQuery),
  getUserListQuery: extractQueryResult(getUserListQuery, true),
  getBlogQuery: extractQueryResult(getBlogQuery, true),
  getArticleQuery: extractQueryResult(getArticleQuery, true),
  getArticleListQuery: extractQueryResult(getArticleListQuery, true),
  getArticleListByBlogIdQuery: extractQueryResult(getArticleListByBlogIdQuery, true),
  getArticleListByAuthorIdQuery: extractQueryResult(getArticleListByAuthorIdQuery, true),
  getBlogListQuery: extractQueryResult(getBlogListQuery, true),
  getBlogListByAuthorIdQuery: extractQueryResult(getBlogListByAuthorIdQuery, true),
  createUserMutation: extractQueryResult(createUserMutation),
  updateUserMutation: extractQueryResult(updateUserMutation),
  deleteUserMutation: extractQueryResult(deleteUserMutation),
}