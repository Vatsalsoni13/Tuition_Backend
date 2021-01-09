const express = require("express");
const User = require("../models/User");
const router = express.Router();
const userController = require("../controllers/user");
const tutorController = require("../controllers/tutor");
const scheduleController = require("../controllers/scheduler");
const multer = require('multer');
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'assignments/')
    },
    filename:(req,file,cb)=>{
        cb(null,req.body.name+file.originalname)
    }
})
const upload = multer({storage:storage})


router.get("/mybatches", tutorController.getMyBatches);
router.post("/create_batch", tutorController.createBatch);
router.post("/schedule",upload.single('task') ,scheduleController.scheduleAssignment);

module.exports = router;
