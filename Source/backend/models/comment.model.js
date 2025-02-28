const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  name: { type: String, required: true }, 
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
module.exports = Comment;
