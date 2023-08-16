import mongoose from 'mongoose';

const enrolledCourseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  
  paymentMode: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  
});


const EnrolledCourse = mongoose.model('EnrolledCourse', enrolledCourseSchema);

 export default EnrolledCourse