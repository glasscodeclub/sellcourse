const Course = require('../models/course.model');

exports.getCourses = function(req, res){
    Course.find({}, (err, ans) => {
        if(err){
            console.log(err);
        }
        else{
            res.render('../views/courses.ejs', {
                results: ans
            });
        }
    })

};

exports.createCourse = function(req, res){
    const createRes = Course.create(req.body);
    console.log(req.body);
    // if(!createRes){
    //     res.status(400).json({
    //         success: false,
    //         data: null
    //     });
    // }

    res.status(201).json({
        success: true,
   //     data: createRes
    });
};

