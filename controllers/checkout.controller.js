const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const User = require('../models/user');
const Course = require('../models/course.model');
const Order = require('../models/order.model');

dotenv.config({ path: '../config/config.env' });
var instance = new Razorpay({ 
    key_id: process.env.RAZ_ID, 
    key_secret: process.env.RAZ_SEC
});


// route        GET /checkout/:courseid 
// access       Protected 
// desc         Creates an order using RazorPay and provides the checkout form
exports.getCheckoutPage = async(req, res) =>{
    try {
        const course = await Course.findById(req.params.courseid); 

        let login = false;

        if(course && req.user){
            login = true;

            // check if already bought
            const user = await User.findById(req.user.id);
            if(user.courses.includes(req.params.courseid)){
                console.log('Already purchased');
                return res.redirect('/profile');
            }
            // create an order otherwise
            var options = {
                amount: course.cost*100,  
                currency: "INR"
            };
            instance.orders.create(options, function(err, order) {
                if(err) console.log(err);

                // console.log("Before ", order.id);
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
        else{
            res.redirect('/courses');
        }
        
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}

// route        POST /checkout/:courseid/verify
// access       Protected 
// desc         Verifies the payment via payment_signature sent from the server, 
//              adds the course to the user's database
exports.verifyPayment = async(req, res) => {
    try{
        let login= false;
        if(req.user){
            login = true;

            // check if already bought
            const user = await User.findById(req.user.id);
            if(user.courses.includes(req.params.courseid)){
                console.log('Already purchased');
                return res.redirect('/profile');
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

            const order = {};
            order.raz_payment_id = req.body.razorpay_payment_id;
            order.raz_order_id = req.body.razorpay_order_id;
            order.raz_signature = req.body.razorpay_signature;
            order.user = req.user.id;
            order.courseID = req.params.courseid;

            const orderSaved = new Order(order);
            await orderSaved.save();

            console.log(orderSaved);
            
            success = true;
            return res.redirect('/profile');
        }
        else{

            return res.render('/courses', {
                success: false,
                msg: 'Order processing failed'
            })
        }
    } catch (err){
        console.log(err)
     res.redirect('/')
    }
}