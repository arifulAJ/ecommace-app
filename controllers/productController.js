
const pagination = require("../helpers/pagination");
const Response = require("../helpers/response");
const Category = require("../models/Category");
const Location = require("../models/Location");
const Product = require("../models/Product");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const slugify = require('slugify');

const Notifaction = require("../models/Notifaction");


// this is our without none category 
// const productCreate = async (req, res, next) => {
//   const { productName, category, color, price, variants } = req.body;
//   const { productImage1 } = req.files;

//   if (!productImage1) {
//     return res
//       .status(404)
//       .json(Response({ statusCode: 404, message: 'Image is missing', status: 'Failed' }));
//   }

//   let parsedVariants;
//   let parsedColor;

//   try {
//     parsedVariants = JSON.parse(variants);
//     parsedColor = JSON.parse(color);
//   } catch (error) {
//     return res
//       .status(400)
//       .json(Response({ statusCode: 400, message: 'Invalid JSON format for variants or color', status: 'Failed' }));
//   }

//   if (!productName || !parsedColor || !category || !Array.isArray(parsedVariants)) {
//     return res
//       .status(404)
//       .json(
//         Response({
//           statusCode: 404,
//           message: 'Missing required fields or invalid format',
//           status: 'Failed',
//         })
//       );
//   }

//   const files = [];
//   if (req.files) {
//     productImage1.forEach((productImage1) => {
//       const publicFileUrl = `/images/users/${productImage1.filename}`;
//       files.push({
//         publicFileUrl,
//         path: productImage1.filename,
//       });
//     });
//   }

//   console.log(files,"------------------------------");

//   const tokenWithBearer = req.headers.authorization;
//   let token;

//   if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//     token = tokenWithBearer.slice(7);
//   }

//   if (!token) {
//     return res
//       .status(401)
//       .json(Response({ statusCode: 401, message: 'Token is missing.', status: 'Failed' }));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     if (decoded.role !== 'boutique') {
//       return res
//         .status(403)
//         .json(
//           Response({
//             statusCode: 403,
//             message: 'You are not authorized to create products.',
//             status: 'Failed',
//           })
//         );
//     }

//     const categoryDoc = await Category.findOne({ name: category });

//     if (!categoryDoc) {
//       return res
//         .status(404)
//         .json(Response({ statusCode: 404, message: 'Category not found', status: 'Failed' }));
//     }

//     let validSizesPattern;
//     if (categoryDoc.sizeType === 'numeric') {
//       validSizesPattern = /^[0-9]+$/;
//     } else if (categoryDoc.sizeType === 'alphabet') {
//       validSizesPattern = /^(S|M|L|XL|XXL|XXXL|X|x|s|m|l|xl|xxl|xxxl)$/;
//     } else {
//       return res
//         .status(400)
//         .json(
//           Response({
//             statusCode: 400,
//             message: `Invalid sizeType '${categoryDoc.sizeType}'`,
//             status: 'Failed',
//           })
//         );
//     }

//     for (const variant of parsedVariants) {
//       if (!validSizesPattern.test(variant.size)) {
//         return res
//           .status(400)
//           .json(
//             Response({
//               statusCode: 400,
//               message: `Invalid size '${variant.size}' for sizeType '${categoryDoc.sizeType}'`,
//               status: 'Failed',
//             })
//           );
//       }
//     }

//     const slug = slugify(productName, { lower: true });
//     const newProduct = new Product({
//       userId: decoded._id,
//       name: productName,
//       category: category,
//       color: parsedColor,
//       variants: parsedVariants,
//       price: price,
//       images: files,
//       firstImage: files[0],
//       slug: slug,
//       isApproved: false, // Product is initially not approved
//       isNewArrival: true,
//     });

//     const savedProduct = await newProduct.save();

//     setTimeout(async () => {
//       await Product.findByIdAndUpdate(savedProduct._id, { $set: { isNewArrival: false } });
//     }, 5 * 60 * 1000); // 5 minutes in milliseconds

 
// const user=await User.findById(decoded._id)
// const data={
//   productId:savedProduct._id,
//   isParoved:"pending",
//   title:"product added",
//   message:` ${user.name} has added a product , would you like to approve? `,
//   role:"admin",
//   type:"product"
// }
// const addNotifaction=await Notifaction.create(data)
//     res
//       .status(200)
//       .json(
//         Response({
//           statusCode: 200,
//           status: 'OK',
//           message: `Hi ${user.name}, your product uploded successfully. Waiting for admin approval.`,
//           data: { savedProduct },
//         })
//       );
//   } catch (error) {
//     console.log('Error in productCreate controller:', error);
//     return res
//       .status(500)
//       .json(
//         Response({ statusCode: 500, message: error.message, status: 'Server Error' })
//       );
//   }
// };




// this work for done for the fead back i will do it later
// Function to add a product


// product show by user 

// this is with none category
const productCreate = async (req, res, next) => {
  const { productName, category, color, price, variants } = req.body;
  const { productImage1 } = req.files;

  if (!productImage1) {
    return res
      .status(404)
      .json(Response({ statusCode: 404, message: 'Image is missing', status: 'Failed' }));
  }

  let parsedVariants;
  let parsedColor;

  try {
    parsedVariants = JSON.parse(variants);
    parsedColor = JSON.parse(color);
  } catch (error) {
    return res
      .status(400)
      .json(Response({ statusCode: 400, message: 'Invalid JSON format for variants or color', status: 'Failed' }));
  }

  if (!productName || !parsedColor || !category || !Array.isArray(parsedVariants)) {
    return res
      .status(404)
      .json(
        Response({
          statusCode: 404,
          message: 'Missing required fields or invalid format',
          status: 'Failed',
        })
      );
  }

  const files = [];
  if (req.files) {
    productImage1.forEach((productImage) => {
      const publicFileUrl = `/images/users/${productImage.filename}`;
      files.push({
        publicFileUrl,
        path: productImage.filename,
      });
    });
  }

  const tokenWithBearer = req.headers.authorization;
  let token;

  if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
    token = tokenWithBearer.slice(7);
  }

  if (!token) {
    return res
      .status(401)
      .json(Response({ statusCode: 401, message: 'Token is missing.', status: 'Failed' }));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.role !== 'boutique') {
      return res
        .status(403)
        .json(
          Response({
            statusCode: 403,
            message: 'You are not authorized to create products.',
            status: 'Failed',
          })
        );
    }

    // const categoryDoc = await Category.findOne({ name: category });

    // if (!categoryDoc) {
    //   return res
    //     .status(404)
    //     .json(Response({ statusCode: 404, message: 'Category not found', status: 'Failed' }));
    // }

    // let validSizesPattern;
    // console.log(categoryDoc.name);

    // // Skip size validation if category is 'none'
    // if (categoryDoc.sizeType !== 'none') {
    //   if (categoryDoc.sizeType === 'numeric') {
    //     validSizesPattern = /^[0-9]+$/;
    //   } else if (categoryDoc.sizeType === 'alphabet') {
    //     validSizesPattern = /^(S|M|L|XL|XXL|XXXL|X|x|s|m|l|xl|xxl|xxxl)$/;
    //   }
    //    else {
    //     return res
    //       .status(400)
    //       .json(
    //         Response({
    //           statusCode: 400,
    //           message: `Invalid sizeType '${categoryDoc.sizeType}'`,
    //           status: 'Failed',
    //         })
    //       );
    //   }

    //   for (const variant of parsedVariants) {
    //     if (!validSizesPattern.test(variant.size)) {
    //       return res
    //         .status(400)
    //         .json(
    //           Response({
    //             statusCode: 400,
    //             message: `Invalid size '${variant.size}' for sizeType '${categoryDoc.sizeType}'`,
    //             status: 'Failed',
    //           })
    //         );
    //     }
    //   }
    // }

    const slug = slugify(productName, { lower: true });
    const newProduct = new Product({
      userId: decoded._id,
      name: productName,
      category: category,
      color: parsedColor,
      variants: parsedVariants,
      price: price,
      images: files,
      firstImage: files[0],
      slug: slug,
      isApproved: false, // Product is initially not approved
      isNewArrival: true,
    });

    const savedProduct = await newProduct.save();

    setTimeout(async () => {
      await Product.findByIdAndUpdate(savedProduct._id, { $set: { isNewArrival: false } });
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    const user = await User.findById(decoded._id);
    const data = {
      productId: savedProduct._id,
      isApproved: "pending",
      title: "Product added",
      message: `${user.name} has added a product, would you like to approve?`,
      role: "admin",
      type: "product",
    };
    const addNotification = await Notifaction.create(data);

    res
      .status(200)
      .json(
        Response({
          statusCode: 200,
          status: 'OK',
          message: `Hi ${user.name}, your product uploaded successfully. Waiting for admin approval.`,
          data: { savedProduct },
        })
      );
  } catch (error) {
    console.log('Error in productCreate controller:', error);
    // next(error)
    return res
      .status(500)
      .json(
        Response({ statusCode: 500, message: error.message, status: 'Server Error' })
      );
  }
};


// const showProductByUser=async(req,res,next)=>{

//      // Get the token from the request headers
//      const tokenWithBearer = req.headers.authorization;
//      let token;
 
//      if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//          // Extract the token without the 'Bearer ' prefix
//          token = tokenWithBearer.slice(7);
//      }
 
//      if (!token) {
//          return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
//      }
 
//      try {
//          // Verify the token
//          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
 
        
 

//          const allProductForUser = await Product.find({userId: decoded._id });
       

//         // const sumOfRatings = allProductForUser.reduce((total, review) => total + parseInt(review.rating), 0);
//         // // Calculate the average rating
//         // const averageRating = sumOfRatings / allProductForUser.length;

        
//            // For demonstration purposes, I'm just sending a success response
//         res.status(200).json(Response({ statusCode: 200, status: "ok", message: "showed all product for the boutique",data:allProductForUser }));
//     } catch (error) {
//         console.log(error);
//         // Handle any errors
//         return res.status(500).json(Response({ statusCode: 500, message:error.message,status:'server error' }));
//     }


// }
const showProductByUser = async (req, res, next) => {
  // Get the token from the request headers
  const tokenWithBearer = req.headers.authorization;
  let token;

  if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
      // Extract the token without the 'Bearer ' prefix
      token = tokenWithBearer.slice(7);
  }

  if (!token) {
      return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
  }

  try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Fetch all valid categories from your Category collection
      const validCategories = await Category.find().select('name');
      const validCategoryNames = validCategories.map(category => category.name);

      console.log(validCategories,validCategoryNames);

      // Fetch all products for the user
      const allProductForUser = await Product.find({ userId: decoded._id,isDelete:false });

      // Filter out products with categories that do not exist in the valid categories list
      const filteredProducts = allProductForUser.filter(product => validCategoryNames.includes(product.category));

      // Send filtered products in response
      res.status(200).json(Response({
          statusCode: 200,
          status: "ok",
          message: "Filtered products based on valid categories",
          data: filteredProducts
      }));
  } catch (error) {
      console.log(error);
      // Handle any errors
      return res.status(500).json(Response({
          statusCode: 500,
          message: error.message,
          status: 'server error'
      }));
  }
};

const allProducts = async (req, res, next) => {
  // for pagination 
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Extract filtering criteria from the query parameters
  const { categories, minPrice, maxPrice } = req.query;
 

  try {
    // Fetch the list of blocked user IDs
    const blockedUsers = await User.find({ isBlocked: true }).distinct('_id');

    // Construct the query object
    let query = {
      isAproved: true,
      isDelete:false,
      userId: { $nin: blockedUsers } // Exclude products with blocked user IDs
    };

    // If categories are provided, filter products by those categories
    // If categories are provided, filter products by those categories
    if (categories) {
      // Parse the categories JSON string into an array
      const categoryArray = JSON.parse(categories);
      console.log(categoryArray);
      query.category = { '$in': categoryArray };
    }

    // If price range is provided, filter products by price within the variants array
    if (minPrice || maxPrice) {
      query['variants.price'] = {};
      if (minPrice) query['variants.price'].$gte = parseFloat(minPrice);
      if (maxPrice) query['variants.price'].$lte = parseFloat(maxPrice);
    }
    console.log(query,"_)");
    // Count the total number of products matching the query
    const productsLength = await Product.find(query).countDocuments();

    // If no products are found, return a 404 error
    if (productsLength === 0) {
      return res.status(404).json(Response({ statusCode: 404, message: 'No products found.', status: 'failed' }));
    }

    // Fetch the products that match the query, including pagination and sorting
    const products = await Product.find(query)
      .populate("userId")
      .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
      .skip((page - 1) * limit)
      .limit(limit);

    // Create the pagination object
    const paginationOfProduct = pagination(productsLength, limit, page);

    // Send a success response with the products and pagination data
    res.status(200).json(Response({
      statusCode: 200,
      status: "ok",
      message: "Products retrieved successfully",
      data: products,
      pagination: paginationOfProduct
    }));

  } catch (error) {
    console.log('Error in allProducts controller:', error);
    // Handle any errors
    return res.status(500).json(Response({
      statusCode: 500,
      message: error.message,
      status: 'server error'
    }));
  }
};



// show product by searching comand
// const searchProduct = async (req, res, next) => {
//   // For pagination
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const searchQuery = req.query.search || '';

//   try {
//      // If no search query is provided
//      if (!searchQuery) {
//       return res.status(404).json(Response({
//           statusCode: 404,
//           status: 'failed',
//           message: 'You did not select any product name to search.'
//       }));
//   }
//       // Build the search condition
//       const searchCondition = searchQuery
//           ? { isAproved: true, name: { $regex: new RegExp('^' + searchQuery, 'i') } }
//           : { isAproved: true };

//       const productsLength = await Product.find(searchCondition).countDocuments();

//       // If no products are found
//       if (productsLength === 0) {
//           return res.status(404).json(Response({ statusCode: 404, message: 'No products found.', status: 'failed' }));
//       }

//       const products = await Product.find(searchCondition)
//           .populate("userId")
//           .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
//           .skip((page - 1) * limit)
//           .limit(limit);

//       const paginationOfProduct = pagination(productsLength, limit, page);

//       // Send success response with data
//       res.status(200).json(Response({
//           statusCode: 200,
//           status: "ok",
//           message: "Products retrieved successfully",
//           data: products,
//           pagination: paginationOfProduct
//       }));
//   } catch (error) {
//       console.log(error);
//       // Handle any errors
//       return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));
//   }
// };


// show all serch by boutiq and product anme

// const searchProduct = async (req, res, next) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const searchQuery = req.query.search || ''; // Search by boutique name

//   try {
//     // If no search query is provided
//     if (!searchQuery) {
//       return res.status(404).json({
//         statusCode: 404,
//         status: 'failed',
//         message: 'You did not provide any boutique name to search.',
//       });
//     }

//     // Build the search condition to search for boutique name
//     const searchCondition = { isAproved: true }; // Ensure products are approved

//     // Find the products by searching boutique name (userId.name)
//     const products = await Product.find(searchCondition)
//       .populate({
//         path: 'userId', // Populate the user details
//         match: { name: { $regex: new RegExp(searchQuery, 'i') } }, // Match boutique name using regex
//       })
//       .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
//       .skip((page - 1) * limit)
//       .limit(limit);

//     // Filter out products with no matched user (no matched boutique)
//     const filteredProducts = products.filter((product) => product.userId);

//     // Count the number of matched products
//     const productsLength = filteredProducts.length;

//     // If no products are found
//     if (productsLength === 0) {
//       return res.status(404).json({
//         statusCode: 404,
//         status: 'failed',
//         message: 'No products found for the specified boutique name.',
//       });
//     }

//     const paginationOfProduct = pagination(productsLength, limit, page);

//     // Send success response with data
//     res.status(200).json({
//       statusCode: 200,
//       status: 'ok',
//       message: 'Products retrieved successfully',
//       data: filteredProducts,
//       pagination: paginationOfProduct,
//     });
//   } catch (error) {
//     console.log(error);
//     // Handle any errors
//     return res.status(500).json({
//       statusCode: 500,
//       status: 'server error',
//       message: error.message,
//     });
//   }
// };

const searchProduct = async (req, res, next) => {
  // For pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const searchQuery = req.query.search || '';

  try {
     // If no search query is provided
     if (!searchQuery) {
      return res.status(404).json(Response({
          statusCode: 404,
          status: 'failed',
          message: 'You did not select any product name to search.'
      }));
  }
      // Build the search condition
      const searchCondition = searchQuery
          ? { isVerified: true,role:"boutique", name: { $regex: new RegExp('^' + searchQuery, 'i') } }
          : { isVerified: true };

      const productsLength = await User.find(searchCondition).countDocuments();

      // If no products are found
      if (productsLength === 0) {
          return res.status(404).json(Response({ statusCode: 404, message: 'No products found.', status: 'failed' }));
      }

      const products = await User.find(searchCondition)
        
          .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
          .skip((page - 1) * limit)
          .limit(limit);

      const paginationOfProduct = pagination(productsLength, limit, page);

      // Send success response with data
      res.status(200).json(Response({
          statusCode: 200,
          status: "ok",
          message: "Products retrieved successfully",
          data: products,
          pagination: paginationOfProduct
      }));
  } catch (error) {
      console.log(error);
      // Handle any errors
      return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));
  }
};


const showProductByCategory = async (req, res, next) => {
  // For pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
      const category = req.params.category;
      let products = [];
      let totalProducts = 0;

      // Fetch products in the specified category that are approved
      const productsInCategory = await Product.find({
          isAproved: true,
          category: category,
          isDelete:false
      }).populate('userId', 'name image isBlocked');
      
      console.log(category,"+++++++++++++++++++++++");
      // Filter out products with blocked users
      const unblockedProductsInCategory = productsInCategory.filter(product => !product.userId.isBlocked);
      totalProducts = unblockedProductsInCategory.length;
      
      // If no products found, return a 404 response
      if (totalProducts === 0) {
          return res.status(404).json({
              status: "failed",
              statusCode: 404,
              message: `The category '${category}' does not have any products available.`,
              data: [],
              pagination: null,
          });
      }
      // Check if the requested page number exceeds the total number of pages
      if (page > totalProducts) {
        return res.status(404).json({
            status: "failed",
            statusCode: 404,
            message: `Page number ${page} exceeds the total number of pages ().`,
            data: [],
           
        });
    }

      // Implement pagination
      const startIndex = (page - 1) * limit;
      products = unblockedProductsInCategory.slice(startIndex, startIndex + limit);
      
      // Calculate pagination using the provided `paginationOfProduct` function
      const paginationOf = pagination(totalProducts, limit, page);

      // Response
      res.status(200).json(Response({
          message: "Retrieved products successfully by category",
          data: products,
          statusCode:200,
          pagination: paginationOf,
      }));

  } catch (error) {
      // Handle any errors
      return res.status(500).json(Response({
          statusCode: 500,
          status: 'server error',
          
          message: error.message,
      }));
      
  }
};

const ProductDetails=async(req,res,next)=>{

   
    
    try {
      const { id,size } = req.query;
      console.log(id);

        const product=await Product.findById(id).populate('userId');

           // Find the variant with the specified size
    const variant = product.variants.find(v => v.size === size);
    product.price=variant.price
    const userId = product.userId._id;
    const user = await Location.findOne({ userId }).populate("userId")
    console.log(product,user,"===============================");

      return  res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Product show successfully",data:{product,boutiqueLocation:user} }));
    } catch (error) {
         // Handle any errors
        //  next(error)
         return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));
        
    }

}



const showProductByUserId=async(req,res,next)=>{
    const id=req.params.id
    // for pagination 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
    
    try {
        const user=await User.findById(id)
        if(!user){
          return  res.status(400).json(Response({ statusCode: 404, status: "bad request", message: "user not found", }));
        }
        const boutiqueUser={
            name:user.name,
            image:user.image,
            description:user.description,
            rating:user.rating,


        }
       
        const totalProducts = await Product.find({ userId: id,isDelete:false }).countDocuments();
        // const totalPages = Math.ceil(totalProducts / perPage);
        const productOfUpdate = await Product.find({ userId: id,isDelete:false })

// Filter out products with ratings (excluding those with rating "0")
const ratedProducts = productOfUpdate.filter(product => product.rating !== '0');

// Calculate total rating and count of rated products
let totalRating = 0;
let ratedProductCount = 0;
for (const productOfUpdate of ratedProducts) {
    totalRating += parseFloat(productOfUpdate.rating);
    ratedProductCount++;
}


// Calculate average rating
const averageRating = ratedProductCount > 0 ? totalRating / ratedProductCount : 0;
// Convert average rating to a floating-point number with one decimal place
const formattedRating = parseFloat(averageRating.toFixed(2));
// Update user's rating
 user.rating = formattedRating;

await user.save();

        const products = await Product.find({ userId: id,isDelete:false }).populate('userId','name , image')
            .skip((page - 1) * limit)
            .limit(limit);

            


            if(totalProducts===0){
             return res.status(404).json(Response({ statusCode: 404, status: "bad request", message: "product not found", }));

            }
            // call the pagination

            const paginationOfProduct= pagination(totalProducts,limit,page)
          return  res.status(200).json(Response({
                message: "Events retrieved successfully",
                data: {boutiqueUser,products},
                pagination: paginationOfProduct
            }));
            
    } catch (error) {
       // Handle any errors
       return res.status(500).json(Response({ statusCode: 500, message:error.message,status:'server error' })); 
         
    }
}


const updatedTheProduct = async (req, res, next) => {
  const { productId } = req.params; // Get the product ID from the route parameters
  const { productName, category, color, price, variants } = req.body;
  const { productImage1 } = req.files;

  try {
    // Check if the product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json(
        Response({
          statusCode: 404,
          message: 'Product not found',
          status: 'Failed',
        })
      );
    }

    // Handle image updates
    const files = [];
    if (req.files && productImage1) {
      productImage1.forEach((image) => {
        const publicFileUrl = `/images/users/${image.filename}`;
        files.push({
          publicFileUrl,
          path: image.filename,
        });
      });
    }

    // Parse and validate JSON fields
    let parsedVariants;
    let parsedColor;

    try {
      parsedVariants = variants ? JSON.parse(variants) : existingProduct.variants;
      parsedColor = color ? JSON.parse(color) : existingProduct.color;
    } catch (error) {
      return res.status(400).json(
        Response({
          statusCode: 400,
          message: 'Invalid JSON format for variants or color',
          status: 'Failed',
        })
      );
    }

    // Validate required fields
    if (!productName || !parsedColor || !category || !Array.isArray(parsedVariants)) {
      return res.status(400).json(
        Response({
          statusCode: 400,
          message: 'Missing required fields or invalid format',
          status: 'Failed',
        })
      );
    }

    // Validate the size against the category size type
    const categoryDoc = await Category.findOne({ name: category });

    if (!categoryDoc) {
      return res.status(404).json(
        Response({
          statusCode: 404,
          message: 'Category not found',
          status: 'Failed',
        })
      );
    }

    let validSizesPattern;
    if (categoryDoc.sizeType === 'numeric') {
      validSizesPattern = /^[0-9]+$/;
    } else if (categoryDoc.sizeType === 'alphabet') {
      validSizesPattern = /^(S|M|L|XL|XXL|XXXL|X|x|s|m|l|xl|xxl|xxxl)$/;
    } else {
      return res.status(400).json(
        Response({
          statusCode: 400,
          message: `Invalid sizeType '${categoryDoc.sizeType}'`,
          status: 'Failed',
        })
      );
    }

    for (const variant of parsedVariants) {
      if (!validSizesPattern.test(variant.size)) {
        return res.status(400).json(
          Response({
            statusCode: 400,
            message: `Invalid size '${variant.size}' for sizeType '${categoryDoc.sizeType}'`,
            status: 'Failed',
          })
        );
      }
    }

    // Update product details
    existingProduct.name = productName;
    existingProduct.category = category;
    existingProduct.color = parsedColor;
    existingProduct.variants = parsedVariants;
    existingProduct.price = price;
    existingProduct.images = files.length > 0 ? files : existingProduct.images;
    existingProduct.firstImage = files.length > 0 ? files[0] : existingProduct.firstImage;
    // existingProduct.slug = slugify(productName, { lower: true });
    // existingProduct.isApproved = false; // Set to false to require re-approval after update

    const updatedProduct = await existingProduct.save();

    // Send notification for re-approval
    const data = {
      productId: updatedProduct._id,
      isParoved: "pending",
      title: "Product Updated",
      message: "Boutique has updated a product. Would you like to approve?",
      role: "admin",
      type: "product",
    };
    await Notifaction.create(data);

    res.status(200).json(
      Response({
        statusCode: 200,
        status: 'OK',
        message: 'Product updated successfully. Waiting for admin approval.',
        data: { updatedProduct },
      })
    );
  } catch (error) {
    console.log('Error in productUpdate controller:', error);
    return res.status(500).json(
      Response({
        statusCode: 500,
        message: error.message,
        status: 'Server Error',
      })
    );
  }
};



// filter the product by the filtaring custome

const showFilterProduct = async (req, res) => {
  try {
    // for pagination 
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 10;

    const { categories, minPrice, maxPrice } = req.query;

    // Construct the query object
    let query = {
      isAproved: true,
      isDelete:false
      
    };

    // If categories are provided, filter products by those categories
    if (categories) {
      const categoryArray = categories.split(',').map(cat => cat.trim());
      query.category = { '$in': categoryArray };
    }
    // If price range is provided, filter products by price within the variants array
    if (minPrice || maxPrice) {
      query['variants.price'] = {};
      if (minPrice) query['variants.price'].$gte = parseFloat(minPrice);
      if (maxPrice) query['variants.price'].$lte = parseFloat(maxPrice);
    }

  

    const productslength = await Product.find(query).countDocuments()
    const products = await Product.find(query)
    .skip((page - 1) * limit)
    if (products.length === 0) {
      return res.status(404).json(Response({
        statusCode: 404,
        message: 'No products found matching the criteria',
        status: 'Failed',
      }));
    }

    const paginationOfProduct= pagination(productslength,limit,page)


    res.status(200).json(Response({
      statusCode: 200,
      status: 'OK',
      data: products,
      pagination:paginationOfProduct
    }));
  } catch (error) {
    console.log('Error in showFilterProduct controller:', error);
    return res.status(500).json(Response({
      statusCode: 500,
      message: error.message,
      status: 'Server Error',
    }));
  }
};


// delte product

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.query;
    
    // Check if the user is authorized
    const tokenWithBearer = req.headers.authorization;
    let token;
    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: 'Token is missing.',
            status: 'Failed',
          })
        );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Fetch the product to verify ownership or admin privileges
    const product = await Product.findById(id);
    console.log(product);
    if (!product) {
      return res
        .status(404)
        .json(
          Response({
            statusCode: 404,
            message: 'Product not found.',
            status: 'Failed',
          })
        );
    }

    // Ensure the user deleting the product is either the owner or an admin
    if (product.userId.toString() !== decoded._id && decoded.role !== 'admin') {
      return res
        .status(403)
        .json(
          Response({
            statusCode: 403,
            message: 'You are not authorized to delete this product.',
            status: 'Failed',
          })
        );
    }

    // Delete the product
    await Product.findByIdAndUpdate(id,{isDelete:true},{new:true});

    // You can also delete any related notifications, images, or other associated data here if needed.

    return res
      .status(200)
      .json(
        Response({
          statusCode: 200,
          message: 'Product deleted successfully.',
          status: 'Success',
        })
      );
  } catch (error) {
    console.log('Error in deleteProduct controller:', error);
    return res
      .status(500)
      .json(
        Response({
          statusCode: 500,
          message: 'Server Error. Failed to delete the product.',
          status: 'Failed',
        })
      );
  }
};




module.exports = {
    productCreate,
    showProductByUser,
    allProducts,
    showProductByCategory,
    showProductByUserId
,ProductDetails,
updatedTheProduct,
searchProduct,
showFilterProduct,
deleteProduct
};
