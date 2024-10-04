const Response = require("../helpers/response")
const Card = require("../models/Card")
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { currentMonthOrders, calculateTotalTips, calculateTotalSubTotal, calculateTotalShippingFee, currentMonthOrdersDriver } = require("../utils/calculateOfOrder");


const AddCard=async(req,res,next)=>{
    const {cardOwaner,cardNumber,expiry,cvv}=req.body
    const {image} = req.files;

    const files=[]
    if(req.files){
        image.forEach(element => {
            const publicFileUrl = `/images/users/${element.filename}`;

            files.push({
                publicFileUrl,
                path: element.filename,
              });
        });
       
    }
    try {

        const cardData={
            image:files[0],
            cardNumber,
            cardOwaner,
            expiry,
            cvv
        }
        const createCard=await Card.create(cardData)
        res.status(200).json(Response({statusCode:200,status:"ok",message:"card created successfully",data:createCard
        }))
        
    } catch (error) {
        res.status(500).json(Response({status:"failed",statusCode:500,message:error.message}))
        
    }

}

const showCard=async(req,res,nextt)=>{
    try {
        const allCards=await Card.find()
        res.status(200).json(Response({statusCode:200,status:"ok",message:"card showed successfully",data:allCards
    }))
        
    } catch (error) {
        res.status(500).json(Response({statusCode:500,message:error.message,status:"failed"}))
        
    }
}



// boutique withdrow money 
const boutiqueEarned=async(req,res)=>{
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
      return res.status(404).json(Response({ statusCode: 404, message: 'you are not boutique.',status:'faield' }));
     }

     const earnign=await User.findById(decoded._id)

    const thisMonthOrders = await currentMonthOrders(decoded._id);

   // tips calculation 
const tipsResults = calculateTotalTips(thisMonthOrders);
// calculate subtotal
const totalSubTotal = calculateTotalSubTotal(thisMonthOrders);

// calcualte shepping free
const totalShippingFee = calculateTotalShippingFee(thisMonthOrders);

// driverPrice for the oredr
const driverPrice=parseInt(tipsResults)+totalShippingFee


     
     const data={
        totalEarnign:earnign.earnedMoney,
        earnThisMonth:totalSubTotal-driverPrice

     }


     res.status(200).json(Response({statusCode:200,status:"success",message:"earned value show successfully ", data:data}))


        
    } catch (error) {
        return res.status(500).json(Response({statusCode:500,message:error.message,status:"failed"}))

        
    }
}
const driverEarned=async(req,res)=>{
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

     if(decoded.role!=="driver"){
      return res.status(404).json(Response({ statusCode: 404, message: 'you are not driver.',status:'faield' }));
     }

     const earnign=await User.findById(decoded._id)

    const thisMonthOrders = await currentMonthOrdersDriver(decoded._id);
   

   // tips calculation 
const tipsResults = calculateTotalTips(thisMonthOrders);


// calcualte shepping free
const totalShippingFee = calculateTotalShippingFee(thisMonthOrders);

// driverPrice for the oredr
const driverPrice=parseFloat(tipsResults)+totalShippingFee


     
     const data={
        totalEarnign:earnign.earnedMoney,
        earnThisMonth:driverPrice

     }


     res.status(200).json(Response({statusCode:200,status:"success",message:"earned value show successfully ", data:data}))


        
    } catch (error) {
        return res.status(500).json(Response({statusCode:500,message:error.message,status:"failed"}))

        
    }
}
module.exports={
    AddCard,
    showCard,
    boutiqueEarned,
    driverEarned
}