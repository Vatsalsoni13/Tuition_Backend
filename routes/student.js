const express = require("express");
const User = require("../models/User");
const router = express.Router();
const studentController = require("../controllers/student");

router.get("/search_batches", studentController.getSearchBatches);
router.get("/enroll_batch", studentController.enrollBatch);
router.get('/enrolled_batches',studentController.getEnrolledBatches)

module.exports = router;
