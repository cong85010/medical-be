const { Router } = require("express");
const {
  getUsers,
  getUserDetails,
  updateUserDetails,
  updateStatus,
  deleteUser,
  createUser,
  createPatient,
  updatePatient,
} = require("../controllers/user/user.controller");
const { isUser, isAdmin } = require("../utils/protected");
const { userValidation } = require("../controllers/user/user.validator");

const router = Router();

//api: url/course/__

//Subscription
router.post("/create", isAdmin, userValidation, createUser);
router.post("/create-patient", createPatient);
router.post("/", getUsers);
router.get("/:id", getUserDetails);
router.put("/update/:id", isUser, updateUserDetails);
router.put("/update-status/:id", isAdmin, updateStatus);
router.post("/delete/:id", isAdmin, deleteUser);

module.exports = router;
