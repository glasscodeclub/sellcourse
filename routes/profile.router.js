const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/isLoggedIn');

const { 
    getUser,
    myCourses,
    postReview,
    courseCertificate,
    markAsWatched
} = require('../controllers/profile.controller');



router.route('/')
        .get(isLoggedIn, getUser);

router.route('/mycourses/:courseid')
        .get(isLoggedIn, myCourses)
        .post(isLoggedIn, postReview);

router.route('/mycourses/:courseid/mark/:vid')
        .post(isLoggedIn, markAsWatched);

router.route('/mycourses/:courseid/cert')
        .get( courseCertificate);


module.exports = router;