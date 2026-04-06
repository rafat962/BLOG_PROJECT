import "dotenv/config";
import express from "express";
import blogRoutes from "./routes/blogs.routes.js";
import userRoutes from "./routes/Users.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

// routes
app.use("/api", blogRoutes);
app.use("/api", userRoutes);

// error handler — must be last
app.use(errorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
