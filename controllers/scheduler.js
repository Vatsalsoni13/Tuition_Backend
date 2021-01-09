const express = require("express");
const User = require("../models/User");
const Batch = require("../models/Batch");
const Job = require("../models/Scheduler");
const { Mongoose } = require("mongoose");
const cron =  require('node-cron');

const TodaysDate = () => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  return date;
};

const CurrentTime = () => {
  var today = new Date();

  var time = today.getHours() + ":" + today.getMinutes();
  return time;
};

exports.scheduleAssignment = async (req, res) => {
  //file
  console.log(req.file)
  const { batchId, date, time } = req.body;
  let job={};
  job.batchId = batchId;
  job.date = date; //2020-10-21 it shd be like this in front
  job.time = time; //14:30
  console.log(job);
  try {
    let newJob = new Job(job);
    await newJob.save();
    let batch = await Batch.findById(batchId);
    batch.assigned.push({path:req.file.path,date:date,time:time});
    await batch.save();
    res.json("SAB THUK");
  } catch (error) {
    res.json({ message: error });
  }
};


cron.schedule('* * * * *', async () => {

    const d=TodaysDate();
    const t=CurrentTime();
    console.log(d,t)
    const curJobs = await Job.find({
        date: d,
        time: t,
      });
    await Promise.all(curJobs.map(async (item)=>{
        let batch = await Batch.findById(item.batchId);
        let newAssigned = batch.assigned.filter((item)=>{
            if(item.date === d && item.time === t)
            {
                batch.assignments.push({path:item.path});
            }
            else
            {
                return item;
            }
        })
        batch.assigned=newAssigned;
        await batch.save();
    }))  
    await Job.deleteMany({ date: d, time:t });
  });