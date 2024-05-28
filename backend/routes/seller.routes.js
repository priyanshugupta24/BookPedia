const express = require('express');
const router = express.Router();

var { viewAllBooks,editBooks,deleteBooks,uploadCsv,viewBook } = require("../controller/sellerController");
var { validateToken } = require("../middlewares/JWT.middleware");

router.route("/seller/viewAllBooks").get(validateToken,viewAllBooks);
router.route("/seller/viewBook").post(validateToken,viewBook);
router.route("/seller/editBooks").post(validateToken,editBooks);
router.route("/seller/deleteBooks").post(validateToken,deleteBooks);
router.route("/seller/uploadCsv").post(validateToken,uploadCsv);

module.exports = router;