
const mongoose  = require("mongoose");


const deliveryChargeSchema=new mongoose.Schema({
  delivaryFee:{type:String,default:'0.00'},
  chargeFee:{type:String,default:'0.00'}
    


},
{timestamps:true})
const DeliveryCharge=mongoose.model('DeliveryCharge',deliveryChargeSchema)
module.exports =DeliveryCharge