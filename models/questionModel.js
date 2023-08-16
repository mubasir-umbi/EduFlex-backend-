import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply' 
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
