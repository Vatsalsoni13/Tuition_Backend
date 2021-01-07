const mongoose = require("mongoose");

const user = new mongoose.Schema({
  email: {
    type: String,
  },
  name: {
    type: String,
    default: null,
  },
  qualification: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  createdBatches: [],
  enrolledBatches: [],
});

module.exports = User = mongoose.model("user", user);
