const mongoose = require('mongoose');
const Review = require('./Reviews');

const variantSchema = new mongoose.Schema({
      size: String,
      color: String,
      inventoryQuantity: Number,
      price: Number
    });

const productSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
    name: {
        type: String,
        required: true
    },
    
    price: {
        type: String,
        required: false,
      
    },
    slug: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
   
    
   
    images: [{
        type: Object,
        required: true
    }],
    firstImage:{type:Object, required:false},
    
color: {
    type: Array, // Array of strings
    required: true,
     // Default empty array if not provided
},

variants: [variantSchema]

 ,
    rating: {
        type: String,
        default: "0.00"
    },
    reviews: {type:String,required:false,default:"0"},
    wishlist: {
        type: Boolean,
        default: false
    },
    isAproved: {
        type: Boolean,
        default: false
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isNewArrivel:{type:Boolean,default:true}
   
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

