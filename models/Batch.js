const mongoose = require("mongoose");

const batch = new mongoose.Schema({
  userId: {
    type: String, // the one who created this batch
  },
  info: {
    title: {
      type: String,
      require: true,
    },
    std: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    subject: {
      type: String,
      require: true,
    },
    fees: {
      type: String,
      default: null,
    },
    date_of_begin: {
      type: Date,
      default: Date.now,
    },
    expire_date: {
      type: Date,
      default: Date.now,
    },
  },
  intake: {
    type: Number,
    default: 10,
  },
  students: [],
  assigned:[]
});

module.exports = Batch = mongoose.model("batch", batch);
