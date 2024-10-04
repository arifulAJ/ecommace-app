
const Response = require("../helpers/response");
const User = require("../models/User");
const { userRegister } = require("../services/userService");
const jwt = require("jsonwebtoken");
// sign up boutique
const signUpBoutique = async (req, res) => {
    try {
        const { name, email, password, address, rate,phone,  city, state, description,fcmToken } = req.body;
        console.log(description )
      
        const {image} = req.files;


      const files = [];
      if(image){
      if (req.files) {
          image.forEach((image) => {
          const publicFileUrl = `/images/users/${image.filename}`;
          
          files.push({
            publicFileUrl,
            path: image.filename,
          });
          // console.log(files);
        });
      }}
console.log(image,files)

        // Validate request body
        if (!name) {
            return res.status(400).json(Response({statusCode:400,status:"name required", message: "Name is required" }));
        }

        if (!email) {
            return res.status(400).json(Response({status:"email ",statusCode:400, message: "Email is required" }));
        }

        if (!password) {
            return res.status(400).json(Response({status:"password faild",statusCode:400, message: "Password is required" }));
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json(Response({ status:"faild",statusCode:400, message: "User already exists" }));
        }

        const userDetails = {
            name,
            email,
            password,
            image,
            phone,
            rate,
            city,
            state,
            address,
            fcmToken,
            role: "boutique",
            description
        };
  // Check if image is provided in the request
  if (files && files.length > 0) {
    userDetails.image = files[0];
}
        // Call service function to register user
        await userRegister(userDetails);

        // res.status(200).json({ message: "A verification email is sent to your email" });
        res.status(200).json(Response({statusCode:200,status:"sign up successfully", message: "A verification email is sent to your email", }));

    } catch (error) {
        console.error("Error in signUp controller:", error);
        res.status(500).json({ error: "Server error" });
    }
};
const updateProfileOfboutique=async(req,res,next)=>{
    const {name,email,phone,address,rate, city,state,description}=req.body

    const { image } = req.files || {};
const files = [];

// Check if there are uploaded files
if (image && Array.isArray(image)) {
    image.forEach((img) => {
        const publicFileUrl = `/images/users/${img.filename}`;
        files.push({
            publicFileUrl,
            path: img.filename,
        });
    });
}
   

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
       const user=await User.findById(decoded._id)
       
        // Assuming you have some user data in req.body that needs to be updated
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone=phone ||user.phone;
        user.address=address|| user.address;
        user.city=city|| user.city;
        user.state=state ||user.state
        user.image=files[0]|| user.image;
        user.rate=rate|| user.rate
        user.description=description || user.description
        

        // Save the updated user profile
       const users= await user.save();

        // Respond with success message
        res.status(200).json(Response({ statusCode: 200, message: 'Profile updated successfully.', status: 'success',data:users}));

    }catch(error){
        res.status(500).json(Response({ statusCode: 500, message: 'internal server error.',status:'Failed' }));
    }


}

module.exports = {
    signUpBoutique,
    updateProfileOfboutique
};
