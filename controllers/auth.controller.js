const User = require('../models/user');
const passport = require('passport');
const sendEmail = require('../lib/sendEmail');
const crypto = require('crypto');

// forgot password
// post /forgot
// public
exports.forgotPwd = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    console.log(req.body.email);
    if (!user) {
        return res.status(404).json({
            success: false,
            msg: 'No such user exists'
        });
    }

    const resetToken = user.getResetPwdToken();
    const id = user.id
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/reset/${id}/${resetToken}`;

    const text = `Click on this link to reset your password ${resetUrl}`;
    const messages = [];

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

        return res.status(400).json({
            success: false,
            msg: 'Failed to send email',
            page: 'forgot'
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
        messages
    });
};