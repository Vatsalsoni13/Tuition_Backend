const express = require("express");
const User = require("../models/User");
const Batch = require("../models/Batch");
const Job = require("../models/Scheduler");
const { Mongoose } = require("mongoose");
const cron =  require('node-cron');
const Assignment = require("../models/Assignment");


let noOfDays = new Map();
noOfDays.set(1,31);
noOfDays.set(1,30);
noOfDays.set(3,28);
noOfDays.set(4,30);
noOfDays.set(5,31);
noOfDays.set(6,30);
noOfDays.set(7,31);
noOfDays.set(8,31);
noOfDays.set(9,30);
noOfDays.set(10,31);
noOfDays.set(11,30);
noOfDays.set(12,31);

function leapYear(year)
{
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

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

const ISTtoUTC=(time,date)=>{
  let ss=time.split(':');
  let dd=date.split('-');
  ss[0]=parseInt(ss[0]);
  ss[1]=parseInt(ss[1]);
  dd[0]=parseInt(dd[0]);
  dd[1]=parseInt(dd[1]);
  dd[2]=parseInt(dd[2]);
  let hour=ss[0]+24;
  let minutes=ss[1]+60;  
  if(ss[0]<=5)
  {
    if(!(ss[0]==5 && ss[1]>30))
    { 
      if(dd[2]==1)
      { //date is 1
        if(dd[1]==1)
        {
          //month is jan
          dd[0]=dd[0]-1;
        }
        dd[1]=((dd[1]+12)-1)%12;
        dd[2]=noOfDays.get(dd[1]);
        if(dd[1]==2)
        {
          if(leapYear(dd[0]))
          {
            dd[2]=dd[2]+1;
          }
        }  
      }
      else
      {
        dd[2]=dd[2]-1;
      }
    }
  }
  hour=(hour-5)%24;
  
  minutes=(minutes-31)%60;
  if(minutes>30)
  {
    hour=hour-1;
  }
  let newDT={}
  newDT.time= hour.toString()+":"+minutes.toString();
  newDT.date=dd[0].toString()+"-"+dd[1].toString()+"-"+dd[2].toString();
  return newDT;
}
exports.scheduleAssignment = async (req, res) => {
  //file
  console.log(req.file)
  const { batchId, date, time } = req.body;
  let utcDT=ISTtoUTC(time,date);
  let job={};
  job.batchId = batchId;
  console.log(utcDT);
  job.date = utcDT.date; //2020-10-21 it shd be like this in front
  job.time = utcDT.time; //14:30
  console.log(job);
  try {
    let newJob = new Job(job);
    await newJob.save();
    let batch = await Assignment.findOne({batchId:batchId});
    console.log(batch);
    batch.assigned.push({path:req.file.path,date:utcDT.date,time:utcDT.time,istDate:date,istTime:time});
    await batch.save();
    res.json("SAB THUK");
  } catch (error) {
    res.json({ message: error });
  }
};

cron.schedule('* * * * *', async () => {

    const d=TodaysDate();
    const t=CurrentTime();
    // console.log(d,t)
    const curJobs = await Job.find({
        date: d,
        time: t,
      });
    await Promise.all(curJobs.map(async (item)=>{
        let batch = await Assignment.findOne({batchId:item.batchId});
        console.log(batch);
        let newAssigned = batch.assigned.filter((item)=>{
            if(item.date === d && item.time === t)
            {
                batch.assignment.push({path:item.path,});
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