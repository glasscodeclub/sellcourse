const express = require('express');
const router = express.Router();

const {
    getCourses,
    createCourse
} = require('../controllers/course.controller');


router
    .get('/courses', getCourses )
    .post('/courses', createCourse);
    
module.exports = router;