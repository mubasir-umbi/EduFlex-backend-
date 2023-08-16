import express from "express";
// import { adminProtect } from '../middleware/adminAuth.js';
import { protect, adminProtect } from "../middleware/authMiddleware.js";
import {
  studentBlock,
  loadStudentsData,
  loadRequests,
  acceptRequest,
  loadTutorsData,
  tutorBlock,
  rejectRequest,
  DashboardData
} from "../controllers/adminController.js";

import {
  addCategory,
  updateCategory,
  deleteCategory,
  loadCategoryData,
} from "../controllers/categoryController.js";

import{ getAllCourseData } from '../controllers/courseController.js'
import { authenticateToken } from "../middleware/authenticateToken.js";

const adminRoutes = express.Router();

adminRoutes.get("/students", authenticateToken, loadStudentsData);
adminRoutes.get("/tutors", loadTutorsData);
adminRoutes.get("/course", authenticateToken, getAllCourseData);
adminRoutes.post("/student/block", authenticateToken, studentBlock);
adminRoutes.get("/requests", authenticateToken, loadRequests);
adminRoutes.post("/accept_req", authenticateToken, acceptRequest);
adminRoutes.post("/reject_req", authenticateToken, rejectRequest);
adminRoutes.post("/tutor/block", authenticateToken, tutorBlock);
adminRoutes.post("/category/add", authenticateToken, addCategory);
adminRoutes.get("/category", loadCategoryData);
adminRoutes.post("/category/update", updateCategory);
adminRoutes.post("/category/delete", authenticateToken, deleteCategory);
adminRoutes.get("/dashboard", authenticateToken, DashboardData);

export default adminRoutes;
