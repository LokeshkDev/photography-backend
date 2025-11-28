import mongoose from "mongoose";

const selectionSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  selections: { type: [String], default: [] }, // store S3 keys
  status: { type: String, default: "new" }, // new | reviewed | accepted | rejected
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Selection", selectionSchema);
