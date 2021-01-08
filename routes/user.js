const express = require("express");
const User = require("../models/User");
const router = express.Router();
const userController = require("../controllers/user");

router.param("userId", userController.getUserById);

router.get("/:userId", userController.getUser);

router.post("/add", userController.addUser);
router.put("/update/:userId", userController.updateUser);
module.exports = router;
