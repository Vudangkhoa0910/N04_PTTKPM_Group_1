const mongoose = require('mongoose');

// Discussion Schema
const discussionSchema = new mongoose.Schema({
  // Course reference - explicitly added as requested
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'course'  // References the course model
  },
  title: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Array of user IDs who participate
  participants: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user'
  }],
  // Array of comments with user references
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    },
    name: String,  // Changed from 'username' to 'name' for consistency
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

const DiscussionModel = mongoose.model('discussion', discussionSchema);

module.exports = DiscussionModel;