const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const User = require('../models/user');
const passport = require('passport');
const Course = require('../models/course.model');

const {
    forgotPwd,
    resetPassword
} = require('../controllers/auth.controller');


router.get('/', async (req, res) => {
    const fetchCourse = await Course.find().limit(3);

    if(fetchCourse){
       // console.log(fetchCourse);
        return res.render('index', {
            results: fetchCourse,
            login: null    
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
    res.render('links');
});


router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/cart', (req, res) => {
    res.render('cart');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/course-details', (req, res) => {
    res.render('course-details');
});

router.get('/pricing', (req, res) => {
    res.render('pricing');
});


router.get('/profile', (req, res) => {
    res.render('profile');
});


//---------- auth routes

//signup/register
router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/register', function (req, res) {
    const { username, email } = req.body;

    const user = new User({
        username,
        email
    });

    User.register(user, req.body.password,
        function (err, user) {
            if (err) {
                console.log(err);
                return res.render('signup');
            } //user strategy
            passport.authenticate("local")(req, res, function () {
               return res.render("/profile#courses-taken", {login: true}); //once the user sign up
            });
    });
});


// login
router.get('/login', (req, res) => {
    if(req.query&&req.query.err == 'no_user'){
        res.render('login', {err: true})
    }
    else{
        res.render('login');
    }
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/done",
    failureRedirect: '/login?err="no_user"'
}), function (req, res) {
   // res.send("User is " + req.user.id);
    res.send({login: true})
});


// forgot password
router.get('/forgot', (req, res) => {
    res.render('forgot');
});
router.post('/forgot', forgotPwd);

// reset password
router.get('/reset/:id/:resettoken', (req, res) => {
    res.render('reset');
})
router.post('/reset/:id/:resettoken', resetPassword)


// logout
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});


module.exports = router;