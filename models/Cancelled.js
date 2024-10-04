
const mongoose  = require("mongoose");


const cancelSchema=new mongoose.Schema({
    orderId:{type:mongoose.Schema.ObjectId,ref:"Order",required:true},
    userId:{type:mongoose.Schema.ObjectId,ref:"User",required:true},
    boutiqueId:{type:mongoose.Schema.ObjectId,ref:"User",required:true}
    


})
const Cancelled=mongoose.model('Cancelled',cancelSchema)
module.exports =Cancelled