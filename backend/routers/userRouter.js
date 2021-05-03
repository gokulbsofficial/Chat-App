const express = require('express')
const router = express.Router()
const {  findUser } = require("../controller/userController")
const { protect } = require("../middleware/authMiddleware")

router.route("/").get(protect, findUser)

module.exports = router;