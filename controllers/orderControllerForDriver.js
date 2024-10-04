const Response = require("../helpers/response")
const Order = require("../models/Order")
const jwt = require("jsonwebtoken");

const pagination = require("../helpers/pagination");
const Cancelled = require("../models/Cancelled");
const User = require("../models/User");


// driver dashbord---------------
//-----------------#############-----------

const showDriverDashBored=async(req,res,next)=>{
// for pagination 
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
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
     if(!decoded._id==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not boutique.',status:'faield' }));
     }

const driverGetOrder=await Order.find({assignedDriver:decoded._id})
console.log(driverGetOrder)

const activeOrders = await Order.find({ assignedDriver: decoded._id, assignedDriverProgress: "inprogress" });
const compliteOrder = await Order.find({ assignedDriver: decoded._id, assignedDrivertrack: "orderDelivered" });
console.log(activeOrders.length,compliteOrder.length)
const driverDashboard={
    activeOrders:activeOrders.length,
    compliteOrders:compliteOrder.length

}

// let totalAmount = 0;

// activeOrders.forEach(order => {
//     totalAmount += parseFloat(order.totalAmount.replace(/[^\d.]/g, ''));

// });
// let totalAmountDeliver = 0;
// compliteOrder.forEach(order => {
//     totalAmountDeliver += parseFloat(order.totalAtotalAmountDelivermount.replace(/[^\d.]/g, ''));

// });
// console.log(totalAmountDeliver)








    
// if (driverGetOrder.length === 0) {
//     return res.status(404).json(Response({ statusCode: 404, message: 'You don\'t have any new order orders.', status: 'failed' }));
// }
        
// const paginationOfProduct= pagination(driverGetOrder.length,limit,page)
res.status(200).json(Response({
    message: "order showed succesfully",
    status:"success",
    statusCode:200,
    data: driverDashboard,
    // pagination: paginationOfProduct
}));
    } catch (error) {
        // server error
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }
}
//cancelledOrderedAsDriver the order fas a driver  ------------
//-------------##################

const cancelledOrderedAsDriver=async(req,res,next)=>{
    id=req.params.id
    
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
     if(!decoded._id==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
     }
    const checktheDriver=await Order.findById(id)
    // console.log(checktheDriver,"this is comenn")
    if(checktheDriver.assignedDriver===null){
      return  res.status(404).json(Response({statusCode:404,status:"faild",message:"driver is not yet assigned "}))

    }
    if(checktheDriver.assignedDriver.toString()!==decoded._id){
        return  res.status(404).json(Response({statusCode:404,status:"faild",message:"you are not this driver "}))

    }
    // console.log(checktheDriver.assignedDriver.toString()===decoded._id)
    const drivercancelOrder=await Order.findByIdAndUpdate(id,{assignedDriver:null,status:"inprogress"}, {new:true})
    const cancleorder =await Cancelled.create({orderId:id,userId:decoded._id,boutiqueId:drivercancelOrder.boutiqueId})
    // console.log(decoded._id)
    // console.log(drivercancelOrder.boutiqueId)
    res.status(200).json(Response({status:"ok",statusCode:200,message:"driver cancelled the order",data:cancleorder}))
        
    } catch (error) {
        
    
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }
}
//----------------------------
// show all order that you cancelled-#####################
//---------------------
const showAllCancellOrder=async(req,res,next)=>{
    // for pagination 
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
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
     if(!decoded._id==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
     }

     const allCanseledOrdercount=await Cancelled.find({userId:decoded._id}).populate('orderId boutiqueId','orderItems').countDocuments()
     // Check if there are no canceled orders
     if (allCanseledOrdercount === 0) {
        return res.status(404).json(Response({
            statusCode: 404,
            status: "failed",
            message: "No canceled orders available."
        }));
    }

     const allCanseledOrderlength=await Cancelled.find({userId:decoded._id}).countDocuments()
     const allCanseledOrder=await Cancelled.find({userId:decoded._id}).populate('boutiqueId') .populate({
        path: 'orderId',
        populate: [
            { path: 'orderItems' },
            { path: 'boutiqueId' }
        ]
    })


     .skip((page - 1) * limit)
     .limit(limit);

     console.log(allCanseledOrder)
     const paginationOfProduct= pagination(allCanseledOrderlength,limit,page)

     res.status(200).json(Response({
        statusCode:200,
        status:"ok",
        message:"all cancelled order retrive",
        data:allCanseledOrder,
        pagination:paginationOfProduct
        

     }))

        
    } catch (error) {

        
    
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }
}
// show new order as per driver ---------------
//-------------#####################

const showNewOrderForDriver=async(req,res,next)=>{

    // for pagination 
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
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
     if(decoded.role!=="driver"){

      return res.status(404).json(Response({ statusCode: 404, message: 'you are not driver.',status:'faield' }));
     }

     const driver=await User.findById(decoded._id)

     if(driver.isBlocked===true){
        return res.status(404).json(Response({ statusCode: 404, message: 'your account not yet aproved',status:'faield' }));

     }

     const findTheStatus=await Order.find({assignedDriver:decoded._id,assignedDriverProgress:"newOrder"})
     console.log(findTheStatus)

const DriverNewOrderlength= await Order.find({assignedDriver:decoded._id,assignedDriverProgress:"newOrder"}).countDocuments()
const DriverNewOrder= await Order.find({assignedDriver:decoded._id,assignedDriverProgress:"newOrder"})
.populate("boutiqueId orderItems")
.skip((page - 1) * limit)
 .limit(limit);
 if (DriverNewOrder.length === 0) {
    return res.status(404).json(Response({ statusCode: 404, message: 'You don\'t have any new order orders.', status: 'failed' }));
}


        // const botiq=newOrder.map(order=>order.boutiqueId)
              const paginationOfProduct= pagination(DriverNewOrderlength,limit,page)
            //   if (DriverNewOrder.length === 0) {
            //     return res.status(404).json(Response({ statusCode: 404, message: 'You don\'t have any new order orders.', status: 'failed' }));
            // }

        console.log(DriverNewOrder,decoded._id)
        res.status(200).json(Response({
            statusCode:200,
            status:"ok",
            message:"all driver new order  retrive",
            data:DriverNewOrder,
            pagination:paginationOfProduct
        
         }))

    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
 
    }
}
//new order to progress ----------------
//########-----------------------

const newOrderToProgress=async(req,res,next)=>{
    const id=req.params.id

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
     if(!decoded._id==="driver"){
      return res.status(404).json(Response({ statusCode: 404, message: 'you are not driver.',status:'faield' }));
     }
// see if this driver is authentic
        const updateToProgress=await Order.findById(id)
        if(updateToProgress.assignedDriver===null){
            return  res.status(404).json(Response({statusCode:404,status:"faild",message:"driver is not yet assigned "}))
      
          }
          if(updateToProgress.assignedDriver.toString()!==decoded._id){
              return  res.status(404).json(Response({statusCode:404,status:"faild",message:"you are not this driver "}))
      
          }
          const date=new Date()
        // console.log(updateToProgress)
        // const assigndriverId= updateToProgress.assignedDriver
        //  const exisist=await User.findById(assigndriverId)
        //  console.log(exisist.assignedDriverProgress==="inprogress")
         // Check if the driver's progress is already "inprogress"
         if (updateToProgress.assignedDriverProgress === "inprogress") {
            return res.status(404).json(Response({
                statusCode: 404,
                status: "failed",
                message: "Driver's progress is already in progress."
            }));
        }
        const updateDrivertoProgress=await Order.findByIdAndUpdate(id,{assignedDriverProgress:"inprogress",orderStart:date},{new:true})

        console.log(updateDrivertoProgress)

        res.status(200).json(Response({statusCode:200,status:"ok",message:"updateed " ,data:updateDrivertoProgress}))
        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
 
    }
}

// get all inprogress oreder for the driver 
//---------------- #############
const getAllinprogressOrderForDriver=async(req,res,next)=>{
     // for pagination 
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
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
     if(!decoded._id==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
     }

// console.log(decoded)
     const getAllInprogresOrderLenth=await Order.find({assignedDriver:decoded._id,assignedDriverProgress:"inprogress"}).countDocuments()
   

     if (getAllInprogresOrderLenth === 0) {
        return res.status(404).json(Response({ statusCode: 404, message: 'You don\'t have any in-progress orders.', status: 'failed' }));
    }
    console.log(getAllInprogresOrderLenth,decoded._id)
     const getAllInprogresOrder=await Order.find({assignedDriver:decoded._id,assignedDriverProgress:"inprogress"}).populate('boutiqueId orderItems')
     .skip((page - 1) * limit)
     .limit(limit);


     console.log(getAllInprogresOrder)
     if (!getAllInprogresOrder || getAllInprogresOrder.length === 0) {
        return res.status(404).json(Response({ statusCode: 404, message: 'You are not assigned as a driver yet any ordered.', status: 'failed' }));
    }
    

     // const botiq=newOrder.map(order=>order.boutiqueId)
     const paginationOfProduct= pagination(getAllInprogresOrderLenth,limit,page)

    //  console.log(newOrder,decoded._id)
     res.status(200).json(Response({
         statusCode:200,
         status:"ok",
         message:"retrive all inprogress data",
         data:getAllInprogresOrder,
         pagination:paginationOfProduct
      }))

        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))

    }
}

// inprogress details search or tracking
//-----------------------------------#############
const inprogressDetailsForOrderTrac=async(req,res,next)=>{
    const id=req.params.id

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
     if(!decoded._id==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
     }

     const inprogressDetailsForDriver=await Order.findById(id).populate('boutiqueId orderItems')
     console.log(inprogressDetailsForDriver.assignedDriver)
     if(inprogressDetailsForDriver.assignedDriver===null){
        return res.status(404).json(Response({ statusCode: 404, message: 'boutique did not assingned any order to you.', status: 'failed' }));
 
     }
    //  console.log(inprogressDetailsForDriver,"ldkjlkdfjgkldfjglkdfj")
    //  if(inprogressDetailsForDriver.assignedDriver.toString()!==decoded._id){
    //     return res.status(404).json(Response({ statusCode: 404, message: 'you don not have any order in progress.',status:'faield' }));

    //  }
    //  if (!inprogressDetailsForDriver.assignedDriver) {
    //     // Handle the case where assigned driver is null
    //     return res.status(401).json(Response({ statusCode: 401, message: 'You are not assigned.', status: 'failed' }));
    // }

     res.status(200).json(Response({status:"ok",message:"details of inprogres order",statusCode:200,data:inprogressDetailsForDriver}))

        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))

    }
}

// accpet odrder for the details 
//------------------############
const accpetOrderDetails=async(req,res,next)=>{
    const id=req.params.id
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
        if(!decoded.role==="driver"){
         return res.status(404).json(Response({ statusCode: 404, message: 'you are not driver.',status:'faield' }));
        }

        const orderDetails=await Order.findById(id).populate('boutiqueId orderItems')
        res.status(200).json(Response({statusCode:200,status:"ok",message:"fetch order details",data:orderDetails}))
        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))

    }
}

// cancele order details
//--------------#####################
const cnacleOrderDetails=async(req,res,next)=>{
    

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
        if(!decoded.role==="driver"){
         return res.status(404).json(Response({ statusCode: 404, message: 'you are not driver.',status:'faield' }));
        }

        const id=req.params.id

        const detailsCancelOrder=await Cancelled.findById(id).populate('boutiqueId') .populate({path:'boutiqueId',
        path: 'orderId',
        populate: [
            { path: 'orderItems' },
            { path: 'boutiqueId' }
        ]
    })
    if (!detailsCancelOrder) {
        // Handle the case where the cancelled order is not found
        return res.status(404).json(Response({ statusCode: 404, message: 'you don not have any cancled order.', status: 'failed' }));
    }
        console.log(detailsCancelOrder)

        res.status(200).json(Response({statusCode:200,status:"ok",message:"cancled order showedfor the order",data:detailsCancelOrder}))


        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))

    }
}

module.exports={
    showDriverDashBored,
    cancelledOrderedAsDriver,
    showAllCancellOrder,
    showNewOrderForDriver,
    newOrderToProgress,
    getAllinprogressOrderForDriver,
    inprogressDetailsForOrderTrac,
    accpetOrderDetails,
    cnacleOrderDetails
}