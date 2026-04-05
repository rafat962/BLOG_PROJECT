const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === "CastError") {
        return res.status(400).json({ error: "malformatted id" });
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Internal server error" });
};

export default errorHandler;
