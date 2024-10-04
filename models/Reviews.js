const mongoose = require('mongoose');

// Define the schema for the review model
const reviewSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
    ProductId:{type:mongoose.Schema.Types.ObjectId,ref:"Product", required:true},
    
    height: {
        type: String, // Assuming height is in centimeters
        required: false
    },
    weight: {
        type: String, // Assuming weight is in kilograms
        required: false
    },
    reviewImage: [{
        type: Object, // Assuming image URLs are strings
        required: false
    }],
    rating: {
        type: String, // Assuming stars range from 1 to 5
        required: false,
        min: 1,
        max: 5
    },
    reviews: {
        type: String, // Assuming comment is optional
        required:false
    }
},{timestamps:true});

// Create the review model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;


