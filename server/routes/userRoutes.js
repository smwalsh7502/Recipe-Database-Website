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

// GET ALL USERS
router.get("/", async (request, response) => {
  try {
    const [rows, fields] = await request.dbConnection.execute(
      "SELECT * FROM users"
    );
    response.json(rows);
  } catch (error) {
    response.status(500).json({ error: "Failed to retrieve users" });
  }
});

// GET SPECIFIC USER BY USERID
router.get("/:userIdOrUsername", async (request, response) => {
  const { userIdOrUsername } = request.params;
  try {
    const [rows, fields] = await request.dbConnection.execute(
      "SELECT * FROM users WHERE user_id = ? OR username = ?",
      [userIdOrUsername, userIdOrUsername]
    );
    if (rows.length === 0) {
      response.status(404).json({ error: "User not found" });
    } else {
      response.json(rows[0]);
    }
  } catch (error) {
    response.status(500).json({ error: "Failed to retrieve the user" });
  }
});


// POST (CREATE USER)
router.post("/", async (request, response) => {
  const userData = request.body;
  try {
    const [result, fields] = await request.dbConnection.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [userData.username, userData.email, userData.password]
    );
    response.status(201).json({ id: result.insertId });
  } catch (error) {
    response.status(500).json({ error: "Failed to create the user" });
  }
});

// PUT (UPDATE EXISTING USER)
router.put("/:userId", async (request, response) => {
  const { userId } = request.params;
  const updatedUserData = request.body;
  try {
    const [result, fields] = await request.dbConnection.execute(
      "UPDATE users SET username = ?, email = ?, password = ? WHERE user_id = ?",
      [
        updatedUserData.username,
        updatedUserData.email,
        updatedUserData.password,
        userId,
      ]
    );
    if (result.affectedRows === 0) {
      response.status(404).json({ error: "User not found" });
    } else {
      response.json({ message: "User updated successfully" });
    }
  } catch (error) {
    response.status(500).json({ error: "Failed to update the user" });
  }
});
  
// DELETE
router.delete("/:userId", async (request, response) => {
  const { userId } = request.params;
  try {
    const [result, fields] = await request.dbConnection.execute(
      "DELETE FROM users WHERE user_id = ?",
      [userId]
    );
    if (result.affectedRows === 0) {
      response.status(404).json({ error: "User not found" });
    } else {
      response.json({ message: "User deleted successfully" });
    }
  } catch (error) {
    response.status(500).json({ error: "Failed to delete the user" });
  }
});
  
// Use the releaseConnection middleware to release the connection after each request
router.use(releaseConnection);

module.exports = router;