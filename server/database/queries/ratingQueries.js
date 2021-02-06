const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function getRatingAverageByArticleId(articleId) {
  return new Promise((resolve, reject) => {
    sequelize.query(`
      SELECT
        ROUND(CAST(AVG(rating) AS numeric), 1) as "ratingAverage"
      FROM ratings
      WHERE article_id = $articleId
    `, {
      bind: {
        articleId,
      },
      type: QueryTypes.SELECT
    }).then((result) => {
      resolve((result && result[0].ratingAverage) || null);
    }).catch((err) => reject(err))
  });
}

function getRatingAverageByBlogId(blogId) {
  return sequelize.query(`
    SELECT
      ROUND(CAST(AVG(rating) AS numeric), 1) as "ratingAverage"
    FROM (
      SELECT
        AVG(rating) as "articleRating"
        FROM ratings
        WHERE article_id IN (
          SELECT id
          FROM articles
          WHERE blog_id = $blogId
        )
      )
  `, {
    bind: {
      blogId,
    },
    type: QueryTypes.SELECT
  });
}

function getRating({articleId, userId}) {
  return sequelize.query(`
    SELECT
      rating
    FROM ratings
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
  getRatingAverageByArticleId,
  getRatingAverageByBlogId,
  getRating
}