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
      subject: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      is_readed: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      is_deleted: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      is_archived: {
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
      CREATE TRIGGER update_messages_changetimestamp BEFORE UPDATE
      ON messages FOR EACH ROW EXECUTE PROCEDURE 
      update_changetimestamp_column();
    `);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('messages');
  }
};