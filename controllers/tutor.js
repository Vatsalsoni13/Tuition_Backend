const express = require("express");
const User = require("../models/User");
const Batch = require("../models/Batch");
const Assignment = require("../models/Assignment");
const { Mongoose } = require("mongoose");

exports.getSingleBatch = async (req, res) => {
  const { batchId } = req.query;
  try {
    let batch = await Batch.findById(batchId);
    let len = batch.students.length;
    let i;
    for (i = 0; i < len; i++) {
      let student = await User.findById(batch.students[i]);
      batch.students[i] = { name: student.name, email: student.email };
    }
    let owner = await User.findById(batch.userId);
    let own = {};
    own.name = owner.name;
    own.qualification = owner.qualification;
    own.phone = owner.phone;
    own.email = owner.email;
    own.location = owner.location;
    res.json({ batch: batch, owner: own });
  } catch (error) {
    res.json({ message: "BATCH NOT FOUND" });
  }
};

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
    assigned: [],
  };

  try {
    let newBatch = Batch(batch);
    await newBatch.save();

    let user = await User.findById(userId);
    user.createdBatches.push({ batchId: newBatch._id.toString() });
    await user.save();
    const assign = {
      batchId: newBatch._id,
      assigned: [],
      assignments: [],
    };
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

exports.getBatchAssignments = async (req, res) => {
  const { batchId } = req.query;
  try {
    let assignments = await Assignment.find({ batchId: batchId });
    let newAssignments = assignments.map((item) => {
      let asign = {};
      asign.name = item.name;
      asign.istDateTime = item.istDateTime;
      asign.path = item.path;
      asign.assignId = item._id;
      asign.fileName = item.fileName;
      return asign;
    });
    res.json(newAssignments);
  } catch (error) {
    res.json({ message: error });
  }
};

exports.getAssignmentResponses = async (req, res) => {
  const { assignId, batchId } = req.query;
  try {
    let assignment = await Assignment.findById(assignId);
    let len = assignment.responses.length;
    let i;
    let submitted = new Map();
    for (i = 0; i < len; i++) {
      let student = await User.findById(assignment.responses[i].studentId);
      assignment.responses[i].email = student.email;
      assignment.responses[i].studentName = student.name;
      submitted.set(assignment.responses[i].studentId, 1);
    }
    let batch = await Batch.findById(batchId);
    let notSubmitted = [];
    len = batch.students.length;
    for (i = 0; i < len; i++) {
      if (!submitted.has(batch.students[i]._id)) {
        let student = await User.findById(batch.students[i]._id);
        notSubmitted.push({ email: student.email, studentName: student.name });
      }
    }
    let response = {};
    response.submitted = assignment.responses;
    response.notSubmitted = notSubmitted;
    res.json(response);
  } catch (error) {
    res.json({ message: error });
  }
};

exports.schedule = async (req, res) => {
  const { batchId } = req.query;
  // console.log(req.body);
  try {
    await Batch.findByIdAndUpdate(
      { _id: batchId },
      { $push: { lectures: req.body } },
      { new: true },
      (err, detail) => {
        if (err) {
          return res.status(400).json({
            error: "Insert unsuccessful",
          });
        }
        res.json(detail);
      }
    );
  } catch (error) {
    console.log(error);
  }
};
