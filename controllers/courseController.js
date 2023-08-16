import asyncHandler from "express-async-handler";
import Course from "../models/courseModel.js";



const addCourse = asyncHandler(async (req, res) => {
  try {
    const { description, thumbnail, category, tutor, price } = req.body;
    let title = req.body?.title;
    title = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

    const courseExist = await Course.findOne({ title: title });
    console.log(courseExist);

    if (courseExist) {
      res.status(401);
      throw new Error("Course Alredy Exist");
    }

    const course = await Course.create({
      title,
      description,
      thumbnail,
      category,
      tutor,
      price,
    });

    if (course) {
      const newCourse = await course.save();

      res.status(201).json({
        newCourse,
      });
    } else {
      res.status(500);
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    console.log(error);
  }
});



const getAllCourseData = asyncHandler(async (req, res) => {

  const courseData = await Course.find({isdDeleted: false});
  
  if (courseData) {
    res.status(201).json({ courseData: courseData });
  } else {
    throw new Error("No course available");
  }
});


// Fetch popular course data



const getPopularCourseData = asyncHandler(async (req, res) => {

  const courseData = await Course.find({isdDeleted: false, popular: true});

  if (courseData) {
    res.status(201).json({ courseData });
  } else {
    throw new Error("No course available");
  }
});


const getSingleCourseData = asyncHandler(async(req, res) => {

    const id = req.query.id 
    const courseData = await Course.findById(id).populate('tutor', 'firstName _id');

  if (courseData) {
    res.status(201).json({ courseData });
  } else {
    throw new Error("No course available");
  }

})



//Course filtered by tutor


const getCourseData = asyncHandler(async (req, res) => {
  const id = req.query.id;

  const courseData = await Course.find({ tutor: id, isdDeleted: false }).populate('tutor')
  if (courseData) {
    res.status(201).json({ courseData: courseData });
  } else {
    throw new Error("No course available");
  }
});


// Filtered course by category 

const getCourseByCategory = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id
  const courseData = await Course.find({category: id, isdDeleted: false});
  if (courseData) {
    res.status(201).json(courseData);
  } else {
    throw new Error("No course available");
  }
  } catch (error) {
    console.log(error);
  }
});


// Filtered course by serch 

const getCourseBySearch = asyncHandler(async (req, res) => {
  try {
    const searchQuery = req.query.query; 

    console.log(searchQuery, 'qeeeeeee');

    const courseData = await Course.find({
   
          $or: [
            { title: { $regex: searchQuery, $options: 'i' } }, 
            { description: { $regex: searchQuery, $options: 'i' } }, 
          ],
    });

    console.log(courseData, 'hmmmmmmmmmmmmmmmmmmmmmmmmm');
      res.status(200).json(courseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});



const updateCourseData = asyncHandler(async (req, res) => {
  try {
    let title = req.body?.title;
    title =
      title?.charAt(0).toUpperCase() + req.body.title?.slice(1).toLowerCase();
    const courseExist = await Course.findOne({ title: title });

    const id = req.body?.id;
    const course = await Course.findById(id);

    if (courseExist && course.title !== title) {
      res.status(401);
      throw new Error("Course alredy exist");
    }

    if (course) {
      course.title =
        req.body.title?.charAt(0).toUpperCase() +
          req.body.title?.slice(1).toLowerCase() || course.title;
      course.thumbnail = req.body.thumbnail || course.thumbnail;
      course.description = req.body.description || course.description;
      course.price = req.body?.price || course.price;
      course.tutor = course.tutor;
      course.category = course.category;

      await course.save();

      res.json("Course updated scucessfully");
    } else {
      res.status(404);
      throw new Error("Course not found");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
});



const deleteCourse = asyncHandler(async (req, res) => {
  const id = req.query.id;

  const course = await Course.findById(id);

  if (course) {
    course.isdDeleted = true;
    await course.save();
    res.json("Course deleted sucssessfully.");
  } else {
    throw new Error("Course does not exists");
  }
});

export {
  addCourse,
  getCourseData,
  updateCourseData,
  deleteCourse,
  getAllCourseData,
  getPopularCourseData,
  getSingleCourseData,
  getCourseByCategory,
  getCourseBySearch,
};
