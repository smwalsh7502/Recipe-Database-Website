const pool = require('../config/db');

// Create the "recipes" table
const createRecipesTable = async () => {
    const connection = await pool.getConnection();
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS recipes (
          recipe_id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          FOREIGN KEY (user_id) REFERENCES users(user_id),
          title VARCHAR(255),
          description TEXT,
          instructions TEXT,
          prep_time INT,
          cook_time INT,
          servings INT
        );
      `);
      console.log('Recipes table created or already exists.');
    } catch (error) {
      console.error('Error creating recipes table:', error);
    } finally {
      connection.release();
    }
  };
  
createRecipesTable();
