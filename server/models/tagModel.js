const pool = require('../config/db');

// Create the "recipes" table
const createTagsTable = async () => {
    const connection = await pool.getConnection();
    try {
      await connection.query(`
         CREATE TABLE IF NOT EXISTS tags (
            tag_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            description TEXT
        );
      `);
      console.log('Tags table created or already exists.');
    } catch (error) {
      console.error('Error creating Tags table:', error);
    } finally {
      connection.release();
    }
  };
  
createTagsTable();
