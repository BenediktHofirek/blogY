const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function getViewCountByArticleId(articleId) {
  return new Promise((resolve, reject) => {
    sequelize.query(`
      SELECT
        COUNT(*) as "viewCount"
      FROM views
      WHERE article_id = $articleId
    `, {
      bind: {
        articleId,
      },
      type: QueryTypes.SELECT
    }).then((result) => {
      resolve((result && result[0].viewCount) || 0);
    }).catch((err) => reject(err))
  });
}

function getViewCountByBlogId(blogId) {
  return new Promise((resolve, reject) => {
    sequelize.query(`
      SELECT
        COUNT(*) as "viewCount"
      FROM views
      WHERE article_id IN (
        SELECT id
        FROM articles
        WHERE blog_id = $blogId
      )
    `, {
      bind: {
        blogId,
      },
      type: QueryTypes.SELECT
    }).then((result) => {
      resolve((result && result[0].viewCount) || 0);
    }).catch((err) => reject(err))
  });
}

function getViewCountByUserId(userId) {
  return new Promise((resolve, reject) => {
    sequelize.query(`
      SELECT
        COUNT(*) as "viewCount"
      FROM views
      WHERE article_id IN (
        SELECT id
        FROM articles
        WHERE blog_id IN (
          SELECT id
          FROM blogs
          WHERE author_id = $userId
        )
      )
    `, {
      bind: {
        userId,
      },
      type: QueryTypes.SELECT
    }).then((result) => {
      resolve((result && result[0].viewCount) || 0);
    }).catch((err) => reject(err))
  });
}

function getView({articleId, userId}) {
  return sequelize.query(`
    SELECT
      updated_at as "viewedAt"
    FROM views
    WHERE article_id = $articleId
    AND user_id = $userId
  `, {
    bind: {
      articleId,
      userId
    },
    type: QueryTypes.SELECT
  });
}

module.exports = {
  getViewCountByArticleId,
  getViewCountByBlogId,
  getViewCountByUserId,
  getView,
}