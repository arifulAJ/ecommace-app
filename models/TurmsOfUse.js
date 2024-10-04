

const mongoose = require('mongoose');

// Define the schema for the review model
const termsOfUseSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User", required:false},
    privacypolicyDroperDriver:{type:String,required:true},
    otherPolicyDroperDriver:{type:String,required:true},
 
});

// Create the review model
const TermsOfUse = mongoose.model('TermsOfUse', termsOfUseSchema);

module.exports = TermsOfUse;