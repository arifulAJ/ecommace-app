const Response = require("../helpers/response");
const Product = require("../models/Product");
const Review = require("../models/Reviews");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const pagination = require("../helpers/pagination");
const { default: mongoose } = require("mongoose");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
 

 const createRewiew=async (req, res, next)=>{
    const { rating, height, weight,reviews } = req.body;
  
  const { reviewImage } = req.files;
const id = req.params.id;

const files = [];

if (reviewImage && reviewImage.length > 0) {
    reviewImage.forEach((image) => {
        const publicFileUrl = `/images/users/${image.filename}`;
        files.push({
            publicFileUrl,
            path: image.filename,
        });
    });
}

console.log(files);

  
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

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
 
       const isProduct=await Product.findById(id)
       if(!isProduct){
         return res.status(404).json(Response({ statusCode: 401, message: 'product not found to review.',status:'faield' }));
       }
       console.log(isProduct,"this is product id")
// Format the rating to always have two decimal places
const formattedRating = parseFloat(rating).toFixed(2);
       console.log(formattedRating,"this is ranting ");

        const newReview={
          userId:decoded._id,
          rating:formattedRating,
          height:height,
          weight:weight,
          reviews:reviews,
          reviewImage:files,
          ProductId:id

        }

     
       
        const saveReview =await Review.create(newReview)
     
        
      
       
        res.status(200).json(Response({ statusCode: 200, status: "ok", message: "review add successfully ",data:saveReview}));
    }catch(error){
       // Handle any errors
       return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error .',status:'server error' }));
    }
 }

//  // show all review for this product

const showAllReciewForProduct = async (req, res, next) => {
  const productId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

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
        const userId = decoded._id; // Assuming the logged-in user's ID is available in req.user

    const isProduct = await Product.findById(productId);
    if (!isProduct) {
      return res.status(404).json(Response({ statusCode: 404, message: 'You don\'t have any product', status: 'failed' }));
    }

    const reviews = await Review.find({ ProductId: productId })
      .populate('userId', 'name image')
      .skip((page - 1) * limit)
      .limit(limit);

    const totalReviews = await Review.find({ ProductId: productId }).countDocuments();

    if (reviews.length === 0) {
      return res.status(404).json(Response({ statusCode: 404, message: 'Product doesn\'t have any reviews yet.', status: 'not found' }));
    }

    const sumOfRatings = reviews.reduce((total, review) => total + parseInt(review.rating), 0);
    const averageRating = sumOfRatings / reviews.length;

    await Product.findByIdAndUpdate(productId, { rating: averageRating.toFixed(2) }, { new: true });

    // Adding like and comment count for each review, and checking if the user has liked the review
    const reviewsWithCounts = await Promise.all(reviews.map(async review => {
      const likeCount = await Like.countDocuments({ reviewId: review._id });
      const commentCount = await Comment.countDocuments({ reviewId: review._id });
      const isLiked = await Like.exists({ reviewId: review._id, userId }); // Check if the user has liked this review

      return {
        ...review._doc,
        likeCount,
        commentCount,
        isLiked: !!isLiked // Convert to boolean, true if the user has liked, otherwise false
      };
    }));

    const paginationOfProduct = pagination(totalReviews, limit, page);

    res.status(200).json(Response({
      message: "Retrieve product successfully by category",
      data: reviewsWithCounts,
      pagination: paginationOfProduct
    }));
  } catch (error) {
    return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error.', status: 'server error' }));
  }
};


 const updateRatingForboutique=async(req,res,next)=>{
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

   try {
       // Verify the token
       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
       console.log()

      

       res.status(200).json(Response({ statusCode: 200, status: "ok", message: "you can see your product  ",}));
   } catch (error) {
      // Handle any errors
      return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));
   }


 }

//  const showAllReviewOfbotique=async(rew,res)=>{
//   try {
//     // Get the token from the request headers
//    const tokenWithBearer = req.headers.authorization;
//    let token;

//    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//        // Extract the token without the 'Bearer ' prefix
//        token = tokenWithBearer.slice(7);
//    }

//    if (!token) {
//        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
//    }


//        // Verify the token
//        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//         // Check if the user has the "boutique" role
//         if (decoded.role !== "boutique") {
//             // If the user does not have the "boutique" role, return an error
//             return res.status(404).json(Response({ statusCode: 404, message: 'You are not authorized boutique',status:'faield' }));
//         }

         
//         const review=await Review.find()

        

      


      

    
//   } catch (error) {
    
//   }
// }
const showAllReviewOfbotique = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    if (page < 1 || limit < 1) {
      throw new Error('Invalid page or limit');
  }

    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Token is missing.',
        status: 'failed',
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Check if the user has the "boutique" role
    if (decoded.role !== "boutique") {
      return res.status(404).json({
        statusCode: 404,
        message: 'You are not authorized as a boutique.',
        status: 'failed',
      });
    }

    // Aggregate reviews for products belonging to the boutique
    const reviews = await Review.aggregate([
      {
        $lookup: {
          from: 'products', // Name of the Product collection
          localField: 'ProductId',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product', // Deconstructs the product array
      },
      {
        $match: {
          'product.userId': new mongoose.Types.ObjectId(decoded._id),
        },
      },
      {
        $project: {
          userId: 1,
          ProductId: 1,
          height: 1,
          weight: 1,
          reviewImage: 1,
          rating: 1,
          reviews: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    // Populate the userId field after aggregation
    const populatedReviews = await Review.populate(reviews, {
      path: 'userId',
      select: 'name email image',
    });
    
     // Adding like and comment count for each review, and checking if the user has liked the review
     const reviewsWithCounts = await Promise.all(populatedReviews.map(async review => {
      const likeCount = await Like.countDocuments({ reviewId: review._id });
      const commentCount = await Comment.countDocuments({ reviewId: review._id });
      // const isLiked = await Like.exists({ reviewId: review._id, userId }); // Check if the user has liked this review

      return {
        ...review,
        likeCount,
        commentCount,
        // isLiked: !!isLiked // Convert to boolean, true if the user has liked, otherwise false
      };
    }));

    // Implement pagination
    const paginatedReviews = populatedReviews.slice(skip, skip + limit);

    // Calculate total pages
    const totalPages = Math.ceil(populatedReviews.length / limit);

    if (totalPages<page){
     return  res.status(404).json(Response({ statusCode: 404, status: "ok", message: "you dont have enough review  ",}));

    }

    const paginationInfo = {
      // currentPage: page,
      // totalPages: totalPages,
     
      // nextPage:
      // previousPage:
      // totalItems: populatedReviews.length,
      currentPage: page,
            totalPages: totalPages,
            nextPage: page < totalPages ? page + 1 : null,
            previousPage: page > 1 ? page - 1 : null,
            totalItems: populatedReviews.length
    };
   

    res.status(200).json(
      Response({
        statusCode: 200,
        status: 'success',
        data: reviewsWithCounts,
        pagination: paginationInfo,
      })
    );
  } catch (error) {
    console.error('Error retrieving reviews:', error);
    return res.status(500).json(
      Response({
        statusCode: 500,
        message: error.message,
        status: 'failed',
      })
    );
  }
};

// create comment 
const makeComment=async(req,res)=>{
 
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

        const { comment,reviewId}=req.body
        const data={
          reviewId:reviewId,
          userId:decoded._id,
          comment:comment
        }

        const commentCreate=await Comment.create(data)


        return res.status(200).json(Response({ statusCode: 200, message: 'comment successful;ly',status:'success' ,data:commentCreate}));

  } catch (error) {
    return res.status(500).json(
      Response({
        statusCode: 500,
        message: error.message,
        status: 'failed',
      })
    );
    
  }
}
// show commnet
const showComments = async (req, res) => {
  const { reviewId } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 1000;

  try {
    // Check if the review exists
    const reviewExists = await Review.findById(reviewId);
    if (!reviewExists) {
      return res.status(404).json(Response({ statusCode: 404, message: 'Review not found.', status: 'failed' }));
    }

    // Retrieve comments for the review
    const comments = await Comment.find({ reviewId })
      .populate('userId', 'name image')
      .skip((page - 1) * limit)
      .limit(limit);

    const totalComments = await Comment.find({ reviewId }).countDocuments();

    if (comments.length === 0) {
      return res.status(404).json(Response({ statusCode: 404, message: 'No comments found for this review.', status: 'not found' }));
    }

    const paginationOfComments = pagination(totalComments, limit, page);

    // Return the comments with pagination
    return res.status(200).json(Response({
      statusCode: 200,
      message: 'Comments retrieved successfully.',
      status: 'success',
      data: comments,
      pagination: paginationOfComments
    }));
  } catch (error) {
    return res.status(500).json(
      Response({
        statusCode: 500,
        message: error.message,
        status: 'failed',
      })
    );
  }
};

 // create comment 

const makeLike = async (req, res) => {
  try {
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

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { reviewId } = req.body;

    // Check if the user has already liked this review
    const existingLike = await Like.findOne({ reviewId: reviewId, userId: decoded._id });

    if (existingLike) {
      // If the like exists, remove it (unlike)
      await Like.findByIdAndDelete(existingLike._id);
      return res.status(200).json(Response({ statusCode: 200, message: 'Like removed successfully', status: 'success' }));
    } else {
      // If the like doesn't exist, create a new like
      const newLike = await Like.create({ reviewId: reviewId, userId: decoded._id, isLike: true });
      return res.status(200).json(Response({ statusCode: 200, message: 'Like added successfully', status: 'success', data: newLike }));
    }

  } catch (error) {
    return res.status(500).json(
      Response({
        statusCode: 500,
        message: error.message,
        status: 'failed',
      })
    );
  }
};

 module.exports={
    createRewiew,
    showAllReciewForProduct,
    updateRatingForboutique,
    showAllReviewOfbotique,
    makeComment,
    makeLike,
    showComments
 }