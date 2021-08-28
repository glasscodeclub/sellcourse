const express = require('express');
const router = express.Router();

const CourseCompletion = require('../models/courseCompletion.model');

router.get('/:certid', async (req, res) => {
    const verify = await CourseCompletion.findOne({ "certificate.uuid" : req.params.certid }).select('certificate');

    if(verify){
        return res.sendFile(verify.certificate.path)
    }
    else{
        return res.render('pricing', {
            login: false,
            success: false
        })
    }
});

module.exports = router;
