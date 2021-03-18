const express = require("express");
const User = require("../models/User");
const router = express.Router();
const userController = require("../controllers/user");
const tutorController = require("../controllers/tutor");
const scheduleController = require("../controllers/scheduler");
// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,'assignments/')
//     },
//     filename:(req,file,cb)=>{
//         cb(null,req.body.name+file.originalname)
//     }
// })
// const upload = multer({storage:storage})

router.get("/mybatches", tutorController.getMyBatches);
router.post("/create_batch", tutorController.createBatch);
router.post("/schedule", scheduleController.scheduleAssignment);
router.get("/assignments", tutorController.getBatchAssignments);
router.get("/responses", tutorController.getAssignmentResponses);
router.put("/schedule", tutorController.schedule);
module.exports = router;
