var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")

const connectDB = require('./config/db');

const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const routes = require('./routes/routes');
const courseRoutes = require('./routes/course.router');
const profileRoutes = require('./routes/profile.router');
const checkoutRoutes = require('./routes/checkout.router');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
connectDB();

app.use(require('express-session')({
    secret: 'Rusty is the best og in the worldpassport',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
//
app.use(passport.initialize());
app.use(passport.session());
// 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', routes);
app.use('/courses', courseRoutes);
app.use('/profile', profileRoutes);
app.use('/checkout', checkoutRoutes);
//app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('connect!');
});