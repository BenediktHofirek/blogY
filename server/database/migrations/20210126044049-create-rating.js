'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ratings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      article_id: {
        allowNull: false,
        type: Sequelize.UUID,
        unique: 'compositeRating'
      },
      user_id: {
        allowNull: false,
        unique: 'compositeRating',
        type: Sequelize.UUID,
      },
      rating: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      updated_at: {
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE
      }
    });

    await autoUpdateUpdatedAt(queryInterface, 'ratings');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ratings');
  }
};