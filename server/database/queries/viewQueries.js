const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function getViewCountByArticleId(articleId) {
  return sequelize.query(`
    SELECT
      COUNT(*) as "count"
    FROM views
    WHERE article_id = $articleId
  `, {
    bind: {
      articleId,
    },
    type: QueryTypes.SELECT
  });
}

module.exports = {
  getViewCountByArticleId,
}