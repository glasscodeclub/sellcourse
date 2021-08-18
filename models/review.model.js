const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    createdAt: {
	   type: Date,
	   default: Date.now
    }

});

ReviewSchema.index({ course: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function(courseId){
    const result = await this.aggregate([
        { $match: { course: courseId } },
        {
            $group: {
                _id: '$courseId',
                averageRating: { $avg: '$rating'}
            }
        }   
    ]);

    try{
        await this.model('Course').findByIdAndUpdate(courseId,{
            averageRating: Math.round(result[0].averageRating)
        });
    } 
    catch(err){
        console.log(err)
    }
};

ReviewSchema.post('save', function(){
    this.constructor.getAverageRating(this.course);
})

module.exports = mongoose.model('Review', ReviewSchema);