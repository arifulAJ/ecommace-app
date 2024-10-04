const Response = require("../helpers/response")
const Order = require("../models/Order")
const jwt = require("jsonwebtoken");
const OrderItem = require("../models/OrderItem");
const User = require("../models/User");
const Location = require("../models/Location");
const pagination = require("../helpers/pagination");
const Product = require("../models/Product");
const { sendNotificationToDevice } = require("../config/push-notifaction");
const Notifaction = require("../models/Notifaction");




const makeOreder = async (req, res, next) => {
    try {   const {
        orderItemsId,
        totalAmount,
        status,
        deliveryAddress,
        paymentMethod,
        serviceFee,
        paymentStatus,
        tips,
        shippingFee,
        tax,
        boutiqueId,
        subTotal
    } = req.body;

    
    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
    }

  
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded.role,"+ if not found show it ");

        if(decoded.role!=="shopper"){
            console.log("there is no user _____________________________");
            return res.status(404).json(Response({ statusCode: 404, message: 'you are not login user .',status:'faield' }));


        }

       

        const orderItem=await OrderItem.findById(orderItemsId)

        // Create the final order record
        const orderedProperty = {
            userId: decoded._id,
            totalAmount:parseFloat(totalAmount).toFixed(2),
            status,
            deliveryAddress,
            paymentMethod,
            paymentStatus,
            tips,
            shippingFee,
            orderId: orderItem.orderId,
            serviceFee,
            orderItems: orderItem._id,
            tax,
            boutiqueId,
            subTotal:parseFloat(subTotal).toFixed(2)
        };

        const createdOrder = await Order.create(orderedProperty);

 const user=await User.findById(decoded._id)
 // Send push notification about password change
        const notification = {
            title: "Order created Succeessfully",
            body: `Hi  ${user.name} thank you for your Order`,
        };

        // if (user.fcmToken) {
        //     await sendNotificationToDevice([user.fcmToken], notification);
        // }
        const data={
            username:"name"
        }
        if (user.fcmToken) {
            await sendNotificationToDevice(user.fcmToken, notification,data);
            const datas={
                receiverId:user._id,
                title:notification.title,
                message:notification.body,
                image:user.image,
                role:user.role,
                type:"order"
                
              
          
              }
          
              const addNotifaction=await Notifaction.create(datas)
            
        } else {
            console.error('FCM token is missing for this user.');
        }

    
// Calculate and update each boutique's earnings

orderItem.orederedProduct.forEach(async(product)=>{
    
    const products=await Product.findById(product.productId)
    const userPersentage=await User.findById(products.userId)

    const discoutn=userPersentage.boutiquePersentage/100
    const persentage=parseInt(product.productPrice*product.quantity)

    const totalDiscount=(persentage*discoutn)
    const finalAmount=persentage-totalDiscount
    console.log(discoutn,persentage,totalDiscount,persentage,finalAmount,"==============find boutiqy ");

// const user=await User.findByIdAndUpdate(products.userId,{earnedMoney:persentage*0.80})
// Calculate earnings and update the user's earnedMoney

const user=await User.findByIdAndUpdate(
    products.userId,
    {
        $inc: {
            earnedMoney: finalAmount
        }
    },
    {new:true}
);


// Find and update the admin's earnedMoney
const admin = await User.findOne({ role: 'admin' });

if (!admin) {
    console.error('Admin user not found');
    return;
}

const adminUpdate = await User.findByIdAndUpdate(
    admin._id,
    {
        $inc: {
            earnedMoney:parseFloat(totalDiscount) // Example: Admin gets 15% of the finalAmount
        }
    },
    { new: true } // Return the updated document
);

        

})
       
// console.log("------------------------------------------",users)

        if (!res.headersSent) {
            return res.status(200).json({
                status: 'success',
                message: 'Order created successfully',
                data: createdOrder,
                statusCode: 200
            });
        }

    } catch (error) {
        console.error('Error creating order:', error);

        if (!res.headersSent) {
            return res.status(500).json({
                status: 'failed',
                message: error.message,
                statusCode: 500
            });
        }
    }
};




const newOrder=async(req,res,next)=>{
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
       if(decoded.role!=="boutique"){
        return res.status(404).json(Response({ statusCode: 404, message: 'you are not boutique.',status:'faield' }));
       }



        const totalNewOrderLengt=await Order.find({status:"neworder",boutiqueId:decoded._id})
        const totalNewOrderLength=await Order.find({status:"neworder",boutiqueId:decoded._id}).countDocuments()
        console.log(totalNewOrderLengt)
        if(totalNewOrderLength===0){
            // update the status 200 to 404 
            return res.status(200).json(Response({ statusCode: 200, message: 'you dont have any new order product.',status:'faield' }));
        }
     
        const totalNewOrder=await Order.find({status:"neworder",boutiqueId:decoded._id}).populate("orderItems")
        .skip((page - 1) * limit)
        .limit(limit);
         // call the pagination

         const paginationOfProduct= pagination(totalNewOrderLength,limit,page)
         res.status(200).json(Response({
             message: "order showed succesfully",
             status:"success",
             statusCode:200,
             data: totalNewOrder,
             pagination: paginationOfProduct
         }));
        
     } catch (error) {

        // server error
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
     }
}
const orderInprogresShow=async(req,res,next)=>{
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
       if(decoded.role!=="boutique"){
        return res.status(404).json(Response({ statusCode: 404, message: 'you are not boutique.',status:'faield' }));
       }

        const totalinProgressOrderLength=await Order.find({status:"inprogress",boutiqueId:decoded._id}).countDocuments()
        console.log(totalinProgressOrderLength)
        // if page lent is 0 then call it 
        if (totalinProgressOrderLength === 0) {
            return res.status(404).json(Response({ statusCode: 404, message: 'You don\'t have any in-progress orders.', status: 'failed' }));
        }
        const totainprogressOrder=await Order.find({status:"inprogress",boutiqueId:decoded._id}).populate("orderItems")
        .skip((page - 1) * limit)
        .limit(limit);
         // call the pagination

         const paginationOfProduct= pagination(totalinProgressOrderLength,limit,page)
         res.status(200).json(Response({
             message: "order showed succesfully",
             status:"success",
             statusCode:200,
             data: totainprogressOrder,
             pagination: paginationOfProduct
         }));
        
     } catch (error) {

        // server error
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
     }
}

// update the order statuse new order to in-progress
const orderInProgress=async(req,res,next)=>{
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
       if(!decoded._id==="boutique"){
        return res.status(404).json(Response({ statusCode: 404, message: 'you are not boutique.',status:'faield' }));
       }
        const inprogress=await Order.findByIdAndUpdate(id, { status: "inprogress" }, { new: true },)
        

        res.status(200).json(Response({status:"success",statusCode:200,message:"updated the statuse ",data:inprogress}))

        
    } catch (error) {
        // server error
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }

}

// order details 
const orderDetails=async(req,res,next)=>{
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
    if(decoded.role!=="boutique"){
        res.status(404).json(Response({status:"failed",statusCode:404,message:" your are not boutique " })) 
    }
    const boutique=await Location.findOne({ userId: decoded._id }).populate('userId','image name');



        const detailsOfOrder=await Order.findById(id).populate('orderItems','orederedProduct')

         res.status(200).json(Response({status:"success",statusCode:200,message:"fetched order details ",data:{detailsOfOrder,boutique}}))
    } catch (error) {
        // server error
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    
    }
}

// update statuse for assigned driver 
const assignedDriver = async (req, res, next) => {
    const id = req.params.id;
    const driverId = req.query.driverId;

    
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
    if(decoded.role!=="boutique"){
       return res.status(404).json(Response({status:"failed",statusCode:404,message:" your are not boutique " })) 
    }
    console.log(decoded)
    // const boutique=await Location.findOne({ userId: decoded._id }).populate('userId','image name');


      const orderidMatch=await Order.findById(id)
    //   console.log(orderidMatch.boutiqueId)
      const user =await User.findById(orderidMatch.boutiqueId)
      
    //   console.log(decoded.email,user.email)
      if(user.email!==decoded.email){
       return  res.status(404).json(Response({status:"failed",statusCode:404,message:" your are not this boutique pleace signin as shoper " })) 

      }
    //   const findTheDriverAccepet=await Order.findById(id)
      // Schedule the task to revert the order status if the driver does not accept within 5 minutes
      setTimeout(async () => {
        const orderAfterTimeout = await Order.findById(id);
        if (orderAfterTimeout.status === "assigned" && orderAfterTimeout.assignedDriverProgress === "newOrder") {
            // Revert order status to "inprogress" and set assigned driver to null
            await Order.findByIdAndUpdate(id, { status: "inprogress", assignedDriver: null, assignedDriverProgress: null });
        }
    }, 5 * 60 * 1000); // 5 minutes delay


     //Update the order with the assigned driver
   const driverAssigned = await Order.findByIdAndUpdate(id, { assignedDriver: driverId, status:"assigned",assignedDriverProgress:"newOrder" }, { new: true });
   //    await User.findByIdAndUpdate(driverId,{assignedDriverProgress:"newOrder"},{new:true})
      res.status(200).json(Response({ status: "success", statusCode: 200, message: "Updated for assigned driver", data: driverAssigned }));
   
    } catch (error) {
        // Server error
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));
    }
};

// update statuse for assigned driver 
const findNearByDriver = async (req, res, next) => {
    

    // const boutique = req.query.boutiqueId;

    function calculateDistance(boutique, driver) {
        const R = 6371; // Radius of the Earth in kilometers
        const lat1 = boutique.latitude;
        const lon1 = boutique.longitude;
        const lat2 = driver.latitude;
        const lon2 = driver.longitude;
        const dLat = (lat2 - lat1) * Math.PI / 180; // Convert degrees to radians
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
    }

    console.log(calculateDistance,"-------------calculate")
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
//  console.log(token);
   try {
       // Verify the token
       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
       if(decoded.role!=="boutique"){
        return res.status(404).json(Response({ statusCode: 404, message: 'you are not boutique.',status:'faield' }));
       }
        // Boutique location 
        const boutiqueLocation = await User.findById(decoded._id);
        // console.log(boutiqueLocation.currentLocation,"----------------------");
   
        // const allDrivers = await User.find({ role: 'driver',status:"active" }).populate() this is final but for the development we will do next 

        const allDrivers = await User.find({ role: 'driver' }).populate()

      
        const drivers = allDrivers
        .filter(driver => driver.currentLocation !== undefined) // Filter out drivers without a currentLocation
        .map(driver => driver.currentLocation); // Map to return only the currentLocation of each driver
    
        
        const nearbyDrivers = drivers.filter(driver => {
           
        
            // Calculate the distance if the driver has a current location
            console.log(driver, "========================", boutiqueLocation.currentLocation, "------------------------latitude");
            const distance = calculateDistance(boutiqueLocation.currentLocation, driver);
        
            // Return true if the distance is within the desired range, otherwise false
            return distance < 100.5; // Filter drivers within one kilometer
        });
        
       
console.log(allDrivers);

        if (nearbyDrivers.length > 0) {
            // Update the order with the assigned driver
            // const driverAssigned = await Order.findByIdAndUpdate(id, { assignedDriver: }, { new: true });
            res.status(200).json(Response({ status: "success", statusCode: 200, message: "Updated for assigned driver", data: allDrivers }));
        } else {
            res.status(404).json(Response({ status: "failed", statusCode: 404, message: "No drivers found within one kilometer" }));
        }
    } catch (error) {
        console.log(error);
        // Server error
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));
    }
};

// boutique all orders  showing it in boutique dashbord
const allOrdersOfBoutique=async(req,res,next)=>{
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
    if(decoded.role!=="boutique"){
        res.status(404).json(Response({status:"failed",statusCode:404,message:" your are not boutique " })) 
    }
    
    const user= await User.findById(decoded._id)

    if(user.isBlocked===true){
        return res.status(401).json(Response({ statusCode: 401, message: 'you are blocked by admin',status:'faield' }));


    }
   


    const allOrderedProductOfBoutique = await Order.find({boutiqueId:decoded._id});
    // const statuseOfDashBoard=allOrderedProductOfBoutique.map(order=>order.status)
    // console.log(allOrderedProductOfBoutique)

// const activeOrders=await Order.find({boutiqueId:decoded._id},{status:"neworder"})
const activeOrders = await Order.find({ boutiqueId: decoded._id, status: "inprogress" });

let totalAmountOfActiveOrder = 0;

activeOrders.forEach(order => {
    totalAmountOfActiveOrder += parseFloat(order.totalAmount.replace(/[^\d.]/g, ''));

});
// compleate order 
const compliteOrder = await Order.find({ boutiqueId: decoded._id, status: "delivered" });

let totalCompliteOrder = 0;

compliteOrder.forEach(order => {
    totalCompliteOrder += parseFloat(order.totalAmount.replace(/[^\d.]/g, ''));

});

console.log("Total amount of new orders:", totalAmountOfActiveOrder,activeOrders.length);
//
// compleate order 
const reciveOrder = await Order.find({ boutiqueId: decoded._id, status: "neworder" });

let reciveOrderTotal = 0;

reciveOrder.forEach(order => {
    reciveOrderTotal += parseFloat(order.totalAmount.replace(/[^\d.]/g, ''));

});

console.log("Total amount of new orders:", totalAmountOfActiveOrder,activeOrders.length);
//
const TotalOrder = await Order.find({ boutiqueId: decoded._id });

let totalOrderAmount = 0;

TotalOrder.forEach(order => {
    totalOrderAmount += parseFloat(order.totalAmount.replace(/[^\d.]/g, ''));

});

console.log("Total amount of new orders:", totalAmountOfActiveOrder,activeOrders.length);
//

const boutiqueDashboard={
    activeOrder:{
        totalOrder:activeOrders.length,
        totalAmount:totalAmountOfActiveOrder.toFixed(2)
    },
    compliteOrder:{
        totalOrder:compliteOrder.length,
        totalAmount:totalCompliteOrder.toFixed(2)
    },
    reciveOrder:{
        totalOrder:reciveOrder.length,
        totalAmount:reciveOrderTotal.toFixed(2)
    },
    totalOrdar:{
        totalOrder:TotalOrder.length,
        totalAmount:totalOrderAmount.toFixed(2)
    }
}


        return res.status(200).json(Response({statusCode:200,status:"ok",message:"fetch alldeta ",data:boutiqueDashboard}))
    } catch (error) {
         // server error
       return   res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }
}



const inprogresOrderDetails=async (req,res,next)=>{
    const id=req.params.id
    try {
        const progressDetails=await Order.findById(id).populate("orderItems boutiqueId")
        console.log(progressDetails,"-------------");

        res.status(200).json(Response({statusCode:200,status:"ok",message:"fetch details of inprogress order ",data:progressDetails}))


        
    } catch (error) {
    // server error
    res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
}
}


const assignedOrderedShowe = async (req, res, next) => {
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
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (decoded.role!== "boutique") {
            return res.status(404).json(Response({ statusCode: 404, message: 'You are not a boutique.', status: 'failed' }));
        }

        const totalInProgressOrderLength = await Order.find({ status: "assigned",boutiqueId:decoded._id }).countDocuments();
        if (totalInProgressOrderLength === 0) {
            return res.status(404).json(Response({ statusCode: 404, message: 'You don\'t have any assigned orders yet.', status: 'failed' }));
        }

        // Fetch orders based on criteria
        const totainprogressOrder = await Order.find({boutiqueId:decoded._id,
            $or: [
                { status: "assigned", assignedDriverProgress: "newOrder" }, // Orders with both fields
                { status: "assigned" }, // Orders with only status "assigned"
                { assignedDriverProgress: "newOrder" }, // Orders with only assignedDriverProgress "newOrder"
                { assignedDriverProgress: "inprogress" } // Orders with only assignedDriverProgress "inprogress"
            ]
        }).populate("orderItems assignedDriver")
            .skip((page - 1) * limit)
            .limit(limit);

    //     const inProgressOrders = totainprogressOrder.filter(order => order.assignedDriverProgress === "inprogress");
    //     const notAcceptedOrders = totainprogressOrder.filter(order => order.assignedDriverProgress !== "inprogress");
      const paginationOfProduct= pagination(totalInProgressOrderLength,limit,page)
console.log(totainprogressOrder,"--------------");
      return res.status(200).json(Response({
        message: "Orders with assignedDriverProgress as 'inprogress'",
        status: "success",
        statusCode: 200,
        data: totainprogressOrder,
        pagination:paginationOfProduct
    }));
       
        
    
    } catch (error) {
        // server error
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));
    }
}

const deliveriedOrder=async(req,res,next)=>{
    try {
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
       return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
   }

 
       // Verify the token
       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
       if (decoded.role!== "boutique") {
           return res.status(404).json(Response({ statusCode: 404, message: 'You are not a boutique.', status: 'failed' }));
       }
      const deliveriedOrderLength=await Order.find({boutiqueId:decoded._id,status:"delivered"}).countDocuments()
      const deliveriedOrder=await Order.find({boutiqueId:decoded._id,status:"delivered"}).populate("orderItems") .skip((page - 1) * limit)
      .limit(limit);
      if(deliveriedOrder.length===0){
        return res.status(404).json(Response({ statusCode: 404, message: 'you dont have any order', status: 'failed' }));

    }
      const paginationOfProduct= pagination(deliveriedOrderLength,limit,page)
    
      return res.status(200).json(Response({
        message: "Orders with assignedDriverProgress as 'inprogress'",
        status: "success",
        statusCode: 200,
        data: deliveriedOrder,
        pagination:paginationOfProduct
    }));
    } catch (error) {
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));

        
    }
}
const deliveriedOrderForDriver=async(req,res,next)=>{
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
       return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
   }

   try {
       // Verify the token
       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
       if (decoded.role!== "driver") {
           return res.status(404).json(Response({ statusCode: 404, message: 'You are not a driver.', status: 'failed' }));
       }
      const deliveriedOrderLength=await Order.find({assignedDriver:decoded._id,assignedDrivertrack:"orderDelivered"}).countDocuments()
      const deliveriedOrder=await Order.find({assignedDriver:decoded._id,assignedDrivertrack:"orderDelivered"}).populate("boutiqueId orderItems") .skip((page - 1) * limit)
      .limit(limit);
      console.log(deliveriedOrder,"{{{{{{{{{{{{{{{{{{{{{{{{{{{{{");
      const paginationOfProduct= pagination(deliveriedOrderLength,limit,page)

      return res.status(200).json(Response({
        message: "Orders with assignedDriverProgress as 'inprogress'",
        status: "success",
        statusCode: 200,
        data: deliveriedOrder,
        pagination:paginationOfProduct
    }));
    } catch (error) {
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));

        
    }
}
  const showDeliveryOrderDetailsForDriver=async(req,res,next)=>{
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
    const id =req.params.id
    console.log(id)
       // Verify the token
       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
       if (decoded.role!== "driver") {
           return res.status(404).json(Response({ statusCode: 404, message: 'You are not a driver.', status: 'failed' }));
       }
        const deliveredDetails=await Order.findById(id).populate("boutiqueId orderItems")
         
        return res.status(200).json(Response({
            message: "Orders details showed'",
            status: "success",
            statusCode: 200,
            data: deliveredDetails,
           
        }));
        
    } catch (error) {
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));

    }
  }
  const showDeliveryOrderDetailsForboutique=async(req,res,next)=>{
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
    const id =req.params.id
    console.log(id)
       // Verify the token
       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
       if (decoded.role!== "boutique") {
           return res.status(404).json(Response({ statusCode: 404, message: 'You are not a boutique.', status: 'failed' }));
       }
        const deliveredDetails=await Order.findById(id).populate("boutiqueId orderItems")
         
        return res.status(200).json(Response({
            message: "Orders details showed'",
            status: "success",
            statusCode: 200,
            data: deliveredDetails,
           
        }));
        
    } catch (error) {
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));

    }
  }

  const showOrderedOfShoper=async(req,res,next)=>{
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
       return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
   }

   try {
    const id =req.params.id
    console.log(id)
       // Verify the token
       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //    if(decoded.role==="shopper"){
    //     return res.status(404).json(Response({ statusCode: 404, message: 'you are not shoper', status: 'failed' }));


    //    }
       const totalInProgressOrderLength = await Order.find({userId:decoded._id,status: { $nin: 'delivered',} }).countDocuments();
       if (totalInProgressOrderLength === 0) {
           return res.status(404).json(Response({ statusCode: 404, message: 'You don\'t have any  orders yet.', status: 'failed' }));
       }
      
       const OrderItems=await Order.find({userId:decoded._id,status: { $nin: 'delivered',} }).populate("orderItems assignedDriver")
       .skip((page - 1) * limit)
       .limit(limit);
       const paginationOfProduct= pagination(totalInProgressOrderLength,limit,page)

       return res.status(200).json(Response({
        message: "Orders details showed'",
        status: "success",
        statusCode: 200,
        data: OrderItems,
        pagination:paginationOfProduct
       
    }));
    } catch (error) {
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));

    }
  }
module.exports={
    makeOreder,
    orderInProgress,
    orderDetails,
    allOrdersOfBoutique,
    assignedDriver,
    newOrder,
    orderInprogresShow,
    inprogresOrderDetails,
    assignedOrderedShowe,
    findNearByDriver,
    deliveriedOrder,
    deliveriedOrderForDriver,
    showDeliveryOrderDetailsForDriver,
    showDeliveryOrderDetailsForboutique,
    showOrderedOfShoper
}