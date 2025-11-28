import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  s3Key: String,
  url: String,
}, { timestamps: true });

export default mongoose.model("Photo", photoSchema);
