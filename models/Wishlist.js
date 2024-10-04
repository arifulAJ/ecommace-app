const   mongoose  = require("mongoose");



const wishlistSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    productId:{type:mongoose.Schema.Types.ObjectId, ref:"Product", required:true},
    // collectionOfWishlistProduct:{type:Object,required:false},
    // wishlistTitle:{type:String,required:false}
    

})
// module.exports = mongoose.model('Wishlist', wishlistSchema);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;