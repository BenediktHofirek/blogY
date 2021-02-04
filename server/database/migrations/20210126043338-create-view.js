'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('views', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      article_id: {
        allowNull: false,
        type: Sequelize.UUID,
        unique: 'compositeView'
      },
      user_id: {
        allowNull: false,
        unique: 'compositeView',
        type: Sequelize.UUID,
      },
      updated_at: {
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE
      }
    });

    await autoUpdateUpdatedAt(queryInterface, 'views');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('views');
  }
};