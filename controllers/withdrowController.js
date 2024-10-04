 // Adjust the path as necessary
const jwt = require('jsonwebtoken');
const Withdrow = require('../models/Withderow');
const Response = require('../helpers/response');
const User = require('../models/User');
const { sendNotificationToDevice } = require('../config/push-notifaction');
const Notifaction = require('../models/Notifaction');
const BankAdd = require('../models/BankAdd');

const createWithdrowRequest = async (req, res) => {
    try {
        // Extract the token from the request headers
        const tokenWithBearer = req.headers.authorization;
        let token;

        if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
            token = tokenWithBearer.slice(7);
        }

        if (!token) {
            return res.status(401).json(Response({
                statusCode: 401,
                message: 'Token is missing.',
                status: 'failed'
            }));
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Destructure the request body
        const { bankName, bnakAccountNumber, withdrowAmount } = req.body;

        // Validate the input
        if (!bankName || !bnakAccountNumber || !withdrowAmount) {
            return res.status(400).json(Response({
                statusCode: 400,
                message: 'All fields are required.',
                status: 'failed'
            }));
        }

        // Fetch the user
        const user = await User.findById(decoded._id);

        // Check if the user's earnedMoney is less than the withdrawal amount
        if (user.earnedMoney < withdrowAmount) {
            return res.status(400).json(Response({
                statusCode: 400,
                message: 'Insufficient funds. You cannot withdraw more than your earned money.',
                status: 'failed'
            }));
        }

        // Create a new withdrawal request
        const newWithdrowRequest = new Withdrow({
            userId: decoded._id,
            bankName,
            bnakAccountNumber,
            withdrowAmount,
        });

        // Save the request to the database
        const savedWithdrowRequest = await newWithdrowRequest.save();

        // Deduct the withdrawal amount from the user's earned money
        user.earnedMoney -= withdrowAmount;
        await user.save();

        // Send push notification about password change
        const notification = {
            title: "Whitdrow request successfully",
            body: `Hi ${user.name} , you withdrow request successfully `,
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
                type:"withdrow"
                
              
          
              }
          
              const addNotifaction=await Notifaction.create(datas)
            
        } else {
            console.error('FCM token is missing for this user.');
        }


        // Send a successful response
        return res.status(200).json(Response({
            statusCode: 200,
            status: 'success',
            message: 'Withdrawal request created successfully',
            data: savedWithdrowRequest
        }));

    } catch (error) {
        console.error('Error creating withdrawal request:', error);
        return res.status(500).json(Response({
            statusCode: 500,
            status: 'failed',
            message: error.message
        }));
    }
};


const showWithdrow=async(req,res)=>{
    try {
         // Extract the token from the request headers
         const tokenWithBearer = req.headers.authorization;
         let token;
 
         if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
             token = tokenWithBearer.slice(7);
         }
 
         if (!token) {
             return res.status(401).json(Response({
                 statusCode: 401,
                 message: 'Token is missing.',
                 status: 'failed'
             }));
         }
 
         // Verify the token
         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

         const findWitdrow=await Withdrow.find({userId:decoded._id}).sort({createdAt:-1})

         return res.status(200).json(Response({status:"success",statusCode:200,data:findWitdrow,}))
         
 

        
    } catch (error) {
        return res.status(500).json(Response({
            statusCode: 500,
            status: 'failed',
            message: error.message
        }));
        
    }
}

const showAllWithdrowInAdmin = async (req, res) => {
    try {
        // Extract the token from the request headers
        const tokenWithBearer = req.headers.authorization;
        let token;

        if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
            token = tokenWithBearer.slice(7);
        }

        if (!token) {
            return res.status(401).json(Response({
                statusCode: 401,
                message: 'Token is missing.',
                status: 'failed'
            }));
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (decoded.role !== "admin") {
            return res.status(401).json(Response({
                statusCode: 401,
                message: "You are not admin.",
                status: "failed",
            }));
        }

        const { date } = req.query; // Assuming the date is passed as a query parameter
        let filter = {};

        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1); // Set the endDate to the next day

            filter.createdAt = {
                $gte: startDate,
                $lt: endDate
            };
        }

        const allWithdrow = await Withdrow.find(filter)
            .populate("userId")
            .sort({ createdAt: -1 });

        return res.status(200).json(Response({
            statusCode: 200,
            message: "Withdrawals fetched successfully",
            data: allWithdrow,
            status: "success"
        }));

    } catch (error) {
        return res.status(500).json(Response({
            statusCode: 500,
            status: 'failed',
            message: error.message
        }));
    }
};

const withdrowAccept=async(req,res)=>{
    try {

         // Extract the token from the request headers
         const tokenWithBearer = req.headers.authorization;
         let token;
 
         if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
             token = tokenWithBearer.slice(7);
         }
 
         if (!token) {
             return res.status(401).json(Response({
                 statusCode: 401,
                 message: 'Token is missing.',
                 status: 'failed'
             }));
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
          const {id}=req.query
          const allWithdrow=await Withdrow.findByIdAndUpdate(id,{status:"aproved"},{new:true}).populate("userId")

          const user=await User.findById(allWithdrow.userId)

          // Send push notification about password change
        const notification = {
            title: "your request has been aproved by the admin",
            body: `Hi ${user.name} , your withdrow amount aproved successfully you will get money very soon `,
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
                type:"withdrow"
                
              
          
              }
          
              const addNotifaction=await Notifaction.create(datas)
            
        } else {
            console.error('FCM token is missing for this user.');
        }

          
          res.status(200).json(Response({statusCode:200,message:"aproved successfully",data:allWithdrow,status:"success"}))
        
    } catch (error) {
        return res.status(500).json(Response({
            statusCode: 500,
            status: 'failed',
            message: error.message
        }));
        
    }

}
const withdrowcancel=async(req,res)=>{
    try {

         // Extract the token from the request headers
         const tokenWithBearer = req.headers.authorization;
         let token;
 
         if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
             token = tokenWithBearer.slice(7);
         }
 
         if (!token) {
             return res.status(401).json(Response({
                 statusCode: 401,
                 message: 'Token is missing.',
                 status: 'failed'
             }));
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
   const {id}=req.query
          const allWithdrow=await Withdrow.findByIdAndUpdate(id,{status:"cancel"},{new:true}).populate("userId")
          const user=await User.findById(allWithdrow.userId)

          // Send push notification about password change
        const notification = {
            title: "your request has been cancel by the admin",
            body: `Hi ${user.name} , your request has been  canceled , if you have any query about that pleace contact with admin`,
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
                type:"withdrow"
                
              
          
              }
          
              const addNotifaction=await Notifaction.create(datas)
            
        } else {
            console.error('FCM token is missing for this user.');
        }

          res.status(200).json(Response({statusCode:200,message:"cancel successfully",data:allWithdrow,status:"success"}))
        
    } catch (error) {
        return res.status(500).json(Response({
            statusCode: 500,
            status: 'failed',
            message: error.message
        }));
        
    }

}

// add bank account

const addBankAccount=async(req,res,next)=>{
    try {
         // Extract the token from the request headers
         const tokenWithBearer = req.headers.authorization;
         let token;
 
         if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
             token = tokenWithBearer.slice(7);
         }
 
         if (!token) {
             return res.status(401).json(Response({
                 statusCode: 401,
                 message: 'Token is missing.',
                 status: 'failed'
             }));
         }
 
         // Verify the token
         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

         const {bankName,accountNumber}=req.body

         const data={
            userId:decoded._id,
            bankName,
            bnakAccountNumber:accountNumber

         }

         const witdrow= await BankAdd.create(data)

         res.status(200).json(Response({statusCode:200,message:" successfully",data:witdrow,status:"success"}))


        
    } catch (error) {

        return res.status(500).json(Response({
            statusCode: 500,
            status: 'failed',
            message: error.message
        }));
        
    }
}

const showBankOfuser=async(req,res)=>{
    try {
        // Extract the token from the request headers
        const tokenWithBearer = req.headers.authorization;
        let token;

        if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
            token = tokenWithBearer.slice(7);
        }

        if (!token) {
            return res.status(401).json(Response({
                statusCode: 401,
                message: 'Token is missing.',
                status: 'failed'
            }));
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const bank=await BankAdd.find({userId:decoded._id})

        res.status(200).json(Response({statusCode:200,message:" successfully",data:bank,status:"success"}))

        
    } catch (error) {
        return res.status(500).json(Response({
            statusCode: 500,
            status: 'failed',
            message: error.message
        }));
        
    }
}
module.exports = {
    createWithdrowRequest,
    showWithdrow,
    showAllWithdrowInAdmin,
    withdrowcancel,
    withdrowAccept,
    addBankAccount,
    showBankOfuser
};
