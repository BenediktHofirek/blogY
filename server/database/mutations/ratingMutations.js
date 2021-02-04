const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function ratingUpdateMutation({
  id,
  rating
}) {
  return sequelize.query(`
    UPDATE ratings
    SET
      rating = $rating
    WHERE id = $id
    RETURNING 
      id,
      article_id as "articleId",
      user_id as "userId",
      rating,
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
  `, {
    bind: {
      id,
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

function ratingDeleteMutation(ratingId) {
  return sequelize.query(`
      DELETE FROM ratings
      WHERE id = $ratingId
      RETURNING *
  `, {
    bind: {
      ratingId,
    },
    type: QueryTypes.DELETE,
  });
}


module.exports = {
  ratingCreateMutation,
  ratingDeleteMutation,
  ratingUpdateMutation,
}