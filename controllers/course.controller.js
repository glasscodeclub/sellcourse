const User = require('../models/user.js');
const Course = require('../models/course.model');
const Video = require('../models/video.model');
const Review = require('../models/review.model');
const CourseCompletion = require('../models/courseCompletion.model');

const moment = require('moment');

// route        GET /courses
// access       Public 
// desc         Fetch all courses
exports.getCourses = function(req, res){
    let login = false;
    console.log(`${req.protocol}://${req.get('host')}/forgot/`)
    if(req.user){
        login= true;
    }
    Course.find({}, (err, ans) => {
        if(err){
            console.log(err);
        }
        else{
            res.render('../views/courses.ejs', {
                results: ans,
                login
            });
        }
    })
};

// exports.createCourse = function(req, res){
//     const createRes = Course.create(req.body);
//     console.log(req.body);
//     // if(!createRes){
//     //     res.status(400).json({
//     //         success: false,
//     //         data: null
//     //     });
//     // }

//     res.status(201).json({
//         success: true,
//    //     data: createRes
//     });
// };


// route        POST /courses/search
// access       Public
// desc         search for courses
exports.searchCourses = async(req, res) => {
    let login = false;
    if(req.user){
        login = true;
    }

    try{
        const results = await Course.find({$or:[{ title: {'$regex': req.query.search, '$options' : 'i' }},
           { description: {'$regex': req.query.search, '$options' : 'i' }} 
        ]});
  
        return res.render('courses', {
            results,
            login
        })

    } catch (err){
        console.log(err);
        return res.redirect('/courses');
    }
}


// route        GET /courses/:courseid
// access       Public
// desc         Fetch course information
exports.getSingleCourse = async(req, res) => {
    let course = await Course.findById(req.params.courseid);
    let bought = false;
    let login = false;
    let courseID = req.params.courseid;
    let user;
    let courseExpired = false;
    var expiresOn;

    try{
        if(req.user){
        user = await User.findById(req.user.id);
        
        if(!user){
            res.redirect('/login');
        }

        login= true;
        if(user.courses.includes(req.params.courseid)){
            bought = true;

            const status = await CourseCompletion.findOne({
                user: req.user.id,
                course: req.params.courseid
            });
            if(status){
                if(status.expiresOn.getTime() < Date.now()){
                    courseExpired = true;
                    console.log("expired: " + courseExpired);
                }
                else{
                    expiresOn = await moment(status.expiresOn).format('DD/MM/YYYY');
                }
            }
        }
    }

    if(!course){
        res.redirect('/courses');
    }

    const publisher = await User.findById(course.publisher);


    const reviewUsers = []
    const reviews = await Review.find({course: req.params.courseid}).sort({date: 'desc'}).limit(5);
    if(reviews){
        for(let i = 0; i < reviews.length; i++){
            reviewUsers.push(await User.findById(reviews[i].user, 'username'));
        }
    }
    
    let playlist = []; 
    course.videos.forEach(vid => {
       playlist.push(Video.findById(vid)) ;
    })
    Promise.allSettled(playlist).then((doc) => {
        let data=[];
        for(let i=0;i<doc.length;++i){
            data.push(doc[i].value)  
        }
        res.render('course-details', {
            err: false,
            messages: null,
            course,
            playlist:data,
            reviews,
            reviewUsers,
            login,
            bought,
            courseid: courseID,
            courseExpired,
            expiresOn,
            publisher: publisher.username
        });
    }).catch(err => {
        console.log(err);
        return res.redirect('/courses');
    })
    } catch(err){
        console.log(err);
        return res.redirect('/courses');
    }
}

