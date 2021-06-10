const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    photoUrl: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

const UsersModel = mongoose.model('Users', UsersSchema);

module.exports = UsersModel;