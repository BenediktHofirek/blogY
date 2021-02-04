const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function markMessageAsReadedMutation({
  id,
}) {
  return sequelize.query(`
    UPDATE messages
    SET
      is_readed = true
    WHERE id = $id
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
      id
    },
    type: QueryTypes.UPDATE
  });
}


function markMessageAsDeletedMutation({
  id,
}) {
  return sequelize.query(`
    UPDATE messages
    SET
      is_deleted = true
    WHERE id = $id
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
      id
    },
    type: QueryTypes.UPDATE
  });
}


function markMessageAsArchivedMutation({
  id,
}) {
  return sequelize.query(`
    UPDATE messages
    SET
      is_archived = true
    WHERE id = $id
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
      id
    },
    type: QueryTypes.UPDATE
  });
}


function restoreMessageMutation({
  id,
}) {
  return sequelize.query(`
    UPDATE messages
    SET
      is_deleted = false,
      is_archived = false
    WHERE id = $id
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
      id
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
  markMessageAsArchivedMutation,
  markMessageAsDeletedMutation,
  markMessageAsReadedMutation,
  restoreMessageMutation,
}