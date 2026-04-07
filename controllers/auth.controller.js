import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

// /api/login
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: "Error",
                error: "username and password are required",
            });
        }

        const user = await User.findOne({ username });

        const passwordCorrect =
            user === null
                ? false
                : await bcrypt.compare(password, user.passwordHash);

        if (!passwordCorrect) {
            return res.status(401).json({
                status: "Error",
                error: "invalid username or password",
            });
        }

        const userForToken = {
            username: user.username,
            id: user._id,
        };

        const token = jwt.sign(userForToken, process.env.SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({
            status: "success",
            token,
            username: user.username,
            name: user.name,
        });
    } catch (err) {
        next(err);
    }
};
