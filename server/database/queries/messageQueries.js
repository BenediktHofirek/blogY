const { sequelize } = require('../models/index.js');
const { QueryTypes } = require('sequelize');

function getMessageReceivedListByUserId(userId) {
  return sequelize.query(`
    SELECT
      id,
      sender_id as "senderId",
      receiver_id as "receiverId",
      text,
      is_readed as "isReaded",
      is_deleted as "isDeleted",
      is_archived as "isArchived",
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
    FROM messages
    WHERE receiver_id = $userId
  `, {
    bind: {
      userId,
    },
    type: QueryTypes.SELECT
  });
}

function getMessageSendedListByUserId(userId) {
  return sequelize.query(`
    SELECT
      id,
      sender_id as "senderId",
      receiver_id as "receiverId",
      text,
      is_readed as "isReaded",
      is_deleted as "isDeleted",
      is_archived as "isArchived",
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "createdAt",
      TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS') as "updatedAt"
    FROM messages
    WHERE sender_id = $userId
  `, {
    bind: {
      userId,
    },
    type: QueryTypes.SELECT
  });
}

module.exports = {
  getMessageReceivedListByUserId,
  getMessageSendedListByUserId,
}