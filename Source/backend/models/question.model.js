const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course', // Assuming you have a Course model
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  options: {
    type: [String], // Array of strings for options
    required: true,
    validate: [arrayLimit, '{PATH} exceeds the limit of 4'] // Validate the amount of options, limited to 4
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

function arrayLimit(val) {
  return val.length <= 4;
}

const QuestionModel = mongoose.model('question', questionSchema);

module.exports = { QuestionModel };