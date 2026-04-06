import bcrypt from "bcrypt";
import User from "../models/User.js";

// 4.15 — GET /api/users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).populate("blogs", {
            title: 1,
            author: 1,
            url: 1,
            likes: 1,
        });

        res.status(200).json({
            status: "success",
            users,
        });
    } catch (err) {
        next(err);
    }
};

// 4.15 + 4.16 — POST /api/users
export const createUser = async (req, res, next) => {
    try {
        const { username, name, password } = req.body;

        // 4.16 — validate username and password (NOT via Mongoose for password)
        if (!username || !password) {
            return res.status(400).json({
                status: "Error",
                error: "username and password are required",
            });
        }

        if (username.length < 3) {
            return res.status(400).json({
                status: "Error",
                error: "username must be at least 3 characters long",
            });
        }

        if (password.length < 3) {
            return res.status(400).json({
                status: "Error",
                error: "password must be at least 3 characters long",
            });
        }

        // 4.16 — username must be unique
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                status: "Error",
                error: "username must be unique",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({ username, name, passwordHash });
        const savedUser = await user.save();

        res.status(201).json({
            status: "success",
            user: savedUser,
        });
    } catch (err) {
        next(err);
    }
};
