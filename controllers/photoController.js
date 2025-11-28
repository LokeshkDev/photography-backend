import Event from "../models/Event.js";
import { s3 } from "../config/s3.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

// 🔹 GET photos for an event
export const getPhotosByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).select("photos");
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const results = event.photos.map((key) => ({
      key,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    }));

    return res.json(results);
  } catch (err) {
    console.error("GET PHOTOS ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch photos" });
  }
};

// 🔹 DELETE photo (DB + S3)
export const deletePhoto = async (req, res) => {
  try {
    const { eventId, key } = req.body;

    if (!eventId || !key) {
      return res.status(400).json({ error: "eventId and key are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Remove key from event.photos
    event.photos = (event.photos || []).filter((photoKey) => photoKey !== key);
    await event.save();

    // Delete from S3
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);

    console.log("✔ Photo deleted:", { eventId, key });

    return res.json({ success: true, photos: event.photos });
  } catch (err) {
    console.error("DELETE PHOTO ERROR:", err);
    return res
      .status(500)
      .json({ error: "Delete failed", details: err.message });
  }
};
