const express = require("express");
const Discussion = require("../models/discussion.model");
const { UserModel } = require("../models/users.models");
const router = express.Router();

// Get discussions by courseId
router.get("/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const discussions = await Discussion.find({ courseId })
      .populate({
        path: "participants",
        select: "name email"  // Include any user fields you want
      })
      .populate({
        path: "comments.userId",
        select: "name email"  // Include any user fields you want
      });

    res.status(200).json(discussions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new discussion
router.post("/", async (req, res) => {
  try {
    const { userId, courseId, title, text } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const newDiscussion = new Discussion({
      courseId,
      title,
      createdBy: userId,
      participants: [userId],
      comments: [{
        userId,
        name: user.name,
        text
      }]
    });

    await newDiscussion.save();
    res.status(201).json(newDiscussion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add comment to an existing discussion
router.post("/:discussionId/comments", async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { userId, text } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ msg: "Discussion not found" });
    }

    // Add user to participants if not already there
    if (!discussion.participants.includes(userId)) {
      discussion.participants.push(userId);
    }

    // Add the new comment
    discussion.comments.push({
      userId,
      name: user.name,  // Using "name" here instead of "username"
      text
    });

    await discussion.save();
    res.status(200).json(discussion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;