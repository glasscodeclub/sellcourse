const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const sendEmail = require('../lib/sendEmail');

exports.forgotPwd = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({
            success: false,
            msg: 'No such user exists'
        });
    }

    const resetToken = user.getResetPwdToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/home/forgot/${resetToken}`;

    const message = `Click on this link to reset your password ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });

        res.status(200).json({
            success: true,
            msg: `Email sent to ${user.email}`,
            page: ''
        })
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
};