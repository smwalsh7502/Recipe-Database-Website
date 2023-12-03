const pool = require('../config/db');

// Create the "recipes" table
const createRecipeIngredientsTable = async () => {
    const connection = await pool.getConnection();
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS recipeIngredients (
            recipe_id INT,
            ingredient_id INT,
            quantity VARCHAR(50),  -- Store the quantity as a string, e.g., "1 cup", "2 tsp"
            PRIMARY KEY (recipe_id, ingredient_id),  -- Composite primary key
            FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
            FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
        );
      `);
      console.log('RecipeIngredients table created or already exists.');
    } catch (error) {
      console.error('Error creating recipe ingredients table:', error);
    } finally {
      connection.release();
    }
  };
  
createRecipeIngredientsTable();
