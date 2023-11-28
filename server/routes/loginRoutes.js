const pool = require('../config/db');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken') 
const mysql = require("mysql2/promise"); // Import the mysql2 package

console.log('Login file is running');

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

// Login Route
router.post('/', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Fetch user from the database based on username
      const [rows, fields] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
  
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      const user = rows[0];
  
      // Use bcrypt.compare with promises
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Password is valid, generate and send an authentication token
      const token = jwt.sign({ userId: user.user_id, username: user.username }, 'yourSecretKey', { expiresIn: '1h' });

      // Set the token in a cookie 
      res.cookie('accessToken', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration

      // Send success response
      res.json({ message: 'Login successful' });

    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Use the releaseConnection middleware to release the connection after each request
router.use(releaseConnection);

module.exports = router;
