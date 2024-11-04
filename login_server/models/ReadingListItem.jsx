const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ReadingListItemSchema = new Schema({
    userId: ObjectId,
    bookId: ObjectId,
})

const ReadingListItem = mongoose.model('ReadingListItem', ReadingListItemSchema);

module.exports = ReadingListItem;