const express = require('express');
const router = express.Router();
const { QuestionModel } = require('../models/question.model');

// GET questions by course ID
router.get('/course/:courseId', async (req, res) => {
  try {
    const questions = await QuestionModel.find({ courseId: req.params.courseId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new question
router.post('/', async (req, res) => {
  const question = new QuestionModel({
    courseId: req.body.courseId,
    questionText: req.body.questionText,
    correctAnswer: req.body.correctAnswer,
    options: req.body.options
  });

  try {
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a question
router.put('/:id', async (req, res) => {
  try {
    const question = await QuestionModel.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.questionText = req.body.questionText;
    question.correctAnswer = req.body.correctAnswer;
    question.options = req.body.options;

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE delete a question
router.delete('/:id', async (req, res) => {
  try {
    const question = await QuestionModel.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await question.deleteOne();
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;