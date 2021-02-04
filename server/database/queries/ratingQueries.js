const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function getRatingAverageByArticleId(articleId) {
  return sequelize.query(`
    SELECT
      AVG(rating) as "ratingAverage"
    FROM ratings
    WHERE article_id = $articleId
  `, {
    bind: {
      articleId,
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
  getRating
}