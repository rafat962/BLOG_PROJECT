import "dotenv/config";
import express from "express";
import blogRoutes from "./routes/blogs.routes.js";
import userRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";
import tokenExtractor from "./middleware/tokenExtractor.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

// 4.25 — extract token from every request before routes
app.use(tokenExtractor);

// routes
app.use("/api", authRoutes);
app.use("/api", blogRoutes);
app.use("/api", userRoutes);

// error handler — must be last
app.use(errorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
