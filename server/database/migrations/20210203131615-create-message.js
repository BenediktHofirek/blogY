'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      sender_id: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      receiver_id: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      text: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      text: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      is_readed: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE
      }
    });

    await autoUpdateUpdatedAt(queryInterface, 'messages'); 
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('messages');
  }
};