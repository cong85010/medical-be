const { StatusCodes } = require("http-status-codes");
const Conversation = require("../../models/Conversation.model");
const { response } = require("../../utils/response");

// Create (Insert) a new conversation
exports.createConversation = async (req, res) => {
  try {
    const { name = "", participants, lastMessage = "" } = req.body;

    const newConversation = new Conversation({
      name,
      participants,
      lastMessage,
    });
    const conversation = await newConversation.save();
    return response(res, StatusCodes.ACCEPTED, true, { conversation }, null);
  } catch (error) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      true,
      { conversation: {} },
      null
    );
  }
};

// Read (Retrieve) a conversation by ID
exports.getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    return response(res, StatusCodes.ACCEPTED, true, { conversation }, null);
  } catch (error) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      true,
      { conversation: {} },
      null
    );
  }
};

// Read (Retrieve) a conversation by UserUd
exports.getConversationByUserid = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("====================================");
    console.log(userId);
    console.log("====================================");

    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate({
        path: "participants",
        select: "fullName phone email photo",
      })
      .sort({
        updatedAt: -1,
      });

    return response(res, StatusCodes.ACCEPTED, true, { conversations }, null);
  } catch (error) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      true,
      { conversations: [] },
      null
    );
  }
};

// Update a conversation by ID
exports.updateConversation = async (req, res) => {
  try {
    const { name, participants, lastMessage } = req.body;
    const updatedConversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { name, participants, lastMessage, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedConversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { conversation: updatedConversation },
      null
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      true,
      { conversation: {} },
      null
    );
  }
};

// Delete a conversation by ID
exports.deleteConversation = async (req, res) => {
  try {
    const deletedConversation = await Conversation.findByIdAndDelete(
      req.params.id
    );
    if (!deletedConversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { conversation: deletedConversation },
      null
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      true,
      { conversation: {} },
      null
    );
  }
};
