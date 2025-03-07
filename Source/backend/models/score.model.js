const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {  // Thêm trường 'name'
        type: String,
        required: true // hoặc false, tùy vào việc bạn luôn có tên
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ScoreModel = mongoose.model('score', scoreSchema);

module.exports = { ScoreModel };