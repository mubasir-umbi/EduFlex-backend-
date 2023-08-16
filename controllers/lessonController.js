import asyncHandler from "express-async-handler";
import Lesson from "../models/LessonModel.js";

const addLesson = asyncHandler(async (req, res) => {
  console.log("am from add lesson backend");
  try {
    const { description, lessonNo, courseId, videoUrl, title } = req.body;
    // let title = req.body?.title;
    // title = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

    // const LessonExist = await Lesson.findOne({ title: title });

    // if (LessonExist) {
    //   res.status(401);
    //   throw new Error("Lesson Alredy Exist");
    // }

    const lesson = await Lesson.create({
      title,
      description,
      lessonNumber: lessonNo,
      courseId,
      videoUrl,
    });

    if (lesson) {
      const newLesson = await lesson.save();

      res.status(201).json({
        newLesson,
      });
    } else {
      res.status(500);
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    console.log(error);
  }
});

const loadLessonData = asyncHandler(async (req, res) => {
  try {
    // console.log(req.cookies, "he he he am reqqqqqqqqqqqqqqqq");
    const id = req.query.id;

    const lessons = await Lesson.find({ courseId: id , isdDeleted : false});

    if (lessons) {
      res.status(201).json(lessons);
    }
  } catch (error) {
    console.log(error);
  }
});

const updateLesson = asyncHandler(async (req, res) => {
  try {
    // let title = req.body?.title;
    // title =
    //   title?.charAt(0).toUpperCase() + req.body.title?.slice(1).toLowerCase();
    // const courseExist = await Course.findOne({ title: title });

    const id = req.query?.id;
    const lesson = await Lesson.findById(id);

    // if (lessonExist && lesson.title !== title) {
    //   res.status(401);
    //   throw new Error("lesson alredy exist");
    // }

    if (lesson) {
      // lesson.title =
      //   req.body.title?.charAt(0).toUpperCase() +
      //     req.body.title?.slice(1).toLowerCase() || lesson.title;
      lesson.title = req.body.title || lesson.title;
      lesson.description = req.body.description || lesson.description;

      await lesson.save();

      res.json("lesson updated scucessfully");
    } else {
      res.status(404);
      throw new Error("lesson not found");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
});

const deleteLesson = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;

  const lesson = await Lesson.findById(id);

  if (lesson) {
    lesson.isdDeleted = true;
    await lesson.save();
    res.json("lesson deleted sucssessfully.");
  } else {
    throw new Error("lesson does not exists");
  }
  } catch (error) {
    console.log(error);
  }
});

export { addLesson, loadLessonData, updateLesson, deleteLesson };
