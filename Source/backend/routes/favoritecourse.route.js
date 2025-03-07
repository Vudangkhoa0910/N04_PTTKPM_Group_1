const express = require('express');
const router = express.Router();
const FavoriteCourse = require('../models/favoritecourse.model');
const mongoose = require('mongoose');

// Middleware to parse JSON
router.use(express.json());

// Add a course to favorites
router.post('/', async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    
    if (!userId || !courseId) {
      return res.status(400).json({ 
        message: 'Vui lòng cung cấp đầy đủ userId và courseId.' 
      });
    }
    
    // Check if this course is already favorited by the user
    const existingFavorite = await FavoriteCourse.findOne({ userId, courseId });
    if (existingFavorite) {
      return res.status(400).json({ 
        message: 'Khoá học này đã được thêm vào danh sách yêu thích.' 
      });
    }
    
    const newFavorite = new FavoriteCourse({
      userId,
      courseId
    });
    
    const savedFavorite = await newFavorite.save();
    res.status(201).json(savedFavorite);
    
  } catch (error) {
    console.error('Lỗi khi thêm khoá học vào danh sách yêu thích:', error);
    
    // Handle duplicate key errors (if the compound index is violated)
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Khoá học này đã được thêm vào danh sách yêu thích.' 
      });
    }
    
    res.status(500).json({
      message: 'Lỗi server khi thêm khoá học vào danh sách yêu thích',
      error: error.message
    });
  }
});

// Remove a course from favorites
router.delete('/:id', async (req, res) => {
  try {
    const favoriteId = req.params.id;
    const deletedFavorite = await FavoriteCourse.findByIdAndDelete(favoriteId);
    
    if (!deletedFavorite) {
      return res.status(404).json({ 
        message: 'Không tìm thấy khoá học yêu thích để xoá với ID này.' 
      });
    }
    
    res.status(200).json({ 
      message: 'Khoá học đã được xoá khỏi danh sách yêu thích.' 
    });
    
  } catch (error) {
    console.error('Lỗi khi xoá khoá học khỏi danh sách yêu thích:', error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID không hợp lệ.' });
    }
    
    res.status(500).json({
      message: 'Lỗi server khi xoá khoá học khỏi danh sách yêu thích',
      error: error.message
    });
  }
});

// Remove a favorite by userId and courseId
router.delete('/user/:userId/course/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    
    const deletedFavorite = await FavoriteCourse.findOneAndDelete({ userId, courseId });
    
    if (!deletedFavorite) {
      return res.status(404).json({ 
        message: 'Không tìm thấy khoá học này trong danh sách yêu thích.' 
      });
    }
    
    res.status(200).json({ 
      message: 'Khoá học đã được xoá khỏi danh sách yêu thích.' 
    });
    
  } catch (error) {
    console.error('Lỗi khi xoá khoá học khỏi danh sách yêu thích:', error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID không hợp lệ.' });
    }
    
    res.status(500).json({
      message: 'Lỗi server khi xoá khoá học khỏi danh sách yêu thích',
      error: error.message
    });
  }
});

// Get all favorite courses for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Add validation for userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // First try to find favorites without populate to see if this part works
    const favoritesRaw = await FavoriteCourse.find({ userId });
    
    if (!favoritesRaw) {
      return res.status(404).json({ message: 'No favorites found for this user' });
    }
    
    // Now try to populate
    const favorites = await FavoriteCourse.find({ userId })
      .populate({
        path: 'courseId',
        model: 'course' // Explicitly specify the model name
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error fetching favorite courses:', error);
    res.status(500).json({ 
      message: 'Error fetching favorite courses', 
      error: error.message,
      stack: error.stack // Include stack trace for debugging
    });
  }
});

// Check if a course is favorited by a user
router.get('/check/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    
    const favorite = await FavoriteCourse.findOne({ userId, courseId });
    
    res.status(200).json({ 
      isFavorited: !!favorite,  // Convert to boolean
      favoriteData: favorite    // Include the full favorite data if it exists
    });
    
  } catch (error) {
    console.error('Lỗi khi kiểm tra trạng thái yêu thích:', error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID không hợp lệ.' });
    }
    
    res.status(500).json({
      message: 'Lỗi server khi kiểm tra trạng thái yêu thích',
      error: error.message
    });
  }
});

module.exports = router;