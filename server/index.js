const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

require("./models/recipeModel");
require("./models/ingredientModel");
require("./models/userModel");
require("./models/recipeIngredientModel");
require("./models/commentModel")
require("./models/tagModel")
require("./models/recipeTagModel")


const pool = require("./config/db"); // Import the database connection pool
const recipeRouter = require("./routes/recipeRoutes"); // Load Recipe Router
const ingredientRouter = require ("./routes/ingredientRoutes");
const userRouter = require ("./routes/userRoutes");
const recipeIngredientRouter = require ("./routes/recipeIngredientRoutes");
const commentRouter = require ("./routes/commentRoutes");
const tagsRouter = require ("./routes/tagRoutes")
const recipeTagsRouter = require ("./routes/recipeTagRoutes")

app.use("/api/recipes", recipeRouter); // Use "/api/recipes" for recipe routes
app.use("/api/ingredients", ingredientRouter);
app.use("/api/users", userRouter);
app.use("/api/recipeIngredients", recipeIngredientRouter);
app.use("/api/comments", commentRouter);
app.use("/api/tags", tagsRouter)
app.use("/api/recipeTags", recipeTagsRouter)

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