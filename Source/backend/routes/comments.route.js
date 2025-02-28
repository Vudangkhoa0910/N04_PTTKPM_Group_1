const express = require("express");
const Comment = require("../models/comment.model");
const { UserModel } = require("../models/users.models"); 
const router = express.Router();

// Lấy danh sách bình luận theo courseId (populate để lấy thông tin user)
router.get("/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const comments = await Comment.find({ courseId })
      .populate({
        path: "userId",
        select: "name", 
      });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm bình luận mới
router.post("/", async (req, res) => {
  try {
    const { userId, courseId, text } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const newComment = new Comment({
      userId,
      name: user.name, 
      courseId,
      text,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});


module.exports = router;
