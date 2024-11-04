const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:  true,
    },
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required:  true,
    },
    rating: Number,
    description: String,
    date: Date,
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;