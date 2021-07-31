const User = require('../models/user');
const Course = require('../models/course.model');
const Video = require('../models/video.model');
const Review = require('../models/review.model');

// route        GET /profile
// access       Protected 
// desc         Fetch the current user and his/her purchases 
exports.getUser = async(req, res) =>{
    if(!req.user)
       return res.redirect('/login');

    const username = req.user.username;
    const purchased = await User.findOne({username}).select('courses');

    if(!purchased){
        return res.render('profile', {
        results: null
    });
    }

    let courseDetails = [];
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

// route        GET /profile/mycourses/:courseid 
// access       Protected 
// desc         Fetch purchased course's information and content
exports.myCourses = async(req, res) => {
    var role;
    let login = false;
    let rev = false;
    if(req.user){
        const user = await User.findById(req.user.id);
        if(!user)
            return res.redirect('/login');

        if(!user.courses.includes(req.params.courseid)){
            return res.redirect('/profile');
        }

        role = user.role;
        // console.log(role);
        login = true;

        // const reviewAdded = await Review.find({course: req.params.courseid, user: req.user.id});
        // if(reviewAdded){
        //     console.log(reviewAdded);
        //     rev = true;
        // } 
    }
    else{
        return res.redirect('/login');
    }


    let course = await Course.findById(req.params.courseid);

    if(!course){
        return res.redirect('/courses');
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
            login,
            role,
            rev
        });
    }).catch(err => {
        console.log(err);
        res.redirect('/');
    })
}

// route        POST /profile/mycourses/:courseid 
// access       Protected 
// desc         Add a review
exports.postReview = async(req, res) => {
    if(!req.user)
        res.redirect('/login');
    
    try{
        const user = await User.findById(req.user.id);
        if(user.role === 'publisher')
            res.redirect('back');

        const { rating, text } = req.body;

        const review = await Review.create({
            rating: rating,
            text: text,
            course: req.params.courseid,
            user: req.user.id
        });

        return res.redirect(`/profile/mycourses/${req.params.courseid}`);
    }
    catch(err) {
        console.log(err);
        res.redirect(`/profile/mycourses/${req.params.courseid}`);
    }

    
}