export async function autoUpdateUpdatedAt(queryInterface, tableName) {
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
    CREATE TRIGGER update_${tableName}_changetimestamp BEFORE UPDATE
    ON ${tableName} FOR EACH ROW EXECUTE PROCEDURE 
    update_changetimestamp_column();
  `);
}