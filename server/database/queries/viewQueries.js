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
      resolve((result && result[0].viewCount) || null);
    }).catch((err) => reject(err))
  });
}

function getViewAverageByBlogId(blogId) {
  return sequelize.query(`
    SELECT
      AVG(id) as "viewAverage"
    FROM views as v
    RIGHT JOIN (
      SELECT id
      FROM articles
      WHERE blog_id = $blogId
    ) as a
    ON v.article_id = a.id
  `, {
    bind: {
      blogId,
    },
    type: QueryTypes.SELECT
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
  getViewAverageByBlogId,
  getView,
}