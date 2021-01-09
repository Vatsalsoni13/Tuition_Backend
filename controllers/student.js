const express = require("express");
const User = require("../models/User");
const Batch = require("../models/Batch");

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