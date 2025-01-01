const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: Date },
  duration: { type: Number },
  priority: { type: Number, default: 1 },
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  tags: [{ type: String }],
  color: { type: String },
  description: { type: String },
  notes: [
    {
      content: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  reminders: [
    {
      time: { type: Date },
      type: { type: String, enum: ["email", "push", "sms"] },
    },
  ],
  notificationPreference: {
    type: String,
    enum: ["none", "all", "important"],
    default: "all",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  order: { type: Number },
  subTasks: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      completed: { type: Boolean, default: false },
      order: { type: Number },
    },
  ],
});

module.exports = mongoose.model("Event", EventSchema);
