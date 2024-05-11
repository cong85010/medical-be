const mongoose = require("mongoose");

// Define the conversation schema
const ConversationSchema = new mongoose.Schema({
  name: String,
  participants: {
    type: [String],
    ref: "user",
    default: [],
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

// Define the Conversation model
const Conversation = mongoose.model("conversation", ConversationSchema);

module.exports = Conversation;
