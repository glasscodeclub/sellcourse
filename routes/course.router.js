const express = require('express');
const router = express.Router();

const {
    getCourses,
    createCourse,
    getSingleCourse
} = require('../controllers/course.controller');


router.route('/')
    .get(getCourses)
    .post(createCourse);

router.route('/:courseid')
    .get(getSingleCourse);
    
module.exports = router;