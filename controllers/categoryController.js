const Response = require("../helpers/response");
const Category = require("../models/Category");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");

// Create category
const createCategory = async (req, res, next) => {
    

try {
    const { name,} = req.body;
    const {categoryImage} = req.files;
    if(!categoryImage){
        return res.status(404).json(Response({ statusCode: 404, message: 'pleace input image.',status:'faield' }));
    
    
    }

const files = [];
if (req.files) {
    categoryImage.forEach((categoryImage) => {
    const publicFileUrl = `/images/users/${categoryImage.filename}`;
    
    files.push({
      publicFileUrl,
      path: categoryImage.filename,
    });
    // console.log(files);
  });
}

console.log(files,"-------------")

    
// Get the token from the request headers
const tokenWithBearer = req.headers.authorization;
let token;

if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
    // Extract the token without the 'Bearer ' prefix
    token = tokenWithBearer.slice(7);
}

if (!token) {
    return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
}
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);


    // Check if the user has the "boutique" role
    if (decoded.role !== "admin") {
        // If the user does not have the "boutique" role, return an error
        return res.status(403).json(Response({ statusCode: 403, message: 'You are not authorized to create products.',status:'faield' }));
    }
        // Convert the category name to lowercase
        // const lowercaseName = name.toLowerCase();
        // Convert the category name to lowercase and capitalize the first letter
const capitalizeFirstLetter = (name) => {
    if (!name) return ''; // Handle cases where name might be empty or undefined
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };
  
  // Example usage
  const categoryName = capitalizeFirstLetter(name)

  

        // Check if the lowercase category name already exists
        const existingCategory = await Category.findOne({ name:categoryName });
        if (existingCategory) {
            return res.status(400).json(Response({ statusCode: 400, message: 'Category already exists', status: "Failed" }));
        }

        // // Create the category
        const newCategory = await Category.create({name:categoryName,categoryImage:files[0]})

        res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Category created successfully", data: { category: newCategory } }));
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json(Response({ statusCode: 500, message: error.message, status: "Failed" }));
    }
};

// get createCategory
const getallCategory=async(_req,res,_next)=>{
    try {
        const allCatagory=await Category.find()

         res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Product created successfully",data:{allCatagory} }));
    } catch (error) {
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" })); return res.status(500).json("new error")
        
    }

}

// catagory with product image 

const getallCategoryWithProductImage = async (_req, res, _next) => {
    try {
        // Query all products
        const allProducts = await Category.find()

        res.status(200).json(Response({statusCode:200,status:"ok",message:"your category fetched",data:{allProducts}}));
    } catch (error) {
        console.error(error);
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
}


const updateCategory = async (req, res) => {
    try {
        const { id } = req.query; // The category ID from the request parameters
        const { name } = req.body;
        const { categoryImage } = req.files;

        // Find the category by ID
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json(Response({ statusCode: 404, message: 'Category not found', status: 'Failed' }));
        }

        // Check if the new category name is provided and if it's different from the existing one
        if (name && name.toLowerCase() !== category.name.toLowerCase()) {
            const existingCategory = await Category.findOne({ name: name.toLowerCase() });
            if (existingCategory) {
                return res.status(400).json(Response({ statusCode: 400, message: 'Category name already exists', status: 'Failed' }));
            }
            category.name = name.toLowerCase();
        }

        // // Update sizeType if provided
        // if (sizeType) {
        //     category.sizeType = sizeType;
        // }
     

        // Update the category image if a new one is provided
        if (categoryImage) {
            const files = [];
            categoryImage.forEach((image) => {
                const publicFileUrl = `/images/users/${image.filename}`;
                files.push({
                    publicFileUrl,
                    path: image.filename,
                });
            });
            category.categoryImage = files[0]; // Update with the new image
        }

        // Save the updated category
        const updatedCategory = await category.save();

        res.status(200).json(Response({ statusCode: 200, status: 'ok', message: 'Category updated successfully', data: { category: updatedCategory } }));
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'Failed' }));
    }
};


const getCategoryById=async(req,res)=>{
    try {
          
// Get the token from the request headers
const tokenWithBearer = req.headers.authorization;
let token;

if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
    // Extract the token without the 'Bearer ' prefix
    token = tokenWithBearer.slice(7);
}

if (!token) {
    return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
}
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);


    // Check if the user has the "boutique" role
    if (decoded.role !== "admin") {
        // If the user does not have the "boutique" role, return an error
        return res.status(403).json(Response({ statusCode: 403, message: 'You are not authorized to create products.',status:'faield' }));
    }

    const {id}=req.query
        const category=await Category.findById(id)
        res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Category show successfully", data: category }));

    } catch (error) {
        res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'Failed' }));

        
    }
}


const categoryDeleted = async (req, res) => {
    try {
        // Get the token from the request headers
        const tokenWithBearer = req.headers.authorization;
        let token;

        if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
            // Extract the token without the 'Bearer ' prefix
            token = tokenWithBearer.slice(7);
        }

        if (!token) {
            return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'Failed' }));
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Check if the user has the "admin" role
        if (decoded.role !== "admin") {
            // If the user does not have the "admin" role, return an error
            return res.status(403).json(Response({ statusCode: 403, message: 'You are not authorized to delete categories.', status: 'Failed' }));
        }

        // Get the category ID from the request parameters
        const {categoryId} = req.query;

        // Find the category by ID and delete it
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json(Response({ statusCode: 404, message: 'Category not found.', status: 'Failed' }));
        }

        res.status(200).json(Response({ statusCode: 200, message: 'Category deleted successfully.', status: 'Success' }));
    } catch (error) {
        res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'Failed' }));
    }
};



const forFilterCategory = async (req, res) => {
    try {
        // Find distinct categories used in the Product collection
        const usedCategories = await Product.distinct('category');
console.log(usedCategories,"____________");
        // Find only categories that are in the usedCategories array
        const categories = await Category.find({ name: { $in: usedCategories } });

        res.status(200).json(Response({ statusCode: 200, message: 'Success', status: 'Success', data: {allProducts:categories} }));
    } catch (error) {
        res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'Failed' }));
    }
};


module.exports={
    createCategory,
    getallCategory,
    getallCategoryWithProductImage,
    updateCategory,
    getCategoryById,
    categoryDeleted,
    forFilterCategory
    

}