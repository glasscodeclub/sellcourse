const mongoose = require('mongoose');

const CourseCompletionSchema = new mongoose.Schema({
    user:{
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    videos:{
        type: [String]
    },
    watchPercentage: {
        type: Number,
        default: 0
    },
    expiresOn: {
        type: Date
    },
    certificate: {
        _id: false,
        uuid: {
            type: String
        },
        path: {
            type: String
        }
    }  
});

module.exports = mongoose.model('CourseCompletion', CourseCompletionSchema);