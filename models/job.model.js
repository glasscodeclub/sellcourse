const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    postedBy: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Job', JobSchema);