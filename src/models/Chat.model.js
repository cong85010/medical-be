// models/Chat.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  file: String,
  to: {
    type: String,
    required: true,
    ref: "user",
  },
  sendBy: {
    type: String,
    required: true,
    ref: "user",
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "conversation",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("chat", chatSchema);
