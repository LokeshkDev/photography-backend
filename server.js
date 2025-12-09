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
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// DB Connection
connectDB();
// console.log("RUNNING SERVER FROM:", import.meta.url);

const ensureDefaultAdmin = async () => {
  try {
    const existing = await User.findOne({ username: "admin" });

    const NEW_ADMIN_PASSWORD = process.env.NEW_ADMIN_PASSWORD;;

    if (!existing) {
      const hashed = await bcrypt.hash(NEW_ADMIN_PASSWORD, 10);

      await User.create({
        username: "admin",
        name: "Super Admin",
        email: "lokesh@system.com",  
        password: hashed,
        role: "admin",
        active: true
      });

      console.log("✅ Default admin created");
    } else {
      // Password update logic
      const isSame = await bcrypt.compare(NEW_ADMIN_PASSWORD, existing.password);

      if (!isSame) {
        const hashed = await bcrypt.hash(NEW_ADMIN_PASSWORD, 10);
        existing.password = hashed;

        // ensure other fields remain valid
        if (!existing.email) existing.email = "Lokesh@system.com";
        if (!existing.name) existing.name = "Super Admin";

        await existing.save();
        console.log("🔄 Admin password updated");
      } else {
        console.log("✔ Admin password already up to date");
      }
    }
  } catch (err) {
    console.log("❌ ERROR creating/updating default admin:", err.message);
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

