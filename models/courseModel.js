import mongoose  from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  
  description: {
    type: String,
    required: true,
  },

  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true,
  },

  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],

  thumbnail: {
    type: String,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  isdDeleted: {
    type: Boolean,
    default: false,
  },

  popular: {
    type: Boolean,
    default: true,
  },

  lesson: {
    type: Number,
    
  },

  price: {
    type: Number,
    required: true,
  },
  
  rating: {
    type: Number,
    default: 0
  },

  reviewCount: {
    type: Number,
    default: 0
  },

  totalRating: {
    type: Number,
    default: 0
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },

});

const Course = mongoose.model('Course', courseSchema);

export default Course;
