import UserProgress from "../models/userProgressModel.js";

const markLessonCompleted = async (req, res) => {
  const { userId, courseId, lessonId } = req.body;
  console.log(req.body);

  try {
    const userProgress = await UserProgress.findOneAndUpdate(
      { user: userId, course: courseId },
      { $addToSet: { completedLessons: lessonId } },
      { upsert: true, new: true }
    );

    res
      .status(200)
      .json({ message: "Lesson marked as completed", userProgress });
    console.log(userProgress);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while marking lesson as completed" });
  }
};


const getUserProgressForCourse = async (req, res) => {
  const { courseId, userId } = req.query
console.log(courseId, userId, '..........................')
  try {
    const userProgress = await UserProgress.findOne({
      user: userId,
      course: courseId,
    }).populate("completedLessons")
 console.log(userProgress, 'completedLessons');
 if (userProgress === null) {
  res.status(200).json([])
} else {
  res.status(200).json(userProgress);
}  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching user progress" });
  }
};

export { getUserProgressForCourse, markLessonCompleted };
