const express = require('express');
const router = express.Router();

var { viewAllBooks,editBooks,deleteBooks,uploadCsv,viewBook } = require("../controller/sellerController");
var { validateToken } = require("../middlewares/JWT.middleware");

router.route("/viewAllBooks").get(validateToken,viewAllBooks);
router.route("/viewBook").post(validateToken,viewBook);
router.route("/editBooks").post(validateToken,editBooks);
router.route("/deleteBooks").post(validateToken,deleteBooks);
router.route("/uploadCsv").post(validateToken,uploadCsv);

module.exports = router;