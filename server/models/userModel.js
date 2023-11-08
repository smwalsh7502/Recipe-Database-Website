const pool = require('../config/db');

// Create the "recipes" table
const createUsersTable = async () => {
    const connection = await pool.getConnection();
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
      `);
      console.log('Users table created or already exists.');
    } catch (error) {
      console.error('Error creating users table:', error);
    } finally {
      connection.release();
    }
  };
  
createUsersTable();
