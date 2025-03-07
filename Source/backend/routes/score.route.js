const express = require('express');
const router = express.Router();
const { ScoreModel } = require('../models/score.model');
const { UserModel } = require('../models/users.models'); 

// POST - Lưu điểm của người dùng
router.post('/', async (req, res) => {
    try {
        const userId = req.body.userId;

        // Tìm người dùng để lấy tên
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'Không tìm thấy người dùng' });
        }

        const score = new ScoreModel({
            userId: userId,
            name: user.name, // Lưu tên người dùng
            courseId: req.body.courseId,
            score: req.body.score
        });

        const newScore = await score.save();
        res.status(201).json(newScore);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET - Lấy điểm cao nhất của khóa học
router.get('/highest/:courseId', async (req, res) => {
    try {
        const highestScore = await ScoreModel.find({ courseId: req.params.courseId })
            .sort({ score: -1 })
            .limit(1);

        if (highestScore && highestScore.length > 0) {
            res.json(highestScore[0]);
        } else {
            res.status(404).json({ message: 'Không tìm thấy điểm nào cho khóa học này' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET - lấy tất cả điểm số của người dùng trong 1 khóa học
router.get('/user/:userId/course/:courseId', async (req, res) => {
    try {
        const scores = await ScoreModel.find({ userId: req.params.userId, courseId: req.params.courseId });
        res.json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET - Lấy điểm của tất cả sinh viên cho một khóa học
router.get('/course/:courseId', async (req, res) => {
    try {
        const scores = await ScoreModel.find({ courseId: req.params.courseId });
        res.json(scores);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;