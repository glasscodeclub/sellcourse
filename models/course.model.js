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
        type: mongoose.Schema.ObjectId,
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
    imageUrl: String,
    videos: {
        type: [String]
    }
});


module.exports = mongoose.model('Course', CourseSchema );