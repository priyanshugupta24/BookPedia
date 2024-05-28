const express = require('express');
const router = express.Router();

var { viewBook,viewDetails } = require("../controller/buyerController");
var { validateToken } = require("../middlewares/JWT.middleware");

router.route("/buyer/viewBook").get(validateToken,viewBook);
router.route("/buyer/viewDetails").post(validateToken,viewDetails);

module.exports = router;