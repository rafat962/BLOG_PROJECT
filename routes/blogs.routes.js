import { Router } from "express";
import {
    getAllBlogs,
    createBlog,
    deleteBlog,
    likeBlog,
} from "../controllers/blogs.controller.js";
import userExtractor from "../middleware/userExtractor.js";

const router = Router();

router.get("/blogs", getAllBlogs);
router.patch("/blogs/:id/like", likeBlog);

router.post("/blogs", userExtractor, createBlog);
router.delete("/blogs/:id", userExtractor, deleteBlog);

export default router;
