const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/isLoggedIn');
const User = require('../models/user');
const passport = require('passport');
const Course = require('../models/course.model');
const Video = require('../models/video.model');
const Review = require('../models/review.model');
const Job = require('../models/job.model');
const { check, validationResult, cookie } = require('express-validator');
const dotenv = require('dotenv');

//--- controllers
const {
    getUser
} = require('../controllers/profile.controller');


dotenv.config({ path: './config/config.env' });


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
            login: true,
            userid: req.user.id    
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

router.get('/about', async (req, res) => {
    let login = false;
    if(req.user)
        login = true;

    const jobs = await Job.find({});
    let jobNumber = jobs.length;

    res.render('about',{
         login: login,
         jobs,
         jobNumber
    });
});



router.get('/contact', (req, res) => {
    let login = false;
    if(req.user) login= true;
    res.render('contact', {
         login
    });
});



router.get('/video/:id',(req, res) => {
    res.sendFile(
        req.params.id+".mp4", { root: "./video" }
    );
})

router.get('/pricing', (req, res) => {
    let login = false;
    if(req.user) login = true;
    res.render('pricing', {
         login
    });
});


/*
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
 /*   
    return res.render('profile', {
        results: courseDetails
    }); 

});

*/
/*
router.get('/profile/mycourses/:courseid', isLoggedIn, async (req, res) => {
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


});

*/

/*
router.get('/courses/:courseid', async(req, res) => {
    let course = await Course.findById(req.params.courseid);
    let bought = false;
    let login = false;
    let courseID = req.params.courseid;
    let user;

    if(req.user){
        user = await User.findById(req.user.id);
        
        if(!user){
            res.redirect('/login');
        }

        login= true;
        if(user.courses.includes(req.params.courseid)){
            bought = true;
        }
    }

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
        res.render('course-details', {
            err: false,
            messages: null,
            course,
            playlist:data,
            reviews,
            reviewUsers,
            login,
            bought,
            courseid: courseID
        });
    }).catch(err => {
        console.log(err);
        return res.redirect('/courses');
    }) 
})

*/

// payment routes
/*
router.get('/checkout/:courseid', isLoggedIn, async(req, res) => {
    try {
        const course = await Course.findById(req.params.courseid); 
        console.log(course);

        let login = false;

        if(course && req.user){
            login = true;
            var options = {
                amount: course.cost*100,  
                currency: "INR"
            };
            instance.orders.create(options, function(err, order) {
                if(err) console.log(err);

                console.log("Before ", order.id);
                const orderID = order.id;

                res.render('cart', {
                    course,
                    courseID: course.id, 
                    raz_id: process.env.RAZ_ID,
                    order,
                    login
                })
                
            });
            
            
        }
        
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }
});

//-------payment with razorpay

router.post("/checkout/:courseid/verify", isLoggedIn, async (req, res) => {
    try{
        console.log(req.body);
        let login= false;
        if(req.user){
            login = true;
            const user = await User.findById(req.user.id);
            if(user.courses.includes(req.params.courseid)){
                throw "Already purchased"
            }
        }

        let success= false;
        let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

        const expectedSignature = crypto.createHmac("sha256", process.env.RAZ_SEC).update(body.toString()).digest("hex");

        if(expectedSignature === req.body.razorpay_signature){
            const user = await User.findById(req.user.id);
            const coursePurchased = req.params.courseid;

            user.courses.push(coursePurchased);
            user.save();
            
            let courseDetails = [];
            for(let i = 0; i < user.courses.length; i++){
                const eachCourse = await Course.findById(user.courses[i]);
                courseDetails.push(eachCourse);
            }

            success = true;
            return res.redirect('/profile');
        }
    } catch (err){
        throw err;
    }
});
*/



//---------- auth routes

// signup/register
router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/register',[
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Provide a valid email address').isEmail(),
    check('password', 'Minimum password length is 6 characters').isLength({min: 6})
], async (req, res) => {
    let messages = [];
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render('signup', {
            success: false,
            messages: errors.array()
        });
    }

    const { username, email, password } = req.body;

    
    const userExists = await User.findOne({email: email});
    if(userExists){
        const errExist = 'Please provide unique email' ;
        messages.push({msg: errExist});
        return res.render('signup', {
            messages 
        })
    }

    const user = new User({
        username,
        email
    });

    User.register(user, password,
        function (err, user) {
            if (err) {
                console.log(err);
                messages.push({msg: 'Invalid info provided'});
                return res.render('signup', {
                    messages
                });
            } //user strategy
            const currUser = User.findById(email);
            passport.authenticate("local")(req, res, function () {
               return res.redirect('/courses') //once the user sign up
            });
    });
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