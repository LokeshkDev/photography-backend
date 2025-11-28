import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Controllers
import { 
  login, 
  createClient, 
  getClients, 
  updateClient, 
  deleteClient,
  resetClientPassword,
  toggleClientActive
} from "../controllers/authController.js";

// Middleware
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Login
router.post("/login", login);

// Create client (Admin Only)
router.post("/create-client", verifyToken, isAdmin, createClient);

// Get all clients (Admin Only)
router.get("/clients", verifyToken, isAdmin, getClients);

// Update client (Admin Only)
router.put("/client/:clientId", verifyToken, isAdmin, updateClient);

// Delete client (Admin Only)
router.delete("/client/:clientId", verifyToken, isAdmin, deleteClient);

// Reset client password (Admin Only)
router.post("/client/reset-password/:clientId", verifyToken, isAdmin, resetClientPassword);

// Toggle client active/inactive (Admin Only)
router.post("/client/active/:clientId", verifyToken, isAdmin, toggleClientActive);

// TEMP add admin manually
router.post("/add-user", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "admin",
    });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
