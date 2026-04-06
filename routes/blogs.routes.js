import { Router } from "express";
import {
    getAllBlogs,
    createBlog,
    likeBlog,
} from "../controllers/blogs.controller.js";

const router = Router();

router.get("/blogs", getAllBlogs);
router.post("/blogs", createBlog);
router.patch("/blogs/:id/like", likeBlog); // 4.18

export default router;
