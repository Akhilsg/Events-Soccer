const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { scheduleEvents } = require("../utils/scheduler");

router.post("/add", async (req, res) => {
  try {
    const { priority, userId } = req.body;
    const lastEvent = await Event.findOne({ priority, userId }).sort({
      order: -1,
    });
    const newOrder = lastEvent ? lastEvent.order + 1 : 0;

    const event = new Event({
      ...req.body,
      order: newOrder,
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const query = { userId: req.params.userId };

    if (req.query.tags) {
      query.tags = { $in: req.query.tags.split(",") };
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const events = await Event.find(query).sort({ priority: 1, order: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/update/:eventId", async (req, res) => {
  try {
    if (req.body.reminders) {
      const validTypes = ["email", "push", "sms"];
      const validReminders = req.body.reminders.every((reminder) =>
        validTypes.includes(reminder.type)
      );
      if (!validReminders) {
        return res.status(400).json({ message: "Invalid reminder type" });
      }
    }

    if (req.body.notificationPreference) {
      const validPreferences = ["none", "all", "important"];
      if (!validPreferences.includes(req.body.notificationPreference)) {
        return res
          .status(400)
          .json({ message: "Invalid notification preference" });
      }
    }

    if (req.body.subTasks) {
      req.body.subTasks = req.body.subTasks.map((task, index) => ({
        ...task,
        order: task.order || index,
      }));
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.eventId,
      req.body,
      { new: true }
    );
    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found" });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete/:eventId", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.eventId);
    if (!deletedEvent)
      return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/schedule/:userId", async (req, res) => {
  try {
    const schedule = await scheduleEvents(req.params.userId);
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/reorder", async (req, res) => {
  const { tasks } = req.body;

  const bulkOps = tasks.map((task) => ({
    updateOne: {
      filter: { _id: task._id },
      update: { $set: { order: task.order, priority: task.priority } },
    },
  }));

  try {
    await Event.bulkWrite(bulkOps);
    res.status(200).json({ message: "Tasks reordered successfully" });
  } catch (error) {
    console.error("Error reordering tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
