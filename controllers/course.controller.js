const CourseModel = require('../models/course.model');

exports.getCourses = async (req, res, err) => {
    const result = await CourseModel.find();

    res.render('../views/courses.ejs', {data: result});
};

