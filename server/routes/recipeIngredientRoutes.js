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


// POST
router.post("/", async (request, response) => {
  const recipeIngredientData = request.body;
  try {
    const [result, fields] = await request.dbConnection.execute(
      "INSERT INTO recipeIngredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)",
      [
        recipeIngredientData.recipe_id || null,
        recipeIngredientData.ingredient_id || null,
        recipeIngredientData.quantity || null,
      ]
    );
    response.status(201).json({ message: "Association created successfully" });
  } catch (error) {
    console.error("Database error:", error); // Log the error message
    response.status(500).json({ error: "Failed to create the association" });
  }
});

// PUT
router.put("/:recipeId/:ingredientId", async (req, res) => {
  const { recipeId, ingredientId } = req.params;
  const { quantity } = req.body;
  try {
    const [result, fields] = await req.dbConnection.execute(
      "UPDATE recipeIngredients SET quantity = ? WHERE recipe_id = ? AND ingredient_id = ?",
      [quantity, recipeId, ingredientId]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Association not found" });
    } else {
      res.json({ message: "Association updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update the association" });
  }
});
  
// DELETE
router.delete("/:recipeId/:ingredientId", async (req, res) => {
  const { recipeId, ingredientId } = req.params;
  try {
    const [result, fields] = await req.dbConnection.execute(
      "DELETE FROM recipeIngredients WHERE recipe_id = ? AND ingredient_id = ?",
      [recipeId, ingredientId]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Association not found" });
    } else {
      res.json({ message: "Association deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the association" });
  }
});
  
// Use the releaseConnection middleware to release the connection after each request
router.use(releaseConnection);

module.exports = router;