const mongoose = require("mongoose");

const assignment = new mongoose.Schema({
  path: {
    type: String,
  },
  fileName: {
    type: String,
  },
  name: {
    type: String,
  },
  batchId: {
    type: String,
  },
  istDateTime: {
    type: String,
  },
  responses: [],
});

module.exports = Assignment = mongoose.model("assignment", assignment);
