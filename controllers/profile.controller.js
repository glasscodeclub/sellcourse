const User = require('../models/user');
const Course = require('../models/course.model');
const Video = require('../models/video.model');
const Review = require('../models/review.model');
const CourseCompletion = require('../models/courseCompletion.model');

const { PDFDocument, rgb, degrees, StandardFonts } = require('pdf-lib');
const fetch = require('node-fetch')

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
        results: courseDetails,
        login
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

    // certificate completion
    let certAvailable = false;
    const status = await CourseCompletion.findOne({
        user: req.user.id,
        course: req.params.courseid
    });
    if(status && status.watchPercentage > 90){
        certAvailable = true;
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
            rev,
            certAvailable
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
exports.courseCertificate = async(req, res) => {
    if(!req.user){
        return res.redirect('/');
    }
    const courseStatus = await CourseCompletion.findOne({
        user: req.user.id,
        course: req.params.courseid
    })
    
    if(!courseStatus){
        return res.redirect('back');
    }
    else if(courseStatus.watchPercentage > 90){
        console.log(courseStatus.watchPercentage);
        // let existingPdfBytes;
        // const url = '../data/Certificate.pdf'
        // await fetch('http://localhost:3000/data/discountcodes.json').then((result) =>
        //     console.log(result)   
        // // existingPdfBytes = result.arrayBuffer()
        // );

        // // Load a PDFDocument from the existing PDF bytes
        // const pdfDoc = await PDFDocument.load(existingPdfBytes);
        // const pages = pdfDoc.getPages();
        // const firstPage = pages[0];

        // // Draw a string of text diagonally across the first page
        // firstPage.drawText(req.user.id, {
        //     x: 300,
        //     y: 270,
        //     size: 58,
        //     color: rgb(0.2, 0.84, 0.67),
        // });

        // // Serialize the PDFDocument to bytes (a Uint8Array)
        // const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
        // saveAs(pdfDataUri, "newcertificate.pdf")
        //---------------------------------------------------------------
        // const pdfDoc = await PDFDocument.create()
        // const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

        // const page = pdfDoc.addPage()
        // const { width, height } = page.getSize()
        // const fontSize = 30
        // page.drawText('Creating PDFs in JavaScript is awesome!', {
        //     x: 50,
        //     y: height - 4 * fontSize,
        //     size: fontSize,
        //     font: timesRomanFont,
        //     color: rgb(0, 0.53, 0.71),
        // })

        // const pdfBytes = await pdfDoc.save()
        // return res.download(pdfBytes);

        return res.sendFile('Certificate.pdf', { 
            root: '../data' 
        });
    }
    else{
        return res.redirect('/');
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