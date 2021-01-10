const mongoose = require("mongoose");

const assignment = new mongoose.Schema({
    batchId: {
        type: String
      },
   assigned:[],
   assignment:[]
});

module.exports = Assignment = mongoose.model("assignment", assignment);
