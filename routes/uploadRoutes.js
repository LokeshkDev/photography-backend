import express from "express";
import { generatePresignedUrl, confirmUpload } from "../controllers/uploadController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/presign", verifyToken, isAdmin, generatePresignedUrl);
router.post("/confirm", verifyToken, isAdmin, confirmUpload);

export default router;
