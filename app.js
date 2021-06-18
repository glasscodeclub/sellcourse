var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose")

const connectDB = require('./config/db');

const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});

const router = require('./routes/routes');
const courseRouter = require('./routes/course.routes/getCourses');
const app = express();


app.use(express.static(__dirname + '/public'))
connectDB();

app.use(bodyParser.urlencoded({extended:true}));
app.use(require('express-session')({
    secret:'Rusty is the best og in the worldpassport',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine','ejs');
//
app.use(passport.initialize());
app.use(passport.session());
// 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('', router);
app.use('/courses', courseRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log('connect!');
});