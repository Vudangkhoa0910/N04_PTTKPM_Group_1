const express = require("express");
const router = express.Router();
const Enrollment = require("../models/enrollment.model"); // Kiểm tra model có tồn tại
// POST /enrollments
router.post("/", async (req, res) => {
  try {
    const { userId, courseId, price, paymentMethod } = req.body;
    const newEnrollment = new Enrollment({
      userId,
      courseId,
      price,
      paymentMethod,
      enrollmentDate: new Date(),
    });

    await newEnrollment.save();
    res.status(201).json({ msg: "Enrollment successful", enrollment: newEnrollment });
  } catch (error) {
    console.error("Error saving enrollment:", error);
    res.status(500).json({ msg: "Failed to enroll", error: error.message });
  }
});

router.get("/course/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    // Lấy danh sách enrollments đã populate 'userId' (đổi tên thành 'user' nếu bạn đã sửa model User)
    const enrollments = await Enrollment.find({ courseId }).populate('userId', 'name email role createdAt'); // Giữ nguyên populate('userId', ...)

    if (!enrollments || enrollments.length === 0) {
      return res.status(404).json({ message: "Không có học sinh đăng ký khóa học này." });
    }

    // **KHÔNG CẦN MAP SANG STUDENTS NỮA, TRẢ VỀ ENROLLMENTS TRỰC TIẾP**
    // const students = enrollments.map(enrollment => enrollment.userId);
    // res.status(200).json({ students: students });

    // **TRẢ VỀ DANH SÁCH ENROLLMENTS**
    res.status(200).json({ enrollments: enrollments }); // Thay vì { students: ... }, trả về { enrollments: ... }


  } catch (error) {
    console.error("Lỗi khi lấy danh sách học sinh của khóa học:", error);
    res.status(500).json({ message: "Không thể lấy danh sách học sinh của khóa học", error: error.message });
  }
});
module.exports = router; // Export router đúng cách

// GET /enrollments (NEW ROUTE - to get ALL enrollments)
router.get("/", async (req, res) => {
  try {
    // Fetch all enrollments from the database, populating 'userId'
    const enrollments = await Enrollment.find().populate('userId', 'name email role createdAt');

    if (!enrollments) {
      return res.status(404).json({ message: "Không tìm thấy enrollments nào." }); // Or handle empty enrollments as needed
    }

    res.status(200).json(enrollments); // Directly return the array of enrollments (as we expect in action)

  } catch (error) {
    console.error("Lỗi khi lấy danh sách enrollments:", error);
    res.status(500).json({ message: "Không thể lấy danh sách enrollments", error: error.message });
  }
});