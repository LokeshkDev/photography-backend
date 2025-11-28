import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "client"], default: "client" },
  active: {
    type: Boolean,
    default: true,
  }
});

export default mongoose.model("User", userSchema);
