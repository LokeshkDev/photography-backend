import Event from "../models/Event.js";
import User from "../models/User.js";

// ====================================== CREATE EVENT
export const createEvent = async (req, res) => {
  try {
    const { title, description, clientId, selectionLimit } = req.body;

    if (!clientId) return res.status(400).json({ error: "clientId missing" });

    const clientUser = await User.findById(clientId);

    const event = await Event.create({
      title,
      description,
      client: clientId,
      clientName: clientUser?.name || "",
      selectionLimit,
      photos: [],
      archived: false,
    });

    res.json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create event" });
  }
};

// ====================================== GET ALL EVENTS (ADMIN)
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("client", "name email");

    res.json({
      events,
      total: events.length,
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to get events" });
  }
};

// ====================================== GET EVENTS BY CLIENT (CLIENT VIEW)
export const getEventsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const events = await Event.find({ client: clientId })
      .select("title description photos selectionLimit archived");

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch client events" });
  }
};

// ====================================== UPDATE EVENT
export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updated = await Event.findByIdAndUpdate(eventId, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update event" });
  }
};

// ====================================== ARCHIVE EVENT
export const archiveEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByIdAndUpdate(eventId, { archived: true }, { new: true });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to archive event" });
  }
};

// ====================================== DUPLICATE EVENT
export const duplicateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const original = await Event.findById(eventId);

    const duplicate = await Event.create({
      title: original.title + "_copy",
      description: original.description,
      client: original.client,
      clientName: original.clientName,
      selectionLimit: original.selectionLimit,
      photos: [],
      archived: false,
    });

    res.json(duplicate);
  } catch (err) {
    res.status(500).json({ error: "Failed to duplicate event" });
  }
};

// ====================================== DELETE EVENT
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    await Event.findByIdAndDelete(eventId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};

export const getSingleEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).select("selectionLimit title client");

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);

  } catch (err) {
    console.log("getSingleEvent ERROR:", err);
    res.status(500).json({ error: "Failed to load event" });
  }
};
