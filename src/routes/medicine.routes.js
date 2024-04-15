const { Router } = require("express");
const medicineController = require("../controllers/medicine/medicine.controller");
const router = Router();

router.get("/", medicineController.getMedicines);
router.get("/:id", medicineController.getMedicineById);
router.post("/", medicineController.createOrUpdateMedicine);

module.exports = router;
