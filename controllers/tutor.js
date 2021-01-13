const express = require("express");
const User = require("../models/User");
const Batch = require("../models/Batch");
const Assignment = require("../models/Assignment")
const { Mongoose } = require("mongoose");

exports.createBatch = async (req, res) => {
  const {
    title,
    description,
    fees,
    userId,
    subject,
    std,
    date,
    intake,
    exp_date,
  } = req.body;
  // date format shd be yyyy/mm/dd
  //userId should be passed by front only so we should store it in async storage in app itself
  const info = {
    title: title,
    std: std,
    subject: subject,
    description: description,
    fees: fees,
    date_of_begin: new Date(date),
    expire_date: exp_date,
  };
  const batch = {
    userId: userId,
    info: info,
    students: [],
    intake: intake,
    assigned:[]
  };
  
  try {
    let newBatch = Batch(batch);
    await newBatch.save();
    
    let user = await User.findById(userId);
    user.createdBatches.push({ batchId: newBatch._id.toString() });
    await user.save();
    const assign= {
      batchId:newBatch._id,
      assigned:[],
      assignments:[]
    }
    let assignment = Assignment(assign);
    await assignment.save();
    res.json(newBatch);
  } catch (error) {
    res.json({ message: error });
  }
};

exports.getMyBatches = async (req, res) => {
  const { tutorId } = req.query;
  try {
    let batches = await Batch.find({ userId: tutorId });
    res.json(batches);
  } catch (error) {
    res.json({ message: error });
  }
  // const { tutorId } = req.query;
  // try {
  //   let user = await User.findById(tutorId);
  //   let batches = user.createdBatches.map(async (batch) => {
  //     let cur = await Batch.findById(batch.batchId);
  //     return cur;
  //   });
  //   const allBatches = await Promise.all(batches);
  //   res.json(allBatches);
  // } catch (error) {
  //   console.log(error);
  // }
};

exports.getBatchAssignments =  async(req,res) =>{
  const {batchId} = req.query;
  try {
    let assignments = await Assignment.find({batchId:batchId});
    let newAssignments = assignments.map((item)=>{

      let asign={};
      asign.name=item.name;
      asign.istDateTime=item.istDateTime;
      asign.path=item.path;
      asign.assignId=item._id;
      return asign;
    })
    res.json(newAssignments);
  } catch (error) {
    res.json({message:error});
  }
}