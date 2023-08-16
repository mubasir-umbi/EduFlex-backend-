import asyncHandler from "express-async-handler";
import EnrolledCourse from "../models/enrolledCourseModel.js";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Tutor from "../models/tutorModel.js";



/// Saving enrolled course details


const saveEnrolledCourseData = asyncHandler(async(req, res) => {

    try {
      const {userId, courseId, paymentMode, amount, } = req.body

    const enrolledCourse = await EnrolledCourse.create({
        userId,
        courseId,
        paymentMode,
        amount,
    })

    if(!enrolledCourse){
      throw new Error('Something went wrong')
    }

    await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { students: userId } },
      { new: true }
    )

    const course = await Course.findById(courseId)
    const tutorId = course.tutor

    await Tutor.findByIdAndUpdate(
      tutorId,
      { $addToSet: { students: userId } },
      { new: true }
    )

    res.status(201).json('sucess')
    } catch (error) {
      console.log(error);
    }
})



/// fetching Students enrolled courses


const myEnrolledCourseData = asyncHandler(async(req, res) => {

  try {
    const userId = req.query.id

    const course = await EnrolledCourse.find({userId}).populate('courseId')
    
    const enrolledCourses = course.map(enrollment => enrollment.courseId);
    console.log(enrolledCourses, 'enrolled course');
    res.json(enrolledCourses);
  } catch (error) {
    console.log(error);
  }
    // try {
    //     const userId = req.query.id
    //     console.log(userId, 'userId');
    // const data = await EnrolledCourse.aggregate([
    //     {
    //       $match: {
    //         userId: userId,
    //       },

    //     },
    //     {
    //       $lookup: {
    //         from: 'courses', 
    //         localField: 'courseId',
    //         foreignField: '_id',
    //         as: 'enrolledCourses',
    //       },
    //     },
    //   ])

    //   if(data){
    //     res.status(201).json(data)
    //   }else{
    //     throw new Error('Error fetching enrolled courses')
    //   }
    // } catch (error) {
    //     console.log(error);
    // }
})


export {
    saveEnrolledCourseData, 
    myEnrolledCourseData,
}