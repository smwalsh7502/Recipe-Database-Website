const pool = require('../config/db');

// Create the "recipes" table
const createRecipeTagsTable = async () => {
    const connection = await pool.getConnection();
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS recipeTags (
            recipe_tag_id INT AUTO_INCREMENT PRIMARY KEY,
            recipe_id INT,
            tag_id INT,
            FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
            FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
        );
      `);
      console.log('Recipe Tags table created or already exists.');
    } catch (error) {
      console.error('Error creating Recipe Tags table:', error);
    } finally {
      connection.release();
    }
  };
  
createRecipeTagsTable();
