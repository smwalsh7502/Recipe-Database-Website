const pool = require('../config/db');

const createRecipeImagesTable = async () => {
    const connection = await pool.getConnection();
    try {
      await connection.query(`
      CREATE TABLE IF NOT EXISTS recipeimages (
        image_id INT AUTO_INCREMENT PRIMARY KEY,
        recipe_id INT,
        FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
        image_path VARCHAR(255) -- Adjust the size based on your needs
      );
      `);
      console.log('RecipeImages table created or already exists.');
    } catch (error) {
      console.error('Error creating recipeimages table:', error);
    } finally {
      connection.release();
    }
  };
  
  createRecipeImagesTable();