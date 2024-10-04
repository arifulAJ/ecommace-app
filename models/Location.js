const mongoose = require('mongoose');

// Define the location schema
const locationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: false },
  latitude: {
    type: Number,
    required: true,
   
  },
  longitude: {
    type: Number,
    required: true,
   
  }
},{ timestamps: true },);



const Location = mongoose.model('Location', locationSchema);
module.exports=Location