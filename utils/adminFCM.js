// services/userService.js

const User = require("../models/User");


const getAdminFcmTokens = async () => {
  try {
    // Find all users with the role of 'admin'
    const admins = await User.find({ role: 'admin',  });

    // Extract the FCM tokens
    const adminFcmTokens = admins.map(admin => admin.fcmToken);

    return adminFcmTokens;
  } catch (error) {
    console.error('Error retrieving admin FCM tokens:', error);
    throw new Error('Failed to retrieve admin FCM tokens');
  }
};

module.exports = {
  getAdminFcmTokens,
};
