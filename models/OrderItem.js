const  mongoose= require("mongoose");

const orderItemSchema=new mongoose.Schema({
    orederedProduct:{type:Object,required:true},
    orderId:{type:String,required:false}
})

// Create the Order model
const OrderItem = mongoose.model('OrderItem', orderItemSchema);
module.exports=OrderItem