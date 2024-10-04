const express = require('express');
const { openTracker, wayToPickupDriver, orderPicked, onTheWayToDeliver, arrivedAtlocation, orderDelivered, openTrackerOfGet, boutiqueTrackingDriver, shoperTrackingDriver } = require('../controllers/drivertrackingContoroller');
const router = express.Router();

// tracking order

// tracking the order by driver arrived arrivedtheStore


//--------------------------
//#########################
// tracking the driver way 
router.patch('/openTracker/:id',openTracker)//
router.patch('/wayToPickupDriver/:id',wayToPickupDriver)//
router.patch('/orderPicked/:id',orderPicked)
router.patch('/onTheWayToDeliver/:id',onTheWayToDeliver)
router.patch('/arrivedAtlocation/:id',arrivedAtlocation)
router.patch('/orderDelivered/:id',orderDelivered)
router.get('/openTrackerOfGet/:id',openTrackerOfGet)
// boutique tracking the driver show-------------
router.get('/boutiqueTrackingDriver/:id',boutiqueTrackingDriver)
// shoper trackiing the driver ---------------------
router.get('/shoperTrackingDriver/:id',shoperTrackingDriver)



module.exports = router;