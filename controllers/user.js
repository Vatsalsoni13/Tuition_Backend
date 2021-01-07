const express = require("express");
const User = require("../models/User");

exports.addUser = async (req, res) => {
  const { name, email, qualification, location, phone } = req.body;
  let user = {};
  user.name = name;
  user.email = email;
  user.qualification = qualification;
  user.location = location;
  user.phone = phone;
  user.createdBatches = [];
  user.enrolledBatches = [];
  let newUser = new User(user);
  await newUser.save();

  res.json(newUser);
};

// 5ff5ff895373573eecd7bbfd tej
// 5ff5ffb75373573eecd7bbfe
