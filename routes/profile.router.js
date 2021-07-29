const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/isLoggedIn');

const { 
    getUser,
    myCourses
} = require('../controllers/profile.controller');



router.route('/', isLoggedIn)
        .get(getUser);

router.route('/mycourses/:courseid', isLoggedIn)
        .get(myCourses);


module.exports = router;