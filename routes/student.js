const express = require("express");
const User = require("../models/User");
const router = express.Router();
const studentController = require("../controllers/student");
const calendarController = require("../controllers/calendar");

router.get("/search_batches", studentController.getSearchBatches);
router.get("/enroll_batch", studentController.enrollBatch);
router.get("/enrolled_batches", studentController.getEnrolledBatches);
router.post("/response", studentController.postResponse);
router.get("/response", studentController.getResponse);
router.get("/response_del", studentController.deleteResponse);
router.get("/assignments", studentController.getAllAssignments);
router.get("/batch_assignments", studentController.getBatchAssignments);

router.post("/create", calendarController.createEvent);

module.exports = router;
