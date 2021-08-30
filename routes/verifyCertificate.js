const express = require('express');
const router = express.Router();
const fs = require('fs');

const CourseCompletion = require('../models/courseCompletion.model');

router.get('/:certid', async (req, res) => {
    const verify = await CourseCompletion.findOne({ "certificate.uuid" : req.params.certid }).select('certificate');

    if(verify && fs.existsSync(verify.certificate.path)){
        return res.sendFile(verify.certificate.path)
    }
    else{
        return res.render('error', {
            login: false,
            success: false,
            msg: 'Invalid certificate ID or Server Error'
        })
    }
});

module.exports = router;
