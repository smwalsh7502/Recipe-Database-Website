const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../config/db');

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


// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = 'uploads';
    console.log('Destination:', dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + '-' + file.originalname; // Define the file name
    console.log('Filename:', filename);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Accept the file
  } else {
    cb(null, false); // Reject the file
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
  fileFilter: fileFilter,
});

// POST (Upload Recipe Image)
router.post('/', upload.single('image'), async (req, res) => {
  try {

     // Check if the file upload middleware processed the file successfully
     if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or invalid file format' });
    }

    const { recipe_id } = req.body;

    // Insert the image information into the database
    const [result] = await req.dbConnection.execute(
      'INSERT INTO recipeimages (recipe_id, image_path) VALUES (?, ?)',
      [recipe_id, req.file.path.replace(/\\/g, '/')]
    );
    
    // Check if the insertion was successful
    if (result.affectedRows === 1) {
      res.status(201).json({ message: 'Image uploaded successfully' });
    } else {
      res.status(500).json({ error: 'Failed to upload the image' });
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload the image' });
  }
});

// GET (Get Recipe Image by Recipe ID)
router.get('/:recipeId', async (req, res) => {
  const { recipeId } = req.params;
  try {
    const [rows, fields] = await req.dbConnection.execute(
      'SELECT * FROM recipeimages WHERE recipe_id = ?',
      [recipeId]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: 'Image not found for the recipe' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the image' });
  }
});

// DELETE (Delete Recipe Image by Recipe ID)
router.delete('/:recipeId', async (req, res) => {
  const { recipeId } = req.params;
  try {
    const [result, fields] = await req.dbConnection.execute(
      'DELETE FROM recipeimages WHERE recipe_id = ?',
      [recipeId]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Image not found for the recipe' });
    } else {
      res.json({ message: 'Image deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the image' });
  }
});

// Use the releaseConnection middleware to release the connection after each request
router.use(releaseConnection);

module.exports = router;