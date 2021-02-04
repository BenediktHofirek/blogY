const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function blogUpdateMutation({
  id,
  name = null,
  source = null,
  html = null
}) {
  return sequelize.query(`
    UPDATE blogs
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

function blogCreateMutation({
  blogId,
  name
}) {
  return sequelize.query(`
  INSERT INTO blogs (name, blog_id)
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

function blogDeleteMutation(blogId) {
  return sequelize.query(`
      DELETE FROM blogs
      WHERE id = $blogId
      RETURNING *
  `, {
    bind: {
      blogId,
    },
    type: QueryTypes.DELETE,
  });
}


module.exports = {
  blogCreateMutation,
  blogDeleteMutation,
  blogUpdateMutation,
}