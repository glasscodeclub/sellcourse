const express = require('express');
const router = express.Router();

const {
    getCourses,
    createCourse,
    getSingleCourse,
    searchCourses
} = require('../controllers/course.controller');


router.route('/')
    .get(getCourses);

router.route('/search')
    .get(searchCourses);

router.route('/:courseid')
    .get(getSingleCourse);
    
module.exports = router;