import Blog from "../models/Blog.js";

// GET /api/blogs
export const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find({});
        res.status(200).json({
            status: "success",
            blogs,
        });
    } catch (err) {
        next(err);
    }
};

// POST /api/blogs
export const createBlog = async (req, res, next) => {
    try {
        const { title, author, url, likes } = req.body;

        if (!title || !url) {
            return res.status(400).json({
                status: "Error",
                error: "title and url are required",
            });
        }

        const blog = new Blog({
            title,
            author,
            url,
            likes: likes ?? 0, // default likes to 0 if not provided
        });

        const savedBlog = await blog.save();

        res.status(201).json({
            status: "success",
            blog: savedBlog,
        });
    } catch (err) {
        next(err);
    }
};
