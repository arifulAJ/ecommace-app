const Response = require("../helpers/response");
const jwt = require("jsonwebtoken");
const TermsOfUse = require("../models/TurmsOfUse");
const PrivecyPolicy = require("./../models/PrivecyPolicy");


// privecy 
const caretTermsAdnControllerForAdmin=async (req,res, next)=>{
  
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
        if(!decoded._id==="admin"){
            return res.status(401).json(Response({ statusCode: 401, message: 'you are not admin.',status:'faield' }));
           }
      
    const {privacypolicyDroperDriver,otherPolicyDroperDriver}=req.body
    const makeDataForTermsAdncondition={
        userId:decoded._id,
        privacypolicyDroperDriver,
        otherPolicyDroperDriver
        
    }
    const createTuremsAndUse=await TermsOfUse.create(makeDataForTermsAdncondition)
    res.status(200).json(Response({statusCode:200,status:"ok",message:"terms and useses create successfully"}))

    } catch (error) {
     // Handle any errors
     return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));
    }
}

// updated 
const updateTermsOfUse = async (req, res, next) => {
    try {
      const { id } = req.query;
      const { privacypolicyDroperDriver, otherPolicyDroperDriver } = req.body;
  
      // Validate if required fields are provided
      if (!privacypolicyDroperDriver || !otherPolicyDroperDriver) {
        return res
          .status(400)
          .json(
            Response({
              statusCode: 400,
              message: "All fields are required",
              status: "Failed",
            })
          );
      }
  
      // Find the terms of use document by ID and update it
      const updatedTerms = await TermsOfUse.findByIdAndUpdate(
        id,
        {
          privacypolicyDroperDriver,
          otherPolicyDroperDriver,
        },
        { new: true }
      );
  
      // Check if the document was found
      if (!updatedTerms) {
        return res
          .status(404)
          .json(
            Response({
              statusCode: 404,
              message: "Terms of Use document not found",
              status: "Failed",
            })
          );
      }
  
      // Send the updated document as the response
      return res
        .status(200)
        .json(
          Response({
            statusCode: 200,
            message: "Terms of Use updated successfully",
            status: "Success",
            data: updatedTerms,
          })
        );
    } catch (error) {
        return res
        .status(500)
        .json(
          Response({
            statusCode: 500,
            message: error.message,
            status: "server errro",
          })
        );
    }
  };
  

const privecyPolicy=async(req,res,next)=>{
    try {

        const privecyPolicyData=await TermsOfUse.find()
        res.status(200).json(Response({statusCode:200,status:"ok",message:"terms and useses create successfully",data:privecyPolicyData}))

        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

    }
}
const acceptPrivecyPolicy=async(req,res,next)=>{
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
        const {isAcceptedPrivecyPolicy,isAcceptedTermsAndUse,id}=req.body
        // Check if a record already exists for the user
        const existingRecord = await PrivecyPolicy.findOne({ userId: decoded._id });
        if (existingRecord) {
            return res.status(404).json(Response({ statusCode: 404, message: 'Privacy policy already accepted.', status: 'failed' }));
        }
        const makePrivecy={
            userId:decoded._id,
            privacypolicyDroperDriver:id,
            isAcceptedPrivecyPolicy,
            isAcceptedTermsAndUse


        }

        const acceptPrivecy= await PrivecyPolicy.create(makePrivecy)
        
        res.status(200).json(Response({statusCode:200,status:"ok",message:"terms and useses create successfully",data:acceptPrivecy}))

        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

        
    }
}
const denayPolicy=async(req,res,next)=>{
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
        const {isAcceptedPrivecyPolicy,isAcceptedTermsAndUse,id}=req.body
         // Check if a record already exists for the user
         const existingRecord = await PrivecyPolicy.findOne({ userId: decoded._id });
         if (existingRecord) {
             return res.status(404).json(Response({ statusCode: 404, message: 'Privacy policy already denied.', status: 'failed' }));
         }
        const makePrivecy={
            userId:decoded._id,
            privacypolicyDroperDriver:id,
            isAcceptedPrivecyPolicy,
            isAcceptedTermsAndUse


        }

        const acceptPrivecy= await PrivecyPolicy.create(makePrivecy)
        
        res.status(200).json(Response({statusCode:200,status:"ok",message:"terms and useses create successfully",data:acceptPrivecy}))

        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

        
    }
}

module.exports={
    caretTermsAdnControllerForAdmin,
    privecyPolicy,
    acceptPrivecyPolicy,
    denayPolicy,
    updateTermsOfUse
}