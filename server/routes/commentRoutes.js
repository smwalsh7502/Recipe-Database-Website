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

// GET ALL COMMENTS FROM A SPECIFIC RECIPE
router.get("/:recipeId", async (request, response) => {
  const recipeId = request.params.recipeId;
  try {
    const [rows, fields] = await request.dbConnection.execute(
      "SELECT * FROM comments WHERE recipe_id = ?",
      [recipeId]
    );
    response.status(200).json(rows);
  } catch (error) {
    response.status(500).json({ error: "Failed to retrieve comments for the recipe" });
  }
});


// POST
router.post("/", async (request, response) => {
  const { recipe_id, user_id, content } = request.body;
  try {
    const [result, fields] = await request.dbConnection.execute(
      "INSERT INTO comments (recipe_id, user_id, content) VALUES (?, ?, ?)",
      [recipe_id, user_id, content]
    );
    response.status(201).json({ comment_id: result.insertId });
  } catch (error) {
    response.status(500).json({ error: "Failed to create the comment" });
  }
});


// PUT
router.put("/:commentId", async (request, response) => {
  const commentId = request.params.commentId;
  const { content } = request.body;
  try {
    const [result, fields] = await request.dbConnection.execute(
      "UPDATE comments SET content = ? WHERE comment_id = ?",
      [content, commentId]
    );
    response.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    response.status(500).json({ error: "Failed to update the comment" });
  }
});
  
// DELETE
router.delete("/:commentId", async (request, response) => {
  const commentId = request.params.commentId;
  try {
    const [result, fields] = await request.dbConnection.execute(
      "DELETE FROM comments WHERE comment_id = ?",
      [commentId]
    );
    response.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    response.status(500).json({ error: "Failed to delete the comment" });
  }
});
  
// Use the releaseConnection middleware to release the connection after each request
router.use(releaseConnection);

module.exports = router;