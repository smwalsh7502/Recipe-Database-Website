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

// GET
router.get("/", async (request, response) => {
    try {
      const [rows, fields] = await request.dbConnection.execute(
        "SELECT * FROM recipeTags"
      );
      response.status(200).json(rows);
    } catch (error) {
      response.status(500).json({ error: "Failed to retrieve recipe-tag associations" });
    }
  });

// POST (CREATE RECIPE TAG ASSOCIATION)
router.post("/", async (request, response) => {
    const { recipe_id, tag_id } = request.body;
    try {
      const [result, fields] = await request.dbConnection.execute(
        "INSERT INTO recipeTags (recipe_id, tag_id) VALUES (?, ?)",
        [recipe_id, tag_id]
      );
      response.status(201).json({ recipe_tag_id: result.insertId });
    } catch (error) {
      response.status(500).json({ error: "Failed to create the recipe-tag association" });
    }
  });

// PUT
router.put("/:recipeTagId", async (request, response) => {
    const recipeTagId = request.params.recipeTagId;
    const { recipe_id, tag_id } = request.body;
    try {
      const [result, fields] = await request.dbConnection.execute(
        "UPDATE recipeTags SET recipe_id = ?, tag_id = ? WHERE recipe_tag_id = ?",
        [recipe_id, tag_id, recipeTagId]
      );
      response.status(200).json({ message: "Recipe-tag association updated successfully" });
    } catch (error) {
      response.status(500).json({ error: "Failed to update the recipe-tag association" });
    }
  });
  
// DELETE
router.delete("/:recipeTagId", async (request, response) => {
    const recipeTagId = request.params.recipeTagId;
    try {
      const [result, fields] = await request.dbConnection.execute(
        "DELETE FROM recipeTags WHERE recipe_tag_id = ?",
        [recipeTagId]
      );
      response.status(200).json({ message: "Recipe-tag association deleted successfully" });
    } catch (error) {
      response.status(500).json({ error: "Failed to delete the recipe-tag association" });
    }
  });
  
// Use the releaseConnection middleware to release the connection after each request
router.use(releaseConnection);

module.exports = router;