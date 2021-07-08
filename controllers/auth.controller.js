const User = require('../models/user');
const passport = require('passport');
const sendEmail = require('../lib/sendEmail');
const crypto = require('crypto');

// forgot password
// post /forgot
// public
exports.forgotPwd = async (req, res) => {
    let messages = [];
    const user = await User.findOne({ email: req.body.email });

    console.log(req.body.email);
    if (!user) {
        messages.push({msg: 'Invalid email address'});
        return res.render('forgot', {
            success: false,
            messages
        });
    }

    const resetToken = user.getResetPwdToken();
    const id = user.id
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/reset/${id}/${resetToken}`;

    const text = `Click on this link to reset your password ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            text
        });

        messages.push({msg: 'Check your email for reset link'});
        return res.render('forgot', {
            success: true,
            messages
        });
    } catch (err) {
        console.log(err);
        user.resetPwdToken = undefined;
        resetPwdExpire = undefined;

        await user.save({ validateBeforeSave: false });

        messages.push({msg: 'Failed to send email'});
        return render('forgot', {
            success: false,
            messages
        });
    }

    res.status(200).json({
        success: true,
        data: user
    });
}


// reset password
// put /reset/:resetToken
// public
exports.resetPassword = async (req, res) => {
    let messages = [];

    const {
        password,
        password2
    } = req.body;

    if(!password || !password2 || password.length < 6 || password2.length < 6){
       messages.push({msg: 'Enter a valid password'});
        return res.render('reset', {
            messages,
            id: req.params.id,
            token: req.params.resettoken
        }); 
    }
    
    if(req.body.password != req.body.password2){
        messages.push({msg: 'Passwords do not match'});
        return res.render('reset', {
            messages,
            id: req.params.id,
            token: req.params.resettoken
        });
    }



    const resetPwdToken = req.params.resettoken;

    console.log(req.params.resettoken);

    const user = await User.findOne({
        resetPwdToken,
        resetPwdExpire: { $gt: Date.now() }
    });


    if (!user) {
        messages.push({msg: 'Invalid Request'})
        return res.render('reset',{
            messages,
            id: req.params.id,
            token: req.params.resettoken
        });
    }


    await user.setPassword(req.body.password);
    user.resetPwdToken = undefined;
    user.resetPwdExpire = undefined;

    await user.save();
    messages.push({msg: 'Password reset successfully'});
    // how to redirect logged in user to the index page?
    // passport.authenticate("local", {
    //     successRedirect: "/",
    //     failureRedirect: "/home/login"
    // });
    
    return res.render('login',{
        messages,
        err: false
    });
};