var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose")

const connectDB = require('./config/db');
const router = require('./routes/routes');
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


app.listen(3000, function(){
    console.log('connect!');
});