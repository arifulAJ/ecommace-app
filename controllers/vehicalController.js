
const Response = require("../helpers/response");
const Driver = require("../models/Driver");
const Notifaction = require("../models/Notifaction");
const User = require("../models/User");
const jwt = require('jsonwebtoken');




const addVehicle = async (req, res, next) => {
   
    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token is missing.' });
    }

    try {
        // Verify the token
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });

        console.log(decoded.role,"this role")
        // Proceed with authentication or authorization logic

        // Find the user by ID from the decoded token
        const user = await User.findOne({ _id: decoded._id, role:"driver" });

        if (!user) {
            return res.status(401).json({ success: false, message: 'your are not a driver .' });
        }

        // Check if the driver has already added a vehicle
        const existingVehicle = await Driver.findOne({ userId: decoded._id }).exec();

        if (existingVehicle) {
            return res.status(400).json({ success: false, message: 'Driver has already added a vehicle.' });
        }

        // If the driver is valid and has not added a vehicle yet
        const { make, model, year,registrationNumber } = req.body;
        const { driverLicense, registration, policeCheck,  } = req.files;

        // Create a new vehicle object with user ID
        const newVehicle = new Driver({
            userId: decoded._id,
            make,
            model,
            year,registrationNumber,
            driverLicense:driverLicense[0],
            registration:registration[0],
            policeCheck:policeCheck[0],
           
        });

        // Save the new vehicle to the database
        const data =await newVehicle.save();
        await User.findByIdAndUpdate(decoded._id,{isBlocked:true})
        // const user=await User.findById(decoded._id)
const datas={
  userId:decoded._id,
  isParoved:"pending",
  title:"driver accept ",
  message:`Hi ${user.name} has added a driver , would you like to accept this driver? `,
  role:"admin",
  type:"driver"
}
const addNotifaction=await Notifaction.create(datas)

        // return res.status(200).json({ success: true, message: 'Vehicle added successfully.' });
        res.status(200).json(Response({statusCode:200,status:"success", message: "vehical added successfully",data:{data} }));
    } catch (error) {
        console.error('Error adding vehicle:', error);
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:"failed" }));
    }
};

const findAllDrivers=async(req,res,next)=>{

    try {
        const allDrivers = await User.find({ role: 'driver' });
        res.status(200).json(Response({statusCode:200,status:"ok",message:"fetched successfully ", data:allDrivers}))
        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:"failed" }));
    }
}
const findNearByDriver=async(req,res,next)=>{
    const boutique = req.query.boutiqueId;

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
        const c = 20000 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
    }

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
       if(!decoded._id==="boutique"){
        return res.status(401).json(Response({ statusCode: 401, message: 'you are not boutique.',status:'faield' }));
       }
       
        // Boutique location 
        const boutiqueLocation = await User.findById(boutique);
        console.log(boutiqueLocation,"boutiqe");
   
        const allDrivers = await User.find({ role: 'driver' });
        const drivers = allDrivers.map(driver => driver.currentLocation);
    

        // Calculate distances and filter drivers within one kilometer
        const nearbyDrivers = drivers.filter(driver => {
            const distance = calculateDistance(boutiqueLocation.currentLocation, driver);
            console.log(distance < 1.5);
            return distance < 1.5; // Filter drivers within one kilometer
        });
        
        
        const userIds = nearbyDrivers.map(item => item.userId);
        const AllNearbyDriver = await User.find({ _id: { $in: userIds } });
     

    
            res.status(200).json(Response({ status: "success", statusCode: 200, message: "Updated for assigned driver", data: AllNearbyDriver }));
        
    } catch (error) {
        // Server error
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));
    }
}


// const updatedVehical = async (req, res, next) => {
//     try {
//         // Get the token from the request headers
//         const tokenWithBearer = req.headers.authorization;
//         let token;

//         if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//             // Extract the token without the 'Bearer ' prefix
//             token = tokenWithBearer.slice(7);
//         }

//         if (!token) {
//             return res.status(401).json({ success: false, message: 'Token is missing.' });
//         }

//         // Verify the token
//         const decoded = await new Promise((resolve, reject) => {
//             jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
//                 if (err) reject(err);
//                 else resolve(decoded);
//             });
//         });

//         // Find the user by ID from the decoded token
//         const user = await User.findOne({ _id: decoded._id, role: "driver" });

//         if (!user) {
//             return res.status(401).json({ success: false, message: 'You are not authorized to update vehicle information.' });
//         }

//         // Find the vehicle by user ID
//         const vehicle = await Driver.findOne({ userId: decoded._id }).exec();

       

//         // Update vehicle information
//         const { make, model, year, registrationNumber } = req.body;
//         const { driverLicense, registration, policeCheck } = req.files;
//         // console.log(driverLicense[0],"_________________");
//         // if (!vehicle) {
//         //      // Create a new vehicle object with user ID
//         // const newVehicle = new Driver({
//         //     userId: decoded._id,
//         //     make,
//         //     model,
//         //     year,registrationNumber,
//         //     driverLicense:driverLicense[0],
//         //     registration:registration[0],
//         //     policeCheck:policeCheck[0],
           
//         // });

//         // // Save the new vehicle to the database
//         // const data =await newVehicle.save();
            
//         //     return res.status(200).json(Response({ success: false, message: 'Vehicle not found.',data:data }));
//         // }

//         vehicle.make = make || vehicle.make;
//         vehicle.model = model || vehicle.model;
//         vehicle.year = year || vehicle.year;
//         vehicle.registrationNumber = registrationNumber || vehicle.registrationNumber;
//         vehicle.driverLicense = driverLicense?.[0] || vehicle.driverLicense;
//         vehicle.registration = registration?.[0] || vehicle.registration;
//         vehicle.policeCheck = policeCheck?.[0] || vehicle.policeCheck;

//         const updatedVehicle = await vehicle.save();
//         console.log(updatedVehicle);

//         res.status(200).json({ success: true, message: 'Vehicle updated successfully.', data: updatedVehicle });
//     } catch (error) {
//         console.error('Error updating vehicle:', error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };


const updatedVehical = async (req, res) => {
    try {
      // Get the token from the request headers
      const tokenWithBearer = req.headers.authorization;
      let token;
  
      if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
      }
  
      if (!token) {
        return res.status(401).json({ success: false, message: 'Token is missing.' });
      }
  
      // Verify the token
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });
  
      // Find the user by ID from the decoded token
      const user = await User.findOne({ _id: decoded._id, role: "driver" });
  
      if (!user) {
        return res.status(401).json({ success: false, message: 'You are not authorized to update vehicle information.' });
      }
  
      // Find the vehicle by user ID
      const vehicle = await Driver.findOne({ userId: decoded._id }).exec();
  
      if (!vehicle) {
        return res.status(404).json({ success: false, message: 'Vehicle not found.' });
      }
  
      // Validate if any update data is provided
      const { make, model, year, registrationNumber } = req.body;
      const { driverLicense, registration, policeCheck } = req.files;
      console.log(driverLicense,"}}}}}}}}}}}}}}}Dddddddddddddddddddddddddd");
  
      if (!make && !model && !year && !registrationNumber && !driverLicense && !registration && !policeCheck) {
        return res.status(400).json({ success: false, message: 'No update data provided. At least one field is required for update.' });
      }
  
      // Update vehicle information
      vehicle.make = make || vehicle.make;
      vehicle.model = model || vehicle.model;
      vehicle.year = year || vehicle.year;
      vehicle.registrationNumber = registrationNumber || vehicle.registrationNumber;
      vehicle.driverLicense = driverLicense?.[0] || vehicle.driverLicense;
      vehicle.registration = registration?.[0] || vehicle.registration;
      vehicle.policeCheck = policeCheck?.[0] || vehicle.policeCheck;
  
      // Save the updated vehicle
      const updatedVehicle = await vehicle.save();
      console.log(updatedVehicle);
  
      res.status(200).json({ success: true, message: 'Vehicle updated successfully.', data: updatedVehicle });
    } catch (error) {
      console.error('Error updating vehicle:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
const vehicalDetails=async(req,res,next)=>{
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
       if (!decoded._id === "Driver") {
           return res.status(401).json(Response({ statusCode: 401, message: 'You are not a driver.', status: 'failed' }));
       }
       const showDriverVehicalDetails=await Driver.find({userId:decoded._id})
       res.status(200).json(Response({statusCode:200,status:"success", message: "vehical showed succesfully",data:showDriverVehicalDetails }));

        
    } catch (error) {
        return res.status(500).json(Response({ status: "error", message: error.message }));

        
    }
}


module.exports = { addVehicle,findAllDrivers ,findNearByDriver,updatedVehical,vehicalDetails};
