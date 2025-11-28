import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";
import selectionRoutes from "./routes/selectionRoutes.js";
import listEndpoints from "express-list-endpoints";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// DB Connection
connectDB();
// console.log("RUNNING SERVER FROM:", import.meta.url);

// ⛔ IMPORTANT: Ensure default admin exists in DB
const ensureDefaultAdmin = async () => {
  try {
    const existing = await User.findOne({ username: "admin" });

    if (!existing) {
      const hashed = await bcrypt.hash("admin123", 10);
      await User.create({
        username: "admin",
        password: hashed,
        role: "admin"
      });

      // console.log("✅ Default admin created — username: admin, password: admin123");
    } else {
      // console.log("👤 Admin already exists:", existing.username);
    }
  } catch (err) {
    // console.log("❌ ERROR creating default admin:", err.message);
  }
};

// Run admin creation
ensureDefaultAdmin();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/selections", selectionRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Photography Selection App Backend Running");
});

// Start Server
app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});

