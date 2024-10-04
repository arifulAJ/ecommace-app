// const admin = require("./firebaseConfig");

// const sendPushNotification = async (user, alarm) => {
//   const message = {
//     notification: {
//       title: ` ${alarm.title}`,
//       body: ` ${alarm.time}`,
//     },
//     data: {
//       userId: user._id.toString(),
//       alarmId: alarm._id.toString(),
//       videoUrl: alarm.video ? alarm.video.toString() : "",
//     },
//     token: user.fcmToken,
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log("Successfully sent push notification:", response);
//   } catch (error) {
//     console.error("Error sending push notification:", error);
//   }
// };

// module.exports = sendPushNotification;

// notificationService.js
const Notifaction = require('../models/Notifaction');
const admin = require('./firebaseConfig');

/**
 * Send notification to a single device
 * @param {string} fcmToken - The FCM token of the device
 * @param {Object} notification - The notification content { title, body }
 * @param {Object} data - Additional data payload
 */
// const sendNotificationToDevice = async (fcmToken, notification, data = {}) => {
//   const message = {
//     notification,
//     data,
//     token: fcmToken,
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log('Successfully sent message:', response);
//     return response;
//   } catch (error) {
//     console.error('Error sending message:', error);
//     throw error;
//   }
// };
const sendNotificationToDevice = async (fcmToken, notification, data = {}) => {
  if (!fcmToken) {
    throw new Error("FCM token is required");
  }

  const message = {
    notification,
    data,
    token: fcmToken, // Ensure the token is set correctly
  };
  // Log the message object

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);

   
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};


/**
 * Send notification to multiple devices
 * @param {Array<string>} fcmTokens - Array of FCM tokens
 * @param {Object} notification - The notification content { title, body }
 * @param {Object} data - Additional data payload
 */
const sendNotificationToMultipleDevices = async (fcmTokens, notification, data = {}) => {
  const message = {
    notification,
    data,
    tokens: fcmTokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log('Successfully sent messages:', response);
    return response;
  } catch (error) {
    console.error('Error sending messages:', error);
    throw error;
  }
};

module.exports = {
  sendNotificationToDevice,
  sendNotificationToMultipleDevices,
};
