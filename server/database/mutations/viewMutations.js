const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function viewUpdateMutation({
  id
}) {
  return sequelize.query(`
    UPDATE views
    SET
      updated_at = CURRENT_TIMESTAMP()
    WHERE id = $id
    RETURNING 
      id,
      article_id as "articleId",
      user_id as "userId",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
  `, {
    bind: {
      id
    },
    type: QueryTypes.UPDATE
  });
}

function viewCreateMutation({
  articleId,
  userId,
  view
}) {
  return sequelize.query(`
  INSERT INTO views (article_id, user_id, view)
  VALUES (
    $articleId,
    $userId,
    $view,
  )
  RETURNING *
  `, {
    bind: {
      articleId,
      userId,
      view
    },
    type: QueryTypes.INSERT
  });
}

function viewDeleteMutation(viewId) {
  return sequelize.query(`
      DELETE FROM views
      WHERE id = $viewId
      RETURNING *
  `, {
    bind: {
      viewId,
    },
    type: QueryTypes.DELETE,
  });
}


module.exports = {
  viewCreateMutation,
  viewDeleteMutation,
  viewUpdateMutation,
}