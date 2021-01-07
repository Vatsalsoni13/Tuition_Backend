const express = require("express");
const User = require("../models/User");
const Batch = require("../models/Batch");
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
  };
  try {
    let newBatch = Batch(batch);
    await newBatch.save();
    let user = await User.findById(userId);
    user.createdBatches.push({ batchId: newBatch._id.toString() });
    await user.save();
    res.json(newBatch);
  } catch (error) {
    res.json({ message: error });
  }
};

exports.getMyBatches = async (req, res) => {
  const userId = req.params.userId;
  try {
    let batches = await Batch.find({ userId: userId });
    res.json(batches);
  } catch (error) {
    res.json({ message: error });
  }
};
