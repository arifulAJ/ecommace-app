const express = require('express');
const { getNotifaction, adminNotifaction, adminAprovedProduct, adminDenayProduct, adminAprovedDriver, adminDenayDriver } = require('../controllers/notifactionController');
const { createOrderItmes } = require('../controllers/orderItemController');

const router = express.Router();


router.get('/getNotifaction',getNotifaction)
router.get('/adminNotifaction',adminNotifaction)

// in notifaction aproved and denay 
router.patch('/adminAprovedProduct',adminAprovedProduct)
router.patch('/adminDenayProduct',adminDenayProduct)


// for the order quentitiy 
router.post('/createOrderItmes',createOrderItmes)

// in notifaction for the admin 
router.patch('/adminAprovedDriver',adminAprovedDriver)
router.patch('/adminDenayDriver',adminDenayDriver)



module.exports=router