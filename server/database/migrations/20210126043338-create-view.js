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
      CREATE TRIGGER update_views_changetimestamp BEFORE UPDATE
      ON views FOR EACH ROW EXECUTE PROCEDURE 
      update_changetimestamp_column();
    `);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('views');
  }
};