import { Router } from "express";
import { getAllBlogs, createBlog } from "../controllers/blogs.controller.js";

const router = Router();

router.get("/blogs", getAllBlogs);
router.post("/blogs", createBlog);

export default router;
