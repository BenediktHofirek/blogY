'use strict';

const { autoUpdateUpdatedAt } = require("../utils/utils");

module.exports = {
  up: (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      username: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(512)
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      birthdate: {
        type: Sequelize.DATE
      },
      photo_url: {
        type: Sequelize.TEXT,
      },
      description: {
        type: Sequelize.TEXT,
      },
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE
      }
    });
    
    await autoUpdateUpdatedAt(queryInterface, 'users');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};