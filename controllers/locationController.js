// Import necessary dependencies

const Response = require("../helpers/response");
const Location = require("../models/Location");


const jwt = require('jsonwebtoken');
const User = require("../models/User");

// Controller functions
const createLocation = async (req, res) => {
    
    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;
console.log(token)
    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({message:"your token is missing ",status:"Failed",statusCode:401}));
    }

    try {
        // Verify the token
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
          // Check if the user has already created a location
          // const existingLocation = await Location.findOne({ userId: decoded._id });
          // if (existingLocation) {
          //     return res.status(400).json(Response({message:"you already added your location now updated it ",status:"Failed",statusCode:400}));
          // }
      // Check if the user has already created a location
      const existingLocation = await Location.findOne({ userId: decoded._id });
      if (existingLocation) {
          // Delete the old location
          await Location.findByIdAndDelete(existingLocation._id);
      }
    const { latitude, longitude } = req.body;
    
    const location = new Location({ userId:decoded._id, latitude, longitude });
    const locations=await location.save();
    
    await User.findByIdAndUpdate(decoded._id,{currentLocation:locations},{new:true})


    res.status(200).json(Response({message:"location created ",status:"ok",statusCode:200,data:locations}));
  } catch (err) {
    console.error('Error creating location:', err);
    res.status(500).json({ error: 'Error creating location' });
  }
};

const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(Response({message:"get location", statusCode:200,data:locations,status:"ok"}));
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ error: 'Error fetching locations' });
  }
};

// const getLocationById = async (req, res) => {
//   try {
//     const location = await Location.findById({id:req.params.id});
//     if (!location) {
//       return res.status(404).json({ error: 'Location not found' });
//     }
//     res.json(location);
//   } catch (err) {
//     console.error('Error fetching location by ID:', err);
//     res.status(500).json({ error: 'Error fetching location by ID' });
//   }
// };
const getLocationById = async (req, res) => {
  // Get the token from the request headers
  const tokenWithBearer = req.headers.authorization;
  let token;

  if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
      // Extract the token without the 'Bearer ' prefix
      token = tokenWithBearer.slice(7);
  }

  if (!token) {
      return res.status(401).json(Response({statusCode:401, status: "faield", message: 'Token is missing.' }));
  }

  try {
      // Verify the token
      const decoded = await new Promise((resolve, reject) => {
          jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
              if (err) reject(err);
              else resolve(decoded);
          });
      });
        // Check if the user has already created a location
        const existingLocation = await Location.findOne({ userId: decoded._id });
        if (existingLocation) {
            return res.status(400).json(Response({ status: "faild",statusCode:400, message: 'User has already created a location.' }));
        }

    const location = await User.findById(decoded._id);
    console.log(location,existingLocation)
    if (!location) {
      return res.status(404).json(Response({ status:"not found",statusCode:400, message: 'Location not found' }));
    }
    res.json(location);
  } catch (err) {
    console.error('Error fetching location by ID:', err);
    res.status(500).json({ error: 'Error fetching location by ID' });
  }
};

const updateLocation = async (req, res) => {
    
 // Get the token from the request headers
 const tokenWithBearer = req.headers.authorization;
 let token;
console.log(token)
 if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
     // Extract the token without the 'Bearer ' prefix
     token = tokenWithBearer.slice(7);
 }

 if (!token) {
     return res.status(401).json(Response({message:"your token is missing ",status:"Failed",statusCode:401}));
 }

 try {
     // Verify the token
     const decoded = await new Promise((resolve, reject) => {
         jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
             if (err) reject(err);
             else resolve(decoded);
         });
     });
    const { latitude, longitude } = req.body;
    console.log(latitude,longitude)
    const location = await Location.findByIdAndUpdate({userId:decoded._id}, { latitude, longitude }, { new: true });
    if (!location) {
      return res.status(404).json(Response({statusCode:404,status:"faield", message: 'Location not found' }));
    }
    res.status(200).j(son(Response({status:"ok",message:"updated successfullu",data:location})));
  } catch (err) {
    console.error('Error updating location:', err);
    res.status(500).json(Response({ statusCode:500,status:"server error", message: 'Error updating location' }));
  }
};

const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json({ message: 'Location deleted successfully' });
  } catch (err) {
    console.error('Error deleting location:', err);
    res.status(500).json({ error: 'Error deleting location' });
  }
};
module.exports = { getLocationById,getLocations,deleteLocation,updateLocation,createLocation };