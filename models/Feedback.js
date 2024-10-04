const   mongoose  = require("mongoose");

// Define the vehicle schema
const feedbackSchema = new mongoose.Schema({
    boutiqueId: { type: mongoose.Schema.ObjectId, ref: 'User', required: false },
   
    title: { type: String, required: true },
    feedbackDescription: { type: String, required: true },
    feedBackImage:{type:Object,required:false,}
  
    
  }, { timestamps: true },
);

  
module.exports = mongoose.model('Feedback', feedbackSchema);
