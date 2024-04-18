const { Router } = require("express");
const orderController = require("../controllers/order/order.controller");
const router = Router();

router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.get("/medical/:id", orderController.getOrderByMedicalRecordId);
router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
