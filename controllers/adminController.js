import Course from "../models/courseModel.js";
import EnrolledCourse from "../models/enrolledCourseModel.js";
import Tutor from "../models/tutorModel.js";
import User from "../models/userModel.js";
import asyncHandler from 'express-async-handler'

const loadStudentsData = asyncHandler(async (req, res) => {
    const usersData = await User.find({isAdmin : false})

    if(usersData){
        res.json( usersData )
    }else{  
        res.status(400)
        throw new Error ('No data')
    }
})


const studentBlock = asyncHandler( async(req, res) => {
    const id = req.body.id
    const user = await User.findById(id)

    if(user){
        user.isBlocked = !user.isBlocked

        const updatedUser = await user.save();
        res.status(201).json(
            {
               status:  updatedUser.isBlocked,
               name: updatedUser.fName 
            }
        )
    }else{
        res.status(400)
        throw new Error ('Invalid user')
    }
})


const loadRequests = asyncHandler(async (req, res) => {
    const requests = await Tutor.find({isVerified : false, isRejected: false})
    console.log(requests);

    if(requests){
        res.json( requests )
    }else{  
        res.status(400)
        throw new Error ('No data')
    }
})




const acceptRequest = asyncHandler( async(req, res) => {
    const id = req.body.id
    const tutor = await Tutor.findById(id)

    if(tutor){
        tutor.isVerified = true

        const updatedTutor = await tutor.save();
        res.status(201).json(
            updatedTutor.isVerified 
        )
    }else{
        res.status(400)
        throw new Error ('Invalid user')
    }
})



const rejectRequest = asyncHandler( async(req, res) => {
    const id = req.body.id
    const tutor = await Tutor.findById(id)

    if(tutor){
        tutor.isRejected = true

        const updatedTutor = await tutor.save();
        res.status(201).json(
            updatedTutor.isRejected 
        )
    }else{
        res.status(400)
        throw new Error ('Invalid user')
    }
})



const loadTutorsData = asyncHandler(async (req, res) => {
    const tutorsData = await Tutor.find({ isVerified: true })

    if(tutorsData){
        res.json( tutorsData )
    } else{  
        res.status(400)
        throw new Error ('No data')
    }
})



const tutorBlock = asyncHandler( async(req, res) => {
    const id = req.body.id
    const tutor = await Tutor.findById(id)

    if(tutor){
        tutor.isBlocked = !tutor.isBlocked

        const updatedTutor = await tutor.save();
        res.status(201).json(
            {
                status : updatedTutor.isBlocked,
                name: updatedTutor.firstName,
            }
        )
    }else{
        res.status(400)
        throw new Error ('Invalid tutor')
    }
})



const DashboardData = asyncHandler( async(req, res) => {
    const toatalStudents = await User.find().count()
    const toatalTutors = await Tutor.find().count()
    const toatalCourse = await Course.find().count()
    const toatalEnrolled = await EnrolledCourse.find().count()

    res.json({
        toatalCourse,
        toatalEnrolled,
        toatalStudents,
        toatalTutors
    })


    console.log(toatalStudents, 'students', toatalTutors, 'tutors', toatalEnrolled, 'enrolled', toatalCourse, 'course');
})





export {
     loadStudentsData,
     studentBlock, 
     loadRequests, 
     acceptRequest, 
     loadTutorsData, 
     tutorBlock, 
     rejectRequest,
     DashboardData,
    }