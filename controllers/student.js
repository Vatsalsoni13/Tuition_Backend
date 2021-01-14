const express = require("express");
const User = require("../models/User");
const Batch = require("../models/Batch");
const Assignment = require("../models/Assignment");

exports.getSearchBatches = async (req, res) => {
  const { std, subject } = req.query;
  console.log(std, subject);
  try {
    let batches;
    if (std !== "ALL" && subject !== "ALL") {
      batches = await Batch.find({
        "info.std": std,
        "info.subject": subject,
      });
    } else if (std === "ALL" && subject !== "ALL") {
      batches = await Batch.find({
        "info.subject": subject,
      });
    } else if (subject === "ALL" && std !== "ALL") {
      batches = await Batch.find({
        "info.std": std,
      });
    } else {
      batches = await Batch.find();
    }
    res.json(batches);
  } catch (error) {
    res.json({ message: error });
  }
};

exports.enrollBatch = async (req, res) => {
  const { studentId, batchId } = req.query;
  try {
    let batch = await Batch.findById(batchId);
    batch.students.push({ _id: studentId });
    try {
      await batch.save();
    } catch (error) {
      res.json({ message: error });
    }
    let user = await User.findById(studentId);
    user.enrolledBatches.push({ batchId: batchId });
    console.log(user, "THIS is user");
    try {
      await user.save();
    } catch (error) {
      res.json({ message: error });
    }
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};

exports.getEnrolledBatches = async (req,res) =>{
    const {studentId} = req.query;
    try {
    let user = await User.findById(studentId);
    let batches=user.enrolledBatches.map(async (batch)=>{
      let cur= await Batch.findById(batch.batchId);
      return cur;
    })
    const allBatches = await Promise.all(batches)
    res.json(allBatches);
    } catch (error) {
      console.log(error);
    }
}

exports.postResponse = async (req,res) =>{
  const {path,istDateTime,name,assignId,studentId} = req.body;
  try {
    let assignment = await Assignment.findById(assignId);
    console.log(assignment);
    assignment.responses.push({path:path,istDateTime:istDateTime,name:name,studentId:studentId});
    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.json({message:"Reponse Failed"});
  }
}
exports.deleteResponse = async (req,res) =>{
  const {assignId,studentId}=req.query;
  try {
    let assignment = await Assignment.findById(assignId);
    let response={}
    let newResponses=assignment.responses.filter(element => {
      if(element.studentId === studentId)
      { 
        response=element;
        console.log("Removed");
      }
      else
      {
        return element;
      }
    });
    assignment.responses = newResponses;
    await assignment.save();
    res.json(response);
  } catch (error) {
    res.json({message:error});
  }
}
exports.getResponse = async (req,res) =>{
  const {assignId,studentId}=req.query;
  try {
    let assignment = await Assignment.findById(assignId);
    let response={}
    assignment.responses.forEach(element => {
      if(element.studentId === studentId)
      {
        response=element;
      }
    });
    console.log(response);
    res.json(response)
  } catch (error) {
    res.json({message:error});
  }
}


exports.getAllAssignments = async (req,res) =>{
  const {studentId}=req.query;
  let student = await User.findById(studentId);
  let assignments=[];
  try {

    let len=student.enrolledBatches.length;
    console.log(len);
    let i;
    for(i=0;i<len;i++)
    {
        let batch=student.enrolledBatches[i];
       
        let batchAssign=await Assignment.find({"batchId":batch.batchId});
        console.log(batchAssign);
        assignments.push(...batchAssign);
    }
    let newAssignments = assignments.map((item)=>{

      let asign={};
      asign.name=item.name;
      asign.istDateTime=item.istDateTime;
      asign.path=item.path;
      asign.assignId=item._id;
      return asign;
    })
    console.log(newAssignments);
    res.json(newAssignments);
  } catch (error) {
    res.json({message:error}); 
  }
}
