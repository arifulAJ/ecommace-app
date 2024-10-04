
const express = require('express');
const { acceptPrivecyPolicy, denayPolicy } = require('../controllers/termsOfUseController');

const router = express.Router();

router.post('/acceptPrivecyPolicy',acceptPrivecyPolicy)
router.post('/denayPolicy',denayPolicy)



module.exports = router;