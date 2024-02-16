const { Router } = require("express");
const {
 login,
 reAuth,
 register,
} = require("../controllers/auth/auth.controller");
const { authValidation } = require("../controllers/auth/auth.validator");

const router = Router();

//api: url/auth/__

//login
router.post("/login", login);

//register
router.post("/register", authValidation, register);

//re-auth
router.post("/reauth", reAuth);

module.exports = router;
