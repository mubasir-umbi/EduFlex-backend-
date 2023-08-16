import mongoose from 'mongoose';

// const commentSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Replace 'User' with the actual model name for users if you have one
//     required: true,
//   },
//   comment: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

const lessonSchema = new mongoose.Schema({
  lessonNumber: {
    type: Number,
    required: true,
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', 
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  videoUrl: {
    type: String,
    required: true,
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  isdDeleted: {
    type: Boolean,
    default: false,
  },

  createdAt: {
        type: Date,
        default: Date.now,
      },
      
  
  //comments: [commentSchema], // Array of comment objects as subdocuments
});

const Lesson = mongoose.model('Lesson', lessonSchema);

export default  Lesson;
