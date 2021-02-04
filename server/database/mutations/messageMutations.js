const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function messageUpdateMutation({
  id,
  receiverId,
  isReaded,
  isArchived,
  isDeleted
}) {
  return sequelize.query(`
    UPDATE messages
    SET
      is_archived = $isArchived,
      is_readed = $isReaded,
      is_deleted = $isDeleted,
    WHERE id = $id
    AND receiver_id = $receiverId
    RETURNING 
      id,
      sender_id as "senderId",
      receiver_id as "receiverId",
      text,
      is_readed as "isReaded",
      is_deleted as "isDeleted",
      is_archived as "isArchived",
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
  `, {
    bind: {
      id,
      receiverId,
      isReaded,
      isArchived,
      isDeleted
    },
    type: QueryTypes.UPDATE
  });
}

function messageCreateMutation({
  senderId,
  receiverId,
  text,
}) {
  return sequelize.query(`
  INSERT INTO messages (sender_id, receiver_id, text)
  VALUES (
    $senderId,
    $receiverId,
    $text
  )
  RETURNING *
  `, {
    bind: {
      senderId,
      receiverId,
      text,
    },
    type: QueryTypes.INSERT
  });
}

module.exports = {
  messageCreateMutation,
  messageUpdateMutation,
}