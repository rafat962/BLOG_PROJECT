import jwt from "jsonwebtoken";
import User from "../models/User.js";

//finds the user from the token and attaches to req.user
const userExtractor = async (req, res, next) => {
    try {
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

        const user = await User.findById(decodedToken.id);

        if (!user) {
            return res.status(401).json({
                status: "Error",
                error: "user not found",
            });
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

export default userExtractor;
