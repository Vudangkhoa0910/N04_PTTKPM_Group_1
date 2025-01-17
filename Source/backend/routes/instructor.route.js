const express = require("express");
const InstructorRequest = require("../models/InstructorRequest");
const router = express.Router();

// Endpoint để đăng ký làm giảng viên
router.post("/register", async (req, res) => {
  try {
    const { name, age, profession, field, experience, description, cv, userId } = req.body;
    console.log("Debug: Received User ID:", userId);

    if (!name || !age || !profession || !field || !experience || !description || !cv || !userId) {
      return res.status(400).json({ message: "All fields are required, including userId." });
    }

    const newRequest = new InstructorRequest({
      name,
      age,
      profession,
      field,
      experience,
      description,
      cv,
      userId, // Lưu userId vào database
    });

    await newRequest.save();

    res.status(201).json({
      message: "Instructor request created successfully",
      newRequest,
    });
  } catch (error) {
    console.error("Error occurred while processing the request:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Endpoint để lấy tất cả yêu cầu giảng viên
router.get("/instructorrequests", async (req, res) => {
  try {
    const requests = await InstructorRequest.find(); // Lấy tất cả yêu cầu giảng viên từ DB
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error occurred while fetching instructor requests:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Endpoint để xóa yêu cầu giảng viên
router.delete("/instructorrequests/:requestId", async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await InstructorRequest.findByIdAndDelete(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Instructor request deleted" });
  } catch (error) {
    console.error("Error occurred while deleting the request:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
