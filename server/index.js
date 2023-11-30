const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');

app.use(express.json());
app.use(cors());

require("./models/recipeModel");
require("./models/ingredientModel");
require("./models/userModel");
require("./models/recipeIngredientModel");
require("./models/recipeImagesModel")

const pool = require("./config/db"); // Import the database connection pool
const recipeRouter = require("./routes/recipeRoutes"); // Load Recipe Router
const ingredientRouter = require ("./routes/ingredientRoutes");
const userRouter = require ("./routes/userRoutes");
const recipeIngredientRouter = require ("./routes/recipeIngredientRoutes");
const loginRouter = require("./routes/loginRoutes")
const imageRouter = require("./routes/recipeImageRoutes")


app.use("/api/recipes", recipeRouter); // Use "/api/recipes" for recipe routes
app.use("/api/ingredients", ingredientRouter);
app.use("/api/users", userRouter);
app.use("/api/recipeIngredients", recipeIngredientRouter);
app.use("/api/login", loginRouter)
app.use("/api/recipeimages", imageRouter)

// Serve static files (images) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const startServer = async () => {

  // Verify the database connection
  try {
    const connection = await pool.getConnection();
    await connection.release();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }

  // Start the server
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
};

startServer();