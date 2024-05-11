const { Router } = require("express");
const router = Router();

const conversationController = require("../controllers/conversation/conversation.controller");

router.post("/list", conversationController.getConversationByUserid);
router.get("/:id", conversationController.getConversationById);
router.post("/create", conversationController.createConversation);
router.put("/", conversationController.updateConversation);
router.delete("/", conversationController.deleteConversation);
module.exports = router;
