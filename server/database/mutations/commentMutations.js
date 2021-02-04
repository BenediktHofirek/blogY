const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function commentUpdateMutation({
  id,
  text,
  userId
}) {
  return sequelize.query(`
    UPDATE comments
    SET
      text = $text
    WHERE id = $id
    AND user_id = $userId
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
      text,
      userId
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

function commentDeleteMutation({
  commentId,
  userId
}) {
  return sequelize.query(`
      DELETE FROM comments
      WHERE id = $commentId
      AND user_id = $userId
      RETURNING *
  `, {
    bind: {
      commentId,
      userId
    },
    type: QueryTypes.DELETE,
  });
}


module.exports = {
  commentCreateMutation,
  commentDeleteMutation,
  commentUpdateMutation,
}