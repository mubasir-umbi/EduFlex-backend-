import asyncHandler from "express-async-handler";
import Question from "../models/questionModel.js";

const addQuestion = asyncHandler((req, res) => {
  try {
    const { courseId, userId, lessonId, text } = req.body;

    const newQuestion = Question.create({
      course: courseId,
      user: userId,
      text: text,
      lesson: lessonId,
    });

    if (newQuestion) {
      res.status(201).json("Question submited successfully");
    } else {
      throw new Error("Error");
    }
  } catch (error) {
    console.log(error);
  }
});

const loadQuestions = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;
    const questions = await Question.find({ course: id })
      .populate("user")
      .populate({
        path: "replies",
        populate: { path: "user", select: "fName" },
      }).populate('course')

    if (questions) {
      res.json(questions);
    } else {
      throw new Error("Error");
    }
  } catch (error) {
    console.log(error);
  }
});

// To update question ///

const updateQuestion = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
    const question = await Question.findById(id);

    if (!question) throw new Error("Question not found");

    question.text = req.body.text || question.text;

    await question.save();
    res.json("Qustion updated");
  } catch (error) {
    console.log(error);
  }
});

/// To delete question ///

const deleteQuestion = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
    const question = await Question.findByIdAndDelete(id);

    if (!question) throw new Error("Question not found");
      
    res.json("Question deleted");
  
  } catch (error) {
    console.log(error);
  }
});

// const loadQuestions = asyncHandler(async (req, res) => {
//     try {
//       const id = mongoose.Types.ObjectId(req.query.id); // Convert the course ID to ObjectId type
//       const questions = await Question.aggregate([
//         {
//           $match: { course: id },
//         },
//         {
//           $lookup: {
//             from: "users", // Assuming your users collection is named "users"
//             localField: "user",
//             foreignField: "_id",
//             as: "user",
//           },
//         },
//         {
//           $unwind: "$user", // Since $lookup returns an array, we unwind it to get a single object
//         },
//         {
//           $lookup: {
//             from: "replies", // Assuming your replies collection is named "replies"
//             localField: "replies",
//             foreignField: "_id",
//             as: "replies",
//           },
//         },
//         {
//           $unwind: "$replies", // Unwind the replies array
//         },
//         {
//           $lookup: {
//             from: "users", // Assuming your users collection is named "users"
//             localField: "replies.user",
//             foreignField: "_id",
//             as: "replies.user",
//           },
//         },
//         {
//           $unwind: "$replies.user", // Unwind the replies.user array
//         },
//         {
//           $group: {
//             _id: "$_id",
//             user: { $first: "$user" },
//             course: { $first: "$course" },
//             lesson: { $first: "$lesson" },
//             text: { $first: "$text" },
//             createdAt: { $first: "$createdAt" },
//             replies: { $push: "$replies" }, // Group the replies back into an array
//           },
//         },
//       ]);

//       if (questions) {
//         res.json(questions);
//       } else {
//         throw new Error("Error");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   });

export { addQuestion, loadQuestions, deleteQuestion, updateQuestion };
