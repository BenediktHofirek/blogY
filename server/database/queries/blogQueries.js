const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function getBlogByIdQuery(blogId) {
  return sequelize.query(`
    SELECT 
      id,
      name,
      description,
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
      description,
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
      description,
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
        'description', description,
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

module.exports = {
  getBlogByIdQuery,
  getBlogQuery,
  getBlogListQuery,
  getBlogListByAuthorIdQuery,
}