// const mongoose = require("mongoose");
// const User = require("../models/User");

// require("dotenv").config();

// // Sample data
// const usersData = [
//   {
//     name: "aidaly Admin",
//     email: "aidaly@dapperdriver.com",
//     phone: "01735566789",
//     password: "$2a$08$Ji4DbfxMvS/A8bjVCltZc.N5v8g8gFpnyWtKmmWvYhyPDLBWkhxkW", // Password should be hashed
//     role: "admin",
//     status:"active",
//     isVerified: true,
//     isAdmin: true, // Assuming isAdmin field should be set for admin user
//     isDeleted: false, // Assuming isDeleted should be false for new user
//   },
//   {
//     name: "Testing Admin",
//     email: "admin@gmail.com",
//     phone: "01735566789",
//     password: "$2a$08$Ji4DbfxMvS/A8bjVCltZc.N5v8g8gFpnyWtKmmWvYhyPDLBWkhxkW", // Password should be hashed
//     role: "admin",
//     status:"active",
//     isVerified: true,
//     isAdmin: true, // Assuming isAdmin field should be set for admin user
//     isDeleted: false, // Assuming isDeleted should be false for new user
//   },
// ];

// // Function to drop the entire database
// const dropDatabase = async () => {
//   try {
//     await mongoose.connection.dropDatabase();
//     console.log("------------> Database dropped successfully! <------------");
//   } catch (err) {
//     console.error("Error dropping database:", err);
//   }
// };

// // Function to seed users
// const seedUsers = async () => {
//   try {
//     await User.deleteMany();
//     await User.insertMany(usersData); // Use create() instead of insertMany() for better validation and middleware hooks
//     console.log("Users seeded successfully!");
//   } catch (err) {
//     console.error("Error seeding users:", err);
//   }
// };


// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_CONNECTION);

// // Call seeding functions
// const seedDatabase = async () => {
//   try {
//     await dropDatabase();
//     await seedUsers();
//     console.log("--------------> Database seeding completed <--------------");
//   } catch (err) {
//     console.error("Error seeding database:", err);
//   } finally {
//     mongoose.disconnect();
//   }
// };

// // Execute seeding
// seedDatabase();



// const mongoose = require("mongoose");
// const User = require("../models/User");

// const TermsOfUse = require("../models/TurmsOfUse");



// require("dotenv").config();

// // Sample data for users
// const usersData = [
//   {
//     name: "aidaly Admin",
//     email: "aidaly@dapperdriver.com",
//     phone: "01735566789",
//     password: "$2a$08$Ji4DbfxMvS/A8bjVCltZc.N5v8g8gFpnyWtKmmWvYhyPDLBWkhxkW", // Password should be hashed
//     role: "admin",
//     status: "active",
//     isVerified: true,
//     isAdmin: true, // Assuming isAdmin field should be set for admin user
//     isDeleted: false, // Assuming isDeleted should be false for new user
//   },
//   {
//     name: "Testing Admin",
//     email: "admin@gmail.com",
//     phone: "01735566789",
//     password: "$2a$08$Ji4DbfxMvS/A8bjVCltZc.N5v8g8gFpnyWtKmmWvYhyPDLBWkhxkW", // Password should be hashed
//     role: "admin",
//     status: "active",
//     isVerified: true,
//     isAdmin: true, // Assuming isAdmin field should be set for admin user
//     isDeleted: false, // Assuming isDeleted should be false for new user
//   },
// ];

// // // Sample data for privacy policies
// // const privacyPoliciesData = [
// //   {
// //     userId: "", // You need to set this dynamically after creating the users
// //     privacypolicyDroperDriver: "", // Add appropriate reference to TermsOfUse document
// //     isAcceptedPrivecyPolicy: true,
// //     isAcceptedTermsAndUse: true,
// //   },
// // ];

// // Sample data for terms of use
// const termsOfUseData = [
//   {
//      // You need to set this dynamically after creating the users
//     privacypolicyDroperDriver: "Welcome to aidalydaperdriver. By accessing or using our platform, you agree to comply with and be bound by these Terms of Use. These terms outline your responsibilities and our obligations regarding the use of our services. You must provide accurate information and use our platform responsibly. Unauthorized activities, such as fraudulent transactions or misuse of content, are prohibited. We process transactions securely and offer various payment methods, while adhering to our refund and return policies. Our platform's content, including text and images, is protected by intellectual property laws. We are committed to safeguarding your privacy and will handle your personal data in accordance with our Privacy Policy. Our liability is limited as outlined, and any disputes will be resolved according to our specified procedures. We may update these terms periodically, and continued use of our platform constitutes acceptance of such changes. For any questions or concerns, please contact our support team.",
//     otherPolicyDroperDriver: " By accessing or using our platform, you agree to comply with and be bound by these Terms of Use. These terms outline your responsibilities and our obligations regarding the use of our services. You must provide accurate information and use our platform responsibly. Unauthorized activities, such as fraudulent transactions or misuse of content, are prohibited. We process transactions securely and offer various payment methods, while adhering to our refund and return policies. Our platform's content, including text and images, is protected by intellectual property laws. We are committed to safeguarding your privacy and will handle your personal data in accordance with our Privacy Policy. Our liability is limited as outlined, and any disputes will be resolved according to our specified procedures. We may update these terms periodically, and continued use of our platform constitutes acceptance of such changes. For any questions or concerns, please contact our support team.",
//   },
// ];

// // Function to drop the entire database
// const dropDatabase = async () => {
//   try {
//     await mongoose.connection.dropDatabase();
//     console.log("------------> Database dropped successfully! <------------");
//   } catch (err) {
//     console.error("Error dropping database:", err);
//   }
// };

// // Function to seed users
// const seedUsers = async () => {
//   try {
//     await User.deleteMany();
//     const users = await User.insertMany(usersData);
//     console.log("Users seeded successfully!");

//     return users;
//   } catch (err) {
//     console.error("Error seeding users:", err);
//   }
// };

// // // Function to seed privacy policies
// // const seedPrivacyPolicies = async (users) => {
// //   try {
// //     const privacyPoliciesToInsert = privacyPoliciesData.map((policy, index) => ({
// //       ...policy,
// //       userId: users[index]._id, // Associate each policy with the corresponding user
// //     }));
// //     await PrivecyPolicy.deleteMany();
// //     await PrivecyPolicy.insertMany(privacyPoliciesToInsert);
// //     console.log("Privacy policies seeded successfully!");
// //   } catch (err) {
// //     console.error("Error seeding privacy policies:", err);
// //   }
// // };

// // Function to seed terms of use
// const seedTermsOfUse = async (users) => {
//   try {
//     // const termsToInsert = termsOfUseData.map((term, index) => ({
//     //   ...term,
//     //   userId: users[index]._id, // Associate each term with the corresponding user
//     // }));
//     await TermsOfUse.deleteMany();
//     await TermsOfUse.insertMany(termsOfUseData);
//     console.log("Terms of use seeded successfully!");
//   } catch (err) {
//     console.error("Error seeding terms of use:", err);
//   }
// };

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_CONNECTION);

// // Call seeding functions
// const seedDatabase = async () => {
//   try {
//     await dropDatabase();
//     const users = await seedUsers();
//     await seedTermsOfUse(users);
//     // await seedPrivacyPolicies(users);
//     console.log("--------------> Database seeding completed <--------------");
//   } catch (err) {
//     console.error("Error seeding database:", err);
//   } finally {
//     mongoose.disconnect();
//   }
// };

// // Execute seeding
// seedDatabase();


const mongoose = require("mongoose");
const User = require("../models/User");
const TermsOfUse = require("../models/TurmsOfUse");
const DeliveryCharge = require("../models/DeliveryCharge");
 // Import the DeliveryCharge model

require("dotenv").config();

// Sample data for users
const usersData = [
  {
    name: "aidaly Admin",
    email: "aidaly@dapperdriver.com",
    phone: "01735566789",
    password: "$2a$08$Ji4DbfxMvS/A8bjVCltZc.N5v8g8gFpnyWtKmmWvYhyPDLBWkhxkW",
    role: "admin",
    status: "active",
    isVerified: true,
    isAdmin: true,
    isDeleted: false,
  },
  {
    name: "Testing Admin",
    email: "admin@gmail.com",
    phone: "01735566789",
    password: "$2a$08$Ji4DbfxMvS/A8bjVCltZc.N5v8g8gFpnyWtKmmWvYhyPDLBWkhxkW",
    role: "admin",
    status: "active",
    isVerified: true,
    isAdmin: true,
    isDeleted: false,
  },
];

// Sample data for terms of use
const termsOfUseData = [
  {
    privacypolicyDroperDriver: "Welcome to aidalydaperdriver. By accessing or using our platform...",
    otherPolicyDroperDriver: "By accessing or using our platform, you agree to comply with and be bound...",
  },
];

// Sample data for delivery charges
const deliveryChargesData = [
  {
    delivaryFee: '5.00',
    chargeFee: '2.00',
  },
];

// Database management functions
const dropDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log("------------> Database dropped successfully! <------------");
  } catch (err) {
    console.error("Error dropping database:", err);
  }
};

// Seeding functions
const seedUsers = async () => {
  try {
    await User.deleteMany();
    const users = await User.insertMany(usersData);
    console.log("Users seeded successfully!");
    return users;
  } catch (err) {
    console.error("Error seeding users:", err);
  }
};

const seedTermsOfUse = async () => {
  try {
    await TermsOfUse.deleteMany();
    await TermsOfUse.insertMany(termsOfUseData);
    console.log("Terms of use seeded successfully!");
  } catch (err) {
    console.error("Error seeding terms of use:", err);
  }
};

const seedDeliveryCharges = async () => {
  try {
    await DeliveryCharge.deleteMany();
    await DeliveryCharge.insertMany(deliveryChargesData);
    console.log("Delivery charges seeded successfully!");
  } catch (err) {
    console.error("Error seeding delivery charges:", err);
  }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION);

// Main seeding function
const seedDatabase = async () => {
  try {
    await dropDatabase();
    const users = await seedUsers();
    await seedTermsOfUse();
    await seedDeliveryCharges(); // Call the delivery charges seeding function
    console.log("--------------> Database seeding completed <--------------");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.disconnect();
  }
};

// Execute seeding
seedDatabase();
