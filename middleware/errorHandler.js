const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === "CastError") {
        return res.status(400).json({ error: "malformatted id" });
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
    }

    // 4.23/4.24 — JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "token invalid" });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "token expired" });
    }

    res.status(500).json({ error: "Internal server error" });
};

export default errorHandler;
