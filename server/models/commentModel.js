const pool = require('../config/db');

// Create the "recipes" table
const createCommentsTable = async () => {
    const connection = await pool.getConnection();
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS comments (
            comment_id INT AUTO_INCREMENT PRIMARY KEY,
            recipe_id INT,
            FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
            user_id INT,
            FOREIGN KEY (user_id) REFERENCES users(user_id),
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `);
      console.log('Comments table created or already exists.');
    } catch (error) {
      console.error('Error creating Comments table:', error);
    } finally {
      connection.release();
    }
  };
  
createCommentsTable();
