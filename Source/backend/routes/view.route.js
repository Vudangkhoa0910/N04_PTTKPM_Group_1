const express = require("express");
const { ViewModel } = require("../models/view.model"); // Import ViewModel (điều chỉnh đường dẫn nếu cần)
const CourseModel = require("../models/courses.model");
const router = express.Router();

// Middleware để parse JSON body (nếu chưa có ở app.js)
router.use(express.json());

// 1. Route tạo mới một view (POST /views)
router.post("/", async (req, res) => {
  try {
    const { teacherId, courseId } = req.body;

    if (!teacherId || !courseId) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ teacherId và courseId." });
    }

    // **1. Tìm course trong collection 'courses' dựa trên courseId**
    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy khóa học với courseId đã cung cấp." });
    }

    // **2. Lấy courseName và coursePrice từ document course tìm được**
    const courseName = course.title; // Giả sử tên trường tên khóa học trong CourseModel là 'title'
    const coursePrice = course.price; // Giả sử tên trường giá khóa học trong CourseModel là 'price'

    // **3. Tạo new View Model, bao gồm courseName và coursePrice**
    const newView = new ViewModel({
      teacherId,
      courseId,
      courseName, // Sử dụng courseName đã lấy từ Course
      coursePrice, // Sử dụng coursePrice đã lấy từ Course
    });

    const savedView = await newView.save();
    res.status(201).json(savedView);
  } catch (error) {
    console.error("Lỗi khi tạo view:", error);
    res
      .status(500)
      .json({ message: "Lỗi server khi tạo view", error: error.message });
  }
});

// 2. Route lấy danh sách tất cả views (GET /views)
router.get("/", async (req, res) => {
  try {
    const views = await ViewModel.find({})
      .populate("teacherId") // Lấy thông tin teacher
      .populate("courseId"); // Lấy thông tin course

    res.status(200).json(views);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách views:", error);
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách views",
      error: error.message,
    });
  }
});

// 3. Route lấy một view cụ thể theo ID (GET /views/:id)
router.get("/:id", async (req, res) => {
  try {
    const viewId = req.params.id;
    const view = await ViewModel.findById(viewId)
      .populate("teacherId")
      .populate("courseId");

    if (!view) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy view với ID này." });
    }

    res.status(200).json(view);
  } catch (error) {
    console.error("Lỗi khi lấy view theo ID:", error);
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "ID view không hợp lệ." }); // Bắt lỗi ID không đúng định dạng ObjectId
    }
    res.status(500).json({
      message: "Lỗi server khi lấy view theo ID",
      error: error.message,
    });
  }
});

// 4. Route cập nhật một view theo ID (PUT /views/:id hoặc PATCH /views/:id)
// Sử dụng PUT để thay thế toàn bộ document hoặc PATCH để cập nhật một phần
router.put("/:id", async (req, res) => {
  try {
    const viewId = req.params.id;
    const { views, teacherId, courseId, courseName, coursePrice } = req.body; // Các trường có thể cập nhật

    const updatedView = await ViewModel.findByIdAndUpdate(
      viewId,
      { views, teacherId, courseId, courseName, coursePrice }, // Dữ liệu cập nhật
      { new: true, runValidators: true } // { new: true } để trả về document đã cập nhật, { runValidators: true } để kích hoạt validation schema
    );

    if (!updatedView) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy view để cập nhật với ID này." });
    }

    res.status(200).json(updatedView);
  } catch (error) {
    console.error("Lỗi khi cập nhật view:", error);
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "ID view không hợp lệ." });
    }
    res
      .status(500)
      .json({ message: "Lỗi server khi cập nhật view", error: error.message });
  }
});

// 5. Route xóa một view theo ID (DELETE /views/:id)
router.delete("/:id", async (req, res) => {
  try {
    const viewId = req.params.id;
    const deletedView = await ViewModel.findByIdAndDelete(viewId);

    if (!deletedView) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy view để xóa với ID này." });
    }

    res.status(200).json({ message: "View đã được xóa thành công." }); // Hoặc có thể trả về deletedView nếu muốn
  } catch (error) {
    console.error("Lỗi khi xóa view:", error);
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "ID view không hợp lệ." });
    }
    res
      .status(500)
      .json({ message: "Lỗi server khi xóa view", error: error.message });
  }
});

module.exports = router;
