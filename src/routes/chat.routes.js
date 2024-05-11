const { Router } = require("express");
const router = Router();

const chatController = require("../controllers/chat/chat.controller");

router.post("/list", chatController.getChatByConversationId);
router.get("/:id", chatController.getChatById);
router.post("/create", chatController.createChat);
router.put("/", chatController.updateChat);
router.delete("/", chatController.deleteChat);
module.exports = router;
