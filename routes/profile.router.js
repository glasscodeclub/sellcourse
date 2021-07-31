const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/isLoggedIn');

const { 
    getUser,
    myCourses,
    postReview
} = require('../controllers/profile.controller');



router.route('/')
        .get(isLoggedIn, getUser);

router.route('/mycourses/:courseid')
        .get(isLoggedIn, myCourses)
        .post(isLoggedIn, postReview);


module.exports = router;