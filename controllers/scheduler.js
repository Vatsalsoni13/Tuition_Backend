const express = require("express");
const User = require("../models/User");
const Batch = require("../models/Batch");
const Job = require("../models/Scheduler");
const { Mongoose } = require("mongoose");
const cron = require("node-cron");
const Assignment = require("../models/Assignment");

// let noOfDays = new Map();
// noOfDays.set(1,31);
// noOfDays.set(1,30);
// noOfDays.set(3,28);
// noOfDays.set(4,30);
// noOfDays.set(5,31);
// noOfDays.set(6,30);
// noOfDays.set(7,31);
// noOfDays.set(8,31);
// noOfDays.set(9,30);
// noOfDays.set(10,31);
// noOfDays.set(11,30);
// noOfDays.set(12,31);

const TodaysDate = () => {
  var today = new Date();
  let date;
  let a;
  if (today.getMonth() < 9) {
    a = today.getFullYear() + "-0" + (today.getMonth() + 1);
  } else {
    a = today.getFullYear() + "-" + (today.getMonth() + 1);
  }
  if (today.getDate() < 10) {
    date = a + "-0" + today.getDate();
  } else {
    date = a + "-" + today.getDate();
  }
  return date;
};

const CurrentTime = () => {
  var today = new Date();
  let time;
  let a;
  if (today.getHours() < 10) {
    a = "0" + today.getHours();
  } else {
    a = today.getHours();
  }
  if (today.getMinutes() < 10) {
    time = a + ":0" + today.getMinutes().toString();
  } else {
    time = a + ":" + today.getMinutes();
  }
  return time;
};

// const ISTtoUTC=(time,date)=>{
//   let ss=time.split(':');
//   let dd=date.split('-');
//   ss[0]=parseInt(ss[0]);
//   ss[1]=parseInt(ss[1]);
//   dd[0]=parseInt(dd[0]);
//   dd[1]=parseInt(dd[1]);
//   dd[2]=parseInt(dd[2]);
//   let hour=ss[0]+24;
//   let minutes=ss[1]+60;
//   if(ss[0]<=5)
//   {
//     if(!(ss[0]==5 && ss[1]>30))
//     {
//       if(dd[2]==1)
//       { //date is 1
//         if(dd[1]==1)
//         {
//           //month is jan
//           dd[0]=dd[0]-1;
//         }
//         dd[1]=((dd[1]+12)-1)%12;
//         dd[2]=noOfDays.get(dd[1]);
//         if(dd[1]==2)
//         {
//           if(leapYear(dd[0]))
//           {
//             dd[2]=dd[2]+1;
//           }
//         }
//       }
//       else
//       {
//         dd[2]=dd[2]-1;
//       }
//     }
//   }
//   hour=(hour-5)%24;

//   minutes=(minutes-31)%60;
//   if(minutes>30)
//   {
//     hour=hour-1;
//   }
//   let newDT={}
//   newDT.time= hour.toString()+":"+minutes.toString();
//   newDT.date=dd[0].toString()+"-"+dd[1].toString()+"-"+dd[2].toString();
//   return newDT;
// }
exports.scheduleAssignment = async (req, res) => {
  //file
  const { batchId, date, time, name, path, istDateTime, fileName } = req.body;
  let job = {};
  job.batchId = batchId;
  job.date = date; //2020-10-21 it shd be like this in front
  job.time = time; //14:30
  try {
    let newJob = new Job(job);
    await newJob.save();
    console.log(newJob, "THIS IS JOB");
    let batch = await Batch.findById(batchId);
    console.log(batch, "THIS IS BATCH");
    batch.assigned.push({
      path: path,
      date: date,
      time: time,
      istDateTime: istDateTime,
      name: name,
      fileName: fileName,
    });
    await batch.save();
    res.json("SAB THIK");
  } catch (error) {
    res.json({ message: error });
  }
};

cron.schedule("* * * * *", async () => {
  const d = TodaysDate();
  const t = CurrentTime();
  const curJobs = await Job.find({
    date: d,
    time: t,
  });
  await Promise.all(
    curJobs.map(async (item) => {
      let batch = await Batch.findById(item.batchId);
      const bId = item.batchId;
      console.log(batch);
      let newAssigned = batch.assigned.map(async (itm) => {
        if (itm.date === d && itm.time === t) {
          let assignment = {
            path: itm.path,
            istDateTime: itm.istDateTime,
            responses: [],
            batchId: bId,
            name: itm.name,
            fileName: itm.fileName,
          };
          let newAssignment = Assignment(assignment);
          await newAssignment.save();
          return itm;
        } else {
          return itm;
        }
      });
      let c = await Promise.all(newAssigned);
      console.log(c);
      batch.assigned = c.filter((itm) => {
        if (itm.date === d && itm.time === t) {
          console.log("ASSA");
        } else {
          return itm;
        }
      });
      await batch.save();
    })
  );
  await Job.deleteMany({ date: d, time: t });
});
