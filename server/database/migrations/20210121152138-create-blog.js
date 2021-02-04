'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('blogs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        allowNull: false,
        unique: 'compositeBlog',
        type: Sequelize.STRING
      },
      author_id: {
        allowNull: false,
        unique: 'compositeBlog',
        type: Sequelize.UUID
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      is_published: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      allow_comments: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

    await autoUpdateUpdatedAt(queryInterface, 'blogs');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('blogs');
  }
};