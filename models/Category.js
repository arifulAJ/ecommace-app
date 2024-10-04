const mongoose = require('mongoose');

// Define the category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  
  
  categoryImage: { type: Object, required: true},
  sizeType:{type:String,enum:["numeric","alphabet","none"]}

  
  
});

// Create the Category model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
