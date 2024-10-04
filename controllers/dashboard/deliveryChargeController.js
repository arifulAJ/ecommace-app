const Response = require("../../helpers/response");
const DeliveryCharge = require("../../models/DeliveryCharge");

const jwt = require("jsonwebtoken");



// Create Delivery Charge Controller
const createDeliveryCharge = async (req, res) => {
  try {
    
    // Check if the user is authorized
    const tokenWithBearer = req.headers.authorization;
    let token;
    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
      token = tokenWithBearer.slice(7);
    }

    if (!token) {
      return res.status(401).json(
        Response({
          statusCode: 401,
          message: 'Token is missing.',
          status: 'Failed',
        })
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Verify that the user is an admin
    if (decoded.role !== 'admin') {
      return res.status(403).json(
        Response({
          statusCode: 403,
          message: 'You are not authorized to delete products as an admin.',
          status: 'Failed',
        })
      );
    }

    const { delivaryFee, chargeFee } = req.body;
    
    // Create a new delivery charge instance
    const deliveryCharge = new DeliveryCharge({ delivaryFee, chargeFee });
    
    // Save the delivery charge to the database
    await deliveryCharge.save();
    
    return res.status(201).json(Response({
      status:"success",
      statusCode:200,
      message: "Delivery charge created successfully!",
      data: deliveryCharge,
    }));
  } catch (error) {
    console.error("Error creating delivery charge:", error);
    return res
      .status(500)
      .json(
        Response({
          statusCode: 500,
          message: error.message,
          status: "server error",
        })
      );
  }
};

// Show Delivery Charge Controller
const showDeliveryCharge = async (req, res) => {
  try {
    const deliveryCharge = await DeliveryCharge.findOne(); // You can modify this to find by ID or other criteria
    
    if (!deliveryCharge) {
      return res.status(404).json(Response({
       status:"failed",
       statusCode:404,
        message: "Delivery charge not found.",
      }));
    }
    
    return res.status(200).json(Response({
      status:"success",
      statusCode:200,
      data: deliveryCharge,
    }));
  } catch (error) {
    console.error("Error retrieving delivery charge:", error);
    return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'Server Error' }));

  }
};

// Update Delivery Charge Controller
// const updateDeliveryCharge = async (req, res) => {
//   try {
//     const { delivaryFee, chargeFee } = req.body;
//     const { id } = req.query; // Assuming you're passing the ID in the URL

//     // Find the delivery charge by ID and update it
//     const updatedDeliveryCharge = await DeliveryCharge.findByIdAndUpdate(
//       id,
//       { delivaryFee, chargeFee },
//       { new: true, runValidators: true } // Options to return the updated document
//     );

//     if (!updatedDeliveryCharge) {
//       return res.status(404).json(Response({
//         statusCode:404,
//         status:"success",
//         message: "Delivery charge not found.",
//       }));
//     }

//     return res.status(200).json(Response({
//       status:"success",
//       statusCode:200,
//       message: "Delivery charge updated successfully!",
//       data: updatedDeliveryCharge,
//     }));
//   } catch (error) {
//     console.error("Error updating delivery charge:", error);
//     return res.status(500).json(Response({
     
//       message: "Server error. Please try again later.",
//     }));
//   }
// };

const updateDeliveryCharge = async (req, res) => {
    try {
      const { delivaryFee, chargeFee } = req.body;
      const { id } = req.query; // Assuming you're passing the ID in the URL
  
      // Convert to numbers, format to 2 decimal places, and then convert back to string
      const formattedDelivaryFee = parseFloat(delivaryFee).toFixed(2).toString();
      const formattedChargeFee = parseFloat(chargeFee).toFixed(2).toString();
  
      // Find the delivery charge by ID and update it
      const updatedDeliveryCharge = await DeliveryCharge.findByIdAndUpdate(
        id,
        { delivaryFee: formattedDelivaryFee, chargeFee: formattedChargeFee },
        { new: true, runValidators: true } // Options to return the updated document
      );
  
      if (!updatedDeliveryCharge) {
        return res.status(404).json(Response({
          statusCode: 404,
          status: "success",
          message: "Delivery charge not found.",
        }));
      }
  
      return res.status(200).json(Response({
        status: "success",
        statusCode: 200,
        message: "Delivery charge updated successfully!",
        data: updatedDeliveryCharge,
      }));
    } catch (error) {
      console.error("Error updating delivery charge:", error);
      return res.status(500).json(Response({
        message: "Server error. Please try again later.",
      }));
    }
  };
  

// Export the controllers
module.exports = {
  createDeliveryCharge,
  showDeliveryCharge,
  updateDeliveryCharge,
};
