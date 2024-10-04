const pagination = require("../../helpers/pagination");
const Response = require("../../helpers/response");
const Driver = require("../../models/Driver");
const Feedback = require("../../models/Feedback");
const Order = require("../../models/Order");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");




const showAllDriverInDashboared=async(req,res)=>{
    try {
        // for pagination 
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const name = req.query.name ? req.query.name.trim() : '';

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
if(!decoded.role==="admin"){
   return res.status(401).json(Response({ statusCode: 401, message: 'you are not admin.',status:'faield' }));
  }
   // Build the query
   const query = { role: "driver" };
   if (name) {
       query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
   }

   
  const allDriverlength=await User.find(query).countDocuments()
  const allDriver=await User.find(query)
  .skip((page - 1) * limit)  // Pagination: skip previous pages
      .limit(limit)              // Limit the number of results per page
      .sort({ createdAt: -1 });  // Sort by creation date descending
      
      if(allDriver.length===0){
        return res.status(404).json(Response({ statusCode: 404, message: 'dont have any driver  .',status:'faield' }));


      }
      const paginationOfProduct= pagination(allDriverlength,limit,page)

  return res.status(200).json(Response({ statusCode: 200, message: "showed boutique product and ",data:allDriver,pagination:paginationOfProduct}));


    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

        
    }
}
const showDriverDetails=async(req,res)=>{
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
if(!decoded.role==="admin"){
   return res.status(401).json(Response({ statusCode: 401, message: 'you are not admin.',status:'faield' }));
  }
  const {id}=req.query
   
  const driver=await Driver.findOne({userId:id}).populate("userId")
  
  const order=await Order.find({status:"delivered",assignedDriver:id}).populate("orderItems userId boutiqueId")
  const deliveriedOrder=await Order.find({status:"delivered",assignedDriver:id}).countDocuments()
  const cancelledOrder=await Order.find({status:"cancelled",assignedDriver:id}).countDocuments()
  const data={
    driver,
    totalDelivried:deliveriedOrder,
    totalCancle:cancelledOrder,
    allOrderInfo:order
  }


  return res.status(200).json(Response({ statusCode: 200, message: "showed boutique product and ",data:data}));


    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

        
    }
}


const driverDashboared=async(req,res)=>{
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
if(!decoded.role==="admin"){
   return res.status(401).json(Response({ statusCode: 401, message: 'you are not admin.',status:'faield' }));
  }

  const order=await Order.find()

  const totalEarn=order.reduce((acc,order)=>{
    return acc+(parseFloat(order.totalAmount)||0)

  },0).toFixed(2);
  const total=parseFloat(totalEarn)
  const deliveriedOrder=await Order.find({status:"delivered"}).countDocuments()
  const cancelledOrder=await Order.find({status:"cancelled"}).countDocuments()

  const data={
    totalOrder:order.length,
    totalEarn:total,
    deliveriedOrder:deliveriedOrder,
    cancelledOrder:cancelledOrder
  }
  return res.status(200).json(Response({ statusCode: 200, message: "showed drrive in dash borde total ",data:data}));

        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

        
    }
}
module.exports={
    showAllDriverInDashboared,
    showDriverDetails,
    driverDashboared
   
}