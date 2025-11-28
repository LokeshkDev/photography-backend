import Selection from "../models/Selection.js";
import Event from "../models/Event.js";
import User from "../models/User.js"; 

// =============================
// CREATE / UPDATE SELECTION (client)
// =============================
export const createSelection = async (req, res) => {
  try {
    const clientId = req.user.id;   // IMPORTANT
    const { eventId, selections } = req.body;

    if (!clientId || !eventId || !Array.isArray(selections)) {
      return res.status(400).json({ error: "Invalid data" });
    }

    console.log("SAVE USING:", clientId, eventId, selections);

    const user = await User.findById(clientId);
    if (!user || user.active === false) {
      return res.status(403).json({ error: "Client not allowed to submit" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.selectionLimit > 0 && selections.length > event.selectionLimit) {
      return res.status(400).json({ 
        error: `Maximum ${event.selectionLimit} selections allowed` 
      });
    }

    const existing = await Selection.findOne({ clientId, eventId });

    if (existing) {
      existing.selections = selections;
      await existing.save();
      return res.json({ message: "Selection updated", selections });
    }

    const newSel = await Selection.create({ clientId, eventId, selections });
    return res.status(201).json({ message: "Selection saved", selections });

  } catch (err) {
    console.error("createSelection error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


// =============================
// GET SELECTIONS FOR AN EVENT (admin)
// =============================
export const getSelectionsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const selections = await Selection.find({ eventId })
      .populate("clientId", "name email active")  // This is good
      .lean();

    return res.json(selections);

  } catch (err) {
    console.error("getSelectionsByEvent error", err);
    return res.status(500).json({ error: "Failed to load selections" });
  }
};

// =============================
// GET EXISTING SELECTIONS FOR A CLIENT (client)
// =============================
export const getClientSelection = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const clientId = req.user.id;

    console.log("FETCH SELECTION:", eventId, clientId);

    const sel = await Selection.findOne({ eventId, clientId });

    console.log("FOUND:", sel);

    if (!sel) return res.json({ selections: [] });

    return res.json({ selections: sel.selections });

  } catch (err) {
    console.error("getClientSelection error", err);
    return res.status(500).json({ error: "Failed to load selection" });
  }
};
