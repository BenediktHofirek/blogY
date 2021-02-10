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
      resolve((result && result[0].ratingAverage) || 0);
    }).catch((err) => reject(err))
  });
}

function getRatingAverageByBlogId(blogId) {
  return new Promise((resolve, reject) => {
    sequelize.query(`
      SELECT
        ROUND(CAST(AVG(rating) AS numeric), 1) as "ratingAverage"
      FROM ratings
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
      resolve((result && result[0].ratingAverage) || 0);
    }).catch((err) => reject(err))
  });
}

function getRatingAverageByUserId(userId) {
  return new Promise((resolve, reject) => {
    sequelize.query(`
      SELECT
        ROUND(CAST(AVG(rating) AS numeric), 1) as "ratingAverage"
      FROM ratings
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
      resolve((result && result[0].ratingAverage) || 0);
    }).catch((err) => reject(err))
  });
}

function getRating({articleId, userId}) {
  new Promise((resolve, reject) => {
    sequelize.query(`
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
    }).then((result) => {
      resolve((result && result[0].ratingAverage) || 0);
    }).catch((err) => reject(err))
  });
}

module.exports = {
  getRatingAverageByArticleId,
  getRatingAverageByBlogId,
  getRatingAverageByUserId,
  getRating
}