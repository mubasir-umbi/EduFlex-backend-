import express from "express";
import {
  tutorRegister,
  verifyOtp,
  tutorLogin,
  logoutTutor,
  myStudents,
  dashBoardData,
  updateProfile
} from "../controllers/tutotController.js";
import {
  addCourse,
  getCourseData,
  updateCourseData,
  deleteCourse,
} from "../controllers/courseController.js";
import {
  addLesson,
  deleteLesson,
  loadLessonData,
  updateLesson,
} from "../controllers/lessonController.js";

import { loadChats } from "../controllers/chatController.js";
import { protect } from '../middleware/authMiddleware.js';
import { authenticateToken } from "../middleware/authenticateToken.js";

const tutorRoutes = express.Router();

tutorRoutes.post("/register", tutorRegister);
tutorRoutes.post("/login", tutorLogin);
tutorRoutes.put("/otp", verifyOtp);
tutorRoutes.post("/logout", logoutTutor);
tutorRoutes.post("/course/add", addCourse);
tutorRoutes.post("/course/add_lesson", addLesson);
tutorRoutes.get("/course", getCourseData);
tutorRoutes.put("/update_course", authenticateToken, updateCourseData);
tutorRoutes.get("/delete_course",  authenticateToken, deleteCourse);
tutorRoutes.get("/course/lesson", loadLessonData);
tutorRoutes.put("/update_lesson",  authenticateToken, updateLesson);
tutorRoutes.get("/delete_lesson",  authenticateToken, deleteLesson);
tutorRoutes.get("/my_students",  authenticateToken, myStudents);
tutorRoutes.get("/dashboard",  authenticateToken, dashBoardData);
tutorRoutes.put("/edit_profile",  authenticateToken, updateProfile);
tutorRoutes.get("/chats", loadChats);


export default tutorRoutes;
