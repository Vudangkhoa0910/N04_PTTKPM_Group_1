const mongoose = require('mongoose');
const { VideoModel } = require('./models/video.model');  // Đảm bảo rằng đường dẫn chính xác

async function addSampleVideos() {
    try {
        // Sample videos data
        const videos = [
            {
                title: 'Introduction to React',
                description: 'A comprehensive guide to React.js and how to build applications.',
                teacher: 'John Doe',
                teacherId: new mongoose.Types.ObjectId('67654c7a3983de1134195dab'), // Sử dụng new
                views: 1200,
                link: 'https://www.example.com/video1',
                video_length: 320, // in seconds (5 minutes 20 seconds)
                img: 'https://www.example.com/thumb1.jpg',
                courseId: new mongoose.Types.ObjectId('63b7b2f9c0b2c7466db0e392'), // Sử dụng new
            },
            {
                title: 'Mastering JavaScript',
                description: 'Learn the core concepts of JavaScript to become an expert.',
                teacher: 'Jane Smith',
                teacherId: new mongoose.Types.ObjectId('63b7b2f9c0b2c7466db0e384'), // Sử dụng new
                views: 3500,
                link: 'https://www.example.com/video2',
                video_length: 480, // in seconds (8 minutes)
                img: 'https://www.example.com/thumb2.jpg',
                courseId: new mongoose.Types.ObjectId('63b7b2f9c0b2c7466db0e393'), // Sử dụng new
            },
            {
                title: 'Node.js for Beginners',
                description: 'An introduction to Node.js and backend development.',
                teacher: 'Alice Johnson',
                teacherId: new mongoose.Types.ObjectId('63b7b2f9c0b2c7466db0e385'), // Sử dụng new
                views: 2500,
                link: 'https://www.example.com/video3',
                video_length: 600, // in seconds (10 minutes)
                img: 'https://www.example.com/thumb3.jpg',
                courseId: new mongoose.Types.ObjectId('63b7b2f9c0b2c7466db0e394'), // Sử dụng new
            }
        ];

        // Insert videos into the database
        await VideoModel.insertMany(videos);
        console.log('Sample videos added successfully');
    } catch (error) {
        console.error('Error adding sample videos:', error);
    }
}

// Connect to the database and add the sample videos
mongoose.connect('mongodb://localhost:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    addSampleVideos();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });