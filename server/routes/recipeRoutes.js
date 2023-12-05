const pool = require('../config/db');
const express = require('express');
const router = express.Router();
const mysql = require("mysql2/promise"); // Import the mysql2 package

// Create a function to get a connection from the pool
const getConnection = async () => {
  return await pool.getConnection();
};

// Middleware function to release the connection after the route handler
const releaseConnection = (req, res, next) => {
  if (req.dbConnection) {
    req.dbConnection.release();
  }
  next();
};

// Middleware to get a database connection for each request
router.use(async (req, res, next) => {
  req.dbConnection = await getConnection();
  next();
});

// GET ALL RECIPES
router.get("/", async (request, response) => {
    try {
        const [rows, fields] = await request.dbConnection.execute(
          "SELECT * FROM recipes"
        );
        response.json(rows);
      } catch (error) {
        response.status(500).json({ error: "Failed to retrieve recipes" });
      }
});

// GET SPECIFIC RECIPES BY RECIPE ID
router.get("/:recipeId", async (request, response) => {
    const { recipeId } = request.params;
    try {
      const [rows, fields] = await request.dbConnection.execute(
        "SELECT * FROM recipes WHERE recipe_id = ?",
        [recipeId]
      );
      if (rows.length === 0) {
        response.status(404).json({ error: "Recipe not found" });
      } else {
        response.json(rows[0]);
      }
    } catch (error) {
      response.status(500).json({ error: "Failed to retrieve the recipe" });
    }
  });

// GET SPECIFIC RECIPES BY USER ID
router.get("/:userId", async (request, response) => {
  const { userId } = request.params;
  try {
    const [rows, fields] = await request.dbConnection.execute(
      "SELECT * FROM recipes WHERE user_id = ?",
      [userId]
    );
    if (rows.length === 0) {
      response.status(404).json({ error: "Recipe not found" });
    } else {
      response.json(rows); // Send all rows, not just the first one
    }
  } catch (error) {
    response.status(500).json({ error: "Failed to retrieve the recipe" });
  }
});

// POST
router.post('/', async (request, response) => {
  try {
    const { user_id, title, description, instructions, prep_time, cook_time, servings} = request.body;
    
    // Validate required fields
    if (!user_id || !title || !description || !instructions || !prep_time || !cook_time || !servings) {
      return response.status(400).json({ error: 'Missing required fields' });
    }

    // Perform additional validation if needed (e.g., validate image file)

    // Insert the recipe into the database
    const [result] = await request.dbConnection.execute(
      'INSERT INTO recipes (user_id, title, description, instructions, prep_time, cook_time, servings) VALUES (?, ?, ?, ?, ?, ?,?)',
      [user_id, title, description, instructions, prep_time, cook_time, servings]
    );

    // Check if the insertion was successful
    if (result.affectedRows === 1) {
      const newRecipeId = result.insertId;
      response.status(201).json({ id: newRecipeId });
    } else {
      response.status(500).json({ error: 'Failed to create the recipe' });
    }
  } catch (error) {
    console.error('Error creating recipe:', error);
    response.status(500).json({ error: 'Failed to create the recipe' });
  }
});


// PUT (UPDATE EXISTING RECIPE)
router.put("/:recipeId", async (request, response) => {
  const { recipeId } = request.params;
  const updatedRecipeData = request.body;
  try {
    const [result, fields] = await request.dbConnection.execute(
      "UPDATE recipes SET user_id = ?, title = ?, description = ?, instructions = ?, prep_time = ?, cook_time = ?, servings = ? WHERE recipe_id = ?",
      [
        updatedRecipeData.user_id,
        updatedRecipeData.title,
        updatedRecipeData.description,
        updatedRecipeData.instructions,
        updatedRecipeData.prep_time,
        updatedRecipeData.cook_time,
        updatedRecipeData.servings,
        recipeId,
      ]
    );
    if (result.affectedRows === 0) {
      response.status(404).json({ error: "Recipe not found" });
    } else {
      response.json({ message: "Recipe updated successfully" });
    }
  } catch (error) {
    response.status(500).json({ error: "Failed to update the recipe" });
  }
});
  
// DELETE
router.delete("/:recipeId", async (request, response) => {
    const { recipeId } = request.params;
    try {
      const [result, fields] = await request.dbConnection.execute(
        "DELETE FROM recipes WHERE recipe_id = ?",
        [recipeId]
      );
      if (result.affectedRows === 0) {
        response.status(404).json({ error: "Recipe not found" });
      } else {
        response.json({ message: "Recipe deleted successfully" });
      }
    } catch (error) {
      response.status(500).json({ error: "Failed to delete the recipe" });
    }
  });
  
// Use the releaseConnection middleware to release the connection after each request
router.use(releaseConnection);

module.exports = router;