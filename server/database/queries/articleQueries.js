const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

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



module.exports = {
  getArticleQuery,
  getArticleListQuery,
  getArticleListByBlogIdQuery,
  getArticleListByAuthorIdQuery,
}