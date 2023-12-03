const mysql = require('mysql2/promise');
const config = require('./config.json');

const dbConfig = config.development;

// Create and export the connection pool
const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  connectionLimit: 200, // Adjust the number as needed
});

module.exports = pool;