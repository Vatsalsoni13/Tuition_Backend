const mongoose = require("mongoose");

const job = new mongoose.Schema({
    batchId: {
        type: String
      },
    date:{
        type:String
    },
    time:{
        type:String
    }
});

module.exports = Job = mongoose.model("job", job);
