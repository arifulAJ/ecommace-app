const express = require('express');
const { createWishList, getAllWishlist, createWishListCollection, showWishlistFolderByName, getFoldername } = require('../controllers/wishListController');
const router = express.Router();

router.post('/addwishlist',createWishList)
router.get('/getAllWishlist',getAllWishlist)
router.post('/createWishListCollection',createWishListCollection)
router.get('/showWishlistFolderByName',showWishlistFolderByName)
router.get('/getFoldername',getFoldername)
module.exports = router;