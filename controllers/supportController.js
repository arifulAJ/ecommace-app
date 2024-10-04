const Response = require("../helpers/response");
const Support = require("../models/Support");

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Notifaction = require("../models/Notifaction");

const  supportOfUsers=async(req,res,next)=>{

   
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
        
        const {email,describIssue}=req.body
        const supportData={
            userId:decoded._id,
            email,
            describIssue
        }
       
    const crateSupport=await Support.create(supportData)

    const user=await User.findById(decoded._id)

    
        const datas={
          
            title:`suport and help of  ${email}` ,
            message:describIssue,
          
            role:"admin",
            type:"admin"
            
          
      
          }
      
          const addNotifaction=await Notifaction.create(datas)
        
    

    res.status(200).json(Response({statusCode:200,status:"ok",message:"your message will show the admin"}))

    } catch (error) {
        // Handle any errors
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));
    }
}
const  getHelpsupport=async(req,res,next)=>{

   
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
        
        const {email,describIssue}=req.body
        const supportData={
            userId:decoded._id,
            email,
            describIssue
        }
       
    const crateSupport=await Support.create(supportData)

    const user=await User.findById(decoded._id)

    
        const datas={
          
            title:`suport and help of  ${email}` ,
            message:describIssue,
          
            role:"admin",
            type:"admin"
            
          
      
          }
      
          const addNotifaction=await Notifaction.create(datas)
        
    

    res.status(200).json(Response({statusCode:200,status:"ok",message:"your message will show the admin"}))

    } catch (error) {
        // Handle any errors
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));
    }
}

const showSuportOfAdmin=async(req,res)=>{
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
            message: "You are not authorized as admin.",
            status: "failed",
          })
        );
    }
    const suport=await Support.find()

    res.status(200).json(Response({statusCode:200,status:"ok",message:"your email will show successfully",data:suport}))

        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

        
    }
}


module.exports={
    supportOfUsers,
    getHelpsupport,
    showSuportOfAdmin
}