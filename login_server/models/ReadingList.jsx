const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Book = require('./Book.jsx');

const ReadingListSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:  true,
    },
    books: [Book.schema],
})

const ReadingList = mongoose.model('ReadingList', ReadingListSchema);

module.exports = ReadingList;