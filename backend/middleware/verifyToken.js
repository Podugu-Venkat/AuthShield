import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Assuming the token is stored in cookies

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        req.userId = decoded.userId; // Attach userId to request object for further use
        next();
    }
    catch(error){
        return res.status(500).json({ message: "Internal server error" });
    }
};