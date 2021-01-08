const express = require("express");
const User = require("../models/User");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: err,
      });
    }
    console.log(user);
    req.profile = user;
    next();
  });
};
exports.getUserByEmail = (req, res, next, email) => {
  User.findOne({ email: email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: err,
      });
    }
    console.log(user);
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  return res.json(req.profile);
};

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
  console.log(user);
  // console.log("ABC");
  res.json(newUser);
};

exports.updateUser = (req, res) => {
  try {
    User.findByIdAndUpdate(
      { _id: req.profile._id },
      { $set: req.body },
      { new: true, useFindAndModify: false },
      (err, user) => {
        if (err) {
          return res.status(400).json({
            error: "Update unsuccessful",
          });
        }
        console.log(user);
        // user.salt = undefined;
        // user.encry_password = undefined;
        // user.updatedAt = undefined;
        // user.createdAt = undefined;
        res.json(user);
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// 5ff5ff895373573eecd7bbfd tej
// 5ff5ffb75373573eecd7bbfe
