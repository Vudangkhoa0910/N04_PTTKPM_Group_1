const mongoose = require("mongoose");

const viewSchema = new mongoose.Schema({
  views: {
    type: Number,
    default: 0,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  coursePrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ViewModel = mongoose.model("views", viewSchema);

module.exports = { ViewModel };
