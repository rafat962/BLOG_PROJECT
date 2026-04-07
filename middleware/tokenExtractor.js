// extracts token from Authorization header
const tokenExtractor = (req, res, next) => {
    const authorization = req.get("authorization");

    if (authorization && authorization.startsWith("Bearer ")) {
        req.token = authorization.replace("Bearer ", "");
    } else {
        req.token = null;
    }

    next();
};

export default tokenExtractor;
