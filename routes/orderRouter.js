const express = require('express');


const { makeOreder, orderInProgress, orderDetails, allOrdersOfBoutique, assignedDriver, newOrder, orderInprogresShow, inprogresOrderDetails, assignedOrderedShowe, deliveriedOrder, deliveriedOrderForDriver, showDeliveryOrderDetailsForDriver, showDeliveryOrderDetailsForboutique, showTheOrderOfShoper, showOrderedOfShoper, findNearByDriver } = require('../controllers/orderController');
const { showDriverDashBored, cancelledOrderedAsDriver, showAllCancellOrder, showNewOrderForDriver, newOrderToProgress, getAllinprogressOrderForDriver, inprogressDetailsForOrderTrac, accpetOrderDetails, cnacleOrderDetails } = require('../controllers/orderControllerForDriver');

const router = express.Router();

router.post('/makeOrder',makeOreder)
// order statuse update
router.patch('/orderInprogres/:id',orderInProgress)
// order details
router.get('/orderDetails/:id',orderDetails)
// all  ordered of butique product
router.get('/allOrdersOfBoutique',allOrdersOfBoutique)
// assigned driver
router.patch('/assignedDriver/:id',assignedDriver)
// get new order 
router.get('/newOrder',newOrder)
// get inprogress order
router.get('/orderInprogresShow',orderInprogresShow)
// show inprogress details
router.get('/inprogresOrderDetails/:id',inprogresOrderDetails)
// show assigned  ordered 
router.get('/assignedOrderedShow',assignedOrderedShowe)
// show all driver who is online 
router.get('/findNearByDriver',findNearByDriver)

//---------------this is drive order route -----------
// -------------------

// driver order route all the order managed
router.get('/showDriverDashBored',showDriverDashBored)
// cancelled the order as driver 
router.post('/cancelledOrderedAsDriver/:id',cancelledOrderedAsDriver)
// fetched all cancelled data for the driver 
router.get('/showAllCancellOrder',showAllCancellOrder)
// get new order for driver
router.get('/showNewOrderForDriver',showNewOrderForDriver)
// driver user assigned updated 
router.patch('/newOrderToProgress/:id',newOrderToProgress)
// get all inprogress order for the driver 
router.get('/getAllinprogressOrderForDriver',getAllinprogressOrderForDriver)
// get inprogress details for driver traking
router.get('/inprogressDetailsForOrderTrac/:id',inprogressDetailsForOrderTrac)
// for accepting order show the details 
router.get('/accpetOrderDetails/:id',accpetOrderDetails)
// for the cancele order details
router.get('/cnacleOrderDetails/:id',cnacleOrderDetails)
// ordered succesfully for botique
router.get('/deliveriedOrder',deliveriedOrder)
// driver deliveried route 
router.get('/deliveriedOrderForDriver',deliveriedOrderForDriver)
router.get('/showDeliveryOrderDetailsForDriver/:id',showDeliveryOrderDetailsForDriver)
router.get('/showDeliveryOrderDetailsForboutique/:id',showDeliveryOrderDetailsForboutique)

// shoper get all order
router.get('/showOrderedOfShoper',showOrderedOfShoper)

module.exports = router;