const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/register', function (req, res) {
    res.render('/signup');
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('signup');
        } //user strategy
        passport.authenticate("local")(req, res, function () {
            res.redirect("/secret"); //once the user sign up
        });
    });
});



// middleware
router.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function (req, res) {
    res.send("User is " + req.user.id);
});

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});


module.exports = router;