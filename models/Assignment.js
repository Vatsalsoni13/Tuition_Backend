const mongoose = require("mongoose");

const assignment = new mongoose.Schema({
    path:{
      type:String
    },
    name:{
    type:String      
    },
    batchId: {
        type: String
      } ,
      istTime:{
        type:String
      } ,
      istDate:{
        type:String
      } ,
    responses:[]
});

module.exports = Assignment = mongoose.model("assignment", assignment);
