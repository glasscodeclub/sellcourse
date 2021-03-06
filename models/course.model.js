const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    duration: {
        type: String
    },
    imageUrl: String,
    content: String,
    tag: String,
    videos: {
        type: [String]
    }
});


module.exports = mongoose.model('Course', CourseSchema );