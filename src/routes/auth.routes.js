const { Router } = require("express");
const {
  login,
  reAuth,
  register,
  changePassword,
  resetPassword,
} = require("../controllers/auth/auth.controller");
const { authValidation } = require("../controllers/auth/auth.validator");
const { isAdmin } = require("../utils/protected");

const router = Router();

//api: url/auth/__

//login
router.post("/login", login);

//register
router.post("/register", authValidation, register);

//re-auth
router.post("/reauth", reAuth);

router.post("/change-password", changePassword);

router.put("/reset-password", isAdmin, resetPassword);
module.exports = router;
