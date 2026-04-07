import Blog from "../models/Blog.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
// GET /api/blogs
export const getAllBlogs = async (req, res, next) => {
    try {
        const { search, author, sortBy, order, page, limit } = req.query;

        //validate sortBy if provided
        const allowedSortFields = ["likes"];
        if (sortBy && !allowedSortFields.includes(sortBy)) {
            return res.status(400).json({
                status: "Error",
                error: `Invalid sortBy field. Allowed fields: ${allowedSortFields.join(", ")}`,
            });
        }

        // build filter object
        const filter = {};

        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        if (author) {
            filter.author = { $regex: author, $options: "i" };
        }

        // sort options
        const sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = order === "asc" ? 1 : -1;
        }

        // pagination
        const pageNum = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        const skip = (pageNum - 1) * pageSize;

        const total = await Blog.countDocuments(filter);

        const blogs = await Blog.find(filter)
            .populate("user", { username: 1, name: 1 }) // 4.17
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);

        res.status(200).json({
            status: "success",
            blogs,
            // pagination metadata
            pagination: {
                currentPage: pageNum,
                pageSize,
                totalBlogs: total,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (err) {
        next(err);
    }
};

// POST /api/blogs (assign first user as creator)
export const createBlog = async (req, res, next) => {
    try {
        const { title, author, url, likes } = req.body;

        if (!title || !url) {
            return res.status(400).json({
                status: "Error",
                error: "title and url are required",
            });
        }

        // verify token from req.token
        if (!req.token) {
            return res.status(401).json({
                status: "Error",
                error: "token missing",
            });
        }

        const decodedToken = jwt.verify(req.token, process.env.SECRET);

        if (!decodedToken.id) {
            return res.status(401).json({
                status: "Error",
                error: "token invalid",
            });
        }

        // 4.24 — user from token is the creator
        const user = await User.findById(decodedToken.id);

        if (!user) {
            return res.status(401).json({
                status: "Error",
                error: "user not found",
            });
        }

        const blog = new Blog({
            title,
            author,
            url,
            likes: likes ?? 0,
            user: user._id,
        });

        const savedBlog = await blog.save();

        user.blogs = user.blogs.concat(savedBlog._id);
        await user.save();

        res.status(201).json({
            status: "success",
            blog: savedBlog,
        });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/blogs/:id/like
export const likeBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true },
        ).populate("user", { username: 1, name: 1 });

        if (!blog) {
            return res.status(404).json({
                status: "Error",
                error: "Blog not found",
            });
        }

        res.status(200).json({
            status: "success",
            blog,
        });
    } catch (err) {
        next(err);
    }
};
