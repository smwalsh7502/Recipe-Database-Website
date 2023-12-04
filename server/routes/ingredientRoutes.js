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

// GET ALL INGREDIENTS
router.get("/", async (req, res) => {
  try {
    const [rows, fields] = await req.dbConnection.execute("SELECT * FROM ingredients");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve ingredients" });
  }
});

// GET SPECIFIC INGREDIENT BY NAME
router.get("/name/:ingredientName", async (req, res) => {
  const { ingredientName } = req.params;
  try {
    const [rows, fields] = await req.dbConnection.execute(
      "SELECT * FROM ingredients WHERE name = ?",
      [ingredientName]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "Ingredient not found" });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the ingredient" });
  }
});


// GET SPECIFIC INGREDIENT BY INGREDIENT ID
router.get("/:ingredientId", async (req, res) => {
  const { ingredientId } = req.params;
  try {
    const [rows, fields] = await req.dbConnection.execute(
      "SELECT * FROM ingredients WHERE ingredient_id = ?",
      [ingredientId]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Ingredient not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the ingredient" });
  }
});

// POST
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const [result, fields] = await req.dbConnection.execute(
      "INSERT INTO ingredients (name) VALUES (?)",
      [name]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Failed to create the ingredient" });
  }
});

// PUT
router.put("/:ingredientId", async (req, res) => {
  const { ingredientId } = req.params;
  const { name } = req.body;
  try {
    const [result, fields] = await req.dbConnection.execute(
      "UPDATE ingredients SET name = ? WHERE ingredient_id = ?",
      [name, ingredientId]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Ingredient not found" });
    } else {
      res.json({ message: "Ingredient updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update the ingredient" });
  }
});

  
// DELETE
router.delete("/:ingredientId", async (req, res) => {
  const { ingredientId } = req.params;
  try {
    const [result, fields] = await req.dbConnection.execute(
      "DELETE FROM ingredients WHERE ingredient_id = ?",
      [ingredientId]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Ingredient not found" });
    } else {
      res.json({ message: "Ingredient deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the ingredient" });
  }
});
  
// Use the releaseConnection middleware to release the connection after each request
router.use(releaseConnection);

module.exports = router;