const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    username: String,
    email: String, 
    password: String,
    private: { type: Boolean, default: false }, // New attribute with a default value
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
