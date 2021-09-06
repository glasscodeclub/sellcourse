const User = require('../models/user');
const Course = require('../models/course.model');
const Video = require('../models/video.model');
const Review = require('../models/review.model');
const CourseCompletion = require('../models/courseCompletion.model');

const { PDFDocument, rgb, degrees, StandardFonts } = require('pdf-lib');
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid');
const moment = require('moment');
//const moment = require('moment');

// route        GET /profile
// access       Protected 
// desc         Fetch the current user and his/her purchases 
exports.getUser = async(req, res) =>{
    if(!req.user)
       return res.redirect('/login');

    let login = false;

    const username = req.user.username;
    if(username) login=true;
    const purchased = await User.findOne({username}).select('courses');

    if(!purchased){
        return res.render('profile', {
            results: null,
            login
        });
    }

    const validity = await CourseCompletion.find({ user: req.user.id });

    let expired = [];
    let courseDetails = [];
    for(let i = 0; i < purchased.courses.length; i++){
        const eachCourse = await Course.findById(purchased.courses[i]);
        if(validity[i].expiresOn.getTime() < Date.now()){
            expired.push(eachCourse);
        }
        else if( validity[i].expiresOn.getTime() > Date.now()){
            courseDetails.push(eachCourse);
        }
    }

   /* Promise.allSettled(courseDetails).then(doc => {
        console.log(courseDetails.title);
    }).catch(err => {
        console.log(err);
    });
    console.log(courseDetails);

    */
    
    return res.render('profile', {
        results: courseDetails,
        login,
        expired,
        username
    }); 
}

// route        GET /profile/mycourses/:courseid 
// access       Protected 
// desc         Fetch purchased course's information and content
exports.myCourses = async(req, res) => {
    var role;
    let login = false;
    let rev = false;
    var expiresOn;
    let certAvailable = false;

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

        // does NOT work
        // check if the user has already posted a review
        // const reviewed = await Review.findOne({
        //     course: req.params.courseid,
        //     user: req.user.id
        // });

        // if(reviewed){
        //     console.log(reviewed);
        // }
    }
    else{
        return res.redirect('/login');
    }


    try {
        let course = await Course.findById(req.params.courseid);

        if(!course){
            return res.redirect('/courses');
        }

        // check for validity
        const validity = await CourseCompletion.findOne({
            user: req.user.id,
            course: req.params.courseid
        })

        if(validity){
            if(validity.watchPercentage > 90){
                certAvailable = true; // generate certificate?
            }
            if(validity.expiresOn.getTime() < Date.now()){
                return res.redirect('/profile')
            } 
            else{
                expiresOn = await moment(validity.expiresOn).format('DD/MM/YYYY');
            }
            

        }

        const reviewUsers = []
        const reviews = await Review.find({course: req.params.courseid}).sort({date: 'desc'}).limit(5);
        if(reviews){
            for(let i = 0; i < reviews.length; i++){
                reviewUsers.push(await User.findById(reviews[i].user, 'username'));
            }
        }

        // certificate completion
        
        

        
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
                rev,
                certAvailable,
                validity,
                expiresOn
            });
        }).catch(err => {
            console.log(err);
            res.redirect('/');
    })
    } catch(err){
        console.log(err);
        return res.redirect('/')
    }
}

// route        POST /profile/mycourses/:courseid 
// access       Protected 
// desc         Add a review
exports.postReview = async(req, res) => {
    if(!req.user)
        res.redirect('/login');
    
    try{
        const user = await User.findById(req.user.id);
        if(user.role === 'publisher'){
           return res.redirect('/profile');
        }
        if(!user.courses.includes(req.params.courseid)){
            return res.redirect('/profile');
        }
        
        let reviewed = await Review.findOne({
            course: req.params.courseid,
            user: req.user.id
        });

        // get the review and rating
        const { rating, text } = req.body;
        try{
            if(reviewed){
                reviewed = await Review.findOneAndUpdate(
                    { user: req.user.id, course: req.params.courseid },
                    { rating: rating, text: text }
                );
                await reviewed.save();
                return res.redirect(`/profile/mycourses/${req.params.courseid}`);
            }
        }catch(err){
            console.log(err);
            return res.redirect(`/profile/mycourses/${req.params.courseid}`);
        } 


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



// route        GET /profile/mycourses/:courseid/cert
// access       Protected 
// desc         Certificate
const path1 = path.join(__dirname, '..', 'data', 'Template.pdf')
const path2 = path.join(__dirname, '..', 'data', 'output.pdf');

exports.courseCertificate = async(req, res) => {
    if(!req.user){
        return res.redirect('/');
    }
    try{
        const courseStatus = await CourseCompletion.findOne({
            user: req.user.id,
            course: req.params.courseid
        })

        const course = await Course.findById(req.params.courseid);

        if(!courseStatus ||!course){
            return res.redirect('back');
        }
        else if(courseStatus.watchPercentage > 90){
            const path3 = path.join(__dirname, '..', 'data', `${req.user.id}_${req.params.courseid}.pdf`);
            
            
            if(courseStatus.certificate.uuid && courseStatus.certificate.path && fs.existsSync(courseStatus.certificate.path)){
                return res.sendFile(`${req.user.id}_${req.params.courseid}.pdf`, {
                    root: './data'
                });
            }
            
            try{            
                const pdfDoc = await PDFDocument.load(fs.readFileSync('./data/testTemplate.pdf'));

                const publisher = await User.findById(course.publisher);

                const pages = pdfDoc.getPages();
                const firstPage = pages[0];

                courseStatus.certificate.path = path3;
                courseStatus.certificate.uuid = nanoid();
                await courseStatus.save();

                firstPage.drawText(req.user.username, {
                    x: 270,
                    y: 250,
                    size: 65,
                    color: rgb(0.2, 0.84, 0.67),
                });

                firstPage.drawText('ID: ' + courseStatus.certificate.uuid, {
                    x: 520,
                    y: 550,
                    size: 15,
                    color: rgb(0.2, 0.84, 0.67),
                });

                firstPage.drawText(course.title, {
                    x: 410,
                    y: 210,
                    size: 20,
                    color: rgb(0.2, 0.84, 0.67),
                });

                firstPage.drawText(publisher.username, {
                    x: 95,
                    y: 210,
                    size: 20,
                    color: rgb(0.2, 0.84, 0.67),
                });

                firstPage.drawText("Verified", {
                    x: 100,
                    y: 115,
                    size: 20,
                    color: rgb(0.2, 0.84, 0.67),
                });

                const verificationLink = `${req.protocol}://${req.get('host')}/verify/${courseStatus.certificate.uuid}`; 

                firstPage.drawText("Verification Link: " + verificationLink, {
                    x: 300,
                    y: 20,
                    size: 10,
                    color: rgb(0.2, 0.84, 0.67),
                });

                fs.writeFileSync(path3, await pdfDoc.save());

                if(fs.existsSync(path3)){
                    return res.sendFile(`${req.user.id}_${req.params.courseid}.pdf`, {
                        root: './data'
                    });
                } else {
                    courseStatus.certificate = undefined;
                    courseStatus.save();
                }
                
            }
            catch(err){
                console.error(err)
                console.log(err)
            }
        }
        else{
            return res.redirect('/');
        }
    } catch(err){
        console.log(err)
        return res.redirect('/')
    }
   
}

// route        POST /profile/mycourses/:courseid/mark/:vid
// access       Protected 
// desc         mark the current video as watched
exports.markAsWatched = async(req, res) => {
    // check if user has purchased the course
    if(!req.user){
        return res.redirect('/login');
    }
    const user = await User.findById(req.user.id);
    const vids = await Course.findById(req.params.courseid).select('videos');
    if(!user){
        return res.redirect('/');
    }
    if(!user.courses.includes(req.params.courseid)){
        return res.redirect('/profile');
    }

    // find the courseCompletion entry
    const courseStatus = await CourseCompletion.findOne({
        user: req.user.id,
        course: req.params.courseid
    });

    try{
        if(!courseStatus){
            const status = await CourseCompletion.create({
                user: req.user.id,
                course: req.params.courseid
            });
            status.videos.unshift(req.params.vid);
            await status.save();

            status.watchPercentage = (status.videos.length/vids.videos.length)*100;
            await status.save();
        }
        else{
            // check if current video has been watched already
            if(courseStatus.videos.includes(req.params.vid)){
                
            }
            else{
                courseStatus.videos.push(req.params.vid);
                courseStatus.watchPercentage = (courseStatus.videos.length/vids.videos.length)*100;
                await courseStatus.save();
            }
        }
    } catch (err){
        console.log(err);
    }
}