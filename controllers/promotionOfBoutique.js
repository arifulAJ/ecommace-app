const pagination = require("../helpers/pagination");
const Response = require("../helpers/response");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const  addPromotionImageForBoutiqu=async(req,res)=>{
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
    if (!decoded.role === "admin") {
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

    const {promotionImage} = req.files || {};


    const files = [];
    if(promotionImage){
    if (req.files) {
        promotionImage.forEach((promotionImage) => {
        const publicFileUrl = `/images/users/${promotionImage.filename}`;
        
        files.push({
          publicFileUrl,
          path: promotionImage.filename,
        });
        // console.log(files);
      });
    }}
     const  {id}=req.query

     const updatedBoutiqe=await User.findByIdAndUpdate(id,{promotionImage:files[0]})
     res.status(200).json(Response({statusCode:200,status:"ok",message:"you have added this boutiques promation image ",data:updatedBoutiqe}));

    } catch (error) {
        console.error(error);
        res.status(500).json(Response({ statusCode: 500, message: error.message, status: "Failed" }));
        
    }
}


// show in shopper dashbored 

// const showBoutiqueForpromation = async (req, res) => {
//     try {
//         // for pagination 
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//       const { name } = req.query; // Get the 'name' query parameter
  
//       // Create a filter object to match the role and name (if provided)
//       const filter = { role: "boutique", isBlocked: false };
  
//       // If a name is provided in the query, add it to the filter
//       if (name) {
//         filter.name = { $regex: name, $options: "i" }; // 'i' for case-insensitive search
//       }
  
//       // Find boutiques that match the filter
//       const findboutiqueLength = await User.find(filter).countDocuments()
//       const findboutique = await User.find(filter).skip((page - 1) * limit)
//       .limit(limit);
//   // If no boutiques are found, return 404
//   if (findboutiqueLength===0) {
//     return res.status(404).json(Response({
//       statusCode: 404,
//       message: "No boutiques found",
//       status: "Failed"
//     }));
//   }
//       const paginationOfProduct= pagination(findboutiqueLength,limit,page)
//       res.status(200).json(Response({ statusCode: 200, message: "Success", data: findboutique ,pagination:paginationOfProduct}));
//     } catch (error) {
//       console.error(error);
//       res.status(500).json(Response({ statusCode: 500, message: error.message, status: "Failed" }));
//     }
//   };
const showBoutiqueForpromation = async (req, res) => {
    try {
      // For pagination 
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const { name } = req.query; // Get the 'name' query parameter
  
      // Create a filter object to match the role and name (if provided)
      const filter = { role: "boutique", isBlocked: false };
  
      // If a name is provided in the query, add it to the filter
      if (name) {
        filter.name = { $regex: name, $options: "i" }; // 'i' for case-insensitive search
      }
  
      // Filter out users who don't have a promotionalImage field
      filter.promotionImage = { $exists: true, $ne: null }; 
  
      // Find boutiques that match the filter
      const findboutiqueLength = await User.find(filter).countDocuments();
      const findboutique = await User.find(filter).skip((page - 1) * limit).limit(limit);
  
      // If no boutiques are found, return 404
      if (findboutiqueLength === 0) {
        return res.status(404).json(Response({
          statusCode: 404,
          message: "No boutiques found",
          status: "Failed"
        }));
      }
  
      const paginationOfProduct = pagination(findboutiqueLength, limit, page);
      res.status(200).json(Response({
        statusCode: 200,
        message: "Success",
        data: findboutique,
        pagination: paginationOfProduct
      }));
    } catch (error) {
      console.error(error);
      res.status(500).json(Response({
        statusCode: 500,
        message: error.message,
        status: "Failed"
      }));
    }
  };
  

module.exports={
    addPromotionImageForBoutiqu,
    showBoutiqueForpromation
}