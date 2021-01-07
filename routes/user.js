const express = require("express");
const User = require("../models/User");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/add", userController.addUser);

module.exports = router;
