const { userRegister, userLogin, forgotPasswordService, verifyCodeService, changePasswordService } = require("../services/userService");
const Response = require("../helpers/response");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { createJSONWebToken } = require('../helpers/jsonWebToken');
const emailWithNodemailer = require("../helpers/email");
const jwt = require("jsonwebtoken");
const { sendNotificationToDevice } = require("../config/push-notifaction");
const Notifaction = require("../models/Notifaction");

// const signUp = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       address,
//       phone,
//       city,
//       state,
//       dateOfBirth,
//       role,
//       fcmToken,
//     } = req.body;
//     const { image } = req.files;
//     const files = [];
//     if (image) {
     

   
//     if (req.files) {
//       image.forEach((img) => {
//         const publicFileUrl = `/images/users/${img.filename}`;
//         files.push({
//           publicFileUrl,
//           path: img.filename,
//         });
//       });
//     }}

//     if (!name || !email || !password) {
//       return res
//         .status(400)
//         .json(
//           Response({ status: 'Failed', statusCode: 400, message: 'Name, email, and password are required' })
//         );
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json(Response({ status: 'Failed', statusCode: 400, message: 'User already exists' }));
//     }

//     const userDetails = {
//       name,
//       email,
//       password,
//       phone,
//       dateOfBirth,
//       city,
//       state,
//       address,
//       role,
//       fcmToken,
//     };

//     if (files.length > 0) {
//       userDetails.image = files[0];
//     }

//     const data = await userRegister(userDetails);



//     res
//       .status(200)
//       .json(
//         Response({
//           statusCode: 200,
//           status: 'Sign up successful',
//           message: 'A verification email has been sent to your email',
//           data: { data },
//         })
//       );
//   } catch (error) {
//     console.error('Error in signUp controller:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// resend otp

const signUp = async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        address,
        phone,
        city,
        state,
        dateOfBirth,
        role,
        fcmToken,
      } = req.body;
      const { image } = req.files;
      const files = [];
  
      // If an image is uploaded, store the public URL and file path
      if (image && req.files) {
        image.forEach((img) => {
          const publicFileUrl = `/images/users/${img.filename}`;
          files.push({
            publicFileUrl,
            path: img.filename,
          });
        });
      }
  
      // Check for required fields
      if (!name || !email || !password) {
        return res
          .status(400)
          .json(
            Response({ status: 'Failed', statusCode: 400, message: 'Name, email, and password are required' })
          );
      }
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json(Response({ status: 'Failed', statusCode: 400, message: 'User already exists' }));
      }
  
      // Prepare user details
      const userDetails = {
        name,
        email,
        password,
        phone,
        dateOfBirth,
        city,
        state,
        address,
        role,
        fcmToken,
      };
  
      // If an image exists, add it to user details
      if (files.length > 0) {
        userDetails.image = files[0];
      }
  
      // Check if the role is 'shopper'
      if (role === 'shopper') {
        userDetails.isVerified = true; // Automatically verify shopper
        const user = await User.create(userDetails); // Create user immediately without email verification

         // Generate the access token
         const accessToken = await userLogin({ email, password, user });
        return res
          .status(200)
          .json(
            Response({
              statusCode: 200,
              status: 'Sign up successful',
              message: 'User has been auto-verified',
              data: {accessToken:accessToken,id:user._id,email:user.email},
            })
          );
      }
  
      // Register other users and send verification email
      const data = await userRegister(userDetails);
  
      // Response for other roles after sending verification email
      res
        .status(200)
        .json(
          Response({
            statusCode: 200,
            status: 'Sign up successful',
            message: 'A verification email has been sent to your email',
            data: { data },
          })
        );
    } catch (error) {
      console.error('Error in signUp controller:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

const resendOtp=async(req,res, )=>{
    try {
        // Extract email from request body
        const { email } = req.body;
        
    
        // Validate email
        if (!email) {
          return res.status(400).json({ error: 'Email is required' });
        }
    
        // Find user by email
        const user = await User.findOne({ email });
       
    
        // Check if user exists
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
   
    if(user.oneTimeCode===null ){
       
     // Generate a new OTP
     const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
     // Prepare email for activate user
    //  const emailData = {
    //      email,
    //      subject: 'Account Activation Email',
    //      html: `
    //    <h1>Hello, ${user.name}</h1>
    //    <p>Your One Time Code is <h3>${oneTimeCode}</h3> to verify your email</p>
    //    <small>This Code is valid for 3 minutes</small>
    //    `
    //  }
    const emailData = {
        email,

    //     subject: 'Account Activation Email',
    //     html: `
    //   <h1>Hello, ${name}</h1>
    //   <p>Your One Time Code is <h3>${oneTimeCode}</h3> to verify your email</p>
    //   <small>This Code is valid for 3 minutes</small>
    //   `
    // https://img.freepik.com/free-vector/geometric-gradient-futuristic-background_23-2149116406.jpg
        subject: 'Account Activation Email',
        
        html: `
        <div style=" padding: 20px; font-family: Arial, sans-serif; text-align: center; min-height: 100vh;">
            <div style="background: url(https://img.freepik.com/free-vector/geometric-gradient-futuristic-background_23-2149116406.jpg) no-repeat center center; background-size: cover; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto;">
                <h1 style="font-size: 2.5em; color: #fff;">Hello, ${user.name}</h1>
                <p style="font-size: 1.2em; color:#fff;">Your One Time Code is:</p>
                <h3 style="font-size: 2em; color: #e67e22;">${oneTimeCode}</h3>
                <p style="font-size: 1em; color: #fff; ">This Code is valid for 3 minutes.</p>
                <hr style="border: 1px solid #fff; margin: 20px 0;">
                <small style="font-size: 0.9em; color:#fff;">If you didn't request this, please ignore this email.</small>
            </div>
        </div>
        `
    
    }
        // Update user's oneTimeCode
        user.oneTimeCode = oneTimeCode;
        // await user.save();
        // if(user.isVerified)
        const data =await user.save();
        console.log(data, "resend data")
    
        // Send verification email with new OTP
        await emailWithNodemailer(emailData);
    
        // Send success response
        res.status(200).json(Response({statusCode:200,status:'ok', message: 'OTP has been resent successfully',data:{user} }))}
        // bad response 
        res.status(400).json(Response({statusCode:400,status:'Failed', message: 'you alredy have otp please chaeck your email ' }));
    
      } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({ error: 'Failed to resend OTP' }

        );
      }
}

// email password login 
const signIn = async (req, res, next) => {
    try {
        const { email, password, fcmToken } = req.body;
        console.log(fcmToken,"----------------");

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        // Verify the password
        const isPasswordValid = await user.isPasswordMatch(password)
 // Check if the user is blocked
 if (user.isBlocked) {
    return res.status(403).json(Response({ statusCode: 403, message: 'your account had been blocked by the admin, pleace contact with admin', status: "Failed" }));
}
    
        
    
        if (!isPasswordValid) {
            console.log(isPasswordValid,"----------------------------------");
            return res.status(404).json(Response({ statusCode: 404, message: 'Invalid password', status: "Failed" }));
        }

        // Update the user's FCM token and logged-in status
        await User.updateOne({ _id: user._id }, { fcmToken: fcmToken, isLoggedIn: true });

        // Generate the access token
        const accessToken = await userLogin({ email, password, user });

        // Success response
        res.status(200).json(Response({ statusCode: 200, message: 'Authentication successful', status: "OK", data: user, token: accessToken, type: "user" }));

    } catch (error) {
        console.error("Error in signIn controller:", error);
        res.status(500).json(Response({ statusCode: 500, message: error.message, status: "Failed" }));
    }
};

// google login 
const signInWithGoogle = async (req, res, next) => {
    try {
        const { email, name, role, fcmToken } = req.body;

        console.log(role,email,"++++++++++++google login");

        // Find the user by email
        let user = await User.findOne({ email });

    

        if (!user) {

            if(role==="boutique"){
                 // If the user doesn't exist, create a new one
            user = new User({
                name,
                email,
                role,
                fcmToken,
                password:"1qazxsw2",
                rate:"$$",
                description:"new boutiq",
               
                isLoggedIn: true,
                isVerified: true // Assuming Google authentication verifies the user
            });

            await user.save();

            }
            else{
                // If the user doesn't exist, create a new one
            user = new User({
                name,
                email,
                role,
                fcmToken,
                password:"1qazxsw2",
               
                isLoggedIn: true,
                isVerified: true // Assuming Google authentication verifies the user
            });

            await user.save();

            }
            
        } else {
            // Check if the user is blocked
            if (user.isBlocked) {
                return res.status(403).json(Response({
                    statusCode: 403,
                    message: 'Your account has been blocked by the admin, please contact the admin',
                    status: "Failed"
                }));
            }
            if (user.role!==role) {
                return res
                  .status(400)
                  .json(Response({ status: 'Failed', statusCode: 400, message: `you alreday exiest as  ${user.role} `  }));
              }

            // Update the user's FCM token and logged-in status
            await User.updateOne({ _id: user._id }, { fcmToken: fcmToken, isLoggedIn: true });
               // Generate the access token
        const accessToken = await userLogin({ email, password: null, user });

        // Success response
       return res.status(200).json(Response({
            statusCode: 200,
            message: 'Google Authentication successful',
            status: "OK",
            data: user,
            token: accessToken,
            type: "user"
        }));
        }

     

    } catch (error) {
        console.error("Error in signInWithGoogle controller:", error);
        res.status(500).json(Response({
            statusCode: 500,
            message: error.message,
            status: "Failed"
        }));
    }
};



const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
       
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        await forgotPasswordService(email, user);

        res.status(200).json(Response({ statusCode: 200, message: 'A verification code is sent to your email', status: "OK" }));

    } catch (error) {
        console.error(error);
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
};

//verify code
const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        // console.log("code-ifh", code)
       
        const user = await User.findOne({ email });
        if (!email) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }
        if (!code) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }
        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }
if(user.oneTimeCode===code){
    await verifyCodeService({ user, code })

    
        // Generate JWT token for the user
        const expiresInOneYear = 365 * 24 * 60 * 60; // seconds in 1 year
        const accessToken = createJSONWebToken({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, expiresInOneYear);
        console.log(accessToken);


    res.status(200).json(Response({ statusCode: 200, message: 'User verified successfully', status: "OK",data:{accessToken,id:user._id,email:user.email}}));


}else{
    return res.status(404).json(Response({ statusCode: 404, message: 'code is not valid', status: "Failed" }));
}
       
    } catch (error) {
        console.error(error);
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
};
// change password
const cahngePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        

        const user = await User.findOne({ email });
        
        if (!email) {
            return res.status(404).json(Response({ statusCode: 404, message: 'Email is required', status: "Failed" }));
        }
        if (!password) {
            return res.status(404).json(Response({ statusCode: 404, message: 'Password is required', status: "Failed" }));
        }

        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        await changePasswordService({ user, password });
       

        res.status(200).json(Response({ statusCode: 200, message: 'Password changed successfully', status: "OK" }));

    } catch (error) {
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
};

const userBlocked=async(req,res,next)=>{
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
        const user=await User.findById(decoded._id)
       user.isBlocked=true
      const blockData=await  user.save()
    
        res.status(200).json(Response({ statusCode: 200, message: 'disabled error .',status:'faield',data:{blockData} }));

     }catch(error){
        res.status(500).json(Response({ statusCode: 500, message: 'server error .',status:'faield' }));
     }

}

// controllers/logoutController.js



const logoutController = async (req, res, next) => {// Get the token from the request headers
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
        // Update user document to set isLoggedIn to false
        await User.findByIdAndUpdate(user._id, { isLoggedIn: false });

        // Respond with success message
        res.status(200).json(Response({ statusCode: 200, message: 'you logout from this device.',status:'ok' }));
    } catch (error) {
        // Handle any errors
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateProfile=async(req,res,next)=>{
    const {name,email,phone,address,city,state,}=req.body

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
       console.log(decoded,user)

        // Assuming you have some user data in req.body that needs to be updated
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone=phone ||user.phone;
        user.address=address|| user.address;
        user.city=city|| user.city;
        user.state=state ||user.state
        user.image=files[0]|| user.image
        

        // Save the updated user profile
       const users= await user.save();

        // Respond with success message
        res.status(200).json(Response({ statusCode: 200, message: 'Profile updated successfully.', status: 'success',data:users}));

    }catch(error){
        res.status(500).json(Response({ statusCode: 500, message:error.message,status:'Failed' }));
    }


}


// useing notification for the user chage password 
const changePasswordUseingOldPassword = async (req, res, next) => {
    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'Failed' }));
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Extract old and new passwords from request body
        const { oldPassword, newPassword } = req.body;

        // Find the user by ID
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found.', status: 'Failed' }));
        }

        // Check if old password matches the stored hashed password
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(404).json(Response({ statusCode: 404, message: 'Incorrect password.', status: 'Failed' }));
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        // Send push notification about password change
        const notification = {
            title: "Password Changed",
            body: `Hi ${user.name} Your password has been changed successfully.`,
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
                type:"chagepassword"
                
              
          
              }
          
              const addNotifaction=await Notifaction.create(datas)
            
        } else {
            console.error('FCM token is missing for this user.');
        }

       
        // Respond with success message
        return res.status(200).json(Response({ statusCode: 200, message: 'Password updated successfully.', status: 'Success', data: user }));

    } catch (error) {
        // Handle errors
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'Failed' }));
    }
};

// module.exports = changePasswordUseingOldPassword;


// profile get for all user 
const ProfileOfUser=async(req,res,next)=>{

    
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
         const profile=await User.findById(decoded._id)
         console.log(decoded,profile)

       return res.status(200).json(Response({ statusCode: 200, message: 'Profile showed successfully.', status: 'success',data:profile}));

        
    } catch (error) {
        return  res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))

        
    }

}

module.exports = {
    signUp,
    signIn,
    forgotPassword,
    verifyCode,
    cahngePassword,
    resendOtp,
    userBlocked,
    logoutController,
    updateProfile,
    changePasswordUseingOldPassword,
    ProfileOfUser,
    signInWithGoogle
    
};
