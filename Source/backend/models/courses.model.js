const mongoose = require('mongoose');

// schema 
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category:{
    type:String,
    require:true
  },
  teacher:{
    type: String,
    require:true
  },
  teacherId:{
    type: mongoose.Schema.Types.ObjectId,
    require:true
  },
  price:{
    type:Number,
    require:true,
  },
  discount: {
    type: Number,
    default: 0,  // Default discount is 0%
    min: 0,
    max: 100     // Maximum discount is 100%
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  img:{
    type:String,
    required:true
  },
  videos: [{type: mongoose.Schema.Types.ObjectId, ref: "videos"}]
});

//  course
const courseModel = mongoose.model('course', courseSchema);

module.exports = courseModel;
