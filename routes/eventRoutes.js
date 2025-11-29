import express from "express";
import Event from "../models/Event.js";   // ✅ REQUIRED IMPORT
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

import {
  createEvent,
  getAllEvents,
  getEventsByClient,
  updateEvent,
  archiveEvent,
  duplicateEvent,
  deleteEvent,
  getSingleEvent 
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", verifyToken, isAdmin, createEvent);

router.get("/", verifyToken, isAdmin, getAllEvents);

router.get("/client/:clientId", verifyToken, getEventsByClient);

router.put("/:eventId", verifyToken, isAdmin, updateEvent);

router.post("/archive/:eventId", verifyToken, isAdmin, archiveEvent);

router.post("/duplicate/:eventId", verifyToken, isAdmin, duplicateEvent);

router.delete("/:eventId", verifyToken, isAdmin, deleteEvent);

router.get("/:eventId", getSingleEvent);

export default router;
