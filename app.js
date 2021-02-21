const express = require("express");
const app = express();
const connectDB = require("./DB/Connection");
const User = require("./models/User");
const userRoutes = require("./routes/user");
const tutorRoutes = require("./routes/tutor");
const studentRoutes = require("./routes/student");
const tutorController = require("./controllers/tutor");
const router = express.Router();

connectDB();
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));
app.use("/tutor", tutorRoutes);
app.use("/user", userRoutes);
app.use("/student", studentRoutes);
app.use("/batch", tutorController.getSingleBatch);

app.use("/", (req, res) => {
  console.log("IN");
  res.send("Finally Deployed");
});
let PORT = process.env.PORT || 3000;
// PORT = 3000;
app.listen(PORT, () => {
  "started server";
  console.log("Start");
});
