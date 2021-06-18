const express = require('express');
const router = express.Router();

const {
    getCourses
} = require('../../controllers/course.controller');


router.get('/all', getCourses );

module.exports = router;