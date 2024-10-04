const   mongoose  = require("mongoose");



// const wishlistRouteSchema=mongoose.Schema({
//     userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
//     collectionOfProduct:{type:Object, required:true},
//     // collectionOfWishlistProduct:{type:Object,required:false},
//     wishlistTitle:{type:String,required:true}
    

// })
// module.exports = mongoose.model('WishlistFolder', wishlistRouteSchema);const mongoose = require('mongoose');

const wishlistProductSchema = new mongoose.Schema({
    wishlistId: { type: mongoose.Schema.Types.ObjectId, ref: "Wishlist", required: false },
    collection:{type:mongoose.Schema.Types.ObjectId,ref:"Prouduct",required:false}
    // You can add more fields specific to the wishlist product here
});

const wishlistRouteSchema =new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collectionOfProducts: [wishlistProductSchema], // Array of wishlist products
    wishlistTitle: { type: String, required: true },
    collectionType:{type:String,enum:["wishlistId","collection"],default:false}
});

// module.exports = mongoose.model('WishlistFolder', wishlistRouteSchema);

const WishlistFolder = mongoose.model('WishlistFolder', wishlistRouteSchema);

module.exports = WishlistFolder;