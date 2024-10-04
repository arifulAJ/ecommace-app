const mongoose = require('mongoose');



// Define the Order schema
const OrderSchema = new mongoose.Schema({
    orderId:{type:String,required:true},
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    boutiqueId:{type:mongoose.Schema.Types.ObjectId, ref:"User",required:true},
    orderItems:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'OrderItem',
       required:false
    },
    totalAmount: { 
        type: String, 
        required: true 
    },
    serviceFee:{type:String,required:true},
    shippingFee:{type:String,required:true},
    tips:{type:String,required:true},
    tax:{type:String,required:true},
    subTotal:{type:String,required:true},
    status: { 
        type: String, 
        enum: ['neworder', 'inprogress', 'assigned', 'delivered', 'cancelled'], 
        default: 'neworder' 
    },
    deliveryAddress: { 
        type: String, 
        required: true 
    }, 
    paymentMethod: { 
        transectionId:{type:String,required:true},
        methodName:{type:String,required:true} 
    },
    assignedDriverProgress:{type:String,enum:["newOrder","inprogress","deliveried","cancelled"],default:null},
    assignedDrivertrack:{type:String,enum:["waytoPickup","arrivedtheStore","orderPicked","waytodeliver","arrivedAtLocation","orderDelivered","onsuccess"],default:null},
   orderDeliveriedTime:{type:String,required:false},
   orderStart:{type:String,required:false},
   orderEnd:{type:String,required:false},

    assignedDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null // Default value is null
    },
    createdAt: { 
        type: Date, 
        default: Date
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// // Define a virtual field to calculate the total quantity of items in the order
// OrderSchema.virtual('totalItems').get(function() {
//     return this.items.reduce((total, item) => total + item.quantity, 0);
// });

// // Define a pre-save hook to update the 'updatedAt' field
// OrderSchema.pre('save', function(next) {
//     this.updatedAt = new Date();
//     next();
// });

// Create the Order model
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
