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

// GET ALL TAGS
router.get("/", async (request, response) => {
  try {
    const [rows, fields] = await request.dbConnection.execute(
      "SELECT * FROM tags"
    );
    response.status(200).json(rows);
  } catch (error) {
    response.status(500).json({ error: "Failed to retrieve tags" });
  }
});

// POST
router.post("/", async (request, response) => {
  const tagData = request.body;
  try {
    const [result, fields] = await request.dbConnection.execute(
      "INSERT INTO tags (name, description) VALUES (?, ?)",
      [tagData.name, tagData.description]
    );
    response.status(201).json({ tag_id: result.insertId });
  } catch (error) {
    response.status(500).json({ error: "Failed to create the tag" });
  }
});

// PUT
router.put("/:tagId", async (request, response) => {
  const tagId = request.params.tagId;
  const tagData = request.body;
  try {
    const [result, fields] = await request.dbConnection.execute(
      "UPDATE tags SET name = ?, description = ? WHERE tag_id = ?",
      [tagData.name, tagData.description, tagId]
    );
    response.status(200).json({ message: "Tag updated successfully" });
  } catch (error) {
    response.status(500).json({ error: "Failed to update the tag" });
  }
});
  
// DELETE
router.delete("/:tagId", async (request, response) => {
  const tagId = request.params.tagId;
  try {
    const [result, fields] = await request.dbConnection.execute(
      "DELETE FROM tags WHERE tag_id = ?",
      [tagId]
    );
    response.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    response.status(500).json({ error: "Failed to delete the tag" });
  }
});

  
// Use the releaseConnection middleware to release the connection after each request
router.use(releaseConnection);

module.exports = router;