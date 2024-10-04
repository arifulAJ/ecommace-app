
const mongoose = require('mongoose');

// Define the schema for the review model
const supportSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
    email:{type:String,required:true},
    describIssue:{type:String,required:true}
});

// Create the review model
const Support = mongoose.model('Support', supportSchema);

module.exports = Support;