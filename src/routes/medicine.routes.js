const { Router } = require("express");
const medicineController = require("../controllers/medicine/medicine.controller");
const router = Router();

router.get("/", medicineController.getMedicines);
router.get("/:id", medicineController.getMedicineById);
router.post("/", medicineController.createMedicine);
router.put("/:id", medicineController.updateMedicine);
router.delete("/:id", medicineController.deleteMedicine);

module.exports = router;
