const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function articleUpdateMutation({
  id,
  authorId,
  isPublished = null,
  allowComments = null,
  name = null,
  source = null,
  html = null
}) {
  return sequelize.query(`
    UPDATE articles
    SET
      name = COALESCE($name, name),
      source = COALESCE($source, source),
      is_published = COALESCE($isPublished, is_published),
      allow_comments = COALESCE($allowComments, allow_comments),
      html = COALESCE($html, html)
    WHERE id = $id
    AND blog_id IN (
      SELECT id
      FROM blogs
      WHERE author_id = $authorId
    )
    RETURNING 
      id,
      blog_id as "blogId",
      name,
      is_published as "isPublished",
      allow_comments as "allowComments",
      source, 
      html,
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
  `, {
    bind: {
      id,
      authorId,
      isPublished,
      allowComments,
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

function articleDeleteMutation({articleId, authorId}) {
  return sequelize.query(`
      DELETE FROM articles
      WHERE id = $articleId
      AND blog_id IN (
        SELECT id
        FROM blogs
        WHERE author_id = $authorId
      )
      RETURNING *
  `, {
    bind: {
      articleId,
      authorId
    },
    type: QueryTypes.DELETE,
  });
}


module.exports = {
  articleCreateMutation,
  articleDeleteMutation,
  articleUpdateMutation,
}