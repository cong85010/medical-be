const { Router } = require("express");
const prescriptionController = require("../controllers/prescription/prescription.controller");
const router = Router();

router.get("/", prescriptionController.getPrescriptions);
router.get("/:id", prescriptionController.getPrescriptionById);

module.exports = router;
