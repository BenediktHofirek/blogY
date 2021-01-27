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
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM users
    WHERE username = :usernameOrEmail
    OR email = :usernameOrEmail
  `, {
    replacements: {
      usernameOrEmail,
    },
    type: QueryTypes.SELECT,
  });
}

function getUserByIdQuery(userId) {
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
    replacements: {
      userId,
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
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM users
    WHERE users.id = (
        SELECT
          author_id
        FROM blogs
        WHERE blogs.id = :blogId
      )
  `, {
    replacements: {
      blogId,
    },
    type: QueryTypes.SELECT,
  });
}

function getUserListQuery() {
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
  `);
}

function getBlogByIdQuery(blogId) {
  return sequelize.query(`
    SELECT 
      id,
      name,
      author_id as "authorId",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM blogs
    WHERE id = :blogId
  `, {
    replacements: {
      blogId,
    },
    type: QueryTypes.SELECT,
  });
}

function getBlogListQuery(authorId) {
  if (typeof authorId !== 'undefined') {
    return sequelize.query(`
      SELECT
        id,
        author_id as "authorId",
        name,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM blogs
      WHERE author_id = :authorId
    `, {
      replacements: {
        authorId,
      },
      type: QueryTypes.SELECT
    });
  }

  return sequelize.query(`
    SELECT
      id,
      author_id as "authorId",
      name,
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM blogs
  `);
}

function getArticleListByBlogIdQuery(blogId) {
  return sequelize.query(`
    SELECT
      id,
      blog_id as "blogId",
      name,
      content,
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM articles
    WHERE blog_id = :blogId
  `, {
    replacements: {
      blogId,
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
}) {
  return sequelize.query(`
    SELECT
      (ARRAY_AGG(JSON_BUILD_OBJECT(
        'id', id,
        'blogId', blog_id,
        'name', name,
        'content', content,
        'createdAt', created_at,
        'updatedAt', updated_at
      )))[:offset : :limit] as "articleList",
      COUNT(*) as count
    FROM articles
    WHERE LOWER(name) LIKE LOWER(:filter || '%')
    AND created_at >= to_timestamp(:timeframe) 
    ORDER BY
      CASE WHEN :orderBy = 'ASC' THEN :sortBy END ASC,
      CASE WHEN :orderBy = 'DESC' THEN :sortBy END DESC
  `, {
    replacements: {
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

function getArticleListByAuthorIdQuery(authorId) {
  return sequelize.query(`
    SELECT
      id,
      blog_id as "blogId",
      name,
      content,
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM articles
    WHERE blog_id IN (
        SELECT id
        FROM blogs
        WHERE author_id = :authorId
      )
  `, {
    replacements: {
      authorId,
    },
    type: QueryTypes.SELECT
  });
}

function createUserMutation(newUserMap) {
  return sequelize.query(`
    INSERT INTO users (username, password, email)
    VALUES (
      :username,
      :password,
      :email
    )
    RETURNING *
  `, {
    replacements: {
      ...newUserMap,
    },
    type: QueryTypes.INSERT,
  });
}

function updateUserMutation(alteredUserMap) {
  return sequelize.query(`
    UPDATE users
    SET
      username = COALESCE(:username, username),
      password = COALESCE(:password, password),
      email = COALESCE(:email, email),
      description = COALESCE(:description, description),
      photo_url = COALESCE(:photoUrl, photo_url)
    WHERE id = :id
    RETURNING *
  `, {
    replacements: {
      ...alteredUserMap,
    },
    type: QueryTypes.UPDATE,
  });
}

function deleteUserMutation(userId) {
  return sequelize.query(`
      DELETE FROM users
      WHERE id = :userId
      RETURNING *
  `, {
    replacements: {
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
  getUserByIdQuery: extractQueryResult(getUserByIdQuery),
  getBlogByIdQuery: extractQueryResult(getBlogByIdQuery),
  getUserByBlogIdQuery: extractQueryResult(getUserByBlogIdQuery),
  getUserListQuery: extractQueryResult(getUserListQuery, true),
  getArticleListQuery: extractQueryResult(getArticleListQuery, true),
  getArticleListByBlogIdQuery: extractQueryResult(getArticleListByBlogIdQuery, true),
  getArticleListByAuthorIdQuery: extractQueryResult(getArticleListByAuthorIdQuery, true),
  getBlogListQuery: extractQueryResult(getBlogListQuery, true),
  createUserMutation: extractQueryResult(createUserMutation),
  updateUserMutation: extractQueryResult(updateUserMutation),
  deleteUserMutation: extractQueryResult(deleteUserMutation),
}