const pool = require('../config/db');

// Create the "recipes" table
const createIngredientsTable = async () => {
    const connection = await pool.getConnection();
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS ingredients (
          ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255)
          );
      `);
      console.log('Ingredients table created or already exists.');
    } catch (error) {
      console.error('Error creating ingredients table:', error);
    } finally {
      connection.release();
    }
  };
  
createIngredientsTable();
