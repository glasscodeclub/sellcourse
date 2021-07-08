const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    createdAt: {
	   type: Date,
	   default: Date.now
    },
   publisher: {
        type: mongoose.Schema.ObjectId,
        required: true
    }
});


module.exports = mongoose.model('Video', VideoSchema );