
const express = require('express');
const { createRewiew, showAllReciewForProduct, updateRatingForboutique, showAllReviewOfbotique, makeComment, makeLike, showComments } = require('../controllers/reviewController');
const upload = require('../middlewares.js/fileUpload');
const router = express.Router();

router.post('/createReview/:id',upload,createRewiew)
router.get('/getReviewForProduct/:id',showAllReciewForProduct)
router.get('/getReviewForProducts/:id',updateRatingForboutique)
router.get('/showAllReviewOfbotique',showAllReviewOfbotique)

// make comment on review 
router.post('/makeComment',makeComment)
router.get('/showComments',showComments)

// make like

router.post('/makeLike',makeLike)


module.exports = router;