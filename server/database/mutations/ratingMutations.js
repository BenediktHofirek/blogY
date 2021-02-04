const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function ratingUpdateMutation({
  id,
  userId,
  rating
}) {
  return sequelize.query(`
    UPDATE ratings
    SET
      rating = $rating
    WHERE id = $id
    AND user_id = $userId
    RETURNING 
      id,
      article_id as "articleId",
      user_id as "userId",
      rating,
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
  `, {
    bind: {
      id,
      userId,
      rating
    },
    type: QueryTypes.UPDATE
  });
}

function ratingCreateMutation({
  articleId,
  userId,
  rating
}) {
  return sequelize.query(`
  INSERT INTO ratings (article_id, user_id, rating)
  VALUES (
    $articleId,
    $userId,
    $rating,
  )
  RETURNING *
  `, {
    bind: {
      articleId,
      userId,
      rating
    },
    type: QueryTypes.INSERT
  });
}

function ratingDeleteMutation({
  ratingId,
  articleId,
  userId
}) {
  return sequelize.query(`
      DELETE FROM ratings
      WHERE id = $ratingId
      AND article_id = $articleId
      AND user_id = $userId
      RETURNING *
  `, {
    bind: {
      ratingId,
      articleId,
      userId
    },
    type: QueryTypes.DELETE,
  });
}


module.exports = {
  ratingCreateMutation,
  ratingDeleteMutation,
  ratingUpdateMutation,
}