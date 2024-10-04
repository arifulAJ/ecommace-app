
const express = require('express');
const { createWithdrowRequest, showWithdrow, showAllWithdrowInAdmin, withdrowcancel, withdrowAccept, addBankAccount, showBankOfuser } = require('../controllers/withdrowController');

const router = express.Router();

router.post('/createWithdrowRequest',createWithdrowRequest)
router.get('/showWithdrow',showWithdrow)
router.get('/showAllWithdrowInAdmin',showAllWithdrowInAdmin)
router.patch('/withdrowcancel',withdrowcancel)
router.patch('/withdrowAccept',withdrowAccept)

// add bank account

router.post('/addBankAccount',addBankAccount)
router.get('/showBankOfuser',showBankOfuser)


module.exports = router;