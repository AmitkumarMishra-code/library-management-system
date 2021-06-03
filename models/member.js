const mongoose = require('mongoose')

const MemberSchema = new mongoose.Schema({
    memberId: {
        type: Number,
        unique: true,
        default: Date.now() * Math.ceil(Math.random() * 10)
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    joinDate: {
        type: Date,
        default: Date.now()
    }
});

const MemberModel = mongoose.model('Member', MemberSchema);

module.exports = MemberModel;