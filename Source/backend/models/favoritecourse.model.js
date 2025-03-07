const mongoose = require('mongoose');

const favoriteCourseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',  // Changed from 'users' to 'user' to match model name
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course',  // Changed from 'courses' to 'course' to match model name
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create a compound index to ensure a user can favorite a course only once
favoriteCourseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const FavoriteCourse = mongoose.model('favoritecourses', favoriteCourseSchema);

module.exports = FavoriteCourse;