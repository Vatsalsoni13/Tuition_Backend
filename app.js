const express = require('express');
const app = express();
const connectDB = require('./DB/Connection');
const User = require('./models/User');
const userRoutes = require('./routes/user');
const tutorRoutes = require('./routes/tutor');
const studentRoutes = require('./routes/student');

connectDB();
app.use(express.urlencoded({extended:false}));
app.use(express.json({extended:false}));
app.use('/tutor',tutorRoutes);
app.use('/user',userRoutes);
app.use('/student',studentRoutes);
app.use('/',(req,res) =>{
    console.log("IN");
});


const Port = process.env.Port || 3000;
app.listen(Port,()=>{
    "started server";
});