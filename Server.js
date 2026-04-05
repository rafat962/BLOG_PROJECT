import "dotenv/config";
import express from "express";
import blogRoutes from "./routes/blogs.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import mongoose from "mongoose";

const app = express();

app.use(express.json());

// routes
app.use("/api", blogRoutes);

// error handler — must be last
app.use(errorHandler);

const PORT = process.env.PORT || 3003;
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err.message));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
