const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function articleUpdateMutation({
  id,
  name = null,
  source = null,
  html = null
}) {
  return sequelize.query(`
    UPDATE articles
    SET
      name = COALESCE($name, name),
      source = COALESCE($source, source),
      html = COALESCE($html, html)
    WHERE id = $id
    RETURNING 
      id,
      blog_id as "blogId",
      name,
      source, 
      html,
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
  `, {
    bind: {
      id,
      name,
      source,
      html
    },
    type: QueryTypes.UPDATE
  });
}

function articleCreateMutation({
  name,
  blogId
}) {
  return sequelize.query(`
  INSERT INTO articles (name, blog_id)
  VALUES (
    $name,
    $blogId
  )
  RETURNING *
  `, {
    bind: {
      blogId,
      name
    },
    type: QueryTypes.INSERT
  });
}

function articleDeleteMutation(articleId) {
  return sequelize.query(`
      DELETE FROM articles
      WHERE id = $articleId
      RETURNING *
  `, {
    bind: {
      articleId,
    },
    type: QueryTypes.DELETE,
  });
}


module.exports = {
  articleCreateMutation,
  articleDeleteMutation,
  articleUpdateMutation,
}