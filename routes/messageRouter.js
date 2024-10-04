
const express = require('express');

const upload = require('../middlewares.js/fileUpload');
const { createChat, getAllChatForTheUser, showChat } = require('../controllers/chatController');
const { createMessage, showMessages, messageWithImage, showMessageOfUser, editMessage, createMessageByImage } = require('../controllers/messageController');
const router = express.Router();

router.post('/createChat',createChat)
router.get('/showChat',showChat)

// message router 
// //----------#---------------
router.post('/createMessage',createMessage)
router.get('/showMessageOfUser',showMessageOfUser)
router.patch('/editMessage',editMessage)
router.post('/createMessageByImage',upload,createMessageByImage)


module.exports=router