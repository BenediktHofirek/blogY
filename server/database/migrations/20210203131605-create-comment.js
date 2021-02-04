'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      parent_id: {
        allowNull: true,
        type: Sequelize.UUID,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      article_id: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      text: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      updated_at: {
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE
      }
    });

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_changetimestamp_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.changetimestamp = now(); 
        RETURN NEW;
      END;
      $$ language 'plpgsql'; 
    `);

    //here string interpolation is safe, no user input
    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_comments_changetimestamp BEFORE UPDATE
      ON comments FOR EACH ROW EXECUTE PROCEDURE 
      update_changetimestamp_column();
    `);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comments');
  }
};