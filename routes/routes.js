const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/isLoggedIn');
const User = require('../models/user');
const passport = require('passport');
const Course = require('../models/course.model');
const Video = require('../models/video.model');
const Review = require('../models/review.model');
const { check, validationResult } = require('express-validator');


const {
    forgotPwd,
    resetPassword
} = require('../controllers/auth.controller');
const { response } = require('express');


router.get('/', async (req, res) => {
    const fetchCourse = await Course.find().limit(3);

    let login;
    if(!req.user){
        login = false
    }
    else{
        login= true
    } 

    if(fetchCourse){
       // console.log(fetchCourse);
        return res.render('index', {
            results: fetchCourse,
            login: login    
        });
    }

    res.render('index');
    
});

// after logging in
router.get('/done',isLoggedIn, async (req, res) => {
    const fetchCourse = await Course.find().limit(3);

    if(fetchCourse){
       // console.log(fetchCourse);
        return res.render('index', {
            results: fetchCourse,
            login: true    
        });
    }

    res.render('index',{
        results: null,
        login: false
    });
    
});

router.get('/links', (req, res) => {
    res.render('links', {
         login: null
    });
});


router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/about', (req, res) => {
    res.render('about',{
         login: null
    });
});

router.get('/cart', isLoggedIn, (req, res) => {
    res.render('cart', {
         login: null
    });
});

router.get('/contact', (req, res) => {
    res.render('contact', {
         login: null
    });
});

router.get('/course-details', (req, res) => {
    res.render('course-details', {
         login: null,
         course: null
    });
});

router.get('/course-player', (req, res) => {
    res.render('coursePlayer', {
        login: null
    });
});

router.get('/video/:id',(req, res) => {
    res.sendFile(
        req.params.id+".mp4", { root: "./video" }
    );
})

router.get('/pricing', (req, res) => {
    res.render('pricing', {
         login: null
    });
});


router.get('/profile', isLoggedIn, async(req, res) => {
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
        console.log( purchased.courses[i]);
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

});

router.get('/courses/:userid/:courseid', isLoggedIn,  (req, res) => {


    const user = User.findById(req.params.userid, function(error, user){
  /*      if(error)
            console.log(error);
        else{
            let check;
            console.log(check);
        } */
    });
    
})

router.get('/courses/:courseid', async(req, res) => {
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
        // err handling
    }) 
})


router.get('/courses/:courseid/:videoid', isLoggedIn, async(req, res) => {
    let course = await Course.findById(req.params.courseid);
    
    if(!req.user){
        return res.render('course-details', {
            course
        });
    }
    
    let playlist = [];
    for(let i=0; i < course.videos.length; i++){
        const vid = await Video.findById(course.videos[i]).select('title url name -_id');
        playlist.push(vid);
    } 

  /*  course.videos.forEach(vid => {
       playlist.push(Video.findById(vid).select('title url -_id')) ;
    })
    Promise.allSettled(playlist).then((doc) => {
        console.log(playlist.title);
        res.render('coursePlayer', {
            err: false,
            messages: null,
            course,
            playlist
        });
    }).catch(err => {
        // err handling
    }) 
    */ 

    const activeVidUrl = await Video.findById(req.params.videoid).select('url');
    console.log(activeVidUrl);
    return res.render('coursePlayer', {
            err: false,
            messages: null,
            course,
            playlist,
            activeVidUrl
        });
    
    

})


//---------- auth routes

// signup/register
router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/register',[
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Provide a valid email address').isEmail(),
    check('password', 'Minimum password length is 6 characters').isLength({min: 6})
], function (req, res) {
    let messages = [];
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render('signup', {
            success: false,
            messages: errors.array()
        });
    }

    const { username, email, password } = req.body;

    const user = new User({
        username,
        email
    });

    User.register(user, password,
        function (err, user) {
            if (err) {
                console.log(err);
                messages.push({msg: err});
                return res.render('signup', {
                    messages
                });
            } //user strategy
            const currUser = User.findById(email);
            console.log(currUser);
            passport.authenticate("local")(req, res, function () {
               return res.render('profile', {login: true}); //once the user sign up
            });
    });
    const currUser = User.findById(email);
    console.log(currUser);
});


// login
router.get('/login', (req, res) => {
    if(req.query&&req.query.err == 'no_user'){
        res.render('login', {err: true})
    }
    else{
        res.render('login', {
            err: false,
            messages: null
        });
    }
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/done",
    failureRedirect: '/login?err=no_user'
}), function (req, res) {
    res.send({
        login: true,
        user: req.user.username
    })
});


// forgot password
router.get('/forgot', (req, res) => {
    res.render('forgot');
});
router.post('/forgot', forgotPwd);

// reset password
router.get('/reset/:id/:resettoken', (req, res) => {
    res.render('reset', {
        id: req.params.id,
        token: req.params.resettoken});
})
router.post('/reset/:id/:resettoken',[
    check('password', 'Minimum password length is 6 characters').isLength({min: 6}),
    check('password2', 'Minimum password length is 6 characters').isLength({min: 6}),
], resetPassword);


// logout
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});


module.exports = router;