const express = require('express');
const router = express.Router();

//import controllers
const { signUp, signIn, forgotPassword, verifyCode, cahngePassword, resendOtp, userBlocked, logoutController, updateProfile, changePasswordUseingOldPassword, ProfileOfUser, signInWithGoogle } = require('../controllers/userController');
const upload = require('../middlewares.js/fileUpload');
const { addVehicle, findAllDrivers, findNearByDriver, updatedVehical, vehicalDetails } = require('../controllers/vehicalController');
const { signUpBoutique, updateProfileOfboutique } = require('../controllers/boutiqueController');
const { createLocation, getLocations, getLocationById, updateLocation } = require('../controllers/locationController');
const { supportOfUsers, showSuportOfAdmin } = require('../controllers/supportController');
const { privecyPolicy, updateTermsOfUse } = require('../controllers/termsOfUseController');
const { showFeedBackinBoutiq } = require('../controllers/dashboard/boutiqueInDashboared');

console.log('userController');

// routes
router.post('/sign-up', upload, signUp);
router.post('/sign-in', signIn);
router.post('/signInWithGoogle', signInWithGoogle);
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCode);
router.post('/change-password', cahngePassword);
router.patch('/changePasswordUseingOldPassword',changePasswordUseingOldPassword)
// if user want to diable Account
router.post('/userBlocked', userBlocked);
//logout route
router.post('/logout',logoutController)
// opt resend
router.post("/resend",resendOtp)
// update profile
router.patch('/updateProfile', upload ,updateProfile)
// profile showed
router.get('/ProfileOfUser',ProfileOfUser)

// router.post('/vehicalDetails/:userId',upload.array["image",3],addVehicle)
// driver route
router.post('/vehicalDetails', upload, addVehicle);
router.get('/findAllDrivers',findAllDrivers)
router.get('/findNearByDriver',findNearByDriver)
router.patch('/updatedVehical', upload,updatedVehical)
router.get('/vehicalDetails',vehicalDetails)

// boutique signup route 
router.post('/signUp-Boutique', upload, signUpBoutique);
router.patch('/updateProfile-Boutique', upload, updateProfileOfboutique);
// location 
router.post('/locations',createLocation);
router.get('/locations',getLocations);
router.get('/locations/:id',getLocationById);
router.put('/updateLocation',updateLocation);

// user support 
router.post('/supportOfUsers',supportOfUsers)
router.get('/showSuportOfAdmin',showSuportOfAdmin)
// privecy policy of user get 
router.get('/privecyPolicy',privecyPolicy)
router.patch('/updateTermsOfUse',updateTermsOfUse)

// fedback show 
router.get('/showFeedBackinBoutiq',showFeedBackinBoutiq)

module.exports = router;