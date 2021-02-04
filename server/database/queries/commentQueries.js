const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function getCommentListByArticleId(articleId) {
  return sequelize.query(`
    SELECT
      id,
      parent_id as "parentId",
      user_id as "userId",
      article_id as "articleId",
      text,
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
    FROM comments
    WHERE article_id = $articleId
  `, {
    bind: {
      articleId,
    },
    type: QueryTypes.SELECT
  });
}

module.exports = {
  getCommentListByArticleId,
}