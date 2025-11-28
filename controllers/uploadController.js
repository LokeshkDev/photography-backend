import { s3 } from "../config/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Event from "../models/Event.js";

export const generatePresignedUrl = async (req, res) => {
  try {
    const { fileName, fileType, folderPath } = req.body;

    const key = `${folderPath}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });

    return res.json({ uploadURL, key });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const confirmUpload = async (req, res) => {
  try {
    const { eventId, key } = req.body;

    const event = await Event.findById(eventId);
    event.photos.push(key);
    await event.save();

    return res.json({ message: "Upload confirmed", photos: event.photos });

  } catch (err) {
    return res.status(500).json({ error: "Confirm upload failed" });
  }
};
