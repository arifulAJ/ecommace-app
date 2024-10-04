
const mongoose = require('mongoose');

// Define the location schema
const likeSchema = new mongoose.Schema({
    reviewId: { type: mongoose.Schema.ObjectId, ref: 'Review', required: false },
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: false },
    isLike:{type:Boolean,default:false},

  
},{ timestamps: true },);



const Like = mongoose.model('Like', likeSchema);
module.exports=Like