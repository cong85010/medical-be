const { StatusCodes } = require("http-status-codes");
const Chat = require("../../models/Chat.model");
const { response } = require("../../utils/response");
const { updateConversation } = require("../conversation/conversation.controller");

// Create (Insert) a new chat
exports.createChat = async (message) => {
  try {
    // Create new chat
    const newChat = new Chat(message);

    const chat = await newChat.save();
    updateConversation(message.conversationId, message);
    return chat;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

// Read (Retrieve) a chat by ID
exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    return response(res, StatusCodes.ACCEPTED, true, { chat }, null);
  } catch (error) {
    return response(res, StatusCodes.BAD_REQUEST, true, { chat: {} }, null);
  }
};

// Read (Retrieve) a chat by getChatByConversationId
exports.getChatByConversationId = async (req, res) => {
  try {
    const { conversationId } = req.body;
    const chats = await Chat.find({
      conversationId,
    })
      .populate({
        path: "sendBy",
        select: "fullName photo",
      })
      .populate({
        path: "to",
        select: "fullName photo",
      })
      .sort({
        createAt: -1,
      });

    return response(res, StatusCodes.ACCEPTED, true, { chats }, null);
  } catch (error) {
    return response(res, StatusCodes.BAD_REQUEST, true, { chats: [] }, null);
  }
};

// Update a chat by ID
exports.updateChat = async (req, res) => {
  try {
    const { name, participants, lastMessage } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      req.params.id,
      { name, participants, lastMessage, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedChat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { chat: updatedChat },
      null
    );
  } catch (error) {
    return response(res, StatusCodes.BAD_REQUEST, true, { chat: {} }, null);
  }
};

// Delete a chat by ID
exports.deleteChat = async (req, res) => {
  try {
    const deletedChat = await Chat.findByIdAndDelete(req.params.id);
    if (!deletedChat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { chat: deletedChat },
      null
    );
  } catch (error) {
    return response(res, StatusCodes.BAD_REQUEST, true, { chat: {} }, null);
  }
};
