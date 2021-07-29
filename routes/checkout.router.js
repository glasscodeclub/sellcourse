const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/isLoggedIn');


const {
    getCheckoutPage,
    verifyPayment
} = require('../controllers/checkout.controller');




router.route('/:courseid', isLoggedIn)
    .get(getCheckoutPage);

router.route('/:courseid/verify', isLoggedIn)
    .post(verifyPayment);


module.exports = router;