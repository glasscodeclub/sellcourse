const User = require('../models/user');
const Course = require('../models/course.model');
const Video = require('../models/video.model');
const Review = require('../models/review.model');

exports.getUser = async(req, res) =>{
    if(!req.user)
       return res.redirect('/login');

    const username = req.user.username;
    const purchased = await User.findOne({username}).select('courses');

    let courseDetails = [];
    // purchased.courses.forEach(courseID => {
    //   //  console.log(courseID);
        
    //     courseDetails = Course.findById(courseID) ;
    
    // })


    for(let i = 0; i < purchased.courses.length; i++){
       const eachCourse = await Course.findById(purchased.courses[i]);
       courseDetails.push(eachCourse);
    }

   /* Promise.allSettled(courseDetails).then(doc => {
        console.log(courseDetails.title);
    }).catch(err => {
        console.log(err);
    });
    console.log(courseDetails);

    */
    
    return res.render('profile', {
        results: courseDetails
    }); 
}


exports.myCourses = async(req, res) => {
    let course = await Course.findById(req.params.courseid);

    if(!course){
        res.redirect('/courses');
    }

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
        res.render('coursePlayer', {
            err: false,
            messages: null,
            course,
            playlist:data,
            reviews,
            reviewUsers,
            login:true,
        });
    }).catch(err => {
        throw err;
        // err handling
    })
}