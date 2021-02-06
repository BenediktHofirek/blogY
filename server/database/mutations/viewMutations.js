const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function viewUpdateMutation({
  id,
  userId
}) {
  return sequelize.query(`
    UPDATE views
    SET
      updated_at = CURRENT_TIMESTAMP()
    WHERE id = $id
    AND user_id = $userId
    RETURNING 
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
  `, {
    bind: {
      id,
      userId
    },
    type: QueryTypes.UPDATE
  });
}

function viewCreateMutation({
  articleId,
  userId
}) {
  return sequelize.query(`
  INSERT INTO views (article_id, user_id)
  VALUES (
    $articleId,
    $userId,
  )
  RETURNING TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
  `, {
    bind: {
      articleId,
      userId,
      view
    },
    type: QueryTypes.INSERT
  });
}

module.exports = {
  viewCreateMutation,
  viewUpdateMutation,
}