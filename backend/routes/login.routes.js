const express = require('express');
const router = express.Router();

var { login,logout,register } = require("../controller/loginController");

router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/register").post(register);

module.exports = router;