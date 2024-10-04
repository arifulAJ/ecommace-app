const jwt = require("jsonwebtoken");



// notifaction post will add later

const Response = require("../helpers/response");
const Notifaction = require("../models/Notifaction");
const Product = require("../models/Product");
const pagination = require("../helpers/pagination");
const User = require("../models/User");
const { sendNotificationToDevice } = require("../config/push-notifaction");

// get notifaction 

const getNotifaction=async(req,res)=>{
    try {
         // for pagination 
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 1000;
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
        console.log(decoded)



        const notifactionlength=await Notifaction.find({receiverId:decoded._id}).countDocuments()
        if(notifactionlength===0){
            return res.status(404).json(Response({ statusCode: 404, message: 'you do not have notifaction.', status: 'failed' }));


        }
        const notifaction=await Notifaction.find({receiverId:decoded._id})
        .sort({createdAt:-1})
        .skip((page - 1) * limit)
        .limit(limit);

        const paginationOfProduct= pagination(notifactionlength,limit,page)


        res.status(200).json(Response({ status: "success", message: "succefully  show", statusCode: 200,data:notifaction,pagination:paginationOfProduct }));

        
    } catch (error) {
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));

        
    }
}


// get notifaction of admin

const adminNotifaction=async(req,res)=>{
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
        console.log(decoded)

        const notifactionlength=await Notifaction.find({role:"admin"}).countDocuments()

        if(notifactionlength===0){
            return res.status(404).json(Response({ statusCode: 404, message: 'you do not have notifaction.', status: 'failed' }));


        }
        const notifaction=await Notifaction.find({role:"admin"}).populate("productId userId")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        const paginationOfProduct= pagination(notifactionlength,limit,page)

        res.status(200).json(Response({ status: "success", message: "succefully  show", statusCode: 200,data:notifaction,pagination:paginationOfProduct }));

        
    } catch (error) {
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));

        
    }
}

// admin aproved product 

const adminAprovedProduct=async(req,res)=>{

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
            console.log(decoded)
            const {id}=req.query
            const notifaction=await Notifaction.findOneAndUpdate({productId:id},{isParoved:"aproved"}).populate("productId")
           
            const updatedProduct=await Product.findByIdAndUpdate(id,{isAproved:true},{new:true})
            const user=await User.findById(updatedProduct.userId)
         

            // Send push notification about password change
        const notification = {
            title: "Product aproved ",
            body: `Hi  ${user.name} ,Your prodcut is aproved successfully `,
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
                isParoved:"aproved",
                receiverId:user._id,
                title:notification.title,
                message:notification.body,
                image:user.image,
                role:user.role,
                type:"product"
                
              
          
              }
          
              const addNotifaction=await Notifaction.create(datas)
            
        } else {
            console.error('FCM token is missing for this user.');
        }

       

            res.status(200).json(Response({ status: "success", message: "aproved successfully ", statusCode: 200,data:updatedProduct }));

    
        
    } catch (error) {
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));

        
    }
}
// admin aproved the driver
const adminAprovedDriver=async(req,res)=>{

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
           
            const {id}=req.query
            const notifaction=await Notifaction.findOneAndUpdate({userId:id},{isParoved:"aproved"})
           
            const updatedProduct=await User.findByIdAndUpdate(id,{isBlocked:false},{new:true})
            const user=await User.findById(updatedProduct._id)
         
console.log(updatedProduct,"++++++++++++++++++++++++++++++++",notifaction);
            // Send push notification about password change
        const notification = {
            title: " Admin aproved the driver ",
            body: `Hi ${user.name}, your account has been approved`,
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
                isParoved:"aproved",
                receiverId:user._id,
                title:notification.title,
                message:notification.body,
                image:user.image,
                role:user.role,
                type:"driver"
                
              
          
              }
          
              const addNotifaction=await Notifaction.create(datas)
            
        } else {
            console.error('FCM token is missing for this user.');
        }

       

            res.status(200).json(Response({ status: "success", message: "aproved successfully ", statusCode: 200,data:user }));

    
        
    } catch (error) {
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));

        
    }
}


  // admin denied the driver account 
const adminDenayDriver=async(req,res)=>{

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
            console.log(decoded)
    
            // const notifaction=await Notifaction.find({role:"admin"}).populate("productId")
            const {id}=req.query
            const notifaction=await Notifaction.findOneAndUpdate({userId:id},{isParoved:"denay"})

            const updatedProduct=await User.findByIdAndUpdate(id,{isBlocked:true})
            const user=await User.findById(updatedProduct._id)
            console.log(user,"--------------------nul",updatedProduct,id);

            // Send push notification about password change
        const notification = {
            title: "driver added  denayed  by the admin",
            body: `Hi  ${user.name} ,Your account Reject by the admin `,
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
                isParoved:"denay",
                receiverId:user._id,
                title:notification.title,
                message:notification.body,
                image:user.image,
                role:user.role,
                type:"driver"
                
              
          
              }
          
              const addNotifaction=await Notifaction.create(datas)
            
        } else {
            console.error('FCM token is missing for this user.');
        }

            res.status(200).json(Response({ status: "success", message: "Denayed successfully ", statusCode: 200,data:user }));

    
        
    } catch (error) {
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));

        
    }
}
  // admin denied the product 
const adminDenayProduct=async(req,res)=>{

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
            console.log(decoded)
    
            // const notifaction=await Notifaction.find({role:"admin"}).populate("productId")
            const {id}=req.query
            const updatedProduct=await User.findByIdAndUpdate(id,{isBlocked:true})
            const user=await User.findById(updatedProduct.userId)
            console.log(user,"--------------------nul",updatedProduct,id);

            // Send push notification about password change
        const notification = {
            title: "Product denayed ",
            body: `Hi  ${user.name} ,Your prodcut is denay place cotact with admin `,
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
                isParoved:"denay",
                receiverId:user._id,
                title:notification.title,
                message:notification.body,
                image:user.image,
                role:user.role,
                type:"product-denay"
                
              
          
              }
          
              const addNotifaction=await Notifaction.create(datas)
            
        } else {
            console.error('FCM token is missing for this user.');
        }

            res.status(200).json(Response({ status: "success", message: "Denay  successfully ", statusCode: 200,data:updatedProduct }));

    
        
    } catch (error) {
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));

        
    }
}


module.exports={
    getNotifaction,
    adminNotifaction,
    adminAprovedProduct,
    adminDenayProduct,
    adminDenayDriver,
    adminAprovedDriver
    
}