const { Router } = require("express");
const router = Router();

const medicalRecordController = require("../controllers/medicalRecord/medicalRecord.controller");

router.post("/", medicalRecordController.getListMedicalRecord);
router.get("/:id", medicalRecordController.getMedicalRecordById);
router.post("/", medicalRecordController.createMedicalRecord);
router.put("/:id", medicalRecordController.updateMedicalRecord);
router.delete("/", medicalRecordController.deleteMedicalRecord);
module.exports = router;
