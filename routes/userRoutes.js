import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  validateOtp,
  resetPassword,
  updatePassword,
} from "../controllers/userController.js";

import {
  getPopularCourseData,
  getSingleCourseData,
  getCourseByCategory,
  getCourseBySearch,
} from "../controllers/courseController.js";

import {
  saveEnrolledCourseData,
  myEnrolledCourseData,
} from "../controllers/enrolledCourseController.js";

import {
  submitReview,
  getReviews,
  getCourseReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

import {
  addQuestion,
  loadQuestions,
  deleteQuestion,
  updateQuestion,
} from "../controllers/questionController.js";

import {
  addReply,
  deleteReply,
  updateReply,
} from "../controllers/replyController.js";
import { getUserProgressForCourse, markLessonCompleted } from "../controllers/userProgressController.js";




const router = express.Router();


router.post("/register", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.post("/forget_password", resetPassword);
router.post("/reset_password", updatePassword);
router.get("/course/popular", getPopularCourseData);
router.get("/course/view", getSingleCourseData);
router.get("/course/category", getCourseByCategory);
router.post("/payment", authenticateToken, saveEnrolledCourseData);
router.get("/my_courses",  myEnrolledCourseData);
router.get("/course_review", getCourseReviews);
router.get("/search_course", getCourseBySearch);
router.get("/progress", getUserProgressForCourse);
router.post("/progress", markLessonCompleted);

router
  .route("/reply")
  .post(authenticateToken, addReply)
  .put(authenticateToken, updateReply)
  .delete(authenticateToken, deleteReply);

router
  .route("/questions")
  .get( loadQuestions)
  .post(authenticateToken, addQuestion)
  .put(authenticateToken, updateQuestion)
  .delete(authenticateToken, deleteQuestion);

router
  .route("/review")
  .post(authenticateToken, submitReview)
  .get( getReviews)
  .put(authenticateToken, updateReview)
  .delete(authenticateToken, deleteReview);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route("/otp")
  .get(getUserProfile)
  .put(validateOtp);




export default router;
