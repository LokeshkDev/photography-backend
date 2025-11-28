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
  getSingleEvent   // ✅ add function in controller
} from "../controllers/eventController.js";

const router = express.Router();

/* ============================
     ADMIN — CREATE EVENT
============================ */
router.post("/", verifyToken, isAdmin, createEvent);

/* ============================
     ADMIN — GET ALL EVENTS
============================ */
router.get("/", verifyToken, isAdmin, getAllEvents);

/* ============================
     CLIENT — GET OWN EVENTS
============================ */
router.get("/client/:clientId", verifyToken, getEventsByClient);

/* ============================
     ADMIN — UPDATE EVENT
============================ */
router.put("/:eventId", verifyToken, isAdmin, updateEvent);

/* ============================
     ADMIN — ARCHIVE EVENT
============================ */
router.post("/archive/:eventId", verifyToken, isAdmin, archiveEvent);

/* ============================
     ADMIN — DUPLICATE EVENT
============================ */
router.post("/duplicate/:eventId", verifyToken, isAdmin, duplicateEvent);

/* ============================
     ADMIN — DELETE EVENT
============================ */
router.delete("/:eventId", verifyToken, isAdmin, deleteEvent);

/* ============================
   CLIENT or ADMIN — GET SINGLE EVENT
   (needed for ClientSubmit.jsx)
============================ */
router.get("/:eventId", verifyToken, getSingleEvent);

export default router;
