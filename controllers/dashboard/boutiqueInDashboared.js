const Response = require("../../helpers/response");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const pagination = require("../../helpers/pagination");
const Product = require("../../models/Product");
const Feedback = require("../../models/Feedback");
const Category = require("../../models/Category");
const { default: slugify } = require("slugify");
const Location = require("../../models/Location");

const getAllBoutiqueForAdmin = async (req, res) => {
  try {
    // for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
      // Extract the token without the 'Bearer ' prefix
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "Token is missing.",
            status: "failed",
          })
        );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role !== "admin") {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "you are not admin.",
            status: "faield",
          })
        );
    }

    // if (date) {
    //   const startDate = new Date(date);
    //   const endDate = new Date(date);
    //   endDate.setHours(23, 59, 59, 999); // Set endDate to the end of the specified date

    //   // Add date filter to query
    //   query.createdAt = { $gte: startDate, $lte: endDate };
    // }

    // Initialize query object
    let query = { role: "boutique",isBlocked:false };

    // Check if month and year are provided for filtering
    const { month, year, } = req.query;

    if (month && year) {
      const startDate = new Date(year, month - 1, 1); // Start of the given month
      const endDate = new Date(year, month, 0); // End of the given month
      endDate.setHours(23, 59, 59, 999); // Set endDate to the end of the given month

      // Add date filter to query
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    // Find all shoppers with optional date filter
    const allboutiquelength = await User.find(query).countDocuments()
    const allboutique = await User.find(query)
      .skip((page - 1) * limit) // Pagination: skip previous pages
      .limit(limit) // Limit the number of results per page
      .sort({ createdAt: -1 }); // Sort by creation date descending

      console.log(allboutique);
    if (allboutique.length === 0) {
      return res
        .status(404)
        .json(
          Response({
            statusCode: 404,
            message: "dont have boutique .",
            status: "faield",
          })
        );
    }

    const paginationOfProduct = pagination(allboutiquelength, limit, page);

    return res
      .status(200)
      .json(
        Response({
          statusCode: 200,
          message: "showed shopper succesfully",
          data: allboutique,
          pagination: paginationOfProduct,
        })
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        Response({
          statusCode: 500,
          message: error.message,
          status: "server error",
        })
      );
  }
};


const boutiqueDetails = async (req, res) => {
  try {
    // For pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
      // Extract the token without the 'Bearer ' prefix
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "Token is missing.",
            status: "failed",
          })
        );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role !== "admin") {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "You are not an admin.",
            status: "failed",
          })
        );
    }

    const { id } = req.query;

    // Fetch the user details
    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res
        .status(404)
        .json(
          Response({
            statusCode: 404,
            message: "User not found.",
            status: "failed",
          })
        );
    }

    // Fetch all valid categories from your Category collection
    const validCategories = await Category.find().select('name');
    const validCategoryNames = validCategories.map(category => category.name);

    // Fetch all products for the user
    const allProductForUser = await Product.find({ userId: id,isDelete:false });

    // Filter out products with categories that do not exist in the valid categories list
    const filteredProducts = allProductForUser.filter(product => validCategoryNames.includes(product.category));
    console.log(allProductForUser,validCategoryNames);

    // Prepare the data object
    const data = {
      userDetails: userDetails,
      products: filteredProducts,
    };

    // Return the response
    return res
      .status(200)
      .json(
        Response({
          statusCode: 200,
          message: "Boutique products retrieved successfully.",
          data: data,
        })
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        Response({
          statusCode: 500,
          message: error.message,
          status: "server error",
        })
      );
  }
};


// const boutiqueDetails = async (req, res) => {
//   try {
//     // for pagination
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     // Get the token from the request headers
//     const tokenWithBearer = req.headers.authorization;
//     let token;

//     if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
//       // Extract the token without the 'Bearer ' prefix
//       token = tokenWithBearer.slice(7);
//     }

//     if (!token) {
//       return res
//         .status(401)
//         .json(
//           Response({
//             statusCode: 401,
//             message: "Token is missing.",
//             status: "failed",
//           })
//         );
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     if (decoded.role !== "admin") {
//       return res
//         .status(401)
//         .json(
//           Response({
//             statusCode: 401,
//             message: "you are not admin.",
//             status: "faield",
//           })
//         );
//     }

//     const { id } = req.query;

//     const userDetails = await User.findById(id);
//     // Fetch all existing categories
//     const existingCategories = await Category.find({}).select('_id');
//     const categoryIds = existingCategories.map((category) => category._id);
//     console.log(categoryIds,"--------------");

// //     // Fetch products of the boutique that belong to existing categories
//     const productforBoutique = await Product.find({ 
//       userId: id, 
//       categoryId: { $in: categoryIds } 
//     })

//     // const productforBoutique = await Product.find({ userId: id });
//     const data = {
//       userDetails: userDetails,
//       product: productforBoutique,
//     };
//     return res
//       .status(200)
//       .json(
//         Response({
//           statusCode: 200,
//           message: "showed boutique product and ",
//           data: data,
//         })
//       );
//   } catch (error) {
//     return res
//       .status(500)
//       .json(
//         Response({
//           statusCode: 500,
//           message: error.message,
//           status: "server error",
//         })
//       );
//   }
// };

// const sendFeedback = async (req, res) => {
//   try {
//     // Get the token from the request headers
//     const tokenWithBearer = req.headers.authorization;
//     let token;

//     if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
//       // Extract the token without the 'Bearer ' prefix
//       token = tokenWithBearer.slice(7);
//     }

//     if (!token) {
//       return res
//         .status(401)
//         .json(
//           Response({
//             statusCode: 401,
//             message: "Token is missing.",
//             status: "failed",
//           })
//         );
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     if (decoded.role !== "admin") {
//       return res
//         .status(401)
//         .json(
//           Response({
//             statusCode: 401,
//             message: "you are not admin.",
//             status: "faield",
//           })
//         );
//     }

//     const { title, description, boutiqueId } = req.body;
//     const { feedBackImage } = req.files;

//     const files = [];
//     if (req.files) {
//       feedBackImage.forEach((feedBackImage) => {
//         const publicFileUrl = `/images/users/${feedBackImage.filename}`;

//         files.push({
//           publicFileUrl,
//           path: feedBackImage.filename,
//         });
//         // console.log(files);
//       });
//     }
//     const data = {
//       title: title,
//       boutiqueId: boutiqueId,
//       feedbackDescription: description,
//       feedBackImage: files[0],
//     };
//     const doFeedBack = await Feedback.create(data);
//     return res
//       .status(200)
//       .json(
//         Response({
//           statusCode: 200,
//           message: "feedback create succesfully ",
//           data: doFeedBack,
//         })
//       );
//   } catch (error) {
//     return res
//       .status(500)
//       .json(
//         Response({
//           statusCode: 500,
//           message: error.message,
//           status: "server error",
//         })
//       );
//   }
// };


// const boutiqueDetails = async (req, res) => {
//   try {
//     // For pagination
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;

//     // Get the token from the request headers
//     const tokenWithBearer = req.headers.authorization;
//     let token;

//     if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
//       // Extract the token without the 'Bearer ' prefix
//       token = tokenWithBearer.slice(7);
//     }

//     if (!token) {
//       return res
//         .status(401)
//         .json(
//           Response({
//             statusCode: 401,
//             message: "Token is missing.",
//             status: "failed",
//           })
//         );
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     if (decoded.role !== "admin") {
//       return res
//         .status(401)
//         .json(
//           Response({
//             statusCode: 401,
//             message: "You are not an admin.",
//             status: "failed",
//           })
//         );
//     }

//     const { id } = req.query;

//     // Fetch the user details
//     const userDetails = await User.findById(id);

//     if (!userDetails) {
//       return res
//         .status(404)
//         .json(
//           Response({
//             statusCode: 404,
//             message: "User not found.",
//             status: "failed",
//           })
//         );
//     }

//     // Fetch all existing categories
//     const existingCategories = await Category.find({}).select('_id');
//     const categoryIds = existingCategories.map((category) => category._id);

//     // Fetch products of the boutique that belong to existing categories
//     const productForBoutique = await Product.find({ 
//       userId: id, 
//       categoryId: { $in: categoryIds } 
//     }).skip((page - 1) * limit).limit(limit);

//     // Prepare the data object
//     const data = {
//       userDetails: userDetails,
//       products: productForBoutique,
//     };

//     // Return the response
//     return res
//       .status(200)
//       .json(
//         Response({
//           statusCode: 200,
//           message: "Boutique products retrieved successfully.",
//           data: data,
//         })
//       );
//   } catch (error) {
//     return res
//       .status(500)
//       .json(
//         Response({
//           statusCode: 500,
//           message: error.message,
//           status: "server error",
//         })
//       );
//   }
// };

const sendFeedback = async (req, res,next) => {
  try {
    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
      // Extract the token without the 'Bearer ' prefix
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "Token is missing.",
            status: "failed",
          })
        );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role !== "admin") {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "You are not admin.",
            status: "failed",
          })
        );
    }

    const { title, description, boutiqueId } = req.body;
    const { feedBackImage } = req.files || {}; // Safely access req.files

    let files = [];

    // Only process images if they are provided
    if (feedBackImage && Array.isArray(feedBackImage)) {
      feedBackImage.forEach((image) => {
        const publicFileUrl = `/images/users/${image.filename}`;
        files.push({
          publicFileUrl,
          path: image.filename,
        });
      });
    }

    // Prepare feedback data
    const data = {
      title: title,
      boutiqueId: boutiqueId,
      feedbackDescription: description,
      feedBackImage: files.length > 0 ? files[0] : null, // Optional: only add if image exists
    };

    // Save feedback to the database
    const doFeedBack = await Feedback.create(data);

    // Respond with success message
    return res
      .status(200)
      .json(
        Response({
          statusCode: 200,
          message: "Feedback created successfully.",
          data: doFeedBack,
        })
      );
  } catch (error) {
    // Handle errors
    // next(error)
    return res
      .status(500)
      .json(
        Response({
          statusCode: 500,
          message: error.message,
          status: "server error",
        })
      );
  }
};


const showFeedBackinBoutiq=async(req,res)=>{
  try {
    
     // Get the token from the request headers
     const tokenWithBearer = req.headers.authorization;
     let token;
 
     if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
       // Extract the token without the 'Bearer ' prefix
       token = tokenWithBearer.slice(7);
     }
 
     if (!token) {
       return res
         .status(401)
         .json(
           Response({
             statusCode: 401,
             message: "Token is missing.",
             status: "failed",
           })
         );
     }
 
   
     // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role !== "boutique") {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "You are not boutique.",
            status: "failed",
          })
        );
    }

    const showFeedback=await Feedback.find({boutiqueId:decoded._id})
     // Respond with success message
     return res
     .status(200)
     .json(
       Response({
         statusCode: 200,
         message: "Feedback show successfully.",
         data: showFeedback,
       })
     );

  } catch (error) {
    return res
      .status(500)
      .json(
        Response({
          statusCode: 500,
          message: error.message,
          status: "server error",
        })
      );
    
  }
}


const updateProfileOfboutiqueInDashboared = async (req, res, next) => {
  const { name, email, phone, address, rate, city, state, description, id,latitude,
    longitude } =
    req.body;

  const { image } = req.files || {};
  const files = [];

  // Check if there are uploaded files
  if (image && Array.isArray(image)) {
    image.forEach((img) => {
      const publicFileUrl = `/images/users/${img.filename}`;
      files.push({
        publicFileUrl,
        path: img.filename,
      });
    });
  }

  const tokenWithBearer = req.headers.authorization;
  let token;

  if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
    // Extract the token without the 'Bearer ' prefix
    token = tokenWithBearer.slice(7);
  }

  if (!token) {
    return res
      .status(401)
      .json(
        Response({
          statusCode: 401,
          message: "Token is missing.",
          status: "faield",
        })
      );
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role !== "admin") {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "you are not admin.",
            status: "faield",
          })
        );
    }

    const user = await User.findById(id);
    const userLocation=await Location.find({userId:id})
    console.log(userLocation);

    // Assuming you have some user data in req.body that needs to be updated
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.city = city || user.city;
    user.state = state || user.state;
    user.image = files[0] || user.image;
    user.rate = rate || user.rate;
    user.description = description || user.description;
    
    userLocation[0].latitude=latitude||userLocation[0].latitude;
    userLocation[0].latitude=longitude||userLocation[0].longitude;
    

    // Save the updated user profile
    const users = await user.save();
    const userLocations=await userLocation[0].save()
    const updated =await User.findByIdAndUpdate(id,{currentLocation:userLocation[0]},{new:true})

    console.log(userLocations);

    // Respond with success message
    res
      .status(200)
      .json(
        Response({
          statusCode: 200,
          message: "Profile updated successfully.",
          status: "success",
          data: users,
        })
      );
  } catch (error) {
    res
      .status(500)
      .json(
        Response({ statusCode: 500, message: error.message, status: "Failed" })
      );
  }
};

const addBoutique = async (req, res) => {
  try {
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
      // Extract the token without the 'Bearer ' prefix
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "Token is missing.",
            status: "faield",
          })
        );
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role !== "admin") {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "you are not admin.",
            status: "faield",
          })
        );
    }

    const {
      name,
      email,
      password,
      address,
      rate,
      phone,
      city,
      state,
      description,
      latitude,
      longitude
    } = req.body;
    console.log(description,req.body,"+++++++++++++");

    const { image } = req.files;

    if (!image) {
      return res
        .status(400)
        .json(
          Response({
            statusCode: 400,
            status: "image is reqired",
            message: "image is required",
          })
        );
    }
    const files = [];
    if (req.files) {
      image.forEach((image) => {
        const publicFileUrl = `/images/users/${image.filename}`;

        files.push({
          publicFileUrl,
          path: image.filename,
        });
        // console.log(files);
      });
    }
    console.log(image, files);

    // Validate request body
    if (!name) {
      return res
        .status(400)
        .json(
          Response({
            statusCode: 400,
            status: "name required",
            message: "Name is required",
          })
        );
    }

    if (!email) {
      return res
        .status(400)
        .json(
          Response({
            status: "email ",
            statusCode: 400,
            message: "Email is required",
          })
        );
    }

    if (!password) {
      return res
        .status(400)
        .json(
          Response({
            status: "password faild",
            statusCode: 400,
            message: "Password is required",
          })
        );
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json(
          Response({
            status: "faild",
            statusCode: 400,
            message: "User already exists",
          })
        );
    }

    const userDetails = {
      name,
      email,
      password,
      image,
      phone,
      rate,
      city,
      state,
      address,
      role: "boutique",
      description,
    };
    // Check if image is provided in the request
    if (files && files.length > 0) {
      userDetails.image = files[0];
    }

    const boutique = await User.create(userDetails);

    if(boutique){
   
    
      const location = new Location({ userId:boutique._id, latitude, longitude });
      const locations=await location.save();
      const updated =await User.findByIdAndUpdate(boutique._id,{currentLocation:location},{new:true})
    console.log(updated,"+++++++++++++++++++++============================");
     return res.status(200).json(Response({message:"location created ",status:"ok",statusCode:200,data:locations}));

    }

    

    // Respond with success message
  return  res
      .status(200)
      .json(
        Response({
          statusCode: 200,
          message: "Profile create   successfully.",
          status: "success",
          data: boutique,
        })
      );
  } catch (error) {
    res
      .status(500)
      .json(
        Response({ statusCode: 500, message: error.message, status: "Failed" })
      );
  }
};

const addPresentageForBoutique = async (req, res) => {
  try {
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
      // Extract the token without the 'Bearer ' prefix
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "Token is missing.",
            status: "faield",
          })
        );
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role!== "admin") {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "you are not admin.",
            status: "faield",
          })
        );
    }

    const { id, taka } = req.body;
    const user = await User.findById(id);
    if (user.role !== "boutique") {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "you are not boutique.",
            status: "faield",
          })
        );
    }

    const userPersentage = await User.findByIdAndUpdate(
      id,
      { boutiquePersentage: taka },
      { new: true }
    );
    return res
      .status(200)
      .json(
        Response({
          statusCode: 200,
          message: "Profile create   successfully.",
          status: "success",
          data: userPersentage,
        })
      );
  } catch (error) {
    res
      .status(500)
      .json(
        Response({ statusCode: 500, message: error.message, status: "Failed" })
      );
  }
};

const deleteBoutique=async(req,res)=>{
  try {
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
      // Extract the token without the 'Bearer ' prefix
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "Token is missing.",
            status: "faield",
          })
        );
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role!== "admin") {
      return res
        .status(401)
        .json(
          Response({
            statusCode: 401,
            message: "you are not admin.",
            status: "faield",
          })
        );
    }

    const {id}=req.query

    const boutique=await User.findByIdAndUpdate(id,{isBlocked:true},{new:true})

    return res
    .status(200)
    .json(
      Response({
        statusCode: 200,
        message: `${boutique.name}  deleted successfully`,
        status: "success",
     
      })
    );
    
  } catch (error) {
    return res.status(500).json(
      Response({ statusCode: 500, message: error.message, status: 'server error' })
  );
    
  }
}

// admin added product by  the user id 


const productCreateFromAdmin = async (req, res, next) => {
  const { productName, category, color, price, variants, boutiqueId } = req.body;
  const { productImage1 } = req.files||{};
  

  if (!productImage1) {
    return res.status(404).json(Response({ statusCode: 404, message: 'Image is missing', status: 'Failed' }));
  }

  let parsedVariants;
  let parsedColor;

  try {
    parsedVariants = JSON.parse(variants);
    parsedColor = JSON.parse(color);
  } catch (error) {
    return res.status(400).json(Response({ statusCode: 400, message: 'Invalid JSON format for variants or color', status: 'Failed' }));
  }

  if (!productName || !parsedColor || !category || !Array.isArray(parsedVariants) || !boutiqueId) {
    return res.status(400).json(
      Response({
        statusCode: 400,
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
    return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'Failed' }));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Check if the user is an admin
    if (decoded.role !== 'admin') {
      return res.status(403).json(
        Response({
          statusCode: 403,
          message: 'You are not authorized to create products as an admin.',
          status: 'Failed',
        })
      );
    }

    const slug = slugify(productName, { lower: true });
    const newProduct = new Product({
      userId: boutiqueId, // Set the boutique ID here
      name: productName,
      category: category,
      color: parsedColor,
      variants: parsedVariants,
      price: price,
      images: files,
      isAproved:true,
      firstImage: files[0],
      slug: slug,
      isApproved: false, // Product is initially not approved
      isNewArrival: true,
    });

    const savedProduct = await newProduct.save();

    // setTimeout(async () => {
    //   await Product.findByIdAndUpdate(savedProduct._id, { $set: { isNewArrival: false } });
    // }, 5 * 60 * 1000); // 5 minutes in milliseconds

    // // Notify the boutique owner about the new product
    // const user = await User.findById(boutiqueId); // Assuming boutiqueId is the owner's user ID
    // const data = {
    //   productId: savedProduct._id,
    //   isApproved: "pending",
    //   title: "Product added",
    //   message: `${user.name} has had a product added by an admin, awaiting approval.`,
    //   role: "admin",
    //   type: "product",
    // };
    // await Notifaction.create(data);

    res.status(200).json(
      Response({
        statusCode: 200,
        status: 'OK',
        message: `create created successfully`,
        data: savedProduct ,
      })
    );
  } catch (error) {
    console.log('Error in productCreateForAdmin controller:', error);
    return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'Server Error' }));
  }
};


const productUpdateForAdmin = async (req, res, next) => {
  const { productId } = req.body; // Get product ID
  const { productName, category, color, price, variants } = req.body;
  const { productImage1 } = req.files;

  if (!productId) {
    return res.status(400).json(Response({ statusCode: 400, message: 'Product ID is required.', status: 'Failed' }));
  }

  const updateData = {};

  // Check if fields are provided and add them to the updateData object
  if (productName) updateData.name = productName;
  if (category) updateData.category = category;
  if (color) {
    try {
      updateData.color = JSON.parse(color);
    } catch (error) {
      return res.status(400).json(Response({ statusCode: 400, message: 'Invalid JSON format for color', status: 'Failed' }));
    }
  }
  if (price) updateData.price = price;
  if (variants) {
    console.log(variants);
    try {
      updateData.variants = JSON.parse(variants);
    } catch (error) {
      return res.status(400).json(Response({ statusCode: 400, message: 'Invalid JSON format for variants', status: 'Failed' }));
    }
  }

  if (req.files && productImage1) {
    const files = productImage1.map((productImage) => {
      const publicFileUrl = `/images/users/${productImage.filename}`;
      return {
        publicFileUrl,
        path: productImage.filename,
      };
    });
    updateData.images = files;
    updateData.firstImage = files[0]; // Update first image if new images are provided
  }

  const tokenWithBearer = req.headers.authorization;
  let token;

  if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
    token = tokenWithBearer.slice(7);
  }

  if (!token) {
    return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'Failed' }));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Check if the user is an admin
    if (decoded.role !== 'admin') {
      return res.status(403).json(
        Response({
          statusCode: 403,
          message: 'You are not authorized to update products as an admin.',
          status: 'Failed',
        })
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json(Response({ statusCode: 404, message: 'Product not found.', status: 'Failed' }));
    }

    res.status(200).json(
      Response({
        statusCode: 200,
        status: 'OK',
        message: 'Product updated successfully.',
        data: { updatedProduct },
      })
    );
  } catch (error) {
    console.log('Error in productUpdateForAdmin controller:', error);
    return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'Server Error' }));
  }
};

// delkete 
const deleteProductForAdmin = async (req, res, next) => {
  try {
    const { id } = req.query;

    // Check if the user is authorized
    const tokenWithBearer = req.headers.authorization;
    let token;
    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res.status(401).json(
        Response({
          statusCode: 401,
          message: 'Token is missing.',
          status: 'Failed',
        })
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Verify that the user is an admin
    if (decoded.role !== 'admin') {
      return res.status(403).json(
        Response({
          statusCode: 403,
          message: 'You are not authorized to delete products as an admin.',
          status: 'Failed',
        })
      );
    }

    // Fetch the product to verify its existence
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json(
        Response({
          statusCode: 404,
          message: 'Product not found.',
          status: 'Failed',
        })
      );
    }

    // Delete the product (or mark it as deleted)
    await Product.findByIdAndUpdate(id, { isDelete: true }, { new: true });

    // Optionally delete any related notifications, images, or other associated data here if needed.

    return res.status(200).json(
      Response({
        statusCode: 200,
        message: 'Product deleted successfully.',
        status: 'Success',
      })
    );
  } catch (error) {
    console.log('Error in deleteProductForAdmin controller:', error);
    return res.status(500).json(
      Response({
        statusCode: 500,
        message: 'Server Error. Failed to delete the product.',
        status: 'Failed',
      })
    );
  }
};

const showProductById = async (req, res, next) => {
  const { productId } = req.query; // Get product ID from the route parameters

  if (!productId) {
    return res.status(400).json(Response({ statusCode: 400, message: 'Product ID is required.', status: 'Failed' }));
  }

  const tokenWithBearer = req.headers.authorization;
  let token;

  if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
    token = tokenWithBearer.slice(7);
  }

  if (!token) {
    return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'Failed' }));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Optional: You can check if the user is an admin here, if needed
    if (decoded.role !== 'admin') {
      return res.status(403).json(
        Response({
          statusCode: 403,
          message: 'You are not authorized to view this product.',
          status: 'Failed',
        })
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json(Response({ statusCode: 404, message: 'Product not found.', status: 'Failed' }));
    }

    res.status(200).json(
      Response({
        statusCode: 200,
        status: 'OK',
        message: 'Product retrieved successfully.',
        data: { product },
      })
    );
  } catch (error) {
    console.log('Error in showProductById controller:', error);
    return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'Server Error' }));
  }
};

module.exports = {
  getAllBoutiqueForAdmin,
  boutiqueDetails,
  sendFeedback,
  showFeedBackinBoutiq,
  updateProfileOfboutiqueInDashboared,
  addBoutique,
  addPresentageForBoutique,
  deleteBoutique,
  productCreateFromAdmin,
  productUpdateForAdmin,
  deleteProductForAdmin,
  showProductById
};
