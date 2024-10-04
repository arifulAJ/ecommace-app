const express = require('express');

const { AddCard, showCard, boutiqueEarned, driverEarned } = require('../controllers/cardController');
const upload = require('../middlewares.js/fileUpload');
const router = express.Router();

router.post('/addcard',upload,AddCard)
router.get('/showCard',showCard)

//  earngiign router of boutique
router.get('/boutiqueEarned',boutiqueEarned)
//driver earning router 
router.get('/driverEarned',driverEarned)
module.exports = router;