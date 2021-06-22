const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const User = require('../models/user');
const passport = require('passport');


router.get('/', (req, res) => {
    res.render("index");
});

router.get('/links', (req, res) => {
    res.render('links');
});


router.get('/secret', isLoggedIn, (req, res) => {
    res.render('secret');
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

router.get('/courses', (req, res) => {
    res.render('courses');
});

router.get('/events', (req, res) => {
    res.render('events');
});

router.get('/login2', (req, res) => {
    res.render("login2");
});

router.get('/pricing', (req, res) => {
    res.render('pricing');
});

router.get('/login2', (req, res) => {
    res.render('login2');
});

router.get('/profile', (req, res) => {
    res.render('profile');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/trainers', (req, res) => {
    res.render('trainers');
});

router.get('/signup2', (req, res) => {
    res.render('signup2');
});

//handling user sign up
router.post('/register', function (req, res) {
    User.register(new User({ username: req.body.username }), req.body.password,
        function (err, user) {
            if (err) {
                console.log(err);
                return res.render('signup');
            } //user strategy
            passport.authenticate("local")(req, res, function () {
                res.redirect("/index"); //once the user sign up
            });
        });
});



// middleware
router.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
}), function (req, res) {
    res.send("User is " + req.user.id);
});

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/home");
});


module.exports = router;