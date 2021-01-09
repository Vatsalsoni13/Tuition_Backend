const express = require("express");
const User = require("../models/User");
const router = express.Router();
const userController = require("../controllers/user");
const tutorController = require("../controllers/tutor");

router.get("/mybatches", tutorController.getMyBatches);
router.post("/create_batch", tutorController.createBatch);

module.exports = router;
