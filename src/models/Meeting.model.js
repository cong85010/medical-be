const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  files: {
    type: [String],
    default: [],
  },
  participants: {
    type: [String],
    ref: "user",
    default: [],
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  owner: {
    type: String,
    ref: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Meeting = mongoose.model("meeting", meetingSchema);

module.exports = Meeting;
