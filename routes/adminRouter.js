const express = require('express');
const { caretTermsAdnControllerForAdmin } = require('../controllers/termsOfUseController');
const { getTotalOfTheDashboared, totalRevinew, feedbackRatio, todayorderDetailsinDashboared, totalCostAndSell, sevenDaysOrderDetailsinDashboared } = require('../controllers/dashboard/analysisController');
const {  blocakShopper, getShoperByOrder, getAllShopper, showShopperDetails, } = require('../controllers/dashboard/shopperInDashboardController');
const { getAllBoutiqueForAdmin, boutiqueDetails,sendFeedback,updateProfileOfboutiqueInDashboared, addBoutique, addPresentageForBoutique, deleteBoutique, productCreateFromAdmin, productUpdateForAdmin, deleteProductForAdmin, showProductById } = require('../controllers/dashboard/boutiqueInDashboared');
const { showAllDriverInDashboared, showDriverDetails, driverDashboared } = require('../controllers/dashboard/driverInDashboared');
const upload = require('../middlewares.js/fileUpload');
const { addPromotionImageForBoutiqu, showBoutiqueForpromation } = require('../controllers/promotionOfBoutique');
const { createDeliveryCharge, showDeliveryCharge, updateDeliveryCharge } = require('../controllers/dashboard/deliveryChargeController');

const router = express.Router();

// admin route of  create terms and users
router.post('/caretTermsAdnControllerForAdmin',caretTermsAdnControllerForAdmin)

// analysise
router.get('/getTotalOfTheDashboared',getTotalOfTheDashboared)
router.get('/totalRevinew',totalRevinew)
router.get('/feedbackRatio',feedbackRatio)
router.get('/todayorderDetailsinDashboared',todayorderDetailsinDashboared)
router.get('/totalCostAndSell',totalCostAndSell)
router.get('/sevenDaysOrderDetailsinDashboared',sevenDaysOrderDetailsinDashboared)
// shopper in admin
// router.get('/getAllShopperForAdmin',getAllShopperForAdmin)
router.patch('/blocakShopper',blocakShopper)
router.get('/getShoperByOrder',getShoperByOrder)
router.get('/getAllShopper',getAllShopper)

// show shopper detail with order 
router.get('/showShopperDetails',showShopperDetails)
// boutique in admin 
router.get('/getAllBoutiqueForAdmin',getAllBoutiqueForAdmin)
router.get('/boutiqueDetails',boutiqueDetails)
router.post('/sendFeedback',upload,sendFeedback)
router.patch('/updateProfileOfboutiqueInDashboared',upload,updateProfileOfboutiqueInDashboared)
router.patch('/addPresentageForBoutique',addPresentageForBoutique)
router.patch('/deleteBoutique',deleteBoutique)
// driver in admin 
router.get('/showAllDriverInDashboared',showAllDriverInDashboared)
router.get('/showDriverDetails',showDriverDetails)
router.get('/driverDashboared',driverDashboared)
router.post('/addBoutique',upload,addBoutique)

// for the pomotion 

router.patch('/addPromotionImageForBoutiqu',upload,addPromotionImageForBoutiqu)
router.get('/showBoutiqueForpromation',showBoutiqueForpromation)


//  product creete for the boutiqe from user 

router.post('/productCreateFromAdmin',upload,productCreateFromAdmin)
router.patch('/productUpdateForAdmin',upload,productUpdateForAdmin)
router.delete('/deleteProductForAdmin',deleteProductForAdmin)
router.get('/showProductById',showProductById)

// delivery charge

router.post('/createDeliveryCharge',createDeliveryCharge)
router.get('/showDeliveryCharge',showDeliveryCharge)
router.patch('/updateDeliveryCharge',updateDeliveryCharge)

module.exports = router;