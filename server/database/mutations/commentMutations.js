const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function commentUpdateMutation({
  id,
  text,
}) {
  return sequelize.query(`
    UPDATE comments
    SET
      text = $text
    WHERE id = $id
    RETURNING 
      id,
      parent_id as "parentId",
      user_id as "userId",
      article_id as "articleId",
      text,
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
  `, {
    bind: {
      id,
      text
    },
    type: QueryTypes.UPDATE
  });
}

function commentCreateMutation({
  parentId = null,
  text,
  userId,
  articleId
}) {
  return sequelize.query(`
  INSERT INTO comments (parent_id, text, user_id, article_id)
  VALUES (
    $parentId,
    $text,
    $userId,
    $articleId
  )
  RETURNING *
  `, {
    bind: {
      parentId,
      text,
      userId,
      articleId
    },
    type: QueryTypes.INSERT
  });
}

function commentDeleteMutation(commentId) {
  return sequelize.query(`
      DELETE FROM comments
      WHERE id = $commentId
      RETURNING *
  `, {
    bind: {
      commentId,
    },
    type: QueryTypes.DELETE,
  });
}


module.exports = {
  commentCreateMutation,
  commentDeleteMutation,
  commentUpdateMutation,
}