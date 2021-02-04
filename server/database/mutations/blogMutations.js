const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function blogUpdateMutation({
  id,
  authorId,
  name = null,
  description = null
}) {
  return sequelize.query(`
    UPDATE blogs
    SET
      name = COALESCE($name, name),
      description = COALESCE($description, description)
    WHERE id = $id
    AND author_id = $authorId
    RETURNING 
      id,
      blog_id as "blogId",
      name,
      description,
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
  `, {
    bind: {
      id,
      authorId,
      name,
      description
    },
    type: QueryTypes.UPDATE
  });
}

function blogCreateMutation({
  authorId,
  name
}) {
  return sequelize.query(`
  INSERT INTO blogs (name, author_id)
  VALUES (
    $name,
    $authorId
  )
  RETURNING *
  `, {
    bind: {
      authorId,
      name
    },
    type: QueryTypes.INSERT
  });
}

function blogDeleteMutation({
  blogId,
  authorId,
}) {
  return sequelize.query(`
      DELETE FROM blogs
      WHERE id = $blogId
      AND author_id = $authorId
      RETURNING *
  `, {
    bind: {
      blogId,
      authorId
    },
    type: QueryTypes.DELETE,
  });
}


module.exports = {
  blogCreateMutation,
  blogDeleteMutation,
  blogUpdateMutation,
}