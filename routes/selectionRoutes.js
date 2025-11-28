import express from "express";
import { 
  createSelection, 
  getSelectionsByEvent,
  getClientSelection
} from "../controllers/selectionController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ------------------ CLIENT SUBMITS SELECTION ------------------ */
router.post("/", verifyToken, createSelection);

/* ------------------ ADMIN GETS ALL SELECTIONS FOR EVENT ------------------ */
router.get("/event/:eventId", verifyToken, isAdmin, getSelectionsByEvent);

/* ------------------ CLIENT GETS THEIR EXISTING SELECTION ------------------ */
router.get("/client/:eventId", verifyToken, getClientSelection);

export default router;
