'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('articles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        allowNull: false,
        unique: 'compositeArticle',
        type: Sequelize.STRING
      },
      blog_id: {
        allowNull: false,
        unique: 'compositeArticle',
        type: Sequelize.UUID
      },
      html: {
        type: Sequelize.TEXT,
      },
      source: {
        type: Sequelize.JSON,
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

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_changetimestamp_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now(); 
        RETURN NEW;
      END;
      $$ language 'plpgsql'; 
    `);

    //here string interpolation is safe, no user input
    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_articles_changetimestamp BEFORE UPDATE
      ON articles FOR EACH ROW EXECUTE PROCEDURE 
      update_changetimestamp_column();
    `);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('articles');
  }
};