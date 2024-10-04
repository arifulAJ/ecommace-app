
const mongoose = require('mongoose');

// Define the location schema
const commentSchema = new mongoose.Schema({
    reviewId: { type: mongoose.Schema.ObjectId, ref: 'Review', required: false },
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: false },
    comment:{type:String, required:false},

  
},{ timestamps: true },);



const Comment = mongoose.model('Comment', commentSchema);
module.exports=Comment