import express from "express";
import { getPhotosByEvent,deletePhoto} from "../controllers/photoController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all photos for an event
router.get("/event/:eventId", getPhotosByEvent);

// Delete a photo (admin only)
router.post("/delete", verifyToken, isAdmin, deletePhoto);

export default router;
