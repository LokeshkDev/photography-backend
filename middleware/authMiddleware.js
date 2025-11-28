import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token?.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id, role: decoded.role };

    if (decoded.role === "client") {
      const user = await User.findById(decoded.id);
      if (!user || user.active !== true) {
        return res.status(403).json({ message: "Account disabled" });
      }
    }

    next();
  } catch (err) {
    console.error("TOKEN ERROR:", err.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
