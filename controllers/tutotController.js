import asyncHandler from "express-async-handler";
import Tutor from "../models/tutorModel.js";
import generatateOtp from "../utils/generateOtp.js";
import generateToken from "../utils/generateToken.js";
import verifyEmail from "../utils/verifyMail.js";
import Course from "../models/courseModel.js";
import EnrolledCourse from '../models/enrolledCourseModel.js'

const tutorRegister = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    mobile,
    password,
    addressLine,
    addressLine2,
    country,
    state,
    city,
    zip,
    about,
  } = req.body;

  const tutorExist = await Tutor.findOne({ email });

  console.log(tutorExist);
  if (tutorExist) {
    res.status(400);
    throw new Error("Email Alredy Exist");
  }

  const tutor = await Tutor.create({
    firstName,
    lastName,
    email,
    mobile,
    password,
    addressLine,
    addressLine2,
    country,
    state,
    city,
    zip,
    about,
    otp: generatateOtp(),
  });

  if (tutor) {
    verifyEmail(tutor.email, tutor.otp);

    res.status(201).json({
      _id: tutor._id,
      otp: tutor.otp,
    });
  } else {
    res.status(400);
    throw new Error("Invalid tutor data");
  }
});

const verifyOtp = asyncHandler(async (req, res) => {
  const tutor = await Tutor.findById(req.body._id);
  console.log(req.body);
  if (tutor) {
    if (tutor.otp === req.body.otp) {
      tutor.otpVerified = true;

      const updatedTutor = await tutor.save();

      res.status(201).json({
        _id : updatedTutor._id,
        firstName: updatedTutor.firstName,
        lastName: updatedTutor.lastName,
        email: updatedTutor.email,
        mobile: updatedTutor.mobile,
        addressline: updatedTutor.addressLine,
        addressline2: updatedTutor.addressLine2,
        country: updatedTutor.country,
        state: updatedTutor.state,
        city: updatedTutor.city,
        zip: updatedTutor.zip,
        about: updatedTutor.about, 
        isVerified: updatedTutor.isVerified,
      });
    } else {
      res.status(400);
      throw new Error("Invalid Otp");
    }
  }
});

const tutorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const tutor = await Tutor.findOne({ email });

  if (tutor && (await tutor.matchPassword(password)) && tutor.otpVerified) {
    if (!tutor.isBlocked) {
     const token =  generateToken(res, tutor._id);

      res.status(201).json({
        token: token,
        id: tutor._id,
        firstName: tutor.firstName,
        lastName: tutor.lastName,
        email: tutor.email,
        mobile: tutor.mobile,
        addressLine: tutor.addressLine,
        addressLine2: tutor.addressLine2,
        country: tutor.country,
        state: tutor.state,
        city: tutor.city,
        about: tutor.about,
        zip: tutor.zip,
        updatedTutor: tutor.about,
        isVerified: tutor.isVerified,
        isBlocked: tutor.isBlocked,
      });
    } else {
      res.status(401);
      throw new Error("Can not login, you are blocked");
    }
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const logoutTutor = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const myStudents = asyncHandler(async (req, res) => {
  const tutorId = req.query.id;

  const students = await Tutor.findById(tutorId).populate("students");

  // await Tutor.aggregate([
  //   {
  //     $match: {
  //       _id: tutorId,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'users',
  //       localField: 'students',
  //       foreignField: '_id',
  //       as: 'studentsInfo',
  //     },
  //   },
  // ])

  if (students) {
    const myStudents = students.students.map((std) => {
      return {
        id: std._id,
        fName: std.fName,
        lName: std.lName,
        email: std.email,
      };
    });
    res.json(myStudents);
  } else {
    throw new Error("Error");
  }
});

// const dashBoardData = asyncHandler(async (req, res) => {
//   try {
//   const id = req.query.id 

//   const totalStudents =  await Tutor.findById(id).populate("students").count()
//   const course = await Course.find({tutor: id})
//   const enrolled = await EnrolledCourse.find()
  
//   const totalCourse = course.length
//   const title = []
//   const courseid = []
//      course.map(c => {
//      title.push(c.title)
//      courseid.push(c._id)
//   })

//   const courseIdies = []

//   enrolled.map((c) => {
//     courseIdies.push(c.courseId)
//   })

//   let count = 1;
//   const courseCount = {};
  
//   async function updateCourseCount(courseId) {
//     if (courseid.includes(courseId)) {
//       const course = await Course.findById(courseId);
//       if (courseCount[course.title]) {
//         courseCount[course.title]++;
//       } else {
//         courseCount[course.title] = count;
//       }
//     }
//   }


//   async function processEnrolledCourses() {
//     // Assuming `enrolled` is an array of course IDs
//     for (const courseId of courseIdies) {
//       await updateCourseCount(courseId);
//     }
//     console.log(courseCount); 
//   }
  
//   processEnrolledCourses();

//   console.log( courseIdies, cour);
//   res.json({totalCourse, totalStudents, title})
//   } catch (error) {
//     console.log(error);
//   }

// });

const dashBoardData = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;
    const totalStudents = await Tutor.findById(id).populate("students").count();
    const course = await Course.find({ tutor: id });
    const enrolled = await EnrolledCourse.find();

    const totalCourse = course.length;
    const title = [];
    const courseid = [];

    course.map((c) => {
      title.push(c.title);
      courseid.push(c._id);
    });

    const courseIdies = [];

    enrolled.map((c) => {
      courseIdies.push(c.courseId);
    });

    const courseCount = {};

    async function updateCourseCount(courseId) {
      if (courseid.includes(courseId)) {
        const course = await Course.findById(courseId);
        if (courseCount[course.title]) {
          courseCount[course.title]++;
        } else {
          courseCount[course.title] = 1; 
        }
      }
    }

    async function processEnrolledCourses() {
      for (const courseId of courseIdies) {
        await updateCourseCount(courseId);
      }
      console.log(courseCount);
      return courseCount; 
    }

    const courseCountResult = await processEnrolledCourses();

    console.log(courseIdies, courseCountResult, title);
    res.json({ totalCourse, totalStudents, title, courseCount: courseCountResult });
  } catch (error) {
    console.log(error);
  }
});


const updateProfile = asyncHandler(async(req, res) => {
  try {
    const id = req.query.id
    console.log(id, req.body, 'id')

    const tutor = await Tutor.findById(id)

    const {firstName,
      lastName,
      email,
      mobile,
      addressLine,
      addressLine2,
      country,
      state,
      city,
      zip,
      about, } = req.body

    if(tutor){
      tutor.firstName = firstName || tutor.firstName
      tutor.lastName = lastName || tutor.lastName
      tutor.email = email || tutor.email
      tutor.mobile = mobile || tutor.mobile
      tutor.addressLine = addressLine || tutor.addressLine
      tutor.addressLine2 = addressLine2 || tutor.addressLine2
      tutor.country = country || tutor.country
      tutor.state = state || tutor.state
      tutor.zip = zip || tutor.zip
      tutor.city = city || tutor.city
      tutor.about = about || tutor.about

     const updatedTutor = await tutor.save()

      res.status(201).json({
        id: updatedTutor._id,
        firstName: updatedTutor.firstName,
        lastName: updatedTutor.lastName,
        email: updatedTutor.email,
        mobile: updatedTutor.mobile,
        addressLine: updatedTutor.addressLine,
        addressLine2: updatedTutor.addressLine2,
        country: updatedTutor.country,
        state: updatedTutor.state,
        city: updatedTutor.city,
        about: updatedTutor.about,
        zip: updatedTutor.zip,
        updatedupdatedTutor: updatedTutor.about,
        isVerified: updatedTutor.isVerified,
        isBlocked: updatedTutor.isBlocked,
      });
    }else{
      throw new Error('error')
    }
  } catch (error) {
    console.log(error)
  }
})


export {
  tutorRegister,
  verifyOtp,
  tutorLogin,
  logoutTutor,
  myStudents,
  dashBoardData,
  updateProfile,
};
