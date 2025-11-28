import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// =============================
//        USER LOGIN
// =============================
export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid email or username" });
    }

    if (user.role === "client" && user.active === false) {
      return res.status(403).json({ message: "Your account is disabled. Contact admin." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, user });

  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
};



// =============================
//     CREATE NEW CLIENT
// =============================
export const createClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // prevent duplicate emails
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPwd = await bcrypt.hash(password, 10);
    const username = email.split("@")[0];

    const user = await User.create({
      username,
      name,
      email,
      password: hashPwd,
      role: "client",
    });

    return res.json({ message: "Client created", user });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



// =============================
//       GET ALL CLIENTS
// =============================
export const getClients = async (req, res) => {
  try {
    const clients = await User.find({ role: "client" }).select("-password");
    return res.json(clients);

  } catch (err) {
    return res.status(500).json({ message: "Failed to load clients" });
  }
};



// =============================
//       UPDATE CLIENT
// =============================
export const updateClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { name, email } = req.body;

    const updated = await User.findByIdAndUpdate(
      clientId,
      { name, email },
      { new: true }
    ).select("-password");

    return res.json(updated);

  } catch (err) {
    return res.status(500).json({ error: "Failed to update client" });
  }
};



// =============================
//       DELETE CLIENT
// =============================
export const deleteClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    await User.findByIdAndDelete(clientId);
    return res.json({ message: "Client deleted successfully" });

  } catch (err) {
    return res.status(500).json({ error: "Failed to delete client" });
  }
};

// =============================
//    RESET CLIENT PASSWORD
// =============================
export const resetClientPassword = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    const hashPwd = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(clientId, { password: hashPwd });

    return res.json({ message: "Password reset successfully" });

  } catch (err) {
    console.log("🔥 RESET PASSWORD ERROR:", err);
    return res.status(500).json({ error: "Failed to reset password" });
  }
};


// active and inactive
export const toggleClientActive = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { active } = req.body;

    const updated = await User.findByIdAndUpdate(
      clientId,
      { active },
      { new: true }
    ).select("-password");

    return res.json(updated);

  } catch (err) {
    return res.status(500).json({ error: "Failed to update active state" });
  }
};